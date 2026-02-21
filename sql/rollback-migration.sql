-- ============================================
-- ROLLBACK: Remove Multi-Baby Management
-- ============================================
-- Run this ONLY if you need to rollback the migration
-- WARNING: This will remove baby management but keep your metrics data

-- ============================================
-- STEP 1: Drop triggers and functions
-- ============================================
DROP TRIGGER IF EXISTS on_baby_created ON babies;
DROP FUNCTION IF EXISTS add_creator_as_owner();

-- ============================================
-- STEP 2: Make baby_id nullable again
-- ============================================
ALTER TABLE metrics ALTER COLUMN baby_id DROP NOT NULL;

-- ============================================
-- STEP 3: Drop RLS policies
-- ============================================

-- Drop policies on metrics
DROP POLICY IF EXISTS "Users can view baby metrics" ON metrics;
DROP POLICY IF EXISTS "Users can insert baby metrics" ON metrics;
DROP POLICY IF EXISTS "Users can update own baby metrics" ON metrics;
DROP POLICY IF EXISTS "Users can delete own baby metrics" ON metrics;

-- Drop policies on baby_users
DROP POLICY IF EXISTS "Users can view baby members" ON baby_users;
DROP POLICY IF EXISTS "Owners and admins can add users" ON baby_users;
DROP POLICY IF EXISTS "Owners and admins can remove users" ON baby_users;

-- Drop policies on babies
DROP POLICY IF EXISTS "Users can view their babies" ON babies;
DROP POLICY IF EXISTS "Users can create babies" ON babies;
DROP POLICY IF EXISTS "Owners and admins can update babies" ON babies;
DROP POLICY IF EXISTS "Owners can delete babies" ON babies;

-- ============================================
-- STEP 4: Restore original RLS policies on metrics
-- ============================================
CREATE POLICY "Users can view own metrics" ON metrics
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own metrics" ON metrics
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own metrics" ON metrics
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own metrics" ON metrics
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- STEP 5: Drop indexes
-- ============================================
DROP INDEX IF EXISTS idx_metrics_baby_id;
DROP INDEX IF EXISTS idx_metrics_baby_type;
DROP INDEX IF EXISTS idx_baby_users_baby_id;
DROP INDEX IF EXISTS idx_baby_users_user_id;

-- ============================================
-- STEP 6: Drop tables (WARNING: Deletes baby data)
-- ============================================
-- Uncomment these lines if you want to completely remove the tables
-- DROP TABLE IF EXISTS baby_users CASCADE;
-- DROP TABLE IF EXISTS babies CASCADE;

-- ============================================
-- STEP 7: Remove baby_id column (Optional)
-- ============================================
-- Uncomment this line if you want to remove the baby_id column
-- ALTER TABLE metrics DROP COLUMN IF EXISTS baby_id;

-- ============================================
-- ROLLBACK COMPLETE
-- ============================================
-- Your app should now work with the original single-user schema
