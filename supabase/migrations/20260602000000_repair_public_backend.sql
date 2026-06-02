-- Repair schema and policies for the public Creator ERP web build.

-- The frontend reads and writes vendor notes, but the original vendors table
-- did not include the column.
ALTER TABLE public.vendors
  ADD COLUMN IF NOT EXISTS notes TEXT;

-- Keep updated_at trigger creation resilient when migrations are reapplied in
-- a repaired database.
DROP TRIGGER IF EXISTS update_vendors_updated_at ON public.vendors;
CREATE TRIGGER update_vendors_updated_at
  BEFORE UPDATE ON public.vendors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_inquiries_updated_at ON public.inquiries;
CREATE TRIGGER update_inquiries_updated_at
  BEFORE UPDATE ON public.inquiries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Inquiries: public visitors may submit and browse inquiries in the current
-- public web build. Destructive edits remain admin-only.
DROP POLICY IF EXISTS "Anyone can insert inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Anyone can view inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Anyone can update inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Anyone can delete inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Admins can update inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Admins can delete inquiries" ON public.inquiries;

CREATE POLICY "Anyone can insert inquiries"
  ON public.inquiries
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view inquiries"
  ON public.inquiries
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can update inquiries"
  ON public.inquiries
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete inquiries"
  ON public.inquiries
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Events: public visitors may browse active events; admin users manage them.
DROP POLICY IF EXISTS "Anyone can view active events" ON public.events;
DROP POLICY IF EXISTS "Admins can manage events" ON public.events;

CREATE POLICY "Anyone can view active events"
  ON public.events
  FOR SELECT
  USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage events"
  ON public.events
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Vendors: public visitors may browse active vendors; admin users manage them.
DROP POLICY IF EXISTS "Anyone can view active vendors" ON public.vendors;
DROP POLICY IF EXISTS "Admins can manage vendors" ON public.vendors;

CREATE POLICY "Anyone can view active vendors"
  ON public.vendors
  FOR SELECT
  USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage vendors"
  ON public.vendors
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Demo seed data keeps the public website browsable after a fresh database
-- reset while still allowing real records to be added later.
INSERT INTO public.vendors (
  name,
  category,
  contact_person,
  email,
  phone,
  address,
  website,
  description,
  rating,
  is_active,
  is_favorite,
  notes
)
SELECT *
FROM (
  VALUES
    (
      '晨光印刷',
      '印刷',
      '林小姐',
      'hello@example-print.tw',
      '02-2345-6789',
      '台北市中山區',
      'https://example.com',
      '少量數位印刷、同人誌與活動宣傳物輸出，交期穩定。',
      5.0,
      true,
      true,
      '適合急件與少量樣品，報價回覆快。'
    ),
    (
      '映色包裝',
      '包裝',
      '王先生',
      'packaging@example.com',
      '04-2222-1122',
      '台中市西區',
      'https://example.com',
      '客製紙盒、貼紙、封套與展場套裝包裝設計製作。',
      4.0,
      true,
      true,
      '適合商品組合包裝，需預留打樣時間。'
    ),
    (
      '快線物流',
      '物流',
      '陳先生',
      'ship@example.com',
      '07-3333-9090',
      '高雄市前鎮區',
      'https://example.com',
      '展場前置寄倉、宅配與活動現場物料配送。',
      4.0,
      true,
      false,
      null
    )
) AS seed(
  name,
  category,
  contact_person,
  email,
  phone,
  address,
  website,
  description,
  rating,
  is_active,
  is_favorite,
  notes
)
WHERE NOT EXISTS (
  SELECT 1 FROM public.vendors WHERE public.vendors.name = seed.name
);

INSERT INTO public.events (
  title,
  description,
  event_date,
  location,
  event_type,
  capacity,
  current_registrations,
  is_active
)
SELECT *
FROM (
  VALUES
    (
      '夏季新品主視覺定稿',
      '確認角色構圖、標題區與社群裁切版本。',
      DATE '2026-06-08',
      '線上會議',
      '專案里程碑',
      null::integer,
      0,
      true
    ),
    (
      '同人展攤位物料送印',
      '海報、立牌與貼紙檔案出血檢查。',
      DATE '2026-06-14',
      '晨光印刷',
      '製作排程',
      null::integer,
      0,
      true
    ),
    (
      '客戶報價追蹤',
      '確認三筆洽詢是否轉入正式專案。',
      DATE '2026-06-21',
      'Creator ERP',
      '業務追蹤',
      null::integer,
      0,
      true
    )
) AS seed(
  title,
  description,
  event_date,
  location,
  event_type,
  capacity,
  current_registrations,
  is_active
)
WHERE NOT EXISTS (
  SELECT 1 FROM public.events WHERE public.events.title = seed.title
);
