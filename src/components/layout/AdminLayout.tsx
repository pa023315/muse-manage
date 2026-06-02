import { ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";
import { LayoutProvider } from "@/contexts/LayoutContext";
import { UserMenu } from "./UserMenu";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {

  return (
    <LayoutProvider>
      <div className="flex h-screen bg-background text-foreground">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="h-14 border-b border-border bg-background flex items-center justify-end px-4">
            <UserMenu />
          </header>
          <main className="flex-1 overflow-auto bg-background">
            {children}
          </main>
        </div>
      </div>
    </LayoutProvider>
  );
}
