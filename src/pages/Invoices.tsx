import { useState } from "react";
import { Edit, Trash2, MoreVertical, CheckCircle, XCircle, AlertCircle, DollarSign } from "lucide-react";
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
import { cn } from "@/lib/utils";
import type { Invoice, StatusInvoice } from "@/types";

// Mock data
const mockInvoices: Invoice[] = [
  {
    id: "1",
    no: "INV-202501-0001",
    projectId: "proj-1",
    quoteId: "quote-1",
    milestoneTitle: "首付款",
    amount: 50000,
    tax: 2500,
    dueDate: "2025-01-15",
    receivedAmount: 30000,
    receivedDate: "2025-01-10",
    status: "partial",
    payMethod: "銀行轉帳",
    note: "部分收款"
  },
  {
    id: "2", 
    no: "INV-202501-0002",
    projectId: "proj-2",
    milestoneTitle: "期中款",
    amount: 80000,
    tax: 4000,
    dueDate: "2025-01-20",
    status: "unpaid"
  },
  {
    id: "3",
    no: "INV-202501-0003", 
    projectId: "proj-3",
    milestoneTitle: "尾款",
    amount: 60000,
    tax: 3000,
    dueDate: "2025-01-05",
    receivedAmount: 60000,
    receivedDate: "2025-01-08",
    status: "paid",
    payMethod: "現金"
  }
];

const mockProjects = [
  { id: "proj-1", name: "品牌VI設計", customer: "ABC公司" },
  { id: "proj-2", name: "網站重構", customer: "DEF工作室" },
  { id: "proj-3", name: "包裝設計", customer: "GHI企業" }
];

const statusConfig: Record<StatusInvoice, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  unpaid: { label: "未收", variant: "destructive" },
  partial: { label: "部分", variant: "secondary" },
  paid: { label: "已收", variant: "default" },
  void: { label: "作廢", variant: "outline" }
};

interface SettlementDialogProps {
  invoice: Invoice;
  onSettle: (invoiceId: string, amount: number, date: string, method: string, note?: string) => void;
}

function SettlementDialog({ invoice, onSettle }: SettlementDialogProps) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [method, setMethod] = useState("");
  const [note, setNote] = useState("");
  const [open, setOpen] = useState(false);

  const remainingAmount = invoice.amount - (invoice.receivedAmount || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const settleAmount = parseFloat(amount);
    
    if (settleAmount <= 0 || settleAmount > remainingAmount) {
      return;
    }

    onSettle(invoice.id, settleAmount, date, method, note);
    setOpen(false);
    setAmount("");
    setMethod("");
    setNote("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <DollarSign className="mr-2 h-4 w-4" />
          核銷
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>收款核銷 - {invoice.no}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="remaining">未收餘額</Label>
            <div className="text-sm text-muted-foreground">
              NT$ {remainingAmount.toLocaleString()}
            </div>
          </div>
          
          <div>
            <Label htmlFor="amount">入帳金額 *</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              max={remainingAmount}
              min="1"
              placeholder="輸入收款金額"
              required
            />
          </div>

          <div>
            <Label htmlFor="date">收款日 *</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="method">付款方式</Label>
            <Input
              id="method"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              placeholder="如：銀行轉帳、現金、支票"
            />
          </div>

          <div>
            <Label htmlFor="note">備註</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="收款備註"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button type="submit">
              確認核銷
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Invoices() {
  const [invoices, setInvoices] = useState(mockInvoices);
  const [viewMode, setViewMode] = useState<"cards" | "rows">("rows");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const { toast } = useToast();

  const filterOptions = [
    { key: "status", label: "狀態", options: ["未收", "部分", "已收", "作廢"] },
    { key: "dueRange", label: "到期區間", options: ["本週", "本月", "逾期"] },
    { key: "payMethod", label: "收款方式", options: ["銀行轉帳", "現金", "支票"] },
    { key: "customer", label: "客戶", options: ["ABC公司", "DEF工作室", "GHI企業"] }
  ];

  const handleSettle = (invoiceId: string, amount: number, date: string, method: string, note?: string) => {
    setInvoices(prev => prev.map(invoice => {
      if (invoice.id === invoiceId) {
        const newReceivedAmount = (invoice.receivedAmount || 0) + amount;
        const newStatus: StatusInvoice = 
          newReceivedAmount >= invoice.amount ? "paid" : "partial";
        
        return {
          ...invoice,
          receivedAmount: newReceivedAmount,
          receivedDate: date,
          status: newStatus,
          payMethod: method,
          note: note || invoice.note
        };
      }
      return invoice;
    }));

    toast({
      title: "核銷成功",
      description: `已記錄收款 NT$ ${amount.toLocaleString()}`
    });
  };

  const handleVoid = (invoiceId: string) => {
    setInvoices(prev => prev.map(invoice => 
      invoice.id === invoiceId 
        ? { ...invoice, status: "void" as StatusInvoice }
        : invoice
    ));
    
    toast({
      title: "請款單已作廢",
      description: "請款單狀態已更新"
    });
  };

  const getProject = (projectId: string) => {
    return mockProjects.find(p => p.id === projectId);
  };

  const moreActions = [
    { label: "匯出 CSV", onClick: () => toast({ title: "匯出功能", description: "CSV 匯出功能開發中" }) }
  ];

  return (
    <div className="flex-1">
      <PageHeader
        breadcrumb={{
          category: "收益管理",
          page: "收益表"
        }}
        primaryAction={{ label: "新建請款", onClick: () => {} }}
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
          searchPlaceholder="搜尋編號/專案/客戶"
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortValue="dueDate"
          onSortChange={() => {}}
          sortOptions={[
            { value: "dueDate", label: "到期日" },
            { value: "receivedDate", label: "收款日" }, 
            { value: "amount", label: "金額" },
            { value: "status", label: "狀態" }
          ]}
        />

        {viewMode === "cards" ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {invoices.map((invoice) => {
              const project = getProject(invoice.projectId);
              const config = statusConfig[invoice.status];
              
              return (
                <Card key={invoice.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{invoice.no}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {project?.name} · {project?.customer}
                        </p>
                      </div>
                      <Badge variant={config.variant}>
                        {config.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-lg font-semibold">
                      NT$ {invoice.amount.toLocaleString()}
                    </div>
                    {invoice.milestoneTitle && (
                      <p className="text-sm text-muted-foreground">
                        里程碑：{invoice.milestoneTitle}
                      </p>
                    )}
                    <div className="text-sm">
                      <div>到期：{invoice.dueDate}</div>
                      {invoice.receivedDate && (
                        <div>收款：{invoice.receivedDate}</div>
                      )}
                    </div>
                    
                    <div className="flex justify-end pt-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {invoice.status !== "paid" && invoice.status !== "void" && (
                            <SettlementDialog 
                              invoice={invoice}
                              onSettle={handleSettle}
                            />
                          )}
                          {invoice.status !== "void" && (
                            <DropdownMenuItem onClick={() => handleVoid(invoice.id)}>
                              <XCircle className="mr-2 h-4 w-4" />
                              作廢
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            編輯
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
                  <TableHead>專案</TableHead>
                  <TableHead>客戶</TableHead>
                  <TableHead>里程碑</TableHead>
                  <TableHead className="text-right">金額</TableHead>
                  <TableHead>到期日</TableHead>
                  <TableHead>收款日</TableHead>
                  <TableHead>狀態</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => {
                  const project = getProject(invoice.projectId);
                  const config = statusConfig[invoice.status];
                  
                  return (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.no}</TableCell>
                      <TableCell>{project?.name}</TableCell>
                      <TableCell>{project?.customer}</TableCell>
                      <TableCell>{invoice.milestoneTitle || "-"}</TableCell>
                      <TableCell className="text-right">
                        NT$ {invoice.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>{invoice.dueDate || "-"}</TableCell>
                      <TableCell>{invoice.receivedDate || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={config.variant}>
                          {config.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {invoice.status !== "paid" && invoice.status !== "void" && (
                              <SettlementDialog 
                                invoice={invoice}
                                onSettle={handleSettle}
                              />
                            )}
                            {invoice.status !== "void" && (
                              <DropdownMenuItem onClick={() => handleVoid(invoice.id)}>
                                <XCircle className="mr-2 h-4 w-4" />
                                作廢
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              編輯
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

        {invoices.length === 0 && (
          <Card className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <DollarSign className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">尚無請款單</h3>
            <p className="text-muted-foreground mb-4">
              建立第一筆以開始對帳
            </p>
            <Button>新建請款</Button>
          </Card>
        )}
      </div>
    </div>
  );
}