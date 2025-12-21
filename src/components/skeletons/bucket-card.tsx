import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface BucketCardSkeletonProps {
  index?: number;
}

export function BucketCardSkeleton({ index = 0 }: BucketCardSkeletonProps) {
  return (
    <Card
      className="border-border/60 animate-fade-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="mt-4 space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="mt-4 space-y-2">
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-8 w-36" />
        </div>
      </CardContent>
    </Card>
  );
}