import { Skeleton } from "@/components/ui/skeleton";

export function TransactionRowSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/60 p-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="text-right space-y-2">
        <Skeleton className="h-6 w-28 ml-auto" />
        <Skeleton className="h-4 w-16 ml-auto" />
      </div>
    </div>
  );
}