"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent, // Aqui vamos tirar a borda
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface WorkspaceDeleteZoneProps {
  workspaceName: string;
}

export function WorkspaceDeleteZone({ workspaceName }: WorkspaceDeleteZoneProps) {
  const router = useRouter();

  const handleDelete = async () => {
    toast.loading("Excluindo workspace...", { id: "delete-ws" });
    
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast.dismiss("delete-ws");
    toast.success("Workspace excluído com sucesso");
    router.push("/dashboard");
  };

  return (
    // Estilo fiel ao código Lovable fornecido: Apenas a borda destructive/50
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-destructive">
          <Trash2 className="h-5 w-5" />
          Zona de Perigo
        </CardTitle>
        <CardDescription>
          Ações irreversíveis para este workspace
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="gap-2 cursor-pointer">
              <Trash2 className="h-4 w-4" />
              Excluir Workspace
            </Button>
          </AlertDialogTrigger>
          
          {/* REMOVIDO A BORDA DO MODAL AQUI (border-none) para ficar clean igual Lovable */}
          <AlertDialogContent className="border-none shadow-xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir Workspace</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação é irreversível. Todos os buckets e transações serão perdidos permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete}
                className="bg-destructive hover:bg-destructive/90 cursor-pointer"
              >
                Sim, Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}