-- ============================================
-- FIX: Infinite Recursion in baby_users RLS Policies
-- ============================================
-- Run this in Supabase SQL Editor to fix the circular dependency issue

-- ============================================
-- Drop problematic policies
-- ============================================
DROP POLICY IF EXISTS "Owners and admins can add users" ON baby_users;
DROP POLICY IF EXISTS "Owners and admins can remove users" ON baby_users;

-- ============================================
-- Fix INSERT policy - avoid self-reference
-- ============================================
-- Allow insert if:
-- 1. Adding yourself (for when baby is created)
-- 2. OR you're already an owner/admin of that baby (checked via function)

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

-- New INSERT policy without recursion
CREATE POLICY "Users can add members to their babies" ON baby_users
  FOR INSERT
  WITH CHECK (
    -- Allow if adding yourself (for trigger when creating baby)
    user_id = auth.uid()
    -- OR if you're owner/admin (checked via function to avoid recursion)
    OR is_baby_owner_or_admin(baby_id, auth.uid())
  );

-- ============================================
-- Fix DELETE policy
-- ============================================
CREATE POLICY "Owners and admins can remove members" ON baby_users
  FOR DELETE
  USING (
    -- Can delete if you're owner/admin of this baby
    is_baby_owner_or_admin(baby_id, auth.uid())
  );

-- ============================================
-- Optional: Add UPDATE policy for changing roles
-- ============================================
CREATE POLICY "Owners can update member roles" ON baby_users
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM baby_users bu
      WHERE bu.baby_id = baby_users.baby_id
      AND bu.user_id = auth.uid()
      AND bu.role = 'owner'
    )
  );

-- ============================================
-- Verification
-- ============================================
-- Test the policies work:
-- SELECT * FROM baby_users WHERE user_id = auth.uid();
-- Should return your baby_users records without recursion error
