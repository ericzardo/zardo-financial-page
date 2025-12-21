"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MonthYearFilterProps {
  month: number;
  year: number;
  onPrevious: () => void;
  onNext: () => void;
}

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
] as const;

export function MonthYearFilter({ month, year, onPrevious, onNext }: MonthYearFilterProps) {
  
  const isCurrentMonth = () => {
    const now = new Date();
    return month === now.getMonth() && year === now.getFullYear();
  };

  const monthName = MONTHS[month] || "Mês Inválido";

  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 cursor-pointer"
        onClick={onPrevious}
        aria-label="Mês anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <span className="min-w-35 text-center text-sm font-medium text-foreground select-none">
        {monthName} {year}
      </span>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 cursor-pointer"
        onClick={onNext}
        disabled={isCurrentMonth()}
        aria-label="Próximo mês"
      >
        <ChevronRight className="h-4 w-4 cursor-pointer" />
      </Button>
    </div>
  );
}