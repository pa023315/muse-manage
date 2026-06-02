import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, Mail, Phone, Globe, MapPin, Search, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/common/PageHeader";
import FilterButtons, { FilterOption } from "@/components/common/FilterButtons";
import * as XLSX from 'xlsx';

interface Vendor {
  id: string;
  name: string;
  category: string | null;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  website: string | null;
  description: string | null;
  rating: number | null;
  is_active: boolean;
}

export default function AdminVendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [categoryFilters, setCategoryFilters] = useState<FilterOption[]>([
    { id: "all", label: "全部", active: true },
    { id: "印刷", label: "印刷", active: false },
    { id: "包裝", label: "包裝", active: false },
    { id: "服裝", label: "服裝", active: false },
    { id: "物流", label: "物流", active: false },
  ]);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    contact_person: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    description: "",
  });

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('name');

      if (error) throw error;
      setVendors(data || []);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast({
        title: "載入失敗",
        description: "無法載入廠商列表",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const vendorData = {
        name: formData.name,
        category: formData.category || null,
        contact_person: formData.contact_person || null,
        email: formData.email || null,
        phone: formData.phone || null,
        address: formData.address || null,
        website: formData.website || null,
        description: formData.description || null,
      };

      if (editingVendor) {
        const { error } = await supabase
          .from('vendors')
          .update(vendorData)
          .eq('id', editingVendor.id);

        if (error) throw error;

        toast({
          title: "更新成功",
          description: "廠商已更新"
        });
      } else {
        const { error } = await supabase
          .from('vendors')
          .insert([vendorData]);

        if (error) throw error;

        toast({
          title: "新增成功",
          description: "廠商已新增"
        });
      }

      setDialogOpen(false);
      resetForm();
      fetchVendors();
    } catch (error) {
      console.error('Error saving vendor:', error);
      toast({
        title: "操作失敗",
        description: "無法儲存廠商",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setFormData({
      name: vendor.name,
      category: vendor.category || "",
      contact_person: vendor.contact_person || "",
      email: vendor.email || "",
      phone: vendor.phone || "",
      address: vendor.address || "",
      website: vendor.website || "",
      description: vendor.description || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('確定要刪除此廠商嗎？')) return;

    try {
      const { error } = await supabase
        .from('vendors')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "刪除成功",
        description: "廠商已刪除"
      });

      fetchVendors();
    } catch (error) {
      console.error('Error deleting vendor:', error);
      toast({
        title: "刪除失敗",
        description: "無法刪除廠商",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      contact_person: "",
      email: "",
      phone: "",
      address: "",
      website: "",
      description: "",
    });
    setEditingVendor(null);
  };

  const handleFilterClick = (filterId: string) => {
    setCategoryFilters(categoryFilters.map(filter => ({
      ...filter,
      active: filter.id === filterId
    })));
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = searchQuery === "" || 
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.contact_person?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const activeCategory = categoryFilters.find(f => f.active);
    const matchesCategory = activeCategory?.id === "all" || vendor.category === activeCategory?.id;
    
    return matchesSearch && matchesCategory;
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (jsonData.length === 0) {
        toast({
          title: "匯入失敗",
          description: "Excel 文件中沒有數據",
          variant: "destructive"
        });
        return;
      }

      const validVendors = [];
      const errors = [];

      for (let i = 0; i < jsonData.length; i++) {
        const row: any = jsonData[i];
        
        // 檢查必填欄位：廠商名稱
        if (!row['廠商名稱'] && !row['name']) {
          errors.push(`第 ${i + 2} 列：缺少廠商名稱`);
          continue;
        }

        validVendors.push({
          name: row['廠商名稱'] || row['name'],
          category: row['類別'] || row['category'] || null,
          contact_person: row['聯絡人'] || row['contact_person'] || null,
          email: row['Email'] || row['email'] || null,
          phone: row['電話'] || row['phone'] || null,
          address: row['地址'] || row['address'] || null,
          website: row['網站'] || row['website'] || null,
          description: row['描述'] || row['description'] || null,
        });
      }

      if (errors.length > 0) {
        toast({
          title: "部分資料有誤",
          description: errors.slice(0, 3).join('\n'),
          variant: "destructive"
        });
      }

      if (validVendors.length === 0) {
        toast({
          title: "匯入失敗",
          description: "沒有有效的廠商資料",
          variant: "destructive"
        });
        return;
      }

      // 批量插入
      const { error } = await supabase
        .from('vendors')
        .insert(validVendors);

      if (error) throw error;

      toast({
        title: "匯入成功",
        description: `成功匯入 ${validVendors.length} 筆廠商資料`
      });

      setImportDialogOpen(false);
      fetchVendors();
      
      // 重置文件輸入
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error importing vendors:', error);
      toast({
        title: "匯入失敗",
        description: "處理 Excel 文件時發生錯誤",
        variant: "destructive"
      });
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const template = [
      {
        '廠商名稱': '範例廠商',
        '類別': '印刷',
        '聯絡人': '張三',
        'Email': 'example@example.com',
        '電話': '02-12345678',
        '地址': '台北市信義區信義路五段7號',
        '網站': 'https://example.com',
        '描述': '範例描述'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '廠商資料');
    XLSX.writeFile(wb, '廠商匯入範本.xlsx');
  };

  return (
    <div className="flex-1 bg-background text-foreground">
      <PageHeader
        breadcrumb={{
          category: "後台管理",
          page: "廠商管理"
        }}
        title="廠商管理"
        description="新增與編輯系統廠商"
        primaryAction={{
          label: "新增廠商",
          onClick: () => {
            resetForm();
            setDialogOpen(true);
          }
        }}
      />

      <div className="px-6 pb-4">
        <Button
          variant="outline"
          onClick={() => setImportDialogOpen(true)}
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          Excel 匯入
        </Button>
      </div>

      <div className="p-6 space-y-4">
        {/* Search and Filter Section */}
        <div className="space-y-4 bg-card rounded-lg border p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="搜尋廠商名稱、聯絡人或 Email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div>
            <p className="text-sm font-medium mb-2">類別篩選</p>
            <FilterButtons
              filters={categoryFilters}
              onFilterClick={handleFilterClick}
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>廠商名稱</TableHead>
                <TableHead>類別</TableHead>
                <TableHead>聯絡人</TableHead>
                <TableHead>聯絡方式</TableHead>
                <TableHead>地址</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    載入中...
                  </TableCell>
                </TableRow>
              ) : filteredVendors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    找不到符合條件的廠商
                  </TableCell>
                </TableRow>
              ) : (
                filteredVendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{vendor.name}</p>
                        {vendor.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {vendor.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {vendor.category && (
                        <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                          {vendor.category}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {vendor.contact_person || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        {vendor.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span>{vendor.phone}</span>
                          </div>
                        )}
                        {vendor.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="truncate">{vendor.email}</span>
                          </div>
                        )}
                        {vendor.website && (
                          <div className="flex items-center gap-1">
                            <Globe className="h-3 w-3 text-muted-foreground" />
                            <a 
                              href={vendor.website} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-primary hover:underline"
                            >
                              網站
                            </a>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {vendor.address ? (
                        <div className="flex items-start gap-1 text-sm">
                          <MapPin className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-2">{vendor.address}</span>
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(vendor)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(vendor.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingVendor ? '編輯廠商' : '新增廠商'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">廠商名稱 *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="category">類別</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選擇類別" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="印刷">印刷</SelectItem>
                    <SelectItem value="包裝">包裝</SelectItem>
                    <SelectItem value="服裝">服裝</SelectItem>
                    <SelectItem value="物流">物流</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">廠商描述</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact_person">聯絡人</Label>
                <Input
                  id="contact_person"
                  value={formData.contact_person}
                  onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone">電話</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="website">網站</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">地址</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                取消
              </Button>
              <Button type="submit">
                {editingVendor ? '更新' : '新增'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Excel Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excel 匯入廠商</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                請上傳包含廠商資料的 Excel 文件。廠商名稱為必填欄位。
              </p>
              <div className="space-y-2">
                <Label>Excel 檔案格式說明：</Label>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>廠商名稱（必填）</li>
                  <li>類別（選填：印刷、包裝、服裝、物流）</li>
                  <li>聯絡人（選填）</li>
                  <li>Email（選填）</li>
                  <li>電話（選填）</li>
                  <li>地址（選填）</li>
                  <li>網站（選填）</li>
                  <li>描述（選填）</li>
                </ul>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                onClick={downloadTemplate}
                className="w-full"
              >
                下載範本檔案
              </Button>

              <Input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                disabled={importing}
              />
            </div>

            {importing && (
              <p className="text-sm text-muted-foreground">處理中...</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
