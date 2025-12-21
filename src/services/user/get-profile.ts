import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/errors";

export async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      avatar_url: true,
      is_privacy_enabled: true,
      workspaces: {
        select: {
          total_balance: true,
          currency: true
        }
      }
    }
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const totalNetWorth = user.workspaces.reduce((acc, workspace) => {
    return acc + Number(workspace.total_balance);
  }, 0);

  return {
    ...user,
    total_net_worth: totalNetWorth
  };
}