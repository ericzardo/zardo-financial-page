"use client";

import { memo, useMemo } from "react";
import { Wallet, TrendingUp, LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SensitiveValue } from "@/components/ui/sensitive-value";
import { cn, formatCurrency } from "@/lib/utils";
import { Bucket } from "@/types";

export interface OverviewCardsProps {
  buckets: Bucket[];
  currency: string;
  isLoading?: boolean;
}

interface StatItem {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  description: string;
}

export const SafeToSpendCard = memo(function SafeToSpendCard({
  buckets,
  currency,
  isLoading,
}: OverviewCardsProps) {

  const { investmentBalance, spendingBalance } = useMemo(() => {
    let investment = 0;
    let spending = 0;

    for (const bucket of buckets) {
      const type = bucket.type || "SPENDING";

      if (type === "INVESTMENT") {
        investment += Number(bucket.total_spent || 0);
      } else {
        spending += Number(bucket.current_balance || 0);
      }
    }

    return { investmentBalance: investment, spendingBalance: spending };
  }, [buckets]);

  const stats = useMemo<StatItem[]>(
    () => [
      {
        title: "Disponível para Consumo",
        value: formatCurrency(spendingBalance, currency),
        icon: Wallet,
        color: "text-finza-success",
        bgColor: "bg-finza-success/10",
        description: "Caixas de rotina e gastos",
      },
      {
        title: "Reservas & Investimentos",
        value: formatCurrency(investmentBalance, currency),
        icon: TrendingUp, 
        color: "text-blue-600",
        bgColor: "bg-blue-600/10",
        description: "Acumulado para o futuro",
      },
    ],
    [spendingBalance, investmentBalance, currency]
  );

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {[0, 1].map((index) => (
          <Card
            key={index}
            className="border-border/60 animate-in fade-in zoom-in-95 duration-500"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-8 w-40" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <Skeleton className="h-12 w-12 rounded-xl" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        
        return (
          <Card
            key={stat.title}
            className="border-border/60 animate-in fade-in zoom-in-95 duration-500 transition-all hover:shadow-sm"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  
                  <p className="text-2xl font-bold text-foreground">
                    <SensitiveValue>{stat.value}</SensitiveValue>
                  </p>
                  
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
                
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl transition-colors",
                    stat.bgColor
                  )}
                >
                  <IconComponent className={cn("h-6 w-6", stat.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
});