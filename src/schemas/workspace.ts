import { z } from "zod";

export const currencyEnum = z.enum(["BRL", "USD", "EUR"]);

export const createWorkspaceSchema = z.object({
  name: z.string().trim().min(1, "O nome do workspace é obrigatório"),
  currency: currencyEnum,
});

export const updateWorkspaceSchema = createWorkspaceSchema.partial();

export type CreateWorkspaceData = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspaceData = z.infer<typeof updateWorkspaceSchema>;
export type CurrencyType = z.infer<typeof currencyEnum>;