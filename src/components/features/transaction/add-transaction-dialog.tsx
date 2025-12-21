"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { cn, getCurrencySymbol } from "@/lib/utils";
import { mockBuckets } from "@/mock/data"; 
import { transactionFormSchema, TransactionFormData, CreateTransactionData } from "@/schemas/transaction";

interface AddTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
  currency?: string;
}

export function AddTransactionDialog({ 
  open, 
  onOpenChange, 
  workspaceId, 
  currency = "BRL" 
}: AddTransactionDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const workspaceBuckets = mockBuckets.filter((b) => b.workspace_id === workspaceId);
  const currencySymbol = getCurrencySymbol(currency);

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      type: "EXPENSE",
      amount: 0,
      description: "",
      date: new Date(),
      bucketId: undefined,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        type: "EXPENSE",
        amount: undefined,
        description: "",
        date: new Date(),
        bucketId: undefined,
      });
    }
  }, [open, form]);

  const onSubmit = async (data: TransactionFormData) => {
    setIsLoading(true);
  
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const payload: CreateTransactionData = {
      ...data,
      workspaceId: workspaceId,
      bucketId: data.bucketId === "none" ? null : data.bucketId,
    };

    console.log("Payload Enviado:", payload);
    
    toast.success("Transação adicionada!", {
      description: `${data.type === "INCOME" ? "Receita" : "Despesa"} de ${currencySymbol} ${Number(data.amount).toFixed(2)} registrada.`,
    });
    
    setIsLoading(false);
    onOpenChange(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset();
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-120 border-none shadow-xl [&>button]:cursor-pointer">
        <DialogHeader>
          <DialogTitle>Nova Transação</DialogTitle>
          <DialogDescription>
            Adicione uma nova receita ou despesa ao seu workspace.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-4" noValidate>
            
            {/* Seletor de Tipo */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <FormControl>
                    <ToggleGroup
                      type="single"
                      value={field.value}
                      onValueChange={(value) => {
                        if (value) field.onChange(value);
                      }}
                      className="grid grid-cols-2 gap-2"
                    >
                      <ToggleGroupItem
                        value="INCOME"
                        className={cn(
                          "h-10 border data-[state=on]:bg-finza-success/10 data-[state=on]:text-finza-success data-[state=on]:border-finza-success transition-all cursor-pointer hover:bg-muted"
                        )}
                      >
                        Receita
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="EXPENSE"
                        className={cn(
                          "h-10 border data-[state=on]:bg-destructive/10 data-[state=on]:text-destructive data-[state=on]:border-destructive transition-all cursor-pointer hover:bg-muted"
                        )}
                      >
                        Despesa
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Input de Valor */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium text-sm">
                        {currencySymbol}
                      </span>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0,00"
                        className="pl-10"
                        {...field}
                        value={field.value ?? ""} 
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? undefined : Number(value));
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Input de Descrição */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Almoço, Salário, Netflix..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Seletor de Data */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal cursor-pointer",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP", { locale: ptBR })
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-none shadow-xl" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        locale={ptBR}
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Seletor de Bucket */}
            <FormField
              control={form.control}
              name="bucketId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria / Bucket</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value || "none"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um bucket (opcional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="border-none shadow-xl">
                      <SelectItem value="none" className="cursor-pointer text-muted-foreground">
                        Sem categoria
                      </SelectItem>
                      {workspaceBuckets.map((bucket) => (
                        <SelectItem key={bucket.id} value={bucket.id} className="cursor-pointer">
                          {bucket.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => handleOpenChange(false)}
                className="cursor-pointer"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading} className="cursor-pointer">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Adicionar Transação"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}