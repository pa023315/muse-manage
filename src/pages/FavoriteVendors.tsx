import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import PageHeader from "@/components/common/PageHeader";
import { Star, Heart, ExternalLink, Mail, Phone, Globe, Edit2, Save } from "lucide-react";
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
  notes: string | null;
}

export default function FavoriteVendors() {
  const [vendors, setVendors] = useState<VendorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [currentNotes, setCurrentNotes] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchFavoriteVendors();
  }, []);

  const fetchFavoriteVendors = async () => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('is_favorite', true)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setVendors((data || []) as unknown as VendorData[]);
    } catch (error) {
      console.error('Error fetching favorite vendors:', error);
      toast({
        title: "載入失敗",
        description: "無法載入常用廠商列表",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (vendorId: string) => {
    const vendor = vendors.find(v => v.id === vendorId);
    if (!vendor) return;

    try {
      const { error } = await supabase
        .from('vendors')
        .update({ is_favorite: false })
        .eq('id', vendorId);

      if (error) throw error;

      setVendors(prev => prev.filter(v => v.id !== vendorId));
      
      toast({
        title: "已移除常用",
        description: `${vendor.name} 已從常用廠商移除`
      });
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast({
        title: "操作失敗",
        description: "無法移除常用廠商",
        variant: "destructive"
      });
    }
  };

  const handleEditNotes = (vendor: VendorData) => {
    setEditingNotes(vendor.id);
    setCurrentNotes(vendor.notes || "");
    setNotesDialogOpen(true);
  };

  const handleSaveNotes = async () => {
    if (!editingNotes) return;

    try {
      const { error } = await supabase
        .from('vendors')
        .update({ notes: currentNotes } as any)
        .eq('id', editingNotes);

      if (error) throw error;

      setVendors(prev => prev.map(v => 
        v.id === editingNotes ? { ...v, notes: currentNotes } : v
      ));

      toast({
        title: "備註已儲存",
        description: "廠商備註已更新"
      });

      setNotesDialogOpen(false);
      setEditingNotes(null);
      setCurrentNotes("");
    } catch (error) {
      console.error('Error saving notes:', error);
      toast({
        title: "儲存失敗",
        description: "無法儲存備註",
        variant: "destructive"
      });
    }
  };

  const handleCardClick = (website: string | null) => {
    if (website) {
      window.open(website, '_blank');
    }
  };

  const renderStars = (rating: number = 0) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? 'fill-warning text-warning' : 'text-muted-foreground'}`}
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
            category: "廠商資源",
            page: "常用廠商"
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
          category: "廠商資源",
          page: "常用廠商"
        }}
      />

      {vendors.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">目前沒有常用廠商</p>
          <p className="text-sm text-muted-foreground mt-2">前往廠商一覽頁面將廠商加入常用</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vendors.map((vendor) => (
            <Card 
              key={vendor.id} 
              className="group transition-all hover:shadow-md"
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
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleRemoveFavorite(vendor.id)}
                        >
                          <Heart className="h-4 w-4 fill-current" />
                        </Button>
                        {vendor.website && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => handleCardClick(vendor.website)}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
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
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {vendor.description}
                  </p>
                )}
                
                <div className="space-y-2 text-sm">
                  {vendor.contact_person && (
                    <p><span className="font-medium">聯絡人：</span>{vendor.contact_person}</p>
                  )}
                  {vendor.email && (
                    <p className="flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      {vendor.email}
                    </p>
                  )}
                  {vendor.phone && (
                    <p className="flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      {vendor.phone}
                    </p>
                  )}
                  {vendor.website && (
                    <p className="flex items-center gap-2">
                      <Globe className="h-3 w-3" />
                      <a 
                        href={vendor.website} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-primary hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        網站
                      </a>
                    </p>
                  )}
                </div>

                {vendor.rating !== null && vendor.rating > 0 && (
                  <div className="flex items-center gap-2">
                    {renderStars(vendor.rating)}
                    <span className="text-sm text-muted-foreground">({vendor.rating})</span>
                  </div>
                )}

                {/* Notes Section */}
                <div className="pt-3 border-t">
                  <div className="flex items-start justify-between mb-2">
                    <Label className="text-sm font-medium">備註</Label>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={() => handleEditNotes(vendor)}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                  </div>
                  {vendor.notes ? (
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-3">
                      {vendor.notes}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">尚無備註</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Notes Dialog */}
      <Dialog open={notesDialogOpen} onOpenChange={setNotesDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>編輯備註</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="notes">備註內容</Label>
              <Textarea
                id="notes"
                value={currentNotes}
                onChange={(e) => setCurrentNotes(e.target.value)}
                rows={6}
                placeholder="輸入廠商備註..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setNotesDialogOpen(false);
                  setEditingNotes(null);
                  setCurrentNotes("");
                }}
              >
                取消
              </Button>
              <Button onClick={handleSaveNotes}>
                <Save className="h-4 w-4 mr-2" />
                儲存
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
