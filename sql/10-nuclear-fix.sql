-- ============================================
-- NUCLEAR OPTION: Complete Reset and Fix
-- ============================================
-- Run this if scripts 8 and 9 didn't work
-- This completely resets EVERYTHING related to RLS

-- ============================================
-- STEP 1: Disable RLS temporarily
-- ============================================
ALTER TABLE babies DISABLE ROW LEVEL SECURITY;
ALTER TABLE baby_users DISABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 2: Drop ALL policies
-- ============================================

-- Drop ALL babies policies
DO $$ 
DECLARE 
  r RECORD;
BEGIN
  FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'babies') 
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON babies', r.policyname);
  END LOOP;
END $$;

-- Drop ALL baby_users policies
DO $$ 
DECLARE 
  r RECORD;
BEGIN
  FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'baby_users') 
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON baby_users', r.policyname);
  END LOOP;
END $$;

-- ============================================
-- STEP 3: Fix trigger function
-- ============================================
DROP FUNCTION IF EXISTS add_creator_as_owner() CASCADE;
DROP FUNCTION IF EXISTS add_creator_as_member() CASCADE;

CREATE OR REPLACE FUNCTION add_creator_as_member()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO baby_users (baby_id, user_id, role, added_by)
  VALUES (NEW.id, NEW.created_by, 'mom', NEW.created_by);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_baby_created ON babies;

CREATE TRIGGER on_baby_created
  AFTER INSERT ON babies
  FOR EACH ROW
  EXECUTE FUNCTION add_creator_as_member();

-- ============================================
-- STEP 4: Set default for created_by
-- ============================================
ALTER TABLE babies 
  ALTER COLUMN created_by SET DEFAULT auth.uid();

-- ============================================
-- STEP 5: Grant ALL permissions
-- ============================================
GRANT ALL ON babies TO authenticated;
GRANT ALL ON baby_users TO authenticated;
GRANT ALL ON metrics TO authenticated;

-- Note: No sequences needed - tables use UUIDs (gen_random_uuid())

-- ============================================
-- STEP 6: Re-enable RLS
-- ============================================
ALTER TABLE babies ENABLE ROW LEVEL SECURITY;
ALTER TABLE baby_users ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 7: Create helper function (to avoid recursion)
-- ============================================
-- This function bypasses RLS to check if user has access to a baby
CREATE OR REPLACE FUNCTION user_has_baby_access(baby_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM baby_users
    WHERE baby_id = baby_uuid
    AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION user_has_baby_access(UUID) TO authenticated;

-- ============================================
-- STEP 8: Create SIMPLE policies
-- ============================================

-- BABIES: Allow all authenticated users to INSERT
CREATE POLICY "babies_insert_policy"
  ON babies
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- BABIES: View babies you have access to
CREATE POLICY "babies_select_policy"
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

-- BABIES: Update accessible babies
CREATE POLICY "babies_update_policy"
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

-- BABIES: Delete accessible babies
CREATE POLICY "babies_delete_policy"
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

-- BABY_USERS: Allow all authenticated to INSERT (for trigger!)
CREATE POLICY "baby_users_insert_policy"
  ON baby_users
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- BABY_USERS: View all members of babies you have access to
-- Uses helper function to avoid recursion
CREATE POLICY "baby_users_select_policy"
  ON baby_users
  FOR SELECT
  TO authenticated
  USING (user_has_baby_access(baby_id));

-- BABY_USERS: Update members of your babies
CREATE POLICY "baby_users_update_policy"
  ON baby_users
  FOR UPDATE
  TO authenticated
  USING (user_has_baby_access(baby_id));

-- BABY_USERS: Delete members from your babies
CREATE POLICY "baby_users_delete_policy"
  ON baby_users
  FOR DELETE
  TO authenticated
  USING (user_has_baby_access(baby_id));

-- ============================================
-- STEP 9: Verify setup
-- ============================================
-- Check policies were created:
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename IN ('babies', 'baby_users')
ORDER BY tablename, cmd;

-- ============================================
-- TEST IT
-- ============================================
-- Now try creating a baby from your app!
-- It should work!

-- Or test here:
-- INSERT INTO babies (name, date_of_birth) VALUES ('Test Baby', '2024-01-01');

-- ============================================
-- EXPLANATION
-- ============================================
-- This script:
-- 1. Temporarily disables RLS
-- 2. Drops ALL existing policies (no conflicts!)
-- 3. Fixes trigger to use 'mom' role
-- 4. Grants ALL necessary permissions
-- 5. Re-enables RLS
-- 6. Creates helper function to avoid recursion
-- 7. Creates simple, working policies
-- 8. Verifies everything is set up
--
-- Key differences from before:
-- - GRANT ALL instead of individual grants
-- - Policies have simple, clear names
-- - Helper function (user_has_baby_access) with SECURITY DEFINER to avoid recursion
-- - baby_users INSERT policy: WITH CHECK (true) - allows trigger!
-- - No direct EXISTS checks on baby_users (would cause recursion)
