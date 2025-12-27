"use client";

import { useState } from "react";
import { Loader2, CornerUpLeft } from "lucide-react"; 
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { deleteTransactionRequest } from "@/http/transactions";
import { Transaction } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface DeleteTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction;
  onSuccess?: () => void;
}

export function DeleteTransactionDialog({
  open,
  onOpenChange,
  transaction,
  onSuccess,
}: DeleteTransactionDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    try {
      setIsDeleting(true);
      await deleteTransactionRequest(transaction.id);
      
      toast.success("Transação removida", {
        description: "Os saldos foram recalculados automaticamente."
      });
      
      if (onSuccess) onSuccess();
      onOpenChange(false);

    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir transação");
    } finally {
      setIsDeleting(false);
    }
  };

  const isExpenseFromBucket = transaction.type === "EXPENSE" && transaction.bucket_id;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange} >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Transação?</AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação removerá permanentemente o registro de{" "}
            <span className="font-semibold text-foreground">
              {transaction.description}
            </span>.
          </AlertDialogDescription>

          {isExpenseFromBucket && (
            <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-md text-sm text-primary flex flex-col gap-1">
              <div className="flex items-center gap-2 font-semibold">
                <CornerUpLeft className="h-4 w-4" />
                Estorno de Saldo
              </div>
              <p className="opacity-90">
                Como esta é uma despesa vinculada a uma caixa, o valor de{" "}
                <strong>{formatCurrency(Number(transaction.amount), "BRL")}</strong>{" "}
                será devolvido ao saldo disponível da caixa.
              </p>
            </div>
          )}
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting} className="cursor-pointer">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive hover:bg-destructive/90 cursor-pointer"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Excluindo...
              </>
            ) : (
              "Sim, excluir"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}