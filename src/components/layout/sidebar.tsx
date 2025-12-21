"use client";

import {
  Sidebar as SidebarShadcn,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  PiggyBank, 
  Settings, 
  HelpCircle 
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";

interface SidebarProps {
  workspaceId: string;
}

const menuItems = [
  {
    title: "Visão Geral",
    icon: LayoutDashboard,
    path: "",
  },
  {
    title: "Transações",
    icon: ArrowLeftRight,
    path: "/transactions",
  },
  {
    title: "Caixas de Propósito",
    icon: PiggyBank,
    path: "/buckets",
  },
  {
    title: "Configurações",
    icon: Settings,
    path: "/settings",
  },
];

export function Sidebar({ workspaceId }: SidebarProps) {
  const pathname = usePathname();
  const basePath = `/dashboard/${workspaceId}`;

  const isActive = (path: string) => {
    if (path === "") {
      return pathname === basePath || pathname === `${basePath}/`;
    }
    return pathname.startsWith(`${basePath}${path}`);
  };

  const isHelpActive = pathname === `${basePath}/help`;

  return (
    <SidebarShadcn className="border-r border-sidebar-border" collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-4 h-16 flex items-center justify-center">
        <Link href={`/dashboard`}>
          <Logo size="md" />
        </Link>
      </SidebarHeader>

      <SidebarContent className="p-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className={cn(
                      "h-11 gap-3 rounded-lg px-3 font-medium transition-all",
                      isActive(item.path)
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                    )}
                  >
                    <Link href={`${basePath}${item.path}`}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Ajuda"
              className={cn(
                "h-11 gap-3 rounded-lg px-3 font-medium transition-all",
                isHelpActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <Link href={`${basePath}/help`}>
                <HelpCircle className="h-5 w-5" />
                <span>Ajuda</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </SidebarShadcn>
  );
}