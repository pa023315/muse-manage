import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { MoreHorizontal, Edit, Send, Eye, FileSignature, ArrowRight, Ban, Plus, FileText } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import ListControls from "@/components/common/ListControls";
import FilterChips, { FilterChip } from "@/components/common/FilterChips";
import { StatusQuote } from "@/types";
import QuoteBuilder from "@/components/quotes/QuoteBuilder";

interface Quote {
  id: string;
  no: string;
  customer: string;
  projectTitle: string;
  amount: number;
  taxMode: 'tax_included' | 'tax_excluded';
  validUntil?: string;
  status: StatusQuote;
  signedAt?: string;
  createdAt: string;
}

const mockQuotes: Quote[] = [
  {
    id: "1",
    no: "Q-202408-0001",
    customer: "創新科技有限公司",
    projectTitle: "品牌識別設計",
    amount: 75000,
    taxMode: "tax_included",
    validUntil: "2024-10-15",
    status: "sent",
    createdAt: "2024-08-25"
  },
  {
    id: "2", 
    no: "Q-202408-0002",
    customer: "美食工坊",
    projectTitle: "產品包裝設計",
    amount: 45000,
    taxMode: "tax_excluded",
    validUntil: "2024-09-30",
    status: "signed",
    signedAt: "2024-08-22",
    createdAt: "2024-08-20"
  },
  {
    id: "3",
    no: "Q-202408-0003",
    customer: "時尚服飾店",
    projectTitle: "網站重新設計",
    amount: 120000,
    taxMode: "tax_included",
    status: "draft",
    createdAt: "2024-08-18"
  }
];

const statusLabels: Record<StatusQuote, string> = {
  draft: "草稿",
  sent: "已送出",
  viewed: "已查看",
  signed: "已簽名",
  void: "作廢"
};

const statusVariants: Record<StatusQuote, "secondary" | "default" | "destructive" | "outline"> = {
  draft: "secondary",
  sent: "outline",
  viewed: "default", 
  signed: "default",
  void: "destructive"
};

const sortOptions = [
  { value: "createdAt-desc", label: "建立日期 (新→舊)" },
  { value: "createdAt-asc", label: "建立日期 (舊→新)" },
  { value: "status", label: "狀態" },
  { value: "amount-desc", label: "金額 (高→低)" },
  { value: "amount-asc", label: "金額 (低→高)" }
];

export default function Quotes() {
  const [viewMode, setViewMode] = useState<'cards' | 'rows'>('rows');
  const [searchValue, setSearchValue] = useState('');
  const [sortValue, setSortValue] = useState('createdAt-desc');
  const [filters, setFilters] = useState<FilterChip[]>([]);
  const [showQuoteBuilder, setShowQuoteBuilder] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);

  const handleRemoveFilter = (key: string) => {
    setFilters(filters.filter(f => f.key !== key));
  };

  const handleClearAllFilters = () => {
    setFilters([]);
  };

  const handleCreateQuote = () => {
    setEditingQuote(null);
    setShowQuoteBuilder(true);
  };

  const handleBulkActions = () => {
    console.log('Bulk actions');
  };

  const handleEditQuote = (quote: Quote) => {
    setEditingQuote(quote);
    setShowQuoteBuilder(true);
  };

  const handleSendQuote = (id: string) => {
    console.log('Send quote:', id);
  };

  const handlePreviewQuote = (id: string) => {
    console.log('Preview quote:', id);
  };

  const handleSignatureStatus = (id: string) => {
    console.log('Check signature status:', id);
  };

  const handleConvertToProject = (id: string) => {
    console.log('Convert to project:', id);
  };

  const handleVoidQuote = (id: string) => {
    console.log('Void quote:', id);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const renderTableView = () => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>編號</TableHead>
            <TableHead>客戶</TableHead>
            <TableHead>專案名稱</TableHead>
            <TableHead>金額</TableHead>
            <TableHead>有效期限</TableHead>
            <TableHead>狀態</TableHead>
            <TableHead>簽名時間</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockQuotes.map((quote) => (
            <TableRow key={quote.id}>
              <TableCell className="font-mono text-sm">{quote.no}</TableCell>
              <TableCell className="font-medium">{quote.customer}</TableCell>
              <TableCell>{quote.projectTitle}</TableCell>
              <TableCell>
                <div>
                  <span className="font-medium">{formatCurrency(quote.amount)}</span>
                  <span className="text-xs text-muted-foreground ml-1">
                    ({quote.taxMode === 'tax_included' ? '含稅' : '未稅'})
                  </span>
                </div>
              </TableCell>
              <TableCell>
                {quote.validUntil ? (
                  new Date(quote.validUntil).toLocaleDateString('zh-TW')
                ) : (
                  <span className="text-muted-foreground">無期限</span>
                )}
              </TableCell>
              <TableCell>
                <Badge variant={statusVariants[quote.status]}>
                  {statusLabels[quote.status]}
                </Badge>
              </TableCell>
              <TableCell>
                {quote.signedAt ? (
                  new Date(quote.signedAt).toLocaleDateString('zh-TW')
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleSendQuote(quote.id)}>
                      <Send className="mr-2 h-4 w-4" />
                      傳送連結
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handlePreviewQuote(quote.id)}>
                      <Eye className="mr-2 h-4 w-4" />
                      預覽
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSignatureStatus(quote.id)}>
                      <FileSignature className="mr-2 h-4 w-4" />
                      簽名狀態
                    </DropdownMenuItem>
                    {quote.status === 'signed' && (
                      <DropdownMenuItem onClick={() => handleConvertToProject(quote.id)}>
                        <ArrowRight className="mr-2 h-4 w-4" />
                        轉專案
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => handleEditQuote(quote)}>
                      <Edit className="mr-2 h-4 w-4" />
                      編輯
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleVoidQuote(quote.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Ban className="mr-2 h-4 w-4" />
                      作廢
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
      {mockQuotes.map((quote) => (
        <Card key={quote.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold text-base">{quote.projectTitle}</h3>
                <p className="text-sm text-muted-foreground">{quote.customer}</p>
                <p className="text-xs font-mono text-muted-foreground">{quote.no}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleSendQuote(quote.id)}>
                    <Send className="mr-2 h-4 w-4" />
                    傳送連結
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handlePreviewQuote(quote.id)}>
                    <Eye className="mr-2 h-4 w-4" />
                    預覽
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSignatureStatus(quote.id)}>
                    <FileSignature className="mr-2 h-4 w-4" />
                    簽名狀態
                  </DropdownMenuItem>
                  {quote.status === 'signed' && (
                    <DropdownMenuItem onClick={() => handleConvertToProject(quote.id)}>
                      <ArrowRight className="mr-2 h-4 w-4" />
                      轉專案
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => handleEditQuote(quote)}>
                    <Edit className="mr-2 h-4 w-4" />
                    編輯
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleVoidQuote(quote.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Ban className="mr-2 h-4 w-4" />
                    作廢
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">金額</p>
                <div>
                  <span className="text-lg font-semibold">{formatCurrency(quote.amount)}</span>
                  <span className="text-xs text-muted-foreground ml-1">
                    ({quote.taxMode === 'tax_included' ? '含稅' : '未稅'})
                  </span>
                </div>
              </div>
              
              {quote.validUntil && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">有效期限</p>
                  <p className="text-sm">{new Date(quote.validUntil).toLocaleDateString('zh-TW')}</p>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <Badge variant={statusVariants[quote.status]}>
                  {statusLabels[quote.status]}
                </Badge>
                {quote.signedAt && (
                  <span className="text-xs text-muted-foreground">
                    簽名於 {new Date(quote.signedAt).toLocaleDateString('zh-TW')}
                  </span>
                )}
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
        <FileText className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">尚無報價</h3>
      <p className="text-muted-foreground mb-4">或由洽詢「轉報價」</p>
      <Button onClick={handleCreateQuote}>
        <Plus className="mr-2 h-4 w-4" />
        新建報價
      </Button>
    </div>
  );

  return (
    <div className="flex-1 bg-background text-foreground">
        <PageHeader
        breadcrumb={{
          category: "專案管理",
          page: "報價單"
        }}
        primaryAction={{
          label: "新建報價",
          onClick: handleCreateQuote,
        }}
        bulkActions={{
          label: "批次操作", 
          onClick: handleBulkActions,
        }}
        moreActions={[
          {
            label: "模板",
            onClick: () => console.log('Templates'),
          }
        ]}
      />

      <FilterChips 
        filters={filters}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={handleClearAllFilters}
      />

      <ListControls
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="搜尋報價編號、客戶、專案名稱..."
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortValue={sortValue}
        onSortChange={setSortValue}
        sortOptions={sortOptions}
      />

      <div className="p-6 bg-background">
        {mockQuotes.length === 0 ? (
          renderEmptyState()
        ) : (
          viewMode === 'rows' ? renderTableView() : renderCardView()
        )}
      </div>

      <QuoteBuilder
        open={showQuoteBuilder}
        onOpenChange={setShowQuoteBuilder}
        quote={editingQuote}
      />
    </div>
  );
}