-- Add admin role to user with email containing 'jpbertilhopt'
-- This will make the user an admin

DO $$
DECLARE
  user_uuid UUID;
BEGIN
  -- Get the user ID from auth.users where email contains 'jpbertilhopt'
  SELECT id INTO user_uuid
  FROM auth.users
  WHERE email LIKE '%jpbertilhopt%'
  LIMIT 1;

  -- If user found, add admin role
  IF user_uuid IS NOT NULL THEN
    -- Insert admin role (will ignore if already exists due to UNIQUE constraint)
    INSERT INTO public.user_roles (user_id, role)
    VALUES (user_uuid, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;

    RAISE NOTICE 'Admin role added to user: %', user_uuid;
  ELSE
    RAISE NOTICE 'User with email containing jpbertilhopt not found';
  END IF;
END $$;

-- Add admin role for exact email (jpbertilhopt@gmail.com)
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'jpbertilhopt@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
