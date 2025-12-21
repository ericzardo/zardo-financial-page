import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Sidebar } from "@/components/layout/sidebar"; 
import { Header } from "@/components/layout/header";
import { mockWorkspaces } from "@/mock/data";

interface WorkspaceLayoutProps {
  children: ReactNode;
  params: Promise<{ workspaceId: string }>;
}

export default async function WorkspaceLayout({
  children,
  params,
}: WorkspaceLayoutProps) {
  const { workspaceId } = await params;

  const workspace = mockWorkspaces.find((w) => w.id === workspaceId);

  if (!workspace) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">
            Workspace não encontrado
          </h1>
          <p className="mt-2 text-muted-foreground">
            O workspace solicitado não existe ou você não tem acesso.
          </p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar workspaceId={workspace.id} />
      
      <div className="flex min-h-screen flex-1 flex-col transition-all duration-300 ease-in-out peer-data-[state=collapsed]:pl-0">
        <Header workspace={workspace} />
      
        <main className="flex-1 overflow-auto bg-background p-6">
          {children} 
        </main>
      </div>
    </SidebarProvider>
  );
}