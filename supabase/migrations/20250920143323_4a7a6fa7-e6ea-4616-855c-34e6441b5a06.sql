-- 建立洽詢表單資料表
CREATE TABLE public.inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  
  -- 基本資料
  name TEXT NOT NULL,
  organization_type TEXT CHECK (organization_type IN ('individual', 'studio', 'company')),
  
  -- 委託資料
  character_type TEXT, -- 角色圖類型：全身/三視圖
  commission_items TEXT[], -- 委託項目：頭貼、插圖、立繪等
  usage_purpose TEXT[], -- 用途：封面用、宣傳用等
  reference_description TEXT, -- 參考圖描述
  image_specifications TEXT, -- 圖片規格
  special_requirements TEXT, -- 特殊需求
  deadline_date DATE, -- 交稿期限
  publish_date DATE, -- 可公開日期
  
  -- 造型設計
  design_notes TEXT, -- 造型設計備註
  
  -- 費用
  budget TEXT, -- 預算
  budget_range TEXT, -- 預算範圍
  
  -- 狀態管理
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'quoted', 'declined')),
  source TEXT DEFAULT 'external_form',
  
  -- 時間戳記
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 啟用 Row Level Security
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- 建立政策 - 允許任何人插入新的洽詢表單（公開表單用）
CREATE POLICY "Anyone can insert inquiries" 
ON public.inquiries 
FOR INSERT 
WITH CHECK (true);

-- 建立政策 - 只有認證用戶可以查看洽詢表單
CREATE POLICY "Authenticated users can view inquiries" 
ON public.inquiries 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- 建立政策 - 只有認證用戶可以更新洽詢表單
CREATE POLICY "Authenticated users can update inquiries" 
ON public.inquiries 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- 建立政策 - 只有認證用戶可以刪除洽詢表單
CREATE POLICY "Authenticated users can delete inquiries" 
ON public.inquiries 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- 建立更新時間戳記的觸發器函數（如果不存在）
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 建立觸發器來自動更新 updated_at
CREATE TRIGGER update_inquiries_updated_at
  BEFORE UPDATE ON public.inquiries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 建立索引以提升查詢效能
CREATE INDEX idx_inquiries_form_id ON public.inquiries(form_id);
CREATE INDEX idx_inquiries_status ON public.inquiries(status);
CREATE INDEX idx_inquiries_created_at ON public.inquiries(created_at DESC);
CREATE INDEX idx_inquiries_deadline_date ON public.inquiries(deadline_date);