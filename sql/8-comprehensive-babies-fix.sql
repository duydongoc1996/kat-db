-- ============================================
-- COMPREHENSIVE FIX: Babies Table RLS
-- ============================================
-- This script completely resets the babies table RLS policies
-- Run this if you're still getting "new row violates row-level security policy"

-- ============================================
-- STEP 1: List current policies (for debugging)
-- ============================================
-- Run this first to see what policies exist:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
-- FROM pg_policies
-- WHERE tablename = 'babies';

-- ============================================
-- STEP 2: Drop ALL existing policies on babies
-- ============================================
DROP POLICY IF EXISTS "Anyone can create babies" ON babies;
DROP POLICY IF EXISTS "Authenticated users can create babies" ON babies;
DROP POLICY IF EXISTS "Users can create babies" ON babies;
DROP POLICY IF EXISTS "View accessible babies" ON babies;
DROP POLICY IF EXISTS "Users can view their babies" ON babies;
DROP POLICY IF EXISTS "Update accessible babies" ON babies;
DROP POLICY IF EXISTS "Owners and admins can update babies" ON babies;
DROP POLICY IF EXISTS "Delete accessible babies" ON babies;
DROP POLICY IF EXISTS "Owners can delete babies" ON babies;

-- Drop any other potential policy names
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON babies;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON babies;

-- ============================================
-- STEP 3: Verify RLS is enabled
-- ============================================
ALTER TABLE babies ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 4: Ensure created_by has default
-- ============================================
ALTER TABLE babies 
  ALTER COLUMN created_by SET DEFAULT auth.uid();

-- ============================================
-- STEP 5: Create ULTRA-SIMPLE INSERT policy
-- ============================================
-- This is the most permissive policy possible while still requiring auth
CREATE POLICY "allow_authenticated_insert"
  ON babies
  FOR INSERT
  TO authenticated  -- Only authenticated role
  WITH CHECK (true);  -- Always allow (RLS just checks they're logged in)

-- ============================================
-- STEP 6: Create other necessary policies
-- ============================================

-- SELECT: View babies you have access to
CREATE POLICY "allow_select_accessible"
  ON babies
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM baby_users
      WHERE baby_users.baby_id = babies.id
      AND baby_users.user_id = auth.uid()
    )
  );

-- UPDATE: Update babies you have access to
CREATE POLICY "allow_update_accessible"
  ON babies
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM baby_users
      WHERE baby_users.baby_id = babies.id
      AND baby_users.user_id = auth.uid()
    )
  );

-- DELETE: Delete babies you have access to
CREATE POLICY "allow_delete_accessible"
  ON babies
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM baby_users
      WHERE baby_users.baby_id = babies.id
      AND baby_users.user_id = auth.uid()
    )
  );

-- ============================================
-- STEP 7: Verify trigger is correct
-- ============================================
-- The trigger should use 'mom' role, not 'owner'
-- (This was done in script 7, but verify it ran)

-- ============================================
-- STEP 8: Grant necessary permissions
-- ============================================
GRANT INSERT ON babies TO authenticated;
GRANT SELECT ON babies TO authenticated;
GRANT UPDATE ON babies TO authenticated;
GRANT DELETE ON babies TO authenticated;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify everything is set up correctly:

-- 1. Check policies exist:
-- SELECT policyname, cmd FROM pg_policies WHERE tablename = 'babies';
-- Should show: allow_authenticated_insert, allow_select_accessible, allow_update_accessible, allow_delete_accessible

-- 2. Check RLS is enabled:
-- SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'babies';
-- Should show: rowsecurity = true

-- 3. Check default value:
-- SELECT column_name, column_default FROM information_schema.columns 
-- WHERE table_name = 'babies' AND column_name = 'created_by';
-- Should show: auth.uid()

-- 4. Check trigger exists:
-- SELECT trigger_name, event_manipulation FROM information_schema.triggers 
-- WHERE event_object_table = 'babies';
-- Should show: on_baby_created, INSERT

-- ============================================
-- TEST INSERT
-- ============================================
-- After running this script, test with:
-- INSERT INTO babies (name, date_of_birth) VALUES ('Test Baby', '2024-01-01');
-- This should work without RLS errors!

-- ============================================
-- EXPLANATION
-- ============================================
-- Why WITH CHECK (true)?
-- - This is the MOST permissive INSERT policy
-- - RLS still enforces authentication (TO authenticated)
-- - The trigger will add the user to baby_users
-- - Then they can view/update/delete via the other policies
--
-- This avoids any chicken-and-egg problems where:
-- - Policy tries to check baby_users for access
-- - But baby_users row doesn't exist yet (it's created by trigger)
-- - So INSERT fails even though trigger would give access
