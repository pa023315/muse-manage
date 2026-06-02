import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import PageHeader from "@/components/common/PageHeader";
import { Search, Plus, Phone, Mail, MapPin, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Customer } from "@/types";

// Mock data for customers
const mockCustomers: Customer[] = [
  {
    id: "customer-1",
    kind: "company",
    name: "台北印刷公司",
    taxId: "12345678",
    contacts: [{ name: "王小明", email: "wang@taipei-print.com", phone: "02-1234-5678" }],
    source: "官網詢問",
    tags: ["印刷", "VIP客戶"],
    note: "台北市中山區民生東路123號",
    createdAt: "2024-01-15"
  },
  {
    id: "customer-2",
    kind: "company",
    name: "創意設計工作室",
    taxId: "23456789",
    contacts: [{ name: "李美麗", email: "li@creative-design.com", phone: "02-2345-6789" }], 
    source: "朋友介紹",
    tags: ["設計", "長期合作"],
    note: "台北市信義區忠孝東路456號",
    createdAt: "2024-02-20"
  },
  {
    id: "customer-3", 
    kind: "company",
    name: "時尚服飾有限公司",
    taxId: "34567890",
    contacts: [{ name: "陳大華", email: "chen@fashion.com", phone: "02-3456-7890" }],
    source: "Google廣告",
    tags: ["服裝", "新客戶"],
    note: "台北市大安區敦化南路789號",
    createdAt: "2024-03-10"
  },
  {
    id: "customer-4",
    kind: "company",
    name: "科技創新股份有限公司",
    taxId: "45678901",
    contacts: [{ name: "張志明", email: "zhang@techinn.com", phone: "02-4567-8901" }], 
    source: "展覽會", 
    tags: ["科技", "大型企業"],
    note: "新北市板橋區中山路321號",
    createdAt: "2024-04-05"
  }
];

interface CustomerFormData {
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  taxId: string;
  source: string;
  address: string;
  notes: string;
}

const initialFormData: CustomerFormData = {
  name: "",
  contactPerson: "",
  phone: "",
  email: "",
  taxId: "",
  source: "",
  address: "",
  notes: ""
};

export default function Customers() {
  const [customers, setCustomers] = useState(mockCustomers);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<CustomerFormData>(initialFormData);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof CustomerFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.name || !formData.contactPerson) {
      toast({
        title: "請填寫必要欄位",
        description: "客戶名稱和聯絡人為必填欄位",
        variant: "destructive"
      });
      return;
    }

    const newCustomer: Customer = {
      id: `customer-${Date.now()}`,
      kind: "company",
      name: formData.name,
      taxId: formData.taxId,
      contacts: [{ 
        name: formData.contactPerson, 
        email: formData.email, 
        phone: formData.phone 
      }],
      source: formData.source,
      tags: [],
      note: `${formData.address}${formData.notes ? (formData.address ? '\n' : '') + '備註: ' + formData.notes : ''}`,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setCustomers(prev => [newCustomer, ...prev]);
    setFormData(initialFormData);
    setIsOpen(false);
    
    toast({
      title: "客戶新增成功",
      description: `${formData.name} 已加入客戶清單`
    });
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setIsOpen(false);
  };

  const handleCardClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailOpen(true);
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.contacts.some(contact => 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          breadcrumb={{
            category: "首頁",
            page: "客戶一覽"
          }}
        />
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              新增客戶
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle>新增客戶</SheetTitle>
            </SheetHeader>
            
            <div className="space-y-4 py-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <div className="space-y-2">
                <Label htmlFor="name">客戶/公司名稱:</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="請輸入客戶名稱"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPerson">聯絡人:</Label>
                <Input
                  id="contactPerson"
                  value={formData.contactPerson}
                  onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                  placeholder="請輸入聯絡人姓名"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">聯絡電話:</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="請輸入聯絡電話"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">電子郵件:</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="請輸入電子郵件"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxId">統一編號:</Label>
                <Input
                  id="taxId"
                  value={formData.taxId}
                  onChange={(e) => handleInputChange("taxId", e.target.value)}
                  placeholder="請輸入統一編號"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="source">客戶來源:</Label>
                <Input
                  id="source"
                  value={formData.source}
                  onChange={(e) => handleInputChange("source", e.target.value)}
                  placeholder="例如：官網、朋友介紹、廣告..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">地址:</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="請輸入客戶地址"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">備註:</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="請輸入備註資訊"
                  className="min-h-[60px] resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t bg-background sticky bottom-0">
              <Button variant="outline" onClick={handleCancel}>
                取消
              </Button>
              <Button onClick={handleSave}>
                儲存
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Search Field */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="搜尋客戶名稱、聯絡人或郵件..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Customer Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredCustomers.map((customer) => (
          <Card 
            key={customer.id} 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleCardClick(customer)}
          >
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">{customer.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Building className="h-3 w-3" />
                    {customer.contacts[0]?.name || "無聯絡人"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{customer.contacts[0]?.phone || "無電話"}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{customer.contacts[0]?.email || "無郵件"}</span>
                </div>
                
                {customer.note && (
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground line-clamp-2">{customer.note}</span>
                  </div>
                )}
              </div>

              {customer.source && (
                <div className="pt-2 border-t">
                  <span className="text-xs text-muted-foreground">來源: {customer.source}</span>
                </div>
              )}

              {customer.tags && customer.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {customer.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs rounded-md bg-secondary text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Customer Detail Sheet */}
      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent className="w-full sm:max-w-md">
          {selectedCustomer && (
            <>
              <SheetHeader>
                <SheetTitle>客戶詳細資訊</SheetTitle>
              </SheetHeader>
              
              <div className="space-y-6 py-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">{selectedCustomer.name}</h3>
                    {selectedCustomer.taxId && (
                      <p className="text-sm text-muted-foreground">統編: {selectedCustomer.taxId}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">聯絡資訊</h4>
                    {selectedCustomer.contacts.map((contact, index) => (
                      <div key={index} className="space-y-2 p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{contact.name}</span>
                        </div>
                        {contact.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{contact.phone}</span>
                          </div>
                        )}
                        {contact.email && (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{contact.email}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {selectedCustomer.note && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">地址/備註</h4>
                      <div className="p-3 border rounded-lg">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <p className="text-sm whitespace-pre-wrap">{selectedCustomer.note}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedCustomer.source && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">客戶來源</h4>
                      <p className="text-sm text-muted-foreground">{selectedCustomer.source}</p>
                    </div>
                  )}

                  {selectedCustomer.tags && selectedCustomer.tags.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">標籤</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedCustomer.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs rounded-md bg-secondary text-secondary-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground">
                      建立日期: {new Date(selectedCustomer.createdAt).toLocaleDateString('zh-TW')}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">未找到符合條件的客戶</p>
        </div>
      )}
    </div>
  );
}