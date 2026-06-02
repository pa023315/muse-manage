import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Save, Link, Eye } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuoteItem {
  id?: string;
  skuId?: string;
  desc: string;
  qty: number;
  unitPrice: number;
  discount?: number;
}

interface PaymentPlan {
  title: string;
  percent: number;
}

interface QuoteBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quote?: any;
}

const mockCustomers = [
  { id: "1", name: "創新科技有限公司" },
  { id: "2", name: "美食工坊" },
  { id: "3", name: "時尚服飾店" },
];

const mockInventory = [
  { id: "1", sku: "DES-001", name: "品牌設計服務", price: 25000 },
  { id: "2", sku: "WEB-001", name: "網頁設計服務", price: 15000 },
  { id: "3", sku: "PKG-001", name: "包裝設計服務", price: 10000 },
];

export default function QuoteBuilder({ open, onOpenChange, quote }: QuoteBuilderProps) {
  const [formData, setFormData] = useState({
    customerId: "",
    projectTitle: "",
    validUntil: null as Date | null,
    taxMode: "tax_included" as "tax_included" | "tax_excluded",
  });

  const [items, setItems] = useState<QuoteItem[]>([
    { desc: "", qty: 1, unitPrice: 0, discount: 0 }
  ]);

  const [paymentPlanEnabled, setPaymentPlanEnabled] = useState(false);
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlan[]>([
    { title: "簽約時", percent: 50 },
    { title: "完成時", percent: 50 }
  ]);

  const [terms, setTerms] = useState(`著作權條款：
本作品之著作權歸屬雙方共同協議。

付款條件：
1. 簽約時支付 50% 款項
2. 專案完成驗收後支付尾款 50%
3. 付款期限為發票開立後 30 天內

其他條款：
1. 專案內容如有變更，需另行報價
2. 本報價有效期限如上所示`);

  // Reset form when quote changes
  useEffect(() => {
    if (quote) {
      setFormData({
        customerId: quote.customerId || "",
        projectTitle: quote.projectTitle || "",
        validUntil: quote.validUntil ? new Date(quote.validUntil) : null,
        taxMode: quote.taxMode || "tax_included",
      });
      // Would also set items from quote data
    } else {
      // Reset form for new quote
      setFormData({
        customerId: "",
        projectTitle: "",
        validUntil: null,
        taxMode: "tax_included",
      });
      setItems([{ desc: "", qty: 1, unitPrice: 0, discount: 0 }]);
    }
  }, [quote]);

  const addItem = () => {
    setItems([...items, { desc: "", qty: 1, unitPrice: 0, discount: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof QuoteItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const selectInventoryItem = (index: number, inventoryItem: any) => {
    updateItem(index, 'skuId', inventoryItem.id);
    updateItem(index, 'desc', inventoryItem.name);
    updateItem(index, 'unitPrice', inventoryItem.price);
  };

  const addPaymentPlan = () => {
    setPaymentPlan([...paymentPlan, { title: "", percent: 0 }]);
  };

  const removePaymentPlan = (index: number) => {
    if (paymentPlan.length > 1) {
      setPaymentPlan(paymentPlan.filter((_, i) => i !== index));
    }
  };

  const updatePaymentPlan = (index: number, field: keyof PaymentPlan, value: any) => {
    const newPlan = [...paymentPlan];
    newPlan[index] = { ...newPlan[index], [field]: value };
    setPaymentPlan(newPlan);
  };

  const calculateSubtotal = (item: QuoteItem) => {
    const baseAmount = item.qty * item.unitPrice;
    const discountAmount = baseAmount * ((item.discount || 0) / 100);
    return baseAmount - discountAmount;
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + calculateSubtotal(item), 0);
  };

  const calculateTax = () => {
    const total = calculateTotal();
    return formData.taxMode === 'tax_excluded' ? total * 0.05 : 0;
  };

  const calculateFinalAmount = () => {
    const total = calculateTotal();
    const tax = calculateTax();
    return total + tax;
  };

  const getTotalPaymentPercent = () => {
    return paymentPlan.reduce((sum, plan) => sum + plan.percent, 0);
  };

  const handleSaveDraft = () => {
    console.log('Saving draft...', { formData, items, paymentPlan, terms });
    onOpenChange(false);
  };

  const handleGenerateSignLink = () => {
    console.log('Generating signature link...', { formData, items, paymentPlan, terms });
  };

  const handlePreview = () => {
    console.log('Opening preview...', { formData, items, paymentPlan, terms });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-4xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{quote ? '編輯報價' : '新建報價'}</SheetTitle>
          <SheetDescription>
            建立或編輯報價單，包含明細、里程碑和條款
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">基本資訊</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer">客戶</Label>
                <Select value={formData.customerId} onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, customerId: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="選擇客戶" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCustomers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectTitle">專案名稱</Label>
                <Input
                  id="projectTitle"
                  value={formData.projectTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, projectTitle: e.target.value }))}
                  placeholder="輸入專案名稱"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>有效期限</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.validUntil && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.validUntil ? format(formData.validUntil, "yyyy/MM/dd") : "選擇日期"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.validUntil}
                      onSelect={(date) => setFormData(prev => ({ ...prev, validUntil: date }))}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>稅別</Label>
                <Select value={formData.taxMode} onValueChange={(value: any) => 
                  setFormData(prev => ({ ...prev, taxMode: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tax_included">含稅</SelectItem>
                    <SelectItem value="tax_excluded">未稅</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">明細項目</h3>
              <Button onClick={addItem} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                新增項目
              </Button>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">品項</TableHead>
                    <TableHead className="w-[100px]">數量</TableHead>
                    <TableHead className="w-[120px]">單價</TableHead>
                    <TableHead className="w-[100px]">折扣%</TableHead>
                    <TableHead className="w-[120px]">小計</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="space-y-1">
                          <Select onValueChange={(value) => {
                            const inventoryItem = mockInventory.find(inv => inv.id === value);
                            if (inventoryItem) {
                              selectInventoryItem(index, inventoryItem);
                            }
                          }}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="選擇商品或自訂" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockInventory.map((inv) => (
                                <SelectItem key={inv.id} value={inv.id}>
                                  <div className="flex flex-col">
                                    <span>{inv.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {inv.sku} - {formatCurrency(inv.price)}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            value={item.desc}
                            onChange={(e) => updateItem(index, 'desc', e.target.value)}
                            placeholder="品項描述"
                            className="text-sm"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.qty}
                          onChange={(e) => updateItem(index, 'qty', parseInt(e.target.value) || 0)}
                          min="1"
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(index, 'unitPrice', parseInt(e.target.value) || 0)}
                          min="0"
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.discount || 0}
                          onChange={(e) => updateItem(index, 'discount', parseInt(e.target.value) || 0)}
                          min="0"
                          max="100"
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(calculateSubtotal(item))}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(index)}
                          disabled={items.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Total Summary */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>小計：</span>
                  <span>{formatCurrency(calculateTotal())}</span>
                </div>
                {formData.taxMode === 'tax_excluded' && (
                  <div className="flex justify-between">
                    <span>營業稅 (5%)：</span>
                    <span>{formatCurrency(calculateTax())}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-semibold border-t pt-2">
                  <span>總計：</span>
                  <span>{formatCurrency(calculateFinalAmount())}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Plan */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={paymentPlanEnabled}
                  onCheckedChange={setPaymentPlanEnabled}
                />
                <Label>里程碑請款</Label>
              </div>
              {paymentPlanEnabled && (
                <Button onClick={addPaymentPlan} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  新增里程碑
                </Button>
              )}
            </div>

            {paymentPlanEnabled && (
              <div className="space-y-2">
                {paymentPlan.map((plan, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <Input
                      value={plan.title}
                      onChange={(e) => updatePaymentPlan(index, 'title', e.target.value)}
                      placeholder="里程碑標題"
                      className="flex-1"
                    />
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={plan.percent}
                        onChange={(e) => updatePaymentPlan(index, 'percent', parseInt(e.target.value) || 0)}
                        min="0"
                        max="100"
                        className="w-20"
                      />
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removePaymentPlan(index)}
                      disabled={paymentPlan.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                <div className="flex justify-end">
                  <Badge variant={getTotalPaymentPercent() === 100 ? "default" : "destructive"}>
                    總計: {getTotalPaymentPercent()}%
                  </Badge>
                </div>
              </div>
            )}
          </div>

          {/* Terms */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">條款內容</h3>
            <Textarea
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              rows={8}
              placeholder="輸入合約條款、付款條件等..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={handlePreview}>
              <Eye className="mr-2 h-4 w-4" />
              預覽
            </Button>
            <Button variant="outline" onClick={handleSaveDraft}>
              <Save className="mr-2 h-4 w-4" />
              儲存草稿
            </Button>
            <Button onClick={handleGenerateSignLink}>
              <Link className="mr-2 h-4 w-4" />
              產生簽名連結
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}