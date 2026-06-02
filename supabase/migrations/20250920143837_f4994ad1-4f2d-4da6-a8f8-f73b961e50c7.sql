-- 修正 RLS 政策，允許所有用戶查看洽詢資料（後台管理用）
DROP POLICY "Authenticated users can view inquiries" ON public.inquiries;
DROP POLICY "Authenticated users can update inquiries" ON public.inquiries;
DROP POLICY "Authenticated users can delete inquiries" ON public.inquiries;

-- 建立新的政策 - 允許所有人查看洽詢表單（後台管理）
CREATE POLICY "Anyone can view inquiries" 
ON public.inquiries 
FOR SELECT 
USING (true);

-- 建立新的政策 - 允許所有人更新洽詢表單（後台管理）
CREATE POLICY "Anyone can update inquiries" 
ON public.inquiries 
FOR UPDATE 
USING (true);

-- 建立新的政策 - 允許所有人刪除洽詢表單（後台管理）
CREATE POLICY "Anyone can delete inquiries" 
ON public.inquiries 
FOR DELETE 
USING (true);