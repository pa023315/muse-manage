import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { LayoutProvider } from "@/contexts/LayoutContext";
import { UserMenu } from "./UserMenu";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <LayoutProvider>
      <div className="flex h-screen bg-background text-foreground">
        <Sidebar />
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