import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  MoreHorizontal, 
  Edit, 
  Archive, 
  CheckCircle, 
  Eye, 
  Plus,
  Calendar,
  DollarSign,
  User,
  FolderOpen
} from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import ListControls from "@/components/common/ListControls";
import FilterChips, { FilterChip } from "@/components/common/FilterChips";
import { StatusProject } from "@/types";

interface Project {
  id: string;
  no: string;
  name: string;
  customer: string;
  owner: string;
  startDate?: string;
  dueDate?: string;
  status: StatusProject;
  amounts: {
    quoted: number;
    invoiced: number;
    received: number;
  };
  progress: number;
}

const mockProjects: Project[] = [
  {
    id: "1",
    no: "P-2024-001",
    name: "品牌識別設計專案",
    customer: "創新科技有限公司",
    owner: "王設計師",
    startDate: "2024-08-01",
    dueDate: "2024-10-15",
    status: "active",
    amounts: {
      quoted: 85000,
      invoiced: 42500,
      received: 42500,
    },
    progress: 65,
  },
  {
    id: "2",
    no: "P-2024-002", 
    name: "產品包裝設計",
    customer: "美食工坊",
    owner: "李創意",
    startDate: "2024-08-15",
    dueDate: "2024-09-30",
    status: "active",
    amounts: {
      quoted: 45000,
      invoiced: 22500,
      received: 22500,
    },
    progress: 80,
  },
  {
    id: "3",
    no: "P-2024-003",
    name: "企業網站設計",
    customer: "專業顧問公司",
    owner: "陳美工",
    startDate: "2024-07-01",
    dueDate: "2024-08-31",
    status: "done",
    amounts: {
      quoted: 120000,
      invoiced: 120000,
      received: 120000,
    },
    progress: 100,
  }
];

const statusLabels: Record<StatusProject, string> = {
  active: "進行中",
  done: "已完成",
  archived: "已封存"
};

const statusVariants: Record<StatusProject, "secondary" | "default" | "outline"> = {
  active: "secondary",
  done: "default",
  archived: "outline"
};

const sortOptions = [
  { value: "startDate-desc", label: "開始日期 (新→舊)" },
  { value: "dueDate-asc", label: "截止日期 (近→遠)" },
  { value: "status", label: "狀態" },
  { value: "quoted-desc", label: "報價金額 (高→低)" }
];

export default function Projects() {
  const [viewMode, setViewMode] = useState<'cards' | 'rows'>('cards');
  const [searchValue, setSearchValue] = useState('');
  const [sortValue, setSortValue] = useState('startDate-desc');
  const [filters, setFilters] = useState<FilterChip[]>([]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleRemoveFilter = (key: string) => {
    setFilters(filters.filter(f => f.key !== key));
  };

  const handleClearAllFilters = () => {
    setFilters([]);
  };

  const handleCreateProject = () => {
    console.log('Create project');
  };

  const handleBulkActions = () => {
    console.log('Bulk actions');
  };

  const handleViewProject = (id: string) => {
    console.log('View project:', id);
  };

  const handleEditProject = (id: string) => {
    console.log('Edit project:', id);
  };

  const handleCompleteProject = (id: string) => {
    console.log('Complete project:', id);
  };

  const handleArchiveProject = (id: string) => {
    console.log('Archive project:', id);
  };

  const renderTableView = () => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>專案名稱</TableHead>
            <TableHead>客戶</TableHead>
            <TableHead>負責人</TableHead>
            <TableHead>期程</TableHead>
            <TableHead>狀態</TableHead>
            <TableHead>金額摘要</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockProjects.map((project) => (
            <TableRow key={project.id}>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium">{project.name}</div>
                  <div className="text-xs text-muted-foreground">{project.no}</div>
                </div>
              </TableCell>
              <TableCell>{project.customer}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3 text-muted-foreground" />
                  {project.owner}
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  {project.startDate && (
                    <div className="text-xs">
                      開始: {new Date(project.startDate).toLocaleDateString('zh-TW')}
                    </div>
                  )}
                  {project.dueDate && (
                    <div className="text-xs">
                      截止: {new Date(project.dueDate).toLocaleDateString('zh-TW')}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={statusVariants[project.status]}>
                  {statusLabels[project.status]}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="text-xs">報價: {formatCurrency(project.amounts.quoted)}</div>
                  <div className="text-xs">已收: {formatCurrency(project.amounts.received)}</div>
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewProject(project.id)}>
                      <Eye className="mr-2 h-4 w-4" />
                      詳情
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditProject(project.id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      編輯
                    </DropdownMenuItem>
                    {project.status === 'active' && (
                      <DropdownMenuItem onClick={() => handleCompleteProject(project.id)}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        設為完成
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => handleArchiveProject(project.id)}>
                      <Archive className="mr-2 h-4 w-4" />
                      封存
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const renderCardView = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {mockProjects.map((project) => (
        <Card key={project.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold text-base">{project.name}</h3>
                <p className="text-xs text-muted-foreground">{project.no}</p>
                <p className="text-sm text-muted-foreground">{project.customer}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleViewProject(project.id)}>
                    <Eye className="mr-2 h-4 w-4" />
                    詳情
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleEditProject(project.id)}>
                    <Edit className="mr-2 h-4 w-4" />
                    編輯
                  </DropdownMenuItem>
                  {project.status === 'active' && (
                    <DropdownMenuItem onClick={() => handleCompleteProject(project.id)}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      設為完成
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => handleArchiveProject(project.id)}>
                    <Archive className="mr-2 h-4 w-4" />
                    封存
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">進度</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>

              {/* Owner */}
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{project.owner}</span>
              </div>

              {/* Dates */}
              {(project.startDate || project.dueDate) && (
                <div className="space-y-1">
                  {project.startDate && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      開始: {new Date(project.startDate).toLocaleDateString('zh-TW')}
                    </div>
                  )}
                  {project.dueDate && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      截止: {new Date(project.dueDate).toLocaleDateString('zh-TW')}
                    </div>
                  )}
                </div>
              )}

              {/* Financial Summary */}
              <div className="space-y-2 p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">財務概況</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <div className="text-muted-foreground">報價</div>
                    <div className="font-medium">{formatCurrency(project.amounts.quoted)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">請款</div>
                    <div className="font-medium">{formatCurrency(project.amounts.invoiced)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">已收</div>
                    <div className="font-medium text-success">{formatCurrency(project.amounts.received)}</div>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <Badge variant={statusVariants[project.status]}>
                  {statusLabels[project.status]}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-6 mb-4">
        <FolderOpen className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">尚無專案</h3>
      <p className="text-muted-foreground mb-4">從已簽名報價一鍵建立</p>
      <Button onClick={handleCreateProject}>
        <Plus className="mr-2 h-4 w-4" />
        新建專案
      </Button>
    </div>
  );

  return (
    <div className="flex-1">
      <PageHeader
        breadcrumb={{
          category: "專案管理",
          page: "專案一覽"
        }}
        primaryAction={{
          label: "新建專案",
          onClick: handleCreateProject,
        }}
        bulkActions={{
          label: "批次操作",
          onClick: handleBulkActions,
        }}
      />

      <FilterChips 
        filters={filters}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={handleClearAllFilters}
      />

      <ListControls
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="搜尋專案名稱、客戶..."
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortValue={sortValue}
        onSortChange={setSortValue}
        sortOptions={sortOptions}
      />

      <div className="p-6">
        {mockProjects.length === 0 ? (
          renderEmptyState()
        ) : (
          viewMode === 'rows' ? renderTableView() : renderCardView()
        )}
      </div>
    </div>
  );
}