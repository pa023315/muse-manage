-- 為當前使用者新增 admin 角色
INSERT INTO public.user_roles (user_id, role)
VALUES ('1d359ee2-7605-4d6b-b71f-0b8897da4d4c', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;