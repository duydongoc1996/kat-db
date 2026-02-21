-- ============================================
-- MIGRATION: Add Multi-Baby Management
-- ============================================
-- This migration adds support for multiple users managing multiple babies
-- SAFE for production - does NOT drop existing data
-- Run this in your Supabase SQL Editor

-- ============================================
-- STEP 1: Create babies table
-- ============================================
CREATE TABLE IF NOT EXISTS babies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name VARCHAR(100) NOT NULL,
  date_of_birth DATE,
  photo_url TEXT,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE babies ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 2: Create baby_users junction table
-- ============================================
CREATE TABLE IF NOT EXISTS baby_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  baby_id UUID REFERENCES babies(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  added_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  UNIQUE(baby_id, user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_baby_users_baby_id ON baby_users(baby_id);
CREATE INDEX IF NOT EXISTS idx_baby_users_user_id ON baby_users(user_id);

-- Enable RLS
ALTER TABLE baby_users ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 3: Add baby_id to metrics table
-- ============================================
-- Add baby_id column (nullable initially for migration)
ALTER TABLE metrics ADD COLUMN IF NOT EXISTS baby_id UUID REFERENCES babies(id) ON DELETE CASCADE;

-- Create index for baby_id
CREATE INDEX IF NOT EXISTS idx_metrics_baby_id ON metrics(baby_id);
CREATE INDEX IF NOT EXISTS idx_metrics_baby_type ON metrics(baby_id, input_type);

-- ============================================
-- STEP 4: Migrate existing data
-- ============================================
-- For each user with existing metrics, create a default baby
DO $$
DECLARE
  user_record RECORD;
  new_baby_id UUID;
BEGIN
  -- Loop through each user who has metrics
  FOR user_record IN 
    SELECT DISTINCT user_id FROM metrics WHERE baby_id IS NULL
  LOOP
    -- Create a default baby for this user
    INSERT INTO babies (name, created_by, notes)
    VALUES ('My Baby', user_record.user_id, 'Auto-created during migration')
    RETURNING id INTO new_baby_id;
    
    -- Add user as owner of the baby
    INSERT INTO baby_users (baby_id, user_id, role, added_by)
    VALUES (new_baby_id, user_record.user_id, 'owner', user_record.user_id);
    
    -- Update all metrics for this user to link to the new baby
    UPDATE metrics 
    SET baby_id = new_baby_id 
    WHERE user_id = user_record.user_id AND baby_id IS NULL;
    
    RAISE NOTICE 'Created baby % for user %', new_baby_id, user_record.user_id;
  END LOOP;
END $$;

-- Now make baby_id NOT NULL (all records should have it now)
ALTER TABLE metrics ALTER COLUMN baby_id SET NOT NULL;

-- ============================================
-- STEP 5: Drop old RLS policies and create new ones
-- ============================================

-- Drop old policies on metrics
DROP POLICY IF EXISTS "Users can view own metrics" ON metrics;
DROP POLICY IF EXISTS "Users can insert own metrics" ON metrics;
DROP POLICY IF EXISTS "Users can update own metrics" ON metrics;
DROP POLICY IF EXISTS "Users can delete own metrics" ON metrics;
DROP POLICY IF EXISTS "Allow all operations on metrics" ON metrics;

-- Create RLS policies for babies
CREATE POLICY "Users can view their babies" ON babies
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM baby_users
      WHERE baby_users.baby_id = babies.id
      AND baby_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create babies" ON babies
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Owners and admins can update babies" ON babies
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM baby_users
      WHERE baby_users.baby_id = babies.id
      AND baby_users.user_id = auth.uid()
      AND baby_users.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Owners can delete babies" ON babies
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM baby_users
      WHERE baby_users.baby_id = babies.id
      AND baby_users.user_id = auth.uid()
      AND baby_users.role = 'owner'
    )
  );

-- Create RLS policies for baby_users
CREATE POLICY "Users can view baby members" ON baby_users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM baby_users bu
      WHERE bu.baby_id = baby_users.baby_id
      AND bu.user_id = auth.uid()
    )
  );

-- Helper function to check owner/admin status (avoids recursion)
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

-- Allow insert if adding yourself OR if you're owner/admin
CREATE POLICY "Users can add members to their babies" ON baby_users
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    OR is_baby_owner_or_admin(baby_id, auth.uid())
  );

-- Owners and admins can remove users
CREATE POLICY "Owners and admins can remove members" ON baby_users
  FOR DELETE
  USING (
    is_baby_owner_or_admin(baby_id, auth.uid())
  );

-- Owners can update member roles
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

-- Create new RLS policies for metrics (baby-based)
CREATE POLICY "Users can view baby metrics" ON metrics
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM baby_users
      WHERE baby_users.baby_id = metrics.baby_id
      AND baby_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert baby metrics" ON metrics
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM baby_users
      WHERE baby_users.baby_id = metrics.baby_id
      AND baby_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own baby metrics" ON metrics
  FOR UPDATE
  USING (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM baby_users
      WHERE baby_users.baby_id = metrics.baby_id
      AND baby_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own baby metrics" ON metrics
  FOR DELETE
  USING (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM baby_users
      WHERE baby_users.baby_id = metrics.baby_id
      AND baby_users.user_id = auth.uid()
    )
  );

-- ============================================
-- STEP 6: Create trigger for auto-adding creator as owner
-- ============================================
CREATE OR REPLACE FUNCTION add_creator_as_owner()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO baby_users (baby_id, user_id, role, added_by)
  VALUES (NEW.id, NEW.created_by, 'owner', NEW.created_by);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_baby_created ON babies;
CREATE TRIGGER on_baby_created
  AFTER INSERT ON babies
  FOR EACH ROW
  EXECUTE FUNCTION add_creator_as_owner();

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
-- Verify the migration:
-- SELECT COUNT(*) FROM babies;
-- SELECT COUNT(*) FROM baby_users;
-- SELECT COUNT(*) FROM metrics WHERE baby_id IS NOT NULL;
--
-- All users should now have:
-- 1. A default baby created
-- 2. Owner access to that baby
-- 3. All their metrics linked to that baby
