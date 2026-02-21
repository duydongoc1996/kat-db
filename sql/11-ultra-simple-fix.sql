-- ============================================
-- ULTRA-SIMPLE FIX: Minimal RLS for Testing
-- ============================================
-- This uses the ABSOLUTE SIMPLEST policies possible
-- to isolate the problem

-- ============================================
-- STEP 1: Clean slate
-- ============================================

-- Disable RLS completely
ALTER TABLE babies DISABLE ROW LEVEL SECURITY;
ALTER TABLE baby_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE metrics DISABLE ROW LEVEL SECURITY;

-- Drop ALL policies using a loop
DO $$ 
DECLARE 
  r RECORD;
BEGIN
  FOR r IN (SELECT schemaname, tablename, policyname FROM pg_policies WHERE tablename IN ('babies', 'baby_users', 'metrics')) 
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
  END LOOP;
END $$;

-- ============================================
-- STEP 2: Fix the trigger
-- ============================================
DROP FUNCTION IF EXISTS add_creator_as_owner() CASCADE;
DROP FUNCTION IF EXISTS add_creator_as_member() CASCADE;
DROP FUNCTION IF EXISTS user_has_baby_access(UUID) CASCADE;

-- Recreate trigger function
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
-- STEP 3: Test WITHOUT RLS
-- ============================================
-- At this point, try creating a baby from your app
-- If it STILL fails, the problem is NOT RLS - it's the trigger or data
-- If it WORKS, then we know RLS is the issue

-- Uncomment to test here:
-- INSERT INTO babies (name, created_by) VALUES ('Test', auth.uid());
-- SELECT * FROM baby_users WHERE baby_id = (SELECT id FROM babies WHERE name = 'Test' LIMIT 1);

-- ============================================
-- STEP 4: Add back MINIMAL RLS for babies
-- ============================================
ALTER TABLE babies ENABLE ROW LEVEL SECURITY;

-- Most permissive policy possible - just check user is logged in
CREATE POLICY "babies_allow_all_authenticated"
  ON babies
  FOR ALL  -- INSERT, SELECT, UPDATE, DELETE - all operations
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- STEP 5: Add back MINIMAL RLS for baby_users
-- ============================================
ALTER TABLE baby_users ENABLE ROW LEVEL SECURITY;

-- Most permissive policy possible for baby_users too
CREATE POLICY "baby_users_allow_all_authenticated"
  ON baby_users
  FOR ALL  -- All operations
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- STEP 6: Grant permissions
-- ============================================
GRANT ALL ON babies TO authenticated;
GRANT ALL ON baby_users TO authenticated;
GRANT ALL ON metrics TO authenticated;

-- ============================================
-- STEP 7: Keep metrics simple too
-- ============================================
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "metrics_allow_all_authenticated"
  ON metrics
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- VERIFICATION
-- ============================================
-- Check what we created:
SELECT 
  tablename, 
  policyname, 
  cmd, 
  qual, 
  with_check,
  permissive
FROM pg_policies
WHERE tablename IN ('babies', 'baby_users', 'metrics')
ORDER BY tablename;

-- Should show:
-- babies | babies_allow_all_authenticated | ALL | true | true | PERMISSIVE
-- baby_users | baby_users_allow_all_authenticated | ALL | true | true | PERMISSIVE
-- metrics | metrics_allow_all_authenticated | ALL | true | true | PERMISSIVE

-- ============================================
-- TEST IT NOW
-- ============================================
-- From your app, try creating a baby
-- This MUST work because:
-- 1. RLS is enabled but allows everything for authenticated users
-- 2. Trigger is fixed to use 'mom' role
-- 3. All permissions granted
-- 4. No recursion possible (no complex checks)

-- ============================================
-- EXPLANATION
-- ============================================
-- This is the MOST PERMISSIVE RLS setup possible:
-- - RLS is enabled (required for production)
-- - But policies allow ALL operations for authenticated users
-- - USING (true) = allow viewing everything
-- - WITH CHECK (true) = allow inserting/updating everything
-- - No fancy checks, no joins, no subqueries
--
-- SECURITY NOTE:
-- This is too permissive for production!
-- Once baby creation works, we'll add proper policies:
-- - babies: view only babies you have access to
-- - baby_users: view only members of your babies
-- - metrics: view only metrics of your babies
--
-- But for now, let's just get it WORKING first!

-- ============================================
-- NEXT STEPS (After this works)
-- ============================================
-- Once baby creation works, we can add proper filtering:
--
-- 1. Create helper function:
-- CREATE FUNCTION get_user_baby_ids() RETURNS SETOF UUID AS $$
--   SELECT baby_id FROM baby_users WHERE user_id = auth.uid()
-- $$ LANGUAGE SQL SECURITY DEFINER;
--
-- 2. Update policies to use it:
-- DROP POLICY babies_allow_all_authenticated ON babies;
-- CREATE POLICY babies_view_accessible ON babies FOR SELECT
--   USING (id IN (SELECT get_user_baby_ids()));
--
-- But let's do that AFTER we confirm inserts work!
