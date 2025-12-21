"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Wallet } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent, // O ALVO DA MUDANÇA
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { updateWorkspaceSchema, UpdateWorkspaceData } from "@/schemas/workspace";
import { Workspace } from "@/types";

interface EditWorkspaceDialogProps {
  workspace: Workspace;
}

export function EditWorkspaceDialog({ workspace }: EditWorkspaceDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<UpdateWorkspaceData>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      name: workspace.name,
      currency: (workspace.currency as "BRL" | "USD" | "EUR") || "BRL",
    },
  });

  const onSubmit = async (data: UpdateWorkspaceData) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Update Payload:", data);
    
    toast.success("Configurações salvas!", {
      description: "As informações do workspace foram atualizadas.",
    });
    setIsLoading(false);
  };

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Wallet className="h-5 w-5 text-primary" />
          Informações Gerais
        </CardTitle>
        <CardDescription>
          Configurações básicas e moeda padrão
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              
              {/* Nome do Workspace */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Workspace</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Finanças Pessoais" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Moeda */}
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Moeda</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a moeda" />
                        </SelectTrigger>
                      </FormControl>
                      
                      {/* CORREÇÃO AQUI: border-none e shadow-xl para remover a borda grossa */}
                      <SelectContent className="border-none shadow-xl">
                        <SelectItem value="BRL" className="cursor-pointer">Real Brasileiro (BRL)</SelectItem>
                        <SelectItem value="USD" className="cursor-pointer">Dólar Americano (USD)</SelectItem>
                        <SelectItem value="EUR" className="cursor-pointer">Euro (EUR)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading} className="cursor-pointer">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Alterações"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}