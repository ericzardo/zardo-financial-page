"use client";

import { useState, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import { Plus, Search } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { TransactionRow } from "@/components/transaction-row";
import { TransactionRowSkeleton } from "@/components/skeletons/transaction-row";
import { AddTransactionDialog } from "@/components/features/transaction/add-transaction-dialog";

import { mockWorkspaces, mockTransactions } from "@/mock/data";

type FilterType = "ALL" | "INCOME" | "EXPENSE";

export default function TransactionsPage() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  const workspace = mockWorkspaces.find((w) => w.id === workspaceId);

  const [filter, setFilter] = useState<FilterType>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading] = useState(false);

  const allTransactions = useMemo(
    () => mockTransactions.filter((t) => t.workspace_id === workspaceId || t.workspace_id === undefined),
    [workspaceId]
  );

  const filteredTransactions = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();
    
    return allTransactions.filter((t) => {
      const matchesFilter = filter === "ALL" || t.type === filter;
      const matchesSearch =
        !searchQuery ||
        (t.description && t.description.toLowerCase().includes(searchLower));
        
      return matchesFilter && matchesSearch;
    });
  }, [allTransactions, filter, searchQuery]);

  const handleOpenDialog = useCallback(() => setIsDialogOpen(true), []);
  const handleCloseDialog = useCallback((open: boolean) => setIsDialogOpen(open), []);
  const handleFilterChange = useCallback((v: string) => setFilter(v as FilterType), []);
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value),
    []
  );

  const listTitle = useMemo(() => {
    if (filter === "ALL") return "Todas as Transações";
    return filter === "INCOME" ? "Receitas" : "Despesas";
  }, [filter]);

  if (!workspace) {
    return <div className="p-8 text-center">Workspace não encontrado</div>;
  }

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Transações</h1>
          <p className="mt-1 text-muted-foreground">
            Gerencie suas receitas e despesas
          </p>
        </div>
        <Button className="gap-2 cursor-pointer" onClick={handleOpenDialog}>
          <Plus className="h-4 w-4" />
          Nova Transação
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-border/60">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar transações..."
                className="pl-10"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>

            {/* Type Filter Tabs */}
            <Tabs value={filter} onValueChange={handleFilterChange}>
              <TabsList className="grid w-full grid-cols-3 sm:w-auto">
                <TabsTrigger value="ALL" className="cursor-pointer">Todas</TabsTrigger>
                <TabsTrigger
                  value="INCOME"
                  className="data-[state=active]:text-finza-success cursor-pointer"
                >
                  Receitas
                </TabsTrigger>
                <TabsTrigger
                  value="EXPENSE"
                  className="data-[state=active]:text-destructive cursor-pointer"
                >
                  Despesas
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            {listTitle}
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({filteredTransactions.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TransactionRowSkeleton key={index} />
            ))
          ) : filteredTransactions.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">
                {searchQuery
                  ? "Nenhuma transação encontrada para sua busca"
                  : "Nenhuma transação registrada neste período"}
              </p>
              <Button
                variant="outline"
                className="mt-4 gap-2 cursor-pointer"
                onClick={handleOpenDialog}
              >
                <Plus className="h-4 w-4" />
                Adicionar primeira transação
              </Button>
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
                currency={workspace.currency}
              />
            ))
          )}
        </CardContent>
      </Card>

      {/* Add Transaction Dialog */}
      <AddTransactionDialog
        open={isDialogOpen}
        onOpenChange={handleCloseDialog}
        workspaceId={workspace.id}
        currency={workspace.currency}
      />
    </div>
  );
}