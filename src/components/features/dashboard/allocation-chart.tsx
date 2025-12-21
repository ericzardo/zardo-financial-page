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
  percentage: number;
  [key: string]: unknown; 
}

interface CustomTooltipProps {
  active?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any; 
  label?: string | number;
}

const COLORS: readonly string[] = [
  "#22c55e",
  "#3b82f6",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#64748b"
] as const;

export const AllocationChart = memo(function AllocationChart({ buckets, currency }: AllocationChartProps) {
  
  const data = useMemo<ChartDataItem[]>(
    () =>
      buckets.map((bucket) => ({
        name: bucket.name,
        value: bucket.current_balance,
        percentage: bucket.allocation_percentage,
      })),
    [buckets]
  );

  const totalBalance = useMemo(
    () => buckets.reduce((sum, b) => sum + b.current_balance, 0),
    [buckets]
  );

  const formattedTotalBalance = useMemo(
    () => formatCurrency(totalBalance, currency),
    [totalBalance, currency]
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
            <p className="text-xs text-muted-foreground">
              {item.percentage}% alocado
            </p>
          </div>
        );
      }
      return null;
    },
    [currency]
  );

  if (buckets.length === 0) {
    return (
      <div className="flex h-70 items-center justify-center border-2 border-dashed rounded-lg border-muted">
        <p className="text-muted-foreground text-sm">Nenhum caixa criado ainda</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 lg:flex-row lg:gap-8 animate-in fade-in duration-500">
      <div className="relative h-70 w-70">
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-0">
          <p className="text-sm text-muted-foreground font-medium mb-1">Total</p>
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
              innerRadius={80}
              outerRadius={120}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  className="stroke-background hover:opacity-80 transition-opacity duration-300"
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

      <div className="flex flex-wrap justify-center gap-3 lg:flex-col lg:gap-2">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-sm text-foreground font-medium">{item.name}</span>
            <span className="text-sm text-muted-foreground">
              ({item.percentage}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});