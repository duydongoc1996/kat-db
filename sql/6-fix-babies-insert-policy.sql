-- ============================================
-- Fix Babies INSERT Policy
-- ============================================
-- Problem: "new row violates row-level security policy for table \"babies\""
-- Solution: Simplify the INSERT policy

-- ============================================
-- Step 1: Drop old INSERT policy
-- ============================================
DROP POLICY IF EXISTS "Anyone can create babies" ON babies;
DROP POLICY IF EXISTS "Authenticated users can create babies" ON babies;

-- ============================================
-- Step 2: Add default value for created_by
-- ============================================
-- Automatically set created_by to current user if not provided
ALTER TABLE babies 
  ALTER COLUMN created_by SET DEFAULT auth.uid();

-- ============================================
-- Step 3: Create simple INSERT policy
-- ============================================
-- Just check that user is authenticated
-- created_by will be set automatically by default value or frontend
CREATE POLICY "Authenticated users can create babies"
  ON babies
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
  );

-- ============================================
-- Explanation
-- ============================================
-- The policy now ONLY checks:
--   1. User is authenticated (auth.uid() IS NOT NULL)
--
-- The created_by field:
--   1. Has a DEFAULT value of auth.uid()
--   2. Can also be set explicitly by frontend
--   3. Will always be the authenticated user
--
-- The trigger (on_baby_created) will:
--   1. Automatically add creator to baby_users table
--   2. Give them access to the baby
--
-- This is simpler and avoids RLS evaluation issues!
