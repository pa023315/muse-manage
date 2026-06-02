import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  FolderOpen,
  Receipt,
  CreditCard,
  Users,
  Building2,
  Package,
  Calendar,
  BarChart3,
  Settings,
  Archive,
  MapPin,
  Palette,
  TrendingUp,
  FileBarChart,
} from "lucide-react";
import { useLocation, NavLink } from "react-router-dom";
import { useLayout } from "@/contexts/LayoutContext";

const navigation = [
  {
    name: "儀表板",
    href: "/dashboard",
    icon: LayoutDashboard,
    group: "overview"
  },
  // 專案管理
  {
    name: "洽詢單",
    href: "/inquiries", 
    icon: MessageSquare,
    group: "project"
  },
  {
    name: "報價單",
    href: "/quotes",
    icon: FileText,
    group: "project"
  },
  {
    name: "專案一覽",
    href: "/projects",
    icon: FolderOpen,
    group: "project"
  },
  {
    name: "時程表",
    href: "/schedule",
    icon: Calendar,
    group: "project"
  },
  // 收益管理
  {
    name: "收益表",
    href: "/invoices",
    icon: Receipt,
    group: "revenue"
  },
  {
    name: "支出表",
    href: "/expenses",
    icon: CreditCard,
    group: "revenue"
  },
  // 客戶管理
  {
    name: "客戶一覽",
    href: "/customers",
    icon: Users,
    group: "customer"
  },
  {
    name: "新增客戶",
    href: "/customers/new",
    icon: Users,
    group: "customer"
  },
  // 庫存管理
  {
    name: "庫存管理",
    href: "/inventory",
    icon: Package,
    group: "inventory"
  },
  // 活動
  {
    name: "活動列表",
    href: "/events",
    icon: Calendar,
    group: "events"
  },
  {
    name: "已報名活動",
    href: "/events/registered",
    icon: MapPin,
    group: "events"
  },
  // 廠商資源
  {
    name: "廠商一覽",
    href: "/vendors",
    icon: Building2,
    group: "vendor"
  },
  {
    name: "常用廠商",
    href: "/vendors/favorites",
    icon: Archive,
    group: "vendor"
  },
  // 資料管理
  {
    name: "帳號管理",
    href: "/settings/account",
    icon: Settings,
    group: "data"
  },
  {
    name: "權限管理",
    href: "/settings/permissions",
    icon: Settings,
    group: "data"
  },
  {
    name: "服務訂閱管理",
    href: "/settings/billing",
    icon: Settings,
    group: "data"
  }
];

const groupLabels = {
  project: "專案管理",
  revenue: "收益管理",
  customer: "客戶管理", 
  inventory: "庫存管理",
  events: "活動",
  vendor: "廠商資源",
  data: "資料管理"
};

export default function Sidebar() {
  const location = useLocation();
  const { sidebarCollapsed } = useLayout();
  
  const getGroupedNav = () => {
    const groups: Record<string, typeof navigation> = {};
    navigation.forEach(item => {
      if (!groups[item.group]) {
        groups[item.group] = [];
      }
      groups[item.group].push(item);
    });
    return groups;
  };

  const groupedNav = getGroupedNav();

  return (
    <div className={cn("flex h-full flex-col bg-sidebar text-sidebar-foreground transition-all duration-300", 
      sidebarCollapsed ? "w-16" : "w-64"
    )}>
      {/* Navigation container */}
      <div className="flex flex-col h-full bg-sidebar">
        {/* Logo */}
        <div className="flex h-14 items-center px-4 border-b border-sidebar-border bg-sidebar">
          <div className="flex items-center gap-2">
            <Palette className="h-6 w-6 text-sidebar-foreground" />
            {!sidebarCollapsed && (
              <span className="font-semibold text-sidebar-foreground">Creator ERP</span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 bg-sidebar">
          <div className="space-y-3 py-4">
            {/* Dashboard */}
            <div className="px-3 py-1.5">
              <NavLink 
                to="/dashboard"
                className={({ isActive }) => cn(
                  "flex items-center w-full justify-start text-xs rounded-md px-3 py-2 transition-colors",
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                )}
              >
                <LayoutDashboard className={cn("h-4 w-4", sidebarCollapsed ? "" : "mr-1.5")} />
                {!sidebarCollapsed && <span>儀表板</span>}
              </NavLink>
            </div>

            <Separator className="bg-sidebar-border" />

            {/* Grouped Navigation */}
            {Object.entries(groupedNav).map(([groupKey, items]) => {
              if (groupKey === 'overview') return null;
              
              return (
                <div key={groupKey} className="px-3 py-1.5">
                  {!sidebarCollapsed && (
                    <h2 className="mb-1.5 px-4 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/70">
                      {groupLabels[groupKey as keyof typeof groupLabels]}
                    </h2>
                  )}
                  <div className="space-y-0.5">
                    {items.map((item) => (
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
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}