import { useState } from "react";
import { Edit, Trash2, MoreVertical, Receipt, Plus } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import PageHeader from "@/components/common/PageHeader";
import FilterChip from "@/components/common/FilterChips";
import ListControls from "@/components/common/ListControls";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Expense, Vendor } from "@/types";

// Mock data
const mockExpenses: Expense[] = [
  {
    id: "1",
    no: "EXP-202501-0001",
    vendorId: "vendor-1",
    projectId: "proj-1",
    category: "印刷",
    amount: 15000,
    tax: 750,
    receiptLink: "https://example.com/receipt1.pdf",
    paidAt: "2025-01-08",
    note: "名片印刷"
  },
  {
    id: "2",
    no: "EXP-202501-0002", 
    vendorId: "vendor-2",
    category: "材料",
    amount: 8000,
    tax: 400,
    paidAt: "2025-01-10",
    note: "設計素材採購"
  },
  {
    id: "3",
    no: "EXP-202501-0003",
    vendorId: "vendor-3",
    projectId: "proj-2", 
    category: "人事",
    amount: 25000,
    tax: 0,
    paidAt: "2025-01-12",
    note: "外包設計師費用"
  }
];

const mockVendors: Vendor[] = [
  {
    id: "vendor-1",
    name: "優印印刷",
    category: "印刷",
    rating: 5,
    isFavorite: true,
    contacts: [{ name: "王先生", email: "wang@print.com", phone: "02-1234-5678" }]
  },
  {
    id: "vendor-2", 
    name: "創意材料行",
    category: "材料",
    rating: 4,
    contacts: [{ name: "李小姐", email: "lee@materials.com" }]
  },
  {
    id: "vendor-3",
    name: "設計工作室",
    category: "人事",
    rating: 5,
    contacts: [{ name: "陳設計師", email: "chen@design.com" }]
  }
];

const mockProjects = [
  { id: "proj-1", name: "品牌VI設計", customer: "ABC公司" },
  { id: "proj-2", name: "網站重構", customer: "DEF工作室" },
  { id: "proj-3", name: "包裝設計", customer: "GHI企業" }
];

const categoryOptions = ["印刷", "材料", "人事", "設備", "運輸", "其他"];

interface ExpenseDialogProps {
  expense?: Expense;
  onSave: (expenseData: Partial<Expense>) => void;
}

function ExpenseDialog({ expense, onSave }: ExpenseDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    vendorId: expense?.vendorId || "",
    projectId: expense?.projectId || "",
    category: expense?.category || "",
    amount: expense?.amount?.toString() || "",
    tax: expense?.tax?.toString() || "",
    receiptLink: expense?.receiptLink || "",
    note: expense?.note || ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSave({
      ...formData,
      amount: parseFloat(formData.amount),
      tax: formData.tax ? parseFloat(formData.tax) : undefined,
      paidAt: new Date().toISOString().split('T')[0]
    });
    
    setOpen(false);
    if (!expense) {
      setFormData({
        vendorId: "",
        projectId: "",
        category: "",
        amount: "",
        tax: "",
        receiptLink: "",
        note: ""
      });
    }
  };

  const getVendor = (vendorId: string) => mockVendors.find(v => v.id === vendorId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {expense ? (
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Edit className="mr-2 h-4 w-4" />
            編輯
          </DropdownMenuItem>
        ) : (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            新建支出
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {expense ? "編輯支出" : "新建支出"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="vendor">供應商 *</Label>
            <Select
              value={formData.vendorId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, vendorId: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="選擇供應商" />
              </SelectTrigger>
              <SelectContent>
                {mockVendors.map(vendor => (
                  <SelectItem key={vendor.id} value={vendor.id}>
                    {vendor.name} {vendor.isFavorite && "⭐"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              或 <Button type="button" variant="link" className="p-0 h-auto text-xs">新建供應商</Button>
            </p>
          </div>

          <div>
            <Label htmlFor="category">分類 *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="選擇分類" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">金額 *</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="支出金額"
                min="0"
                step="1"
                required
              />
            </div>
            <div>
              <Label htmlFor="tax">稅額</Label>
              <Input
                id="tax"
                type="number"
                value={formData.tax}
                onChange={(e) => setFormData(prev => ({ ...prev, tax: e.target.value }))}
                placeholder="稅額"
                min="0"
                step="1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="project">關聯專案</Label>
            <Select
              value={formData.projectId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, projectId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="選擇專案（可選）" />
              </SelectTrigger>
              <SelectContent>
                {mockProjects.map(project => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name} · {project.customer}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="receipt">單據連結</Label>
            <Input
              id="receipt"
              type="url"
              value={formData.receiptLink}
              onChange={(e) => setFormData(prev => ({ ...prev, receiptLink: e.target.value }))}
              placeholder="https://... (發票、收據等外部連結)"
            />
          </div>

          <div>
            <Label htmlFor="note">備註</Label>
            <Textarea
              id="note"
              value={formData.note}
              onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
              placeholder="支出備註說明"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button type="submit">
              {expense ? "儲存" : "新建"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Expenses() {
  const [expenses, setExpenses] = useState(mockExpenses);
  const [viewMode, setViewMode] = useState<"cards" | "rows">("rows");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const { toast } = useToast();

  const filterOptions = [
    { key: "vendor", label: "供應商", options: mockVendors.map(v => v.name) },
    { key: "category", label: "分類", options: categoryOptions },
    { key: "period", label: "期間", options: ["本週", "本月", "本季", "今年"] },
    { key: "project", label: "關聯專案", options: mockProjects.map(p => p.name) }
  ];

  const handleSave = (expenseData: Partial<Expense>) => {
    const newExpense: Expense = {
      id: Date.now().toString(),
      no: `EXP-202501-${String(expenses.length + 1).padStart(4, '0')}`,
      ...expenseData
    } as Expense;

    setExpenses(prev => [newExpense, ...prev]);
    
    toast({
      title: "支出已儲存",
      description: `支出單號：${newExpense.no}`
    });
  };

  const handleUpdate = (expenseId: string, expenseData: Partial<Expense>) => {
    setExpenses(prev => prev.map(expense => 
      expense.id === expenseId 
        ? { ...expense, ...expenseData }
        : expense
    ));
    
    toast({
      title: "支出已更新",
      description: "支出資料已成功更新"
    });
  };

  const handleDelete = (expenseId: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== expenseId));
    
    toast({
      title: "支出已刪除",
      description: "支出紀錄已移除"
    });
  };

  const getVendor = (vendorId: string) => mockVendors.find(v => v.id === vendorId);
  const getProject = (projectId?: string) => projectId ? mockProjects.find(p => p.id === projectId) : null;

  const moreActions = [
    { label: "匯出 CSV", onClick: () => toast({ title: "匯出功能", description: "CSV 匯出功能開發中" }) }
  ];

  return (
    <div className="flex-1">
      <PageHeader
        breadcrumb={{
          category: "收益管理",
          page: "支出表"
        }}
        actions={<ExpenseDialog onSave={handleSave} />}
        bulkActions={{ label: "批次操作", onClick: () => {} }}
        moreActions={moreActions}
      />

      <div className="p-6">
        <FilterChip
          filters={[]}
          onRemoveFilter={() => {}}
          onClearAll={() => {}}
        />

        <ListControls
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="搜尋編號/供應商/分類"
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortValue="paidAt"
          onSortChange={() => {}}
          sortOptions={[
            { value: "paidAt", label: "付款日" },
            { value: "amount", label: "金額" },
            { value: "category", label: "分類" },
            { value: "vendor", label: "供應商" }
          ]}
        />

        {viewMode === "cards" ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {expenses.map((expense) => {
              const vendor = getVendor(expense.vendorId);
              const project = getProject(expense.projectId);
              
              return (
                <Card key={expense.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{expense.no}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {vendor?.name}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {expense.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-lg font-semibold">
                      NT$ {expense.amount.toLocaleString()}
                      {expense.tax && expense.tax > 0 && (
                        <span className="text-sm text-muted-foreground ml-2">
                          +稅 {expense.tax.toLocaleString()}
                        </span>
                      )}
                    </div>
                    {project && (
                      <p className="text-sm text-muted-foreground">
                        專案：{project.name}
                      </p>
                    )}
                    <div className="text-sm">
                      <div>付款：{expense.paidAt}</div>
                      {expense.receiptLink && (
                        <div className="flex items-center gap-1">
                          <Receipt className="h-3 w-3" />
                          <span>有單據</span>
                        </div>
                      )}
                    </div>
                    {expense.note && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {expense.note}
                      </p>
                    )}
                    
                    <div className="flex justify-end pt-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <ExpenseDialog 
                            expense={expense}
                            onSave={(data) => handleUpdate(expense.id, data)}
                          />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDelete(expense.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            刪除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>編號</TableHead>
                  <TableHead>供應商</TableHead>
                  <TableHead>分類</TableHead>
                  <TableHead className="text-right">金額</TableHead>
                  <TableHead className="text-right">稅額</TableHead>
                  <TableHead>關聯專案</TableHead>
                  <TableHead>付款日</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => {
                  const vendor = getVendor(expense.vendorId);
                  const project = getProject(expense.projectId);
                  
                  return (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">{expense.no}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {vendor?.name}
                          {vendor?.isFavorite && <span>⭐</span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{expense.category}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        NT$ {expense.amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {expense.tax ? `NT$ ${expense.tax.toLocaleString()}` : "-"}
                      </TableCell>
                      <TableCell>{project?.name || "-"}</TableCell>
                      <TableCell>{expense.paidAt || "-"}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <ExpenseDialog 
                              expense={expense}
                              onSave={(data) => handleUpdate(expense.id, data)}
                            />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDelete(expense.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              刪除
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        )}

        {expenses.length === 0 && (
          <Card className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Receipt className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">尚無支出紀錄</h3>
            <p className="text-muted-foreground mb-4">
              建立第一筆以開始對帳
            </p>
            <ExpenseDialog onSave={handleSave} />
          </Card>
        )}
      </div>
    </div>
  );
}