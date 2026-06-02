import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, CheckCircle } from "lucide-react";

interface FormData {
  name: string;
  organizationType: string;
  characterType: string;
  commissionItems: string[];
  usagePurpose: string[];
  referenceDescription: string;
  imageSpecifications: string;
  specialRequirements: string;
  deadlineDate: string;
  publishDate: string;
  designNotes: string;
  budget: string;
}

const commissionOptions = [
  "頭貼",
  "插圖", 
  "立繪",
  "Vtuber模型",
  "其他"
];

const usageOptions = [
  "封面用",
  "宣傳用", 
  "商品印製",
  "胸章",
  "掛軸",
  "立牌",
  "其他"
];

export default function PublicInquiryForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    organizationType: "",
    characterType: "",
    commissionItems: [],
    usagePurpose: [],
    referenceDescription: "",
    imageSpecifications: "",
    specialRequirements: "",
    deadlineDate: "",
    publishDate: "",
    designNotes: "",
    budget: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast({
        title: "請填寫必填欄位",
        description: "稱呼為必填欄位",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('inquiries')
        .insert({
          name: formData.name,
          organization_type: formData.organizationType || null,
          character_type: formData.characterType || null,
          commission_items: formData.commissionItems.length > 0 ? formData.commissionItems : null,
          usage_purpose: formData.usagePurpose.length > 0 ? formData.usagePurpose : null,
          reference_description: formData.referenceDescription || null,
          image_specifications: formData.imageSpecifications || null,
          special_requirements: formData.specialRequirements || null,
          deadline_date: formData.deadlineDate || null,
          publish_date: formData.publishDate || null,
          design_notes: formData.designNotes || null,
          budget: formData.budget || null
        });

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: "提交成功！",
        description: "我們已收到您的洽詢，將會盡快與您聯繫。"
      });
    } catch (error) {
      console.error('提交表單錯誤:', error);
      toast({
        title: "提交失敗",
        description: "請稍後再試或直接聯繫我們。",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommissionItemChange = (item: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      commissionItems: checked
        ? [...prev.commissionItems, item]
        : prev.commissionItems.filter(i => i !== item)
    }));
  };

  const handleUsagePurposeChange = (purpose: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      usagePurpose: checked
        ? [...prev.usagePurpose, purpose]
        : prev.usagePurpose.filter(p => p !== purpose)
    }));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <h2 className="text-2xl font-bold text-foreground">提交成功！</h2>
              <p className="text-muted-foreground">
                感謝您的洽詢，我們已收到您的表單。<br/>
                將會在 24 小時內與您聯繫。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">委託洽詢表單</h1>
            <p className="text-muted-foreground">請詳細填寫以下資訊，我們將盡快與您聯繫</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 基本資料 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">基本資料</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">
                    稱呼 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="請輸入您的稱呼"
                    required
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium">所屬</Label>
                  <RadioGroup
                    value={formData.organizationType}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, organizationType: value }))}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="individual" id="individual" />
                      <Label htmlFor="individual">個人</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="studio" id="studio" />
                      <Label htmlFor="studio">工作室</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="company" id="company" />
                      <Label htmlFor="company">公司</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            {/* 委託資料 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">委託資料</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-sm font-medium">角色圖</Label>
                  <RadioGroup
                    value={formData.characterType}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, characterType: value }))}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fullbody" id="fullbody" />
                      <Label htmlFor="fullbody">全身</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="three-view" id="three-view" />
                      <Label htmlFor="three-view">三視圖</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-sm font-medium">委託項目</Label>
                  <div className="mt-2 space-y-2">
                    {commissionOptions.map((item) => (
                      <div key={item} className="flex items-center space-x-2">
                        <Checkbox
                          id={`commission-${item}`}
                          checked={formData.commissionItems.includes(item)}
                          onCheckedChange={(checked) => handleCommissionItemChange(item, !!checked)}
                        />
                        <Label htmlFor={`commission-${item}`}>{item}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">用途</Label>
                  <div className="mt-2 space-y-2">
                    {usageOptions.map((purpose) => (
                      <div key={purpose} className="flex items-center space-x-2">
                        <Checkbox
                          id={`usage-${purpose}`}
                          checked={formData.usagePurpose.includes(purpose)}
                          onCheckedChange={(checked) => handleUsagePurposeChange(purpose, !!checked)}
                        />
                        <Label htmlFor={`usage-${purpose}`}>{purpose}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="reference" className="text-sm font-medium">參考圖</Label>
                  <Textarea
                    id="reference"
                    value={formData.referenceDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, referenceDescription: e.target.value }))}
                    placeholder="構圖 / 指定動作 / 背景場景 / (商品特殊設計請附圖)"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="specs" className="text-sm font-medium">圖片規格</Label>
                  <Input
                    id="specs"
                    value={formData.imageSpecifications}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageSpecifications: e.target.value }))}
                    placeholder="ex: 高4000*寬3000 像素"
                  />
                </div>

                <div>
                  <Label htmlFor="special" className="text-sm font-medium">特殊需求</Label>
                  <Textarea
                    id="special"
                    value={formData.specialRequirements}
                    onChange={(e) => setFormData(prev => ({ ...prev, specialRequirements: e.target.value }))}
                    placeholder="拆層 / 差分..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="deadline" className="text-sm font-medium">交稿期限</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.deadlineDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, deadlineDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="publish" className="text-sm font-medium">可公開日期</Label>
                    <Input
                      id="publish"
                      type="date"
                      value={formData.publishDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, publishDate: e.target.value }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 造型設計 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">造型設計</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="design" className="text-sm font-medium">設計需求</Label>
                  <Textarea
                    id="design"
                    value={formData.designNotes}
                    onChange={(e) => setFormData(prev => ({ ...prev, designNotes: e.target.value }))}
                    placeholder="請附參考圖，若需複雜服裝設計請另行委託。"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 費用 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">費用</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="budget" className="text-sm font-medium">預算</Label>
                  <Input
                    id="budget"
                    value={formData.budget}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                    placeholder="請輸入您的預算範圍"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center pt-4">
              <Button 
                type="submit" 
                size="lg" 
                disabled={isSubmitting}
                className="min-w-32"
              >
                {isSubmitting ? "提交中..." : "提交洽詢"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}