import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getCurrencySymbol = (currency: string = "BRL") => {
  try {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: currency,
    })
      .formatToParts(0)
      .find((part) => part.type === "currency")?.value || currency;
  } catch {
    return currency; 
  }
};

export const formatCurrency = (value: number, currency: string = "BRL") => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: currency,
  }).format(value);
};

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}