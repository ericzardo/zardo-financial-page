import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/errors";
import { Prisma } from "@prisma/client";
import { CreateTransactionData } from "@/schemas/transaction";

interface CreateServiceProps extends CreateTransactionData {
  userId: string;
}

export async function createTransaction({ userId, ...data }: CreateServiceProps) {
  // 1. Validações Iniciais
  const workspace = await prisma.workspace.findUnique({
    where: { id: data.workspaceId }
  });

  if (!workspace || workspace.user_id !== userId) {
    throw new AppError("Workspace not found", 404);
  }

  // Regra: Despesa SEMPRE precisa de bucket explícito
  if (data.type === 'EXPENSE' && !data.bucketId) {
    throw new AppError("Toda despesa precisa sair de uma caixa específica.", 400);
  }

  // Valida bucket se for passado
  if (data.bucketId) {
    const bucket = await prisma.bucket.findUnique({
      where: { id: data.bucketId }
    });
    if (!bucket || bucket.workspace_id !== data.workspaceId) {
      throw new AppError("Caixa não encontrada neste workspace", 404);
    }
  }

  return prisma.$transaction(async (tx) => {
    const amount = new Prisma.Decimal(data.amount);

    // 2. Cria a Transação
    const transaction = await tx.transaction.create({
      data: {
        workspace_id: data.workspaceId,
        bucket_id: data.bucketId,
        amount,
        type: data.type,
        description: data.description,
        date: data.date ? new Date(data.date) : new Date(),
        is_allocated: data.isAllocated || false,
      }
    });

    // 3. Atualiza Saldo GERAL do Workspace
    if (data.type === 'INCOME') {
      await tx.workspace.update({
        where: { id: data.workspaceId },
        data: { total_balance: { increment: amount } }
      });
    } else {
      await tx.workspace.update({
        where: { id: data.workspaceId },
        data: { total_balance: { decrement: amount } }
      });
    }

    // 4. Lógica de DESPESA (Simples: Tira da caixa selecionada)
    if (data.type === 'EXPENSE' && data.bucketId) {
      await tx.bucket.update({
        where: { id: data.bucketId },
        data: { 
          total_spent: { increment: amount }, 
          current_balance: { decrement: amount } 
        }
      });
    }

    // 5. Lógica de RECEITA (Complexa: Distribuição + Sobras)
    if (data.type === 'INCOME') {
      
      // CENÁRIO A: Distribuição Automática Ligada
      if (data.isAllocated) {
        const buckets = await tx.bucket.findMany({
          where: { workspace_id: data.workspaceId }
        });

        let totalDistributed = new Prisma.Decimal(0); // Acumulador
        let defaultBucketId: string | null = null;

        // Passo 1: Distribuir baseado nas porcentagens
        for (const bucket of buckets) {
          // Já aproveita o loop para achar quem é o default
          if (bucket.is_default) {
            defaultBucketId = bucket.id;
          }

          const percentage = Number(bucket.allocation_percentage) / 100;
          
          if (percentage > 0) {
            const shareAmount = Number(amount) * percentage;
            const shareDecimal = new Prisma.Decimal(shareAmount);
            
            // Soma ao acumulador para sabermos quanto sobrou depois
            totalDistributed = totalDistributed.add(shareDecimal);

            await tx.bucket.update({
              where: { id: bucket.id },
              data: {
                total_allocated: { increment: shareDecimal },
                current_balance: { increment: shareDecimal }
              }
            });
          }
        }

        // Passo 2: Calcular a sobra (Remainder)
        // Sobra = Valor Total - Valor que foi distribuído nas porcentagens
        const remainder = amount.minus(totalDistributed);

        // Passo 3: Jogar a sobra no Default (se houver sobra > 0)
        // Usamos uma pequena margem de erro para decimais (0.01), mas > 0 serve
        if (remainder.gt(0)) {
          if (defaultBucketId) {
            await tx.bucket.update({
              where: { id: defaultBucketId },
              data: {
                total_allocated: { increment: remainder },
                current_balance: { increment: remainder }
              }
            });
          } else {
            // Opcional: Se não tiver bucket default, o dinheiro fica "solto" no workspace.
            // Mas para metodologia Zero-Based estrita, poderíamos lançar erro.
            // Por enquanto, vamos apenas logar ou ignorar, mantendo no saldo geral.
            console.warn("Sobra de dinheiro detectada mas nenhum Bucket Padrão (Default) foi encontrado para alocação.");
          }
        }
      } 

      // CENÁRIO B: Receita Direta (Sem distribuição, vai para uma caixa específica)
      else if (!data.isAllocated && data.bucketId) {
        await tx.bucket.update({
          where: { id: data.bucketId },
          data: {
            total_allocated: { increment: amount },
            current_balance: { increment: amount }
          }
        });
      }
      
      // CENÁRIO C: Receita Direta mas usuário não selecionou caixa (Dinheiro Solto)
      // Se você quiser forçar que TUDO vá para o default caso não selecione nada:
      else if (!data.isAllocated && !data.bucketId) {
         const defaultBucket = await tx.bucket.findFirst({
            where: { workspace_id: data.workspaceId, is_default: true }
         });
         
         if (defaultBucket) {
            // Atualiza a transação para ficar vinculada ao default
             await tx.transaction.update({
               where: { id: transaction.id },
               data: { bucket_id: defaultBucket.id }
             });

             await tx.bucket.update({
               where: { id: defaultBucket.id },
               data: {
                 total_allocated: { increment: amount },
                 current_balance: { increment: amount }
               }
             });
         }
      }
    }

    return transaction;
  });
}