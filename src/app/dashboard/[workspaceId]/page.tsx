"use client";

import { useState, useCallback, useMemo, use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Plus } from "lucide-react";

import { mockBuckets, mockWorkspaces } from "@/mock/data";

import { MonthYearFilter } from "@/components/features/dashboard/month-year-filter";
import { AllocationChart } from "@/components/features/dashboard/allocation-chart";
import { SafeToSpendCard } from "@/components/features/dashboard/safe-to-spend-card";
import { AddTransactionDialog } from "@/components/features/transaction/add-transaction-dialog";

interface PageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

export default function DashboardPage({ params }: PageProps) {
  const { workspaceId } = use(params);

  const workspace = mockWorkspaces.find((w) => w.id === workspaceId);

  const buckets = useMemo(
    () => mockBuckets.filter((b) => b.workspace_id === workspaceId),
    [workspaceId]
  );

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [isDialogOpen, setIsDialogOpen] = useState(false);

const handlePreviousMonth = useCallback(() => {
    setMonth((prevMonth) => {
      if (prevMonth === 0) {
        setYear((y) => y - 1);
        return 11;
      }
      return prevMonth - 1;
    });
  }, [setMonth, setYear]);

const handleNextMonth = useCallback(() => {
    setMonth((prevMonth) => {
      if (prevMonth === 11) {
        setYear((y) => y + 1);
        return 0;
      }
      return prevMonth + 1;
    });
  }, [setMonth, setYear]);

  const handleOpenDialog = useCallback(() => setIsDialogOpen(true), []);
  const handleCloseDialog = useCallback((open: boolean) => setIsDialogOpen(open), []);

  if (!workspace) {
    return (
       <div className="flex h-[80vh] flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-2xl font-bold">Workspace não encontrado</h1>
        <p className="text-muted-foreground">
          O workspace solicitado não existe ou você não tem acesso.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Visão Geral</h1>
          <p className="mt-1 text-muted-foreground">
            Acompanhe a alocação do seu dinheiro
          </p>
        </div>
        <div className="flex items-center gap-3">
          <MonthYearFilter
            month={month}
            year={year}
            onPrevious={handlePreviousMonth}
            onNext={handleNextMonth}
          />
          <Button onClick={handleOpenDialog} className="gap-2 cursor-pointer">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Transação</span>
          </Button>
        </div>
      </div>

      {/* Safe to Spend Cards */}
      <SafeToSpendCard buckets={buckets} currency={workspace.currency} />

      {/* Allocation Chart */}
      <Card className="border-border/60">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg font-semibold">
            Distribuição por Caixas
          </CardTitle>
          <PieChart className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <AllocationChart buckets={buckets} currency={workspace.currency} />
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