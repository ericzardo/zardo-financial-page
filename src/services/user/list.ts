import { prisma } from "@/lib/prisma";

export async function listUsers() {
  return prisma.user.findMany({
    select: { 
      id: true, 
      name: true, 
      email: true,
      _count: {
        select: { workspaces: true }
      }
    }
  });
}