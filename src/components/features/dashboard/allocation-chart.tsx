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
  plannedPercentage: number;
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
  "#64748b"  // Cinza
] as const;

export const AllocationChart = memo(function AllocationChart({ buckets, currency }: AllocationChartProps) {
  
  const totalBalance = useMemo(
    () => buckets.reduce((sum, b) => sum + Math.max(0, Number(b.current_balance)), 0),
    [buckets]
  );

  const formattedTotalBalance = useMemo(
    () => formatCurrency(totalBalance, currency),
    [totalBalance, currency]
  );

  const data = useMemo<ChartDataItem[]>(
    () =>
      buckets
        .map((bucket) => {
          const balance = Math.max(0, Number(bucket.current_balance));
          
          const realShare = totalBalance > 0 
            ? (balance / totalBalance) * 100 
            : 0;

          return {
            name: bucket.name,
            value: balance,
            realPercentage: Number(realShare.toFixed(1)),
            plannedPercentage: Number(bucket.allocation_percentage),
          };
        })
        .filter(item => item.value > 0),
    [buckets, totalBalance]
  );

  const CustomTooltip = useCallback(
    ({ active, payload }: CustomTooltipProps) => {
      if (active && payload && payload.length > 0) {
        const item = payload[0].payload as ChartDataItem;
        
        return (
          <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-xl z-50">
            <p className="text-sm font-medium text-foreground">{item.name}</p>
            <p className="text-sm text-muted-foreground">
              <SensitiveValue>{formatCurrency(item.value, currency)}</SensitiveValue>
            </p>
            <div className="mt-1 flex flex-col gap-0.5">
               <p className="text-xs font-semibold text-finza-success">
                 {item.realPercentage}% do patrimônio
               </p>
            </div>
          </div>
        );
      }
      return null;
    },
    [currency]
  );

  if (buckets.length === 0 || totalBalance === 0) {
    return (
      <div className="flex h-70 items-center justify-center border-2 border-dashed rounded-lg border-muted bg-muted/10">
        <p className="text-muted-foreground text-sm">Sem saldo para exibir gráfico</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 lg:flex-row lg:gap-12 animate-in fade-in duration-500">
      <div className="relative h-64 w-64 shrink-0">
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-0">
          <p className="text-xs text-muted-foreground font-medium mb-1 uppercase tracking-wider">Total</p>
          <p className="text-xl font-bold text-foreground">
            <SensitiveValue>{formattedTotalBalance}</SensitiveValue>
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

      <div className="flex flex-col gap-3 w-full max-w-xs">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2 group">
            
            <div
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            
            <div className="flex items-center gap-1.5 text-sm">
              <span className="font-medium text-foreground truncate max-w-37.5" title={item.name}>
                {item.name}
              </span>
              <span className="text-muted-foreground">
                ({item.realPercentage}%)
              </span>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
});