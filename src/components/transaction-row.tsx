"use client";

import { useMemo, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Trash2, PiggyBank } from "lucide-react";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { SensitiveValue } from "@/components/ui/sensitive-value";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/types";
import { DeleteTransactionDialog } from "@/components/features/transaction/delete-transaction-dialog"; 

interface TransactionRowProps {
  transaction: Transaction;
  currency: string;
  onDeleteSuccess?: () => void; 
}

export function TransactionRow({ transaction, currency, onDeleteSuccess }: TransactionRowProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const isIncome = transaction.type === "INCOME";

  const formattedAmount = useMemo(
    () => formatCurrency(transaction.amount, currency),
    [transaction.amount, currency]
  );

  const formattedDate = useMemo(
    () => formatDate(transaction.date),
    [transaction.date]
  );

  return (
    <>
      <div className="group flex items-center justify-between rounded-lg border border-border/60 p-4 transition-all hover:bg-secondary/30 hover:shadow-sm pr-14 sm:pr-4 relative">
        
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl transition-colors",
              isIncome 
                ? "bg-finza-success/10 group-hover:bg-finza-success/20" 
                : "bg-destructive/10 group-hover:bg-destructive/20"
            )}
          >
            {isIncome ? (
              <ArrowDownLeft className="h-6 w-6 text-finza-success" />
            ) : (
              <ArrowUpRight className="h-6 w-6 text-destructive" />
            )}
          </div>
          <div>
            <p className="font-medium text-foreground">
              {transaction.description || "Sem descrição"}
            </p>
            <p className="text-sm text-muted-foreground">{formattedDate}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p
              className={cn(
                "text-lg font-semibold",
                isIncome ? "text-finza-success" : "text-destructive"
              )}
            >
              <SensitiveValue>
                {isIncome ? "+" : "-"} {formattedAmount}
              </SensitiveValue>
            </p>
            
            <div className="flex items-center justify-end gap-1.5 text-sm text-muted-foreground mt-0.5">
              {transaction.bucket ? (
                <>
                  <PiggyBank className="h-3 w-3 opacity-70" />
                  <span className="font-medium text-foreground/80">
                    {transaction.bucket.name}
                  </span>
                </>
              ) : (
                <span className="opacity-70 text-xs">
                  {isIncome ? "Receita Livre" : "Sem Categoria"}
                </span>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="hidden sm:flex h-9 w-9 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Deletar</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="sm:hidden absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <DeleteTransactionDialog 
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        transaction={transaction}
        onSuccess={onDeleteSuccess}
      />
    </>
  );
}