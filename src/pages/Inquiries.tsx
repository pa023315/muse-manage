import { useState, useEffect } from "react";
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
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, Edit, Trash2, FileText, Plus, Calendar, ExternalLink, Copy, Share2 } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import ListControls from "@/components/common/ListControls";
import FilterChips, { FilterChip } from "@/components/common/FilterChips";
import { StatusInquiry, Inquiry } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";


const statusLabels: Record<StatusInquiry, string> = {
  new: "尚未回覆",
  quoted: "已報價",
  declined: "已婉拒"
};

const statusVariants: Record<StatusInquiry, "secondary" | "default" | "destructive"> = {
  new: "secondary",
  quoted: "default", 
  declined: "destructive"
};

const sortOptions = [
  { value: "createdAt-desc", label: "建立日期 (新→舊)" },
  { value: "createdAt-asc", label: "建立日期 (舊→新)" },
  { value: "status", label: "狀態" },
  { value: "dueDate", label: "到期日期" }
];

export default function Inquiries() {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'cards' | 'rows'>('rows');
  const [searchValue, setSearchValue] = useState('');
  const [sortValue, setSortValue] = useState('createdAt-desc');
  const [filters, setFilters] = useState<FilterChip[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateFormDialog, setShowCreateFormDialog] = useState(false);
  const [newFormUrl, setNewFormUrl] = useState("");

  const handleRemoveFilter = (key: string) => {
    setFilters(filters.filter(f => f.key !== key));
  };

  const handleClearAllFilters = () => {
    setFilters([]);
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      console.log('開始載入洽詢資料...');
      
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Supabase 查詢結果:', { data, error });

      if (error) {
        console.error('Supabase 錯誤:', error);
        throw error;
      }
      
      console.log('原始資料數量:', data?.length || 0);
      
      // 轉換資料庫資料為應用程式需要的格式
      const formattedData: Inquiry[] = (data || []).map(item => ({
        id: item.id,
        form_id: item.form_id,
        name: item.name,
        organization_type: item.organization_type as 'individual' | 'studio' | 'company',
        character_type: item.character_type,
        commission_items: item.commission_items,
        usage_purpose: item.usage_purpose,
        reference_description: item.reference_description,
        image_specifications: item.image_specifications,
        special_requirements: item.special_requirements,
        deadline_date: item.deadline_date,
        publish_date: item.publish_date,
        design_notes: item.design_notes,
        budget: item.budget,
        budget_range: item.budget_range,
        status: item.status as StatusInquiry,
        source: item.source,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));
      
      console.log('格式化後資料數量:', formattedData.length);
      console.log('格式化後資料:', formattedData);
      
      setInquiries(formattedData);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      toast({
        title: "載入失敗",
        description: "無法載入洽詢資料，請稍後再試。",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateFormUrl = () => {
    const formId = crypto.randomUUID();
    const baseUrl = window.location.origin;
    const url = `${baseUrl}/inquiry-form/${formId}`;
    setNewFormUrl(url);
    setShowCreateFormDialog(true);
  };

  const copyFormUrl = async () => {
    try {
      await navigator.clipboard.writeText(newFormUrl);
      toast({
        title: "已複製到剪貼簿",
        description: "表單連結已複製，可以分享給客戶填寫。"
      });
    } catch (error) {
      toast({
        title: "複製失敗",
        description: "無法複製連結，請手動複製。",
        variant: "destructive"
      });
    }
  };

  const handleCreateInquiry = generateFormUrl;

  const handleBulkActions = () => {
    console.log('Bulk actions');
  };

  const handleEditInquiry = (id: string) => {
    console.log('Edit inquiry:', id);
  };

  const handleDeleteInquiry = (id: string) => {
    console.log('Delete inquiry:', id);
  };

  const handleConvertToQuote = (id: string) => {
    console.log('Converting inquiry to quote:', id);
    // Navigate to quotes page and open builder with inquiry data
    // This would be implemented with proper routing and state management
  };

  const renderTableView = () => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>標題</TableHead>
            <TableHead>客戶</TableHead>
            <TableHead>預算區間</TableHead>
            <TableHead>到期日</TableHead>
            <TableHead>狀態</TableHead>
            <TableHead>來源</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inquiries.map((inquiry) => (
            <TableRow key={inquiry.id}>
              <TableCell className="font-medium">{inquiry.commission_items?.join(', ') || '未指定項目'}</TableCell>
              <TableCell>{inquiry.name}</TableCell>
              <TableCell>{inquiry.budget || inquiry.budget_range || '未提供'}</TableCell>
              <TableCell>
                {inquiry.deadline_date ? (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    {new Date(inquiry.deadline_date).toLocaleDateString('zh-TW')}
                  </div>
                ) : (
                  <span className="text-muted-foreground">無期限</span>
                )}
              </TableCell>
              <TableCell>
                <Badge variant={statusVariants[inquiry.status]}>
                  {statusLabels[inquiry.status]}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">{inquiry.source || '外部表單'}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditInquiry(inquiry.id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      編輯
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleConvertToQuote(inquiry.id)}>
                      <FileText className="mr-2 h-4 w-4" />
                      轉報價
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDeleteInquiry(inquiry.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      刪除
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
      {inquiries.map((inquiry) => (
        <Card key={inquiry.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold text-base">{inquiry.commission_items?.join(', ') || '未指定項目'}</h3>
                <p className="text-sm text-muted-foreground">{inquiry.name}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEditInquiry(inquiry.id)}>
                    <Edit className="mr-2 h-4 w-4" />
                    編輯
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleConvertToQuote(inquiry.id)}>
                    <FileText className="mr-2 h-4 w-4" />
                    轉報價
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleDeleteInquiry(inquiry.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    刪除
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">預算</p>
                <p className="text-sm">{inquiry.budget || inquiry.budget_range || '未提供'}</p>
              </div>
              
              {inquiry.deadline_date && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">到期日期</p>
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="h-3 w-3" />
                    {new Date(inquiry.deadline_date).toLocaleDateString('zh-TW')}
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <Badge variant={statusVariants[inquiry.status]}>
                  {statusLabels[inquiry.status]}
                </Badge>
                <span className="text-xs text-muted-foreground">{inquiry.source || '外部表單'}</span>
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
      <h3 className="text-lg font-semibold mb-2">尚無洽詢</h3>
      <p className="text-muted-foreground mb-4">從右上角「新建洽詢」開始</p>
      <Button onClick={handleCreateInquiry}>
        <Plus className="mr-2 h-4 w-4" />
        新建洽詢
      </Button>
    </div>
  );

  return (
    <div className="flex-1">
        <PageHeader
        breadcrumb={{
          category: "專案管理",
          page: "洽詢單"
        }}
        primaryAction={{
          label: "建立外部表單",
          onClick: handleCreateInquiry,
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
        searchPlaceholder="搜尋案件標題、客戶名稱..."
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortValue={sortValue}
        onSortChange={setSortValue}
        sortOptions={sortOptions}
      />

      <div className="p-6">
        {loading ? (
          <div className="text-center py-12">載入中...</div>
        ) : inquiries.length === 0 ? (
          renderEmptyState()
        ) : (
          viewMode === 'rows' ? renderTableView() : renderCardView()
        )}
      </div>

      {/* 建立表單對話框 */}
      <Dialog open={showCreateFormDialog} onOpenChange={setShowCreateFormDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              外部洽詢表單
            </DialogTitle>
            <DialogDescription>
              已為您生成一個新的洽詢表單連結，客戶可以透過此連結填寫洽詢資訊
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="form-url">表單連結</Label>
              <div className="flex space-x-2">
                <Input
                  id="form-url"
                  value={newFormUrl}
                  readOnly
                  className="flex-1"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={copyFormUrl}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => window.open(newFormUrl, '_blank')}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                預覽表單
              </Button>
              <Button onClick={() => setShowCreateFormDialog(false)}>
                完成
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}