"use client";

import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Loader2, Info } from "lucide-react";
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
import { MoneyInput } from "@/components/ui/money-input";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch"; 
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { cn, getCurrencySymbol } from "@/lib/utils";
import { transactionFormSchema, TransactionData } from "@/schemas/transaction";
import { createTransactionRequest } from "@/http/transactions";
import { getBucketsRequest } from "@/http/buckets"; 
import { Bucket } from "@/types";

interface AddTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
  currency?: string;
  buckets?: Bucket[]; 
  onSuccess?: () => void;
}

export function AddTransactionDialog({ 
  open, 
  onOpenChange, 
  workspaceId, 
  currency = "BRL",
  buckets: initialBuckets = [],
  onSuccess
}: AddTransactionDialogProps) {
  
  const [isLoading, setIsLoading] = useState(false);
  const [bucketsList, setBucketsList] = useState<Bucket[]>(initialBuckets);
  const [isLoadingBuckets, setIsLoadingBuckets] = useState(false);

  const currencySymbol = getCurrencySymbol(currency);

  const form = useForm<TransactionData>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      type: "EXPENSE",
      amount: 0,
      description: "",
      date: new Date(),
      workspaceId: workspaceId,
      isAllocated: false, 
    },
  });

  const selectedType = useWatch({ control: form.control, name: "type" });
  const isAllocated = useWatch({ control: form.control, name: "isAllocated" });

  useEffect(() => {
    async function fetchBuckets() {
      if (open && workspaceId) {
        try {
          setIsLoadingBuckets(true);
          const data = await getBucketsRequest(workspaceId);
          setBucketsList(data);
        } catch (error) {
          console.error("Erro ao buscar caixas", error);
        } finally {
          setIsLoadingBuckets(false);
        }
      }
    }
    fetchBuckets();
  }, [open, workspaceId]);

  useEffect(() => {
    if (open) {
      form.reset({
        type: "EXPENSE",
        amount: 0,
        description: "",
        date: new Date(),
        workspaceId: workspaceId,
        bucketId: undefined,
        isAllocated: false,
      });
    }
  }, [open, form, workspaceId]);

  const onSubmit = async (data: TransactionData) => {
    try {
      setIsLoading(true);

      const payload = {
        ...data,
        workspaceId,
        bucketId: (data.type === "INCOME" && data.isAllocated) || data.bucketId === "none" 
          ? undefined 
          : data.bucketId,
      };

      await createTransactionRequest(payload);
      
      toast.success("Transação registrada!");
      
      if (onSuccess) onSuccess();
      onOpenChange(false);

    } catch (error) {
      console.error(error);
      toast.error("Erro ao registrar transação.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) form.reset();
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-106.25 p-6 border-none shadow-2xl gap-0">
        <DialogHeader className="pb-4 mb-4">
          <DialogTitle className="text-xl">Nova Transação</DialogTitle>
          <DialogDescription>
            Registre entradas ou saídas para manter seu controle em dia.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Tipo</FormLabel>
                  <FormControl>
                    <ToggleGroup
                      type="single"
                      value={field.value}
                      onValueChange={(value) => {
                        if (value) {
                          field.onChange(value);
                          if (value === "EXPENSE") {
                             form.setValue("isAllocated", false);
                          } else {
                             form.setValue("bucketId", undefined);
                          }
                        }
                      }}
                      className="grid grid-cols-2 gap-2"
                    >
                      <ToggleGroupItem
                        value="INCOME"
                        className="h-9 border border-input data-[state=on]:bg-finza-success/10 data-[state=on]:text-finza-success data-[state=on]:border-finza-success hover:bg-accent hover:text-accent-foreground transition-all cursor-pointer"
                      >
                        Receita
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="EXPENSE"
                        className="h-9 border border-input data-[state=on]:bg-destructive/10 data-[state=on]:text-destructive data-[state=on]:border-destructive hover:bg-accent hover:text-accent-foreground transition-all cursor-pointer"
                      >
                        Despesa
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor</FormLabel>
                    <FormControl>
                      <MoneyInput
                        placeholder="0,00"
                        currencySymbol={currencySymbol}
                        value={field.value} 
                        onValueChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                              "w-full justify-start text-left font-normal pl-3",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy", { locale: ptBR })
                            ) : (
                              <span>Selecione</span>
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
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={selectedType === "INCOME" ? "Ex: Salário, Freelance..." : "Ex: Mercado, Uber..."}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedType === "INCOME" && (
              <FormField
                control={form.control}
                name="isAllocated"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm font-medium">
                        Distribuição Automática
                      </FormLabel>
                      <FormDescription className="text-xs">
                        Dividir valor conforme % das caixas
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="cursor-pointer"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            {!(selectedType === "INCOME" && isAllocated) && (
              <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                <FormField
                  control={form.control}
                  name="bucketId"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel>
                          {selectedType === "INCOME" ? "Caixa de Destino" : "Categoria / Caixa"}
                        </FormLabel>
                        {selectedType === "EXPENSE" && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Vincule a uma caixa para atualizar seu orçamento.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value || "none"}
                        disabled={isLoadingBuckets} 
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={
                               selectedType === "INCOME" 
                                 ? "Selecione onde guardar" 
                                 : "Selecione a categoria"
                            } />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-50">
                          <SelectItem value="none" className="cursor-pointer text-muted-foreground">
                            {selectedType === "INCOME" ? "Sem destino (Saldo Livre)" : "Selecione..."}
                          </SelectItem>
                          {bucketsList.map((bucket) => (
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
              </div>
            )}

            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => handleOpenChange(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading} className="min-w-32">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  selectedType === "INCOME" ? "Receber" : "Pagar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}