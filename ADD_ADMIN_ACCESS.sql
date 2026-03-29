-- ============================================
-- ADICIONAR ACESSO ADMIN
-- ============================================
-- Execute este script no Supabase Dashboard:
-- 1. Acesse: https://supabase.com/dashboard/project/tzdatllacntstuaoabou/sql/new
-- 2. Cole este código
-- 3. Clique em "Run" ou "Executar"
-- ============================================

-- Adicionar role admin para jpbertilhopt@gmail.com
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'jpbertilhopt@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Verificar se foi adicionado com sucesso
SELECT 
  u.email,
  u.id as user_id,
  ur.role,
  ur.created_at as role_added_at
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id AND ur.role = 'admin'
WHERE u.email = 'jpbertilhopt@gmail.com';

