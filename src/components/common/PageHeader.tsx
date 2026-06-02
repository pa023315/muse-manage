import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Plus, MoreHorizontal, Menu } from "lucide-react";
import { useLayout } from "@/contexts/LayoutContext";
interface PageHeaderProps {
  title?: string;
  description?: string;
  actions?: ReactNode;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  bulkActions?: {
    label: string;
    onClick: () => void;
  };
  moreActions?: Array<{
    label: string;
    onClick: () => void;
  }>;
  breadcrumb?: {
    category: string;
    page: string;
  };
}
export default function PageHeader({
  title,
  description,
  actions,
  primaryAction,
  bulkActions,
  moreActions,
  breadcrumb
}: PageHeaderProps) {
  const {
    toggleSidebar
  } = useLayout();
  return <div className="border-b border-border bg-background">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="h-8 w-8">
            <Menu className="h-4 w-4" />
          </Button>
          
          <div>
            {breadcrumb ? <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <span className="text-muted-foreground">{breadcrumb.category}</span>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-foreground font-semibold">
                      {breadcrumb.page}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb> : <h1 className="text-2xl font-semibold text-foreground">{title}</h1>}
            {description}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {bulkActions && <Button variant="outline" onClick={bulkActions.onClick}>
              {bulkActions.label}
            </Button>}
          
          {primaryAction && <Button onClick={primaryAction.onClick}>
              <Plus className="mr-2 h-4 w-4" />
              {primaryAction.label}
            </Button>}
          
          {moreActions && moreActions.length > 0 && <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {moreActions.map((action, index) => <DropdownMenuItem key={index} onClick={action.onClick}>
                    {action.label}
                  </DropdownMenuItem>)}
              </DropdownMenuContent>
            </DropdownMenu>}
          
          {actions}
        </div>
      </div>
    </div>;
}