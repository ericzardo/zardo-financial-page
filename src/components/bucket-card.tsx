"use client";

import { useMemo } from "react";
import { PiggyBank, Settings2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SensitiveValue } from "@/components/ui/sensitive-value";
import { cn, formatCurrency } from "@/lib/utils";
import { Bucket } from "@/types";

interface BucketCardProps {
  bucket: Bucket;
  currency: string;
  index: number;
  onEdit: (bucket: Bucket) => void;
}

export function BucketCard({ bucket, currency, index, onEdit }: BucketCardProps) {
  const formattedBalance = useMemo(
    () => formatCurrency(bucket.current_balance, currency),
    [bucket.current_balance, currency]
  );

  return (
    <Card
      className={cn(
        "border-border/60 transition-all hover:border-primary/50 hover:shadow-md group relative",
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary">
            <PiggyBank className="h-6 w-6" />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={() => onEdit(bucket)}
            >
              <Settings2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold text-foreground">{bucket.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {bucket.allocation_percentage}% alocado
          </p>
        </div>

        <div className="mt-4 space-y-2">
          <Progress value={bucket.allocation_percentage} className="h-2" />
          <p className="text-2xl font-bold text-foreground">
            <SensitiveValue>{formattedBalance}</SensitiveValue>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}