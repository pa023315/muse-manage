import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  BarChart3,
  Calendar,
  Building2,
  Shield,
  LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useLayout } from "@/contexts/LayoutContext";
import { Button } from "@/components/ui/button";

const navigation = [
  {
    name: "管理後台",
    href: "/admin",
    icon: BarChart3,
  },
  {
    name: "活動管理",
    href: "/admin/events",
    icon: Calendar,
  },
  {
    name: "廠商管理",
    href: "/admin/vendors",
    icon: Building2,
  },
];

export default function AdminSidebar() {
  const { sidebarCollapsed } = useLayout();
  const navigate = useNavigate();

  const handleBackToERP = () => {
    navigate("/dashboard");
  };

  return (
    <div className={cn("flex h-full flex-col bg-sidebar text-sidebar-foreground transition-all duration-300", 
      sidebarCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex flex-col h-full bg-sidebar">
        {/* Logo */}
        <div className="flex h-14 items-center px-4 border-b border-sidebar-border bg-sidebar">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-sidebar-foreground" />
            {!sidebarCollapsed && (
              <span className="font-semibold text-sidebar-foreground">管理後台</span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 bg-sidebar">
          <div className="space-y-3 py-4">
            <div className="px-3 py-1.5">
              {!sidebarCollapsed && (
                <h2 className="mb-1.5 px-4 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/70">
                  管理功能
                </h2>
              )}
              <div className="space-y-0.5">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) => cn(
                      "flex items-center w-full justify-start text-xs rounded-md px-3 py-2 transition-colors",
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                    )}
                  >
                    <item.icon className={cn("h-4 w-4", sidebarCollapsed ? "" : "mr-1.5")} />
                    {!sidebarCollapsed && <span>{item.name}</span>}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        <Separator className="bg-sidebar-border" />
        
        {/* Back to ERP Button */}
        <div className="p-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackToERP}
            className="w-full justify-start text-xs"
          >
            <LogOut className={cn("h-4 w-4", sidebarCollapsed ? "" : "mr-1.5")} />
            {!sidebarCollapsed && <span>返回 ERP 系統</span>}
          </Button>
        </div>
      </div>
    </div>
  );
}
