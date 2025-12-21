"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { mockUser, mockWorkspaces } from "@/mock/data";
import { ChevronDown, LogOut, User, Wallet } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PrivacyToggle } from "@/components/features/privacy-toggle"; 

interface HeaderProps {
  workspace?: { name: string; currency: string; id: string };
}

export function Header({ workspace }: HeaderProps) {
  const router = useRouter();
  
  const currentWorkspace = workspace || mockWorkspaces[0];

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <header className="flex h-16 items-center justify-between border-b border-border/60 bg-card px-4 lg:px-6 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="lg:hidden" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-auto gap-3 px-3 py-2 cursor-pointer hover:bg-secondary data-[state=open]:bg-secondary"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Wallet className="h-4 w-4 text-primary" />
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold text-foreground">
                  {currentWorkspace.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {currentWorkspace.currency}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {mockWorkspaces.map((ws) => (
              <DropdownMenuItem
                key={ws.id}
                onClick={() => router.push(`/dashboard/${ws.id}`)}
                className={ws.id === currentWorkspace.id ? "bg-secondary" : ""}
              >
                <Wallet className="mr-2 h-4 w-4" />
                {ws.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard">Ver todos os workspaces</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-2">
        <PrivacyToggle className="h-9 w-9 cursor-pointer" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-3 px-3 cursor-pointer hover:bg-secondary">
              <Avatar className="h-8 w-8 border-2 border-secondary">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                  {getInitials(mockUser.name)}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium text-foreground md:block">
                {mockUser.name}
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => router.push("/profile")}>
              <User className="mr-2 h-4 w-4" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}