"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Key, Shield, ChevronDown, LogOut, User as UserIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SensitiveValue } from "@/components/ui/sensitive-value";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { cn, formatCurrency } from "@/lib/utils";
import { mockUser, mockWorkspaces } from "@/mock/data"

import { 
  UpdateUserData, 
} from "@/schemas/user";

import { Logo } from "@/components/ui/logo"; 
import { PrivacyToggle } from "@/components/features/privacy-toggle"; 
import { ChangePasswordDialog } from "@/components/features/profile/change-password-dialog";
import { EditProfileDialog } from "@/components/features/profile/edit-profile-dialog";

const PRESET_AVATARS = [
  { id: "avatar-1", emoji: "👤", bg: "bg-primary/10" },
  { id: "avatar-2", emoji: "🧑‍💼", bg: "bg-accent/10" },
  { id: "avatar-3", emoji: "🦊", bg: "bg-finza-success/10" },
];

export default function UserProfile() {
const router = useRouter();

  const [name, setName] = useState(mockUser.name);
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0].id);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

const totalNetWorth = mockWorkspaces.reduce((acc, workspace) => {
  return acc + (workspace.total_balance || 0); 
}, 0);
  const currentAvatar = PRESET_AVATARS.find((a) => a.id === selectedAvatar) || PRESET_AVATARS[0];

  const handleProfileUpdate = (data: UpdateUserData) => {
    if (data.name) setName(data.name);
    if (data.avatarUrl) setSelectedAvatar(data.avatarUrl);
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-background animate-fade-up">
      <header className="border-b border-border/60 bg-card">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link href={`/dashboard`}>
              <Logo size="md" />
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <PrivacyToggle showTooltip={false} className="cursor-pointer" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-3 px-3 hover:bg-secondary cursor-pointer">
                  <Avatar className="h-8 w-8 border-2 border-secondary">
                    <AvatarFallback className={cn("text-lg", currentAvatar.bg)}>
                      {currentAvatar.emoji}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium text-foreground sm:block">
                    {name}
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="cursor-pointer">
                  <UserIcon className="mr-2 h-4 w-4" />
                  Perfil
                </DropdownMenuItem>
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
       <main className="mx-auto max-w-3xl px-6 py-8">
        <div>
          <div className="mb-8">
            <button
              onClick={handleGoBack}
              className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </button>
            <h1 className="text-2xl font-bold text-foreground">
              Configurações de Usuário
            </h1>
            <p className="mt-1 text-muted-foreground">
              Gerencie suas informações pessoais e segurança
            </p>
          </div>

          <div className="space-y-6">
            {/* Banner do Perfil */}
            <Card className="border-border/60 overflow-hidden">
              <div 
                className="h-28 sm:h-32"
                style={{ 
                  background: "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)" 
                }}
              />
              
              <CardContent className="relative px-6 pb-8">
                <div className="flex flex-col items-center -mt-16 sm:-mt-20">
                  <Avatar className="h-28 w-28 sm:h-32 sm:w-32 border-4 border-card shadow-xl">
                    <AvatarFallback className={cn("text-5xl sm:text-6xl", currentAvatar.bg)}>
                      {currentAvatar.emoji}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="mt-4 text-center">
                    <h2 className="text-2xl font-bold text-foreground">{name}</h2>
                    <p className="text-muted-foreground">{mockUser.email}</p>
                  </div>
                  
                  <div className="mt-4 rounded-xl bg-secondary/50 px-6 py-3 text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Patrimônio Total
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      <SensitiveValue>
                        {formatCurrency(totalNetWorth, "BRL")}
                      </SensitiveValue>
                    </p>
                  </div>
                  
                  <Button
                    variant="outline"
                    className="mt-6 cursor-pointer"
                    onClick={() => setIsEditDialogOpen(true)}
                  >
                    Editar Perfil
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Cartão de Segurança */}
            <Card className="border-border/60">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
                    <Shield className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <CardTitle>Segurança</CardTitle>
                    <CardDescription>
                      Gerencie sua senha e autenticação
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="gap-2 cursor-pointer"
                  onClick={() => setIsPasswordDialogOpen(true)}
                >
                  <Key className="h-4 w-4" />
                  Alterar Senha
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Dialog: Editar Perfil */}
      <EditProfileDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        initialData={{ name, avatarUrl: selectedAvatar }}
        onSuccess={handleProfileUpdate}
      />

      {/* Dialog: Alterar senha */}
      <ChangePasswordDialog 
         open={isPasswordDialogOpen} 
         onOpenChange={setIsPasswordDialogOpen} 
       />
    </div>
  );
}