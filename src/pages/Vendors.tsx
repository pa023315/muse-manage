import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PageHeader from "@/components/common/PageHeader";
import { Star, Heart, ExternalLink, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface VendorData {
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
  is_favorite: boolean;
}

const categories = ["全部", "印刷", "包裝", "服裝", "物流"];

export default function Vendors() {
  const [vendors, setVendors] = useState<VendorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const { toast } = useToast();

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('is_active', true)
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

  const handleRating = async (vendorId: string, rating: 1 | 2 | 3 | 4 | 5) => {
    try {
      const { error } = await supabase
        .from('vendors')
        .update({ rating })
        .eq('id', vendorId);

      if (error) throw error;

      setVendors(prev => prev.map(vendor => 
        vendor.id === vendorId ? { ...vendor, rating } : vendor
      ));
      toast({
        title: "評分已更新",
        description: `已給予 ${rating} 星評分`
      });
    } catch (error) {
      console.error('Error updating rating:', error);
      toast({
        title: "評分失敗",
        description: "無法更新評分",
        variant: "destructive"
      });
    }
  };

  const handleFavorite = async (vendorId: string) => {
    const vendor = vendors.find(v => v.id === vendorId);
    if (!vendor) return;

    const newFavoriteState = !vendor.is_favorite;

    try {
      const { error } = await supabase
        .from('vendors')
        .update({ is_favorite: newFavoriteState })
        .eq('id', vendorId);

      if (error) throw error;

      setVendors(prev => prev.map(v => 
        v.id === vendorId ? { ...v, is_favorite: newFavoriteState } : v
      ));
      
      toast({
        title: newFavoriteState ? "已加入常用" : "已移除常用",
        description: newFavoriteState ? `${vendor.name} 已加入常用廠商` : `${vendor.name} 已從常用廠商移除`
      });
    } catch (error) {
      console.error('Error updating favorite:', error);
      toast({
        title: "操作失敗",
        description: "無法更新常用狀態",
        variant: "destructive"
      });
    }
  };

  const handleCardClick = (website: string | null) => {
    if (website) {
      window.open(website, '_blank');
    }
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (vendor.category?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
                         (vendor.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
                         (vendor.address?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesCategory = selectedCategory === "全部" || vendor.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderStars = (rating: number = 0, vendorId: string, interactive: boolean = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? 'fill-warning text-warning' : 'text-muted-foreground'} ${
              interactive ? 'cursor-pointer hover:text-warning' : ''
            }`}
            onClick={interactive ? () => handleRating(vendorId, star as 1 | 2 | 3 | 4 | 5) : undefined}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          breadcrumb={{
            category: "首頁",
            page: "廠商一覽"
          }}
        />
        <div className="text-center py-12">
          <p className="text-muted-foreground">載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={{
          category: "首頁",
          page: "廠商一覽"
        }}
      />

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜尋廠商名稱或分類..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="選擇分類" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Vendor Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredVendors.map((vendor) => (
          <Card 
            key={vendor.id} 
            className="group cursor-pointer transition-all hover:shadow-md"
            onClick={() => handleCardClick(vendor.website)}
          >
            <CardContent className="p-4 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">{vendor.name}</h3>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className={`h-8 w-8 ${vendor.is_favorite ? 'text-destructive' : 'text-muted-foreground'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFavorite(vendor.id);
                        }}
                      >
                        <Heart className={`h-4 w-4 ${vendor.is_favorite ? 'fill-current' : ''}`} />
                      </Button>
                      {vendor.website && (
                        <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                  </div>
                  
                  {vendor.category && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {vendor.category}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
              
              {vendor.description && (
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {vendor.description}
                </p>
              )}
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{vendor.address || '未提供地址'}</span>
                <div 
                  className="flex items-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {renderStars(vendor.rating || 0, vendor.id, true)}
                  <span className="text-muted-foreground">({vendor.rating || 0})</span>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button
                  size="sm"
                  variant={vendor.is_favorite ? "default" : "outline"}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFavorite(vendor.id);
                  }}
                >
                  {vendor.is_favorite ? "常用" : "加入常用"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVendors.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">未找到符合條件的廠商</p>
        </div>
      )}
    </div>
  );
}