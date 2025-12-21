"use client";

import { memo, useMemo } from "react";
import { ShieldCheck, Wallet, LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SensitiveValue } from "@/components/ui/sensitive-value";
import { cn, formatCurrency } from "@/lib/utils";
import { Bucket } from "@/types";

export interface SafeToSpendCardProps {
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

const PROTECTED_KEYWORDS: readonly string[] = [
  "emergência",
  "reserva",
  "fixo",
  "fixed",
  "emergency",
  "investimento",
] as const;

const isProtectedBucket = (name: string): boolean => {
  const lowerName = name.toLowerCase();
  return PROTECTED_KEYWORDS.some((keyword) => lowerName.includes(keyword));
};

export const SafeToSpendCard = memo(function SafeToSpendCard({
  buckets,
  currency,
  isLoading,
}: SafeToSpendCardProps) {
  
  const { protectedBalance, safeToSpend } = useMemo(() => {
    let protected_ = 0;
    let safe = 0;

    for (const bucket of buckets) {
      if (isProtectedBucket(bucket.name)) {
        protected_ += bucket.current_balance;
      } else {
        safe += bucket.current_balance;
      }
    }

    return { protectedBalance: protected_, safeToSpend: safe };
  }, [buckets]);

  const stats = useMemo<StatItem[]>(
    () => [
      {
        title: "Disponível para Gastar",
        value: formatCurrency(safeToSpend, currency),
        icon: Wallet,
        color: "text-finza-success",
        bgColor: "bg-finza-success/10",
        description: "Caixas não-essenciais",
      },
      {
        title: "Reservas Protegidas",
        value: formatCurrency(protectedBalance, currency),
        icon: ShieldCheck,
        color: "text-primary",
        bgColor: "bg-primary/10",
        description: "Emergência e fixos",
      },
    ],
    [safeToSpend, protectedBalance, currency]
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
            className="border-border/60 animate-in fade-in zoom-in-95 duration-500"
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