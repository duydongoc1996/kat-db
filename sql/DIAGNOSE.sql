-- ============================================
-- DIAGNOSTIC QUERIES
-- ============================================
-- Run these to see what's actually configured

-- ============================================
-- 1. Check all policies on babies table
-- ============================================
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'babies'
ORDER BY cmd, policyname;

-- ============================================
-- 2. Check all policies on baby_users table
-- ============================================
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'baby_users'
ORDER BY cmd, policyname;

-- ============================================
-- 3. Check RLS is enabled
-- ============================================
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename IN ('babies', 'baby_users', 'metrics');

-- ============================================
-- 4. Check table permissions
-- ============================================
SELECT 
  grantee,
  table_schema,
  table_name,
  privilege_type
FROM information_schema.table_privileges
WHERE table_name IN ('babies', 'baby_users', 'metrics')
ORDER BY table_name, privilege_type;

-- ============================================
-- 5. Check trigger exists
-- ============================================
SELECT 
  trigger_name,
  event_manipulation,
  action_statement,
  action_timing
FROM information_schema.triggers
WHERE event_object_table = 'babies';

-- ============================================
-- 6. Check default value for created_by
-- ============================================
SELECT 
  column_name,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'babies'
AND column_name = 'created_by';

-- ============================================
-- 7. Check baby_users constraint
-- ============================================
SELECT 
  constraint_name,
  check_clause
FROM information_schema.check_constraints
WHERE constraint_name LIKE '%baby_users%role%';

-- ============================================
-- EXPECTED RESULTS
-- ============================================
-- Query 1 (babies policies): Should show:
--   - allow_authenticated_insert (INSERT, with_check = true)
--   - allow_select_accessible (SELECT)
--   - allow_update_accessible (UPDATE)
--   - allow_delete_accessible (DELETE)
--
-- Query 2 (baby_users policies): Should show:
--   - allow_all_authenticated_insert (INSERT, with_check = true)
--   - View members of accessible babies (SELECT)
--   - Remove members from accessible babies (DELETE)
--   - Update members of accessible babies (UPDATE)
--
-- Query 3 (RLS enabled): Should show rowsecurity = t (true) for all
--
-- Query 4 (permissions): Should show INSERT, SELECT, UPDATE, DELETE for authenticated
--
-- Query 5 (trigger): Should show on_baby_created, INSERT, add_creator_as_member()
--
-- Query 6 (default): Should show auth.uid()
--
-- Query 7 (constraint): Should show check for 'mom', 'dad', 'other'
