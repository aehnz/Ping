-- ============================================
-- Status App — Supabase Migration
-- Run this in the Supabase SQL Editor
-- ============================================

-- 1. Create the users table
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT DEFAULT '',
  status TEXT DEFAULT 'free' CHECK (status IN ('free', 'dnd')),
  custom_message TEXT DEFAULT '',
  partner_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  partner_code TEXT UNIQUE DEFAULT gen_random_uuid()::text,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- Users can read their partner's profile
CREATE POLICY "Users can read partner profile"
  ON public.users FOR SELECT
  USING (
    id = (SELECT partner_id FROM public.users WHERE id = auth.uid())
  );

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow users to read any profile by partner_code (for linking)
CREATE POLICY "Users can read by partner code"
  ON public.users FOR SELECT
  USING (true);

-- 4. Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'name', ''));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Trigger on auth.users insert
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Function to link partners
CREATE OR REPLACE FUNCTION public.link_partner(partner_code_input TEXT)
RETURNS JSONB AS $$
DECLARE
  partner_record RECORD;
  current_user_id UUID;
BEGIN
  current_user_id := auth.uid();
  
  -- Find the partner by code
  SELECT id, partner_id INTO partner_record
  FROM public.users
  WHERE partner_code = partner_code_input AND id != current_user_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid partner code');
  END IF;
  
  IF partner_record.partner_id IS NOT NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'This person already has a partner');
  END IF;
  
  -- Link both users
  UPDATE public.users SET partner_id = partner_record.id, updated_at = now()
  WHERE id = current_user_id;
  
  UPDATE public.users SET partner_id = current_user_id, updated_at = now()
  WHERE id = partner_record.id;
  
  RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Enable Realtime on the users table
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;

-- 8. Auto-update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
