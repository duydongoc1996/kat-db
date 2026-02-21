-- ============================================
-- COMPLETE FIX: Remove ALL Infinite Recursion
-- ============================================
-- Run this ENTIRE script in Supabase SQL Editor

-- ============================================
-- 1. Drop ALL existing policies on baby_users
-- ============================================
DROP POLICY IF EXISTS "Users can view baby members" ON baby_users;
DROP POLICY IF EXISTS "Users can view their own baby memberships" ON baby_users;
DROP POLICY IF EXISTS "Users can view their own memberships" ON baby_users;
DROP POLICY IF EXISTS "Owners and admins can add users" ON baby_users;
DROP POLICY IF EXISTS "Users can add members to their babies" ON baby_users;
DROP POLICY IF EXISTS "Owners and admins can remove users" ON baby_users;
DROP POLICY IF EXISTS "Owners and admins can remove members" ON baby_users;
DROP POLICY IF EXISTS "Owners can update member roles" ON baby_users;

-- ============================================
-- 2. Create helper function (SECURITY DEFINER)
-- ============================================
CREATE OR REPLACE FUNCTION is_baby_owner_or_admin(baby_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM baby_users
    WHERE baby_id = baby_uuid
    AND user_id = user_uuid
    AND role IN ('owner', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 3. Create NEW policies (NO RECURSION)
-- ============================================

-- SELECT: Users can only view their own memberships
CREATE POLICY "Users can view their own memberships" ON baby_users
  FOR SELECT
  USING (user_id = auth.uid());

-- INSERT: Allow adding yourself OR if owner/admin (via function)
CREATE POLICY "Users can add members to their babies" ON baby_users
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    OR is_baby_owner_or_admin(baby_id, auth.uid())
  );

-- UPDATE: Only owners can change roles
CREATE POLICY "Owners can update member roles" ON baby_users
  FOR UPDATE
  USING (is_baby_owner_or_admin(baby_id, auth.uid()));

-- DELETE: Owners and admins can remove members
CREATE POLICY "Owners and admins can remove members" ON baby_users
  FOR DELETE
  USING (is_baby_owner_or_admin(baby_id, auth.uid()));

-- ============================================
-- 4. Verify policies
-- ============================================
-- You can check the policies with:
-- SELECT * FROM pg_policies WHERE tablename = 'baby_users';

-- ============================================
-- 5. Test query
-- ============================================
-- This should now work without recursion:
-- SELECT * FROM baby_users WHERE user_id = auth.uid();
