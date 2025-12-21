"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, LogOut, User, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Logo } from "@/components/ui/logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { WorkspaceCard } from "@/components/workspace-card";
import { CreateWorkspaceDialog } from "@/components/features/workspace/create-workspace-dialog";
import { PrivacyToggle } from "@/components/features/privacy-toggle"; 

import { mockUser, mockWorkspaces, mockBuckets } from "@/mock/data";

export default function WorkspaceSelectorPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const workspacesWithBalance = mockWorkspaces.map(ws => {
    const balance = mockBuckets
      .filter(b => b.workspace_id === ws.id)
      .reduce((acc, curr) => acc + curr.current_balance, 0);
    
    return { ...ws, total_balance: balance };
  });

  return (
    <div className="min-h-screen bg-background animate-fade-up">
      {/* Header Simplificado*/}
      <header className="border-b border-border/60 bg-card">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Logo size="md" />
          
          <div className="flex items-center gap-2">
            <PrivacyToggle showTooltip={false} />

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-3 px-3 hover:bg-secondary cursor-pointer">
                  <Avatar className="h-8 w-8 border-2 border-secondary">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                      {getInitials(mockUser.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium text-foreground sm:block">
                    {mockUser.name}
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <Link href="/profile">
                    <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Perfil
                    </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-6 py-12">
        <div>
          {/* Greeting Section */}
          <div className="mb-10 text-center sm:text-left">
            <h1 className="text-3xl font-bold text-foreground">
              Olá, {mockUser.name.split(" ")[0]} 👋
            </h1>
            <p className="mt-2 text-muted-foreground text-lg">
              Selecione um workspace para começar a gerenciar suas finanças.
            </p>
          </div>

          {/* Workspaces Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {workspacesWithBalance.map((workspace, index) => (
              <div
                key={workspace.id}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <WorkspaceCard workspace={workspace} />
              </div>
            ))}

            {/* Create New Workspace Button (Card style) */}
            <Button
              variant="outline"
              onClick={() => setCreateDialogOpen(true)}
              className="h-full min-h-45 w-full flex-col gap-4 border-2 border-dashed border-border/80 bg-transparent hover:border-primary/50 hover:bg-secondary/30 cursor-pointer group"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-dashed border-muted-foreground/30 group-hover:border-primary/50 group-hover:scale-110 transition-all duration-300">
                <Plus className="h-7 w-7 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    Criar Novo Workspace
                </span>
                <span className="text-xs text-muted-foreground font-normal">
                    Adicione um novo espaço
                </span>
              </div>
            </Button>
          </div>
        </div>
      </main>

      {/* Create Workspace Dialog */}
      <CreateWorkspaceDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
}