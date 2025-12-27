import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/errors";

export async function deleteTransaction(transactionId: string, userId: string) {
  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
    include: { workspace: true }
  });

  if (!transaction) throw new AppError("Transação não encontrada", 404);
  if (transaction.workspace.user_id !== userId) throw new AppError("Não autorizado", 403);

  return prisma.$transaction(async (tx) => {
    const amount = transaction.amount;
    
    if (transaction.type === 'INCOME') {
      await tx.workspace.update({
        where: { id: transaction.workspace_id },
        data: { total_balance: { decrement: amount } }
      });
    } else {
      await tx.workspace.update({
        where: { id: transaction.workspace_id },
        data: { total_balance: { increment: amount } }
      });
    }

    
    if (transaction.type === 'EXPENSE' && transaction.bucket_id) {
      await tx.bucket.update({
        where: { id: transaction.bucket_id },
        data: { 
          total_spent: { decrement: amount },
          current_balance: { increment: amount } 
        }
      });
    }

    if (transaction.type === 'INCOME') {

      if (transaction.is_allocated) {
        const buckets = await tx.bucket.findMany({
          where: { workspace_id: transaction.workspace_id }
        });

        for (const bucket of buckets) {

          const percentage = Number(bucket.allocation_percentage) / 100;
          const shareAmount = Number(amount) * percentage; 
          
          if (shareAmount > 0) {
             await tx.bucket.update({
              where: { id: bucket.id },
              data: {
                total_allocated: { decrement: shareAmount },
                current_balance: { decrement: shareAmount }
              }
            });
          }
        }
      }

      else if (transaction.bucket_id) {
        await tx.bucket.update({
          where: { id: transaction.bucket_id },
          data: {
             total_allocated: { decrement: amount },
             current_balance: { decrement: amount }
          }
        });
      }
    }

    return tx.transaction.delete({ where: { id: transactionId } });
  });
}