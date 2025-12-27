"use client";

import Link from "next/link";
import { ArrowRight, Wallet, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SensitiveValue } from "@/components/ui/sensitive-value";
import { formatCurrency, cn } from "@/lib/utils";
import { Workspace } from "@/types"; 

interface WorkspaceCardProps {
  workspace: Workspace;
}

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  const totalBalance = Number(workspace.total_balance || 0);
  const isNegative = totalBalance < 0;

  return (
    <Link href={`/dashboard/${workspace.id}`}>
      <Card 
        className={cn(
          "group relative h-full overflow-hidden border-border/60 transition-all hover:shadow-md cursor-pointer",
          isNegative ? "hover:border-destructive/50" : "hover:border-primary/50"
        )}
      >
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg transition-colors group-hover:text-white",
                isNegative 
                  ? "bg-destructive/10 text-destructive group-hover:bg-destructive" 
                  : "bg-primary/10 text-primary group-hover:bg-primary"
              )}>
                {isNegative ? <TrendingDown className="h-5 w-5" /> : <Wallet className="h-5 w-5" />}
              </div>
              <div>
                <CardTitle className={cn(
                  "text-base font-semibold transition-colors",
                  isNegative ? "group-hover:text-destructive" : "group-hover:text-primary"
                )}>
                  {workspace.name}
                </CardTitle>
                
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground uppercase font-medium">
                    {workspace.currency}
                  </span>
                </div>
              </div>
            </div>
            
            <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Saldo Total</p>
            <p className={cn(
              "text-2xl font-bold tracking-tight",
              isNegative ? "text-destructive" : "text-foreground"
            )}>
              <SensitiveValue>
                {formatCurrency(totalBalance, workspace.currency)}
              </SensitiveValue>
            </p>
          </div>
        </CardContent>

        <div className={cn(
          "absolute bottom-0 left-0 h-1 w-full opacity-0 transition-opacity group-hover:opacity-100",
          isNegative 
            ? "bg-linear-to-r from-destructive/0 via-destructive/20 to-destructive/0" 
            : "bg-linear-to-r from-primary/0 via-primary/20 to-primary/0"
        )} />
      </Card>
    </Link>
  );
}