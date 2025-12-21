"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Plus, Target, PiggyBank } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { AddBucketDialog } from "@/components/features/buckets/add-bucket-dialog";
import { EditBucketDialog } from "@/components/features/buckets/edit-bucket-dialog";

import { BucketCard } from "@/components/bucket-card";
import { BucketCardSkeleton } from "@/components/skeletons/bucket-card";

import { mockWorkspaces, mockBuckets } from "@/mock/data";

import { Bucket } from "@/types";
import { cn } from "@/lib/utils";

export default function BucketsPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspaceId as string;

  const workspace = mockWorkspaces.find((w) => w.id === workspaceId);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedBucket, setSelectedBucket] = useState<Bucket | null>(null);
  
  const [isLoading] = useState(false);

  const buckets = useMemo(() => 
    mockBuckets.filter((b) => b.workspace_id === workspaceId),
    [workspaceId]
  ); 

  const totalAllocated = useMemo(
    () => buckets.reduce((sum, b) => sum + b.allocation_percentage, 0),
    [buckets]
  );

  const allocationMessage = useMemo(
    () =>
      totalAllocated < 100
        ? `${100 - totalAllocated}% ainda disponível para alocar`
        : "100% do seu orçamento está alocado",
    [totalAllocated]
  );

  const handleCreateClick = () => {
    setIsCreateOpen(true);
  };

  const handleEditClick = (bucket: Bucket) => {
    setSelectedBucket(bucket);
    setIsEditOpen(true);
  };

  if (!workspace) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-muted-foreground">
        <p>Workspace não encontrado.</p>
        <Button variant="link" onClick={() => router.push("/dashboard")}>
          Voltar ao início
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Caixas de Propósito
          </h1>
          <p className="mt-1 text-muted-foreground">
            Organize seu dinheiro por objetivos
          </p>
        </div>
        <Button className="gap-2 cursor-pointer" onClick={handleCreateClick}>
          <Plus className="h-4 w-4" />
          Novo Caixa
        </Button>
      </div>

      {/* Allocation Overview */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Target className="h-5 w-5 text-primary" />
            Alocação Total
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Alocado</span>
              <span className="font-medium text-foreground">
                {totalAllocated}%
              </span>
            </div>
            {/* Progress Bar com cor dinâmica se passar de 100% */}
            <Progress 
              value={totalAllocated} 
              className={cn("h-3", totalAllocated > 100 && "bg-destructive/20 [&>div]:bg-destructive")} 
            />
            <p className={cn("text-sm", totalAllocated > 100 ? "text-destructive font-medium" : "text-muted-foreground")}>
              {totalAllocated > 100 ? "Atenção: Você alocou mais que 100%!" : allocationMessage}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Buckets Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <BucketCardSkeleton key={index} index={index} />
          ))
        ) : buckets.length === 0 ? (
          <Card className="col-span-full border-border/60 p-12 text-center border-dashed">
            <PiggyBank className="mx-auto h-12 w-12 text-muted-foreground/30" />
            <h3 className="mt-4 font-semibold text-foreground">
              Nenhum caixa criado
            </h3>
            <p className="mt-2 text-muted-foreground">
              Crie seu primeiro caixa para começar a organizar seu dinheiro
            </p>
            <Button className="mt-4 gap-2 cursor-pointer" onClick={handleCreateClick}>
              <Plus className="h-4 w-4" />
              Criar Caixa
            </Button>
          </Card>
        ) : (
          buckets.map((bucket, index) => (
            <BucketCard
              key={bucket.id}
              bucket={bucket}
              currency={workspace.currency}
              index={index}
              onEdit={handleEditClick}
            />
          ))
        )}
      </div>

      <AddBucketDialog 
        open={isCreateOpen} 
        onOpenChange={setIsCreateOpen} 
        workspaceId={workspace.id} 
      />

      <EditBucketDialog 
        open={isEditOpen} 
        onOpenChange={setIsEditOpen} 
        bucket={selectedBucket} 
        workspaceId={workspace.id} 
      />
    </div>
  );
}