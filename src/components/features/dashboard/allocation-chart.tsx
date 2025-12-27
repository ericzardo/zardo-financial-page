"use client";

import { memo, useMemo, useCallback } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Bucket } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { SensitiveValue } from "@/components/ui/sensitive-value";

export interface AllocationChartProps {
  buckets: Bucket[];
  currency: string;
}

interface ChartDataItem {
  name: string;
  value: number;
  realPercentage: number;
  type: string;
  [key: string]: unknown; 
}

interface CustomTooltipProps {
  active?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any; 
  label?: string | number;
}

const COLORS: readonly string[] = [
  "#22c55e", // Verde
  "#3b82f6", // Azul
  "#f59e0b", // Amarelo
  "#8b5cf6", // Roxo
  "#ec4899", // Rosa
  "#64748b", // Cinza
  "#0ea5e9", // Sky Blue
  "#f43f5e", // Rose
] as const;

export const AllocationChart = memo(function AllocationChart({ buckets, currency }: AllocationChartProps) {
  
  const getBucketValue = useCallback((bucket: Bucket) => {
    const balance = Math.max(0, Number(bucket.current_balance || 0));
    
    if (bucket.type === 'INVESTMENT') {
      const invested = Math.max(0, Number(bucket.total_spent || 0));
      return balance + invested;
    }
    
    return balance;
  }, []);

  const totalPatrimony = useMemo(
    () => buckets.reduce((sum, b) => sum + getBucketValue(b), 0),
    [buckets, getBucketValue]
  );

  const formattedTotal = useMemo(
    () => formatCurrency(totalPatrimony, currency),
    [totalPatrimony, currency]
  );

  const data = useMemo<ChartDataItem[]>(
    () =>
      buckets
        .map((bucket) => {
          const value = getBucketValue(bucket);
          
          const realShare = totalPatrimony > 0 
            ? (value / totalPatrimony) * 100 
            : 0;

          return {
            name: bucket.name,
            value: value,
            type: bucket.type || "SPENDING",
            realPercentage: Number(realShare.toFixed(1)),
          };
        })
        .filter(item => item.value > 0)
        .sort((a, b) => b.value - a.value), 
    [buckets, totalPatrimony, getBucketValue]
  );

  const CustomTooltip = useCallback(
    ({ active, payload }: CustomTooltipProps) => {
      if (active && payload && payload.length > 0) {
        const item = payload[0].payload as ChartDataItem;
        const isInvestment = item.type === 'INVESTMENT';
        
        return (
          <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-xl z-50">
            <p className="text-sm font-medium text-foreground">{item.name}</p>
            <p className="text-sm text-muted-foreground">
              <SensitiveValue>{formatCurrency(item.value, currency)}</SensitiveValue>
            </p>
            <div className="mt-1 flex flex-col gap-0.5">
               <p className="text-xs font-semibold text-finza-success">
                 {item.realPercentage}% do total
               </p>
               {isInvestment && (
                 <p className="text-[10px] text-blue-500 font-medium">
                   (Saldo + Aportes)
                 </p>
               )}
            </div>
          </div>
        );
      }
      return null;
    },
    [currency]
  );

  if (buckets.length === 0 || totalPatrimony === 0) {
    return (
      <div className="flex h-64 items-center justify-center border-2 border-dashed rounded-lg border-muted bg-muted/10">
        <p className="text-muted-foreground text-sm">Sem dados para exibir</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 lg:flex-row lg:gap-12 animate-in fade-in duration-500">
      {/* GRÁFICO */}
      <div className="relative h-64 w-64 shrink-0">
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-0">
          <p className="text-xs text-muted-foreground font-medium mb-1 uppercase tracking-wider">Total</p>
          <p className="text-xl font-bold text-foreground">
            <SensitiveValue>{formattedTotal}</SensitiveValue>
          </p>
        </div>
        <ResponsiveContainer width="100%" height="100%" className="relative z-10">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={75}
              outerRadius={110}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={2}
              stroke="hsl(var(--background))"
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  className="hover:opacity-80 transition-opacity duration-300 cursor-pointer"
                />
              ))}
            </Pie>
            <Tooltip 
              content={CustomTooltip} 
              cursor={false} 
              wrapperStyle={{ zIndex: 100 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* LEGENDA */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        {data.map((item, index) => {
           const color = COLORS[index % COLORS.length];

           return (
            <div key={item.name} className="flex items-center gap-2 group">
              <div
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: color }}
              />
              
              <div className="flex items-center gap-1.5 text-sm w-full">
                <span className="font-medium text-foreground truncate max-w-37.5" title={item.name}>
                  {item.name}
                </span>
                <span className="text-muted-foreground">
                  ({item.realPercentage}%)
                </span>
                
                {item.type === 'INVESTMENT' && (
                   <span className="ml-auto text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full dark:bg-blue-900/30 dark:text-blue-300">
                     Inv.
                   </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});