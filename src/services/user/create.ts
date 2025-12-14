import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/errors";

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
}

export async function createUser(data: CreateUserDTO) {
  const userExists = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (userExists) {
    throw new AppError("Email already in use", 409);
  }

  const passwordHash = await hash(data.password, 6);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: passwordHash,
      workspaces: {
        create: {
          name: "Meu Workspace",
          currency: "BRL",
          // Futuramente aqui entra a criação dos buckets padrão também
        }
      }
    },
    select: {
      id: true,
      name: true,
      email: true,
      created_at: true,
      workspaces: true
    }
  });

  return user;
}