import { prisma } from "@/lib/prisma";

export async function listBuckets(workspaceId: string) {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    select: { total_balance: true }
  });

  const totalWorkspaceBalance = Number(workspace?.total_balance || 0);

  const buckets = await prisma.bucket.findMany({
    where: { workspace_id: workspaceId },
    orderBy: { created_at: 'asc' }
  });

  const bucketsWithRealStats = buckets.map(bucket => {
    const bucketBalance = Number(bucket.current_balance);
    
    const realPercentage = totalWorkspaceBalance > 0 
      ? (bucketBalance / totalWorkspaceBalance) * 100 
      : 0;

    return {
      ...bucket,
      real_allocation_percentage: Number(realPercentage.toFixed(2)) 
    };
  });

  return bucketsWithRealStats;
}