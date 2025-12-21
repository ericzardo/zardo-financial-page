"use client";

import { useParams, useRouter } from "next/navigation";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { EditWorkspaceDialog } from "@/components/features/settings/edit-workspace-dialog";
import { WorkspaceDeleteZone } from "@/components/features/settings/danger-zone-workspace";

import { mockWorkspaces } from "@/mock/data";

export default function WorkspaceSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspaceId as string;

  const workspace = mockWorkspaces.find((w) => w.id === workspaceId);

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
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
        <p className="mt-1 text-muted-foreground">
          Gerencie as configurações do workspace <strong>{workspace.name}</strong>
        </p>
      </div>

      {/* 1. Formulário Geral */}
      <EditWorkspaceDialog workspace={workspace} />

      {/* 2. Preferências (Placeholder) */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Settings className="h-5 w-5 text-primary" />
            Preferências
          </CardTitle>
          <CardDescription>
            Personalize sua experiência
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground bg-secondary/20 p-4 rounded-lg border border-border/50">
            Mais opções de personalização (temas, notificações, integrações) estarão disponíveis em breve.
          </p>
        </CardContent>
      </Card>

      {/* 3. Zona de Perigo */}
      <WorkspaceDeleteZone workspaceName={workspace.name} />
    </div>
  );
}