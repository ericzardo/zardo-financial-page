"use client";

import Link from "next/link";
import { ArrowRight, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SensitiveValue } from "@/components/ui/sensitive-value";
import { formatCurrency } from "@/lib/utils";
import { Workspace } from "@/types"; 

interface WorkspaceCardProps {
  workspace: Workspace;
}

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  return (
    <Link href={`/dashboard/${workspace.id}`}>
      <Card className="group relative h-full overflow-hidden border-border/60 transition-all hover:border-primary/50 hover:shadow-md cursor-pointer">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">
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
            <p className="text-2xl font-bold tracking-tight">
              <SensitiveValue>
                {/* Fallback seguro para 0 caso não venha saldo calculado */}
                {formatCurrency(workspace.total_balance || 0, workspace.currency)}
              </SensitiveValue>
            </p>
          </div>
        </CardContent>
        
        {/* Barra decorativa no fundo */}
        <div className="absolute bottom-0 left-0 h-1 w-full bg-linear-to-r from-primary/0 via-primary/20 to-primary/0 opacity-0 transition-opacity group-hover:opacity-100" />
      </Card>
    </Link>
  );
}