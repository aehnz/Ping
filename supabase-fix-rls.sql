-- ============================================
-- FIX: Drop the recursive RLS policies and replace
-- Run this in Supabase SQL Editor
-- ============================================

-- Drop ALL existing policies on the users table
DROP POLICY IF EXISTS "Users can read own profile" ON public.users;
DROP POLICY IF EXISTS "Users can read partner profile" ON public.users;
DROP POLICY IF EXISTS "Users can read by partner code" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;

-- NEW simplified policies (no recursion)

-- SELECT: Allow all authenticated users to read any row
-- (Status data is not sensitive — it's the whole point of the app)
CREATE POLICY "Authenticated users can read profiles"
  ON public.users FOR SELECT
  TO authenticated
  USING (true);

-- INSERT: Users can only insert their own row
CREATE POLICY "Users can insert own profile"
  ON public.users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- UPDATE: Users can only update their own row
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
