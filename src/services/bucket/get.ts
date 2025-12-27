import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/errors";

export async function getBucketById(bucketId: string) {
  const bucket = await prisma.bucket.findUnique({
    where: { id: bucketId },
    include: {
      workspace: {
        select: { total_balance: true }
      }
    }
  });

  if (!bucket) {
    throw new AppError("Bucket not found", 404);
  }

  const totalWorkspaceBalance = Number(bucket.workspace.total_balance || 0);
  const bucketBalance = Number(bucket.current_balance);

  const realPercentage = totalWorkspaceBalance > 0 
    ? (bucketBalance / totalWorkspaceBalance) * 100 
    : 0;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { workspace, ...bucketData } = bucket;

  return {
    ...bucketData,
    allocation_percentage: Number(bucket.allocation_percentage),
    current_balance: bucketBalance,
    total_allocated: Number(bucket.total_allocated), 
    total_spent: Number(bucket.total_spent),
    type: bucket.type,
    
    real_allocation_percentage: Number(realPercentage.toFixed(2))
  };
}