"use client";

import { MoreHorizontal, Pencil, Trash2, AlertCircle, TrendingUp, Wallet } from "lucide-react";
import { Bucket } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress"; 
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SensitiveValue } from "./ui/sensitive-value";

interface BucketCardProps {
  bucket: Bucket;
  currency: string;
  index: number;
  onEdit: (bucket: Bucket) => void;
  onDelete: (bucket: Bucket) => void;
}

export function BucketCard({ bucket, currency, index, onEdit, onDelete }: BucketCardProps) {
  const colors = [
    "bg-purple-100 text-purple-600",
    "bg-blue-100 text-blue-600",
    "bg-green-100 text-green-600",
    "bg-orange-100 text-orange-600",
  ];
  const colorClass = colors[index % colors.length];

  const allocated = Number(bucket.total_allocated || 0);
  const spent = Number(bucket.total_spent || 0);
  const currentBalance = Number(bucket.current_balance || 0);
  
  const isInvestment = bucket.type === "INVESTMENT";

  
  let progressValue = 0;
  let isNegative = false;
  let statusMessage = "";
  let progressColorClass = "[&>*]:bg-primary";
  let statusIcon = <Wallet className="h-6 w-6" />;
  
  let displayLabelLeft = "Disponível";
  let displayValueLeft = currentBalance;
  let displayLabelRight = "Gasto / Limite";

  if (isInvestment) {
    statusIcon = <TrendingUp className="h-6 w-6" />;
    progressValue = allocated > 0 ? (spent / allocated) * 100 : 0;
    
    
    if (progressValue >= 100) {
      progressColorClass = "[&>*]:bg-finza-success"; 
      statusMessage = "Meta de aporte batida! 🚀";
    } else if (progressValue > 0) {
      progressColorClass = "[&>*]:bg-primary"; 
      statusMessage = "Em progresso...";
    } else {
      progressColorClass = "[&>*]:bg-amber-500"; 
      statusMessage = "Nenhum aporte feito ainda";
    }

    displayLabelLeft = "Falta Aportar";

    displayValueLeft = currentBalance < 0 ? 0 : currentBalance; 
    
    displayLabelRight = "Aportado / Meta";

  } else {

    statusIcon = <Wallet className="h-6 w-6" />;

    progressValue = allocated > 0 ? (spent / allocated) * 100 : 0;
    isNegative = currentBalance < 0; 

    if (isNegative) {
      progressColorClass = "[&>*]:bg-destructive"; 
      statusIcon = <AlertCircle className="h-6 w-6" />;
      statusMessage = "Orçamento estourado!";
    } else if (progressValue > 85) {
      progressColorClass = "[&>*]:bg-amber-500"; 
      statusMessage = "Cuidado, perto do limite";
    } else {
      progressColorClass = "[&>*]:bg-finza-success"; 
      statusMessage = "Dentro do orçamento";
    }
  }

  const containerClass = (isNegative && !isInvestment) 
    ? "border-destructive/50 bg-destructive/5" 
    : "";

  const iconContainerClass = (isNegative && !isInvestment)
    ? "bg-destructive/10 text-destructive"
    : isInvestment 
      ? "bg-blue-100 text-blue-600"
      : colorClass;

  return (
    <Card
     className={cn(
        "border-border/60 finza-card-hover animate-fade-up group relative overflow-hidden transition-all hover:shadow-md",
        bucket.is_default && "ring-2 ring-primary/20",
        containerClass
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-2xl transition-colors",
            iconContainerClass
          )}>
            {statusIcon}
          </div>

          <div className="flex items-center gap-2">
            {isInvestment && (
              <Badge variant="outline" className="text-xs font-normal border-blue-200 text-blue-600 bg-blue-50">
                Investimento
              </Badge>
            )}

            <Badge variant="outline" className="text-xs font-normal text-muted-foreground border-border/50">
              {Number(bucket.allocation_percentage)}%
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 cursor-pointer text-muted-foreground hover:text-foreground"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                
                <DropdownMenuItem onClick={() => onEdit(bucket)} className="cursor-pointer">
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>

                {!bucket.is_default && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => onDelete(bucket)} 
                      className="text-destructive focus:text-destructive cursor-pointer"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        <div>
          <h3 className="font-semibold text-lg leading-none tracking-tight truncate pr-2">
            {bucket.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {statusMessage}
          </p>
        </div>

        <div className="space-y-2">
          <Progress 
            value={progressValue} 
            className={cn("h-2 w-full", progressColorClass)} 
          />
          
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
               <span className="text-[10px] uppercase text-muted-foreground font-semibold">
                 {displayLabelLeft}
               </span>
               <span className={cn(
                 "text-2xl font-bold",
                 (isNegative && !isInvestment) ? "text-destructive" : "text-foreground"
               )}>
                <SensitiveValue>{formatCurrency(displayValueLeft, currency)}</SensitiveValue>
              </span>
            </div>

            <div className="text-right hidden sm:block">
               <span className="text-[10px] uppercase text-muted-foreground font-semibold">
                 {displayLabelRight}
               </span>
               <div className="text-xs font-medium text-muted-foreground">
                 <SensitiveValue>
                   {formatCurrency(spent, currency)} / {formatCurrency(allocated, currency)}
                 </SensitiveValue>
               </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}