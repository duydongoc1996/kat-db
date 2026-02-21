-- ============================================
-- SIMPLE RLS POLICIES - No Complex Roles
-- ============================================
-- Everyone who has access to a baby has equal rights
-- No owner/admin/member distinction - just "has access" or "doesn't have access"

-- ============================================
-- 1. Drop ALL existing policies
-- ============================================

-- Drop baby_users policies
DROP POLICY IF EXISTS "Users can view baby members" ON baby_users;
DROP POLICY IF EXISTS "Users can view their own memberships" ON baby_users;
DROP POLICY IF EXISTS "Owners and admins can add users" ON baby_users;
DROP POLICY IF EXISTS "Users can add members to their babies" ON baby_users;
DROP POLICY IF EXISTS "Owners and admins can remove users" ON baby_users;
DROP POLICY IF EXISTS "Owners and admins can remove members" ON baby_users;
DROP POLICY IF EXISTS "Owners can update member roles" ON baby_users;

-- Drop babies policies
DROP POLICY IF EXISTS "Users can view their babies" ON babies;
DROP POLICY IF EXISTS "Users can create babies" ON babies;
DROP POLICY IF EXISTS "Owners and admins can update babies" ON babies;
DROP POLICY IF EXISTS "Owners can delete babies" ON babies;

-- Drop metrics policies
DROP POLICY IF EXISTS "Users can view baby metrics" ON metrics;
DROP POLICY IF EXISTS "Users can insert baby metrics" ON metrics;
DROP POLICY IF EXISTS "Users can update own metrics" ON metrics;
DROP POLICY IF EXISTS "Users can update own baby metrics" ON metrics;
DROP POLICY IF EXISTS "Users can delete own metrics" ON metrics;
DROP POLICY IF EXISTS "Users can delete own baby metrics" ON metrics;

-- Drop helper function (we don't need it anymore!)
DROP FUNCTION IF EXISTS is_baby_owner_or_admin(UUID, UUID);

-- ============================================
-- 2. Helper Function - Check if user has access to baby
-- ============================================
CREATE OR REPLACE FUNCTION user_has_baby_access(baby_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM baby_users
    WHERE baby_id = baby_uuid
    AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================
-- 3. BABIES TABLE - Simple Policies
-- ============================================

-- Anyone can create a baby
CREATE POLICY "Anyone can create babies" ON babies
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- View babies you have access to
CREATE POLICY "View accessible babies" ON babies
  FOR SELECT
  USING (user_has_baby_access(id));

-- Anyone with access can update baby info
CREATE POLICY "Update accessible babies" ON babies
  FOR UPDATE
  USING (user_has_baby_access(id));

-- Anyone with access can delete baby
CREATE POLICY "Delete accessible babies" ON babies
  FOR DELETE
  USING (user_has_baby_access(id));

-- ============================================
-- 4. BABY_USERS TABLE - Simple Policies
-- ============================================

-- View your own memberships
CREATE POLICY "View own memberships" ON baby_users
  FOR SELECT
  USING (user_id = auth.uid());

-- Anyone with baby access can add new members
CREATE POLICY "Add members to accessible babies" ON baby_users
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid()  -- Allow trigger to add creator
    OR user_has_baby_access(baby_id)  -- Or if you have access
  );

-- Anyone with access can remove members
CREATE POLICY "Remove members from accessible babies" ON baby_users
  FOR DELETE
  USING (user_has_baby_access(baby_id));

-- Anyone with access can update memberships (change roles if needed)
CREATE POLICY "Update members of accessible babies" ON baby_users
  FOR UPDATE
  USING (user_has_baby_access(baby_id));

-- ============================================
-- 5. METRICS TABLE - Simple Policies
-- ============================================

-- View metrics for babies you have access to
CREATE POLICY "View metrics of accessible babies" ON metrics
  FOR SELECT
  USING (user_has_baby_access(baby_id));

-- Anyone with baby access can add metrics
CREATE POLICY "Add metrics to accessible babies" ON metrics
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND user_has_baby_access(baby_id)
  );

-- Anyone with baby access can update ANY metric (not just their own)
CREATE POLICY "Update metrics of accessible babies" ON metrics
  FOR UPDATE
  USING (user_has_baby_access(baby_id));

-- Anyone with baby access can delete ANY metric
CREATE POLICY "Delete metrics of accessible babies" ON metrics
  FOR DELETE
  USING (user_has_baby_access(baby_id));

-- ============================================
-- DONE! Much Simpler!
-- ============================================
-- Now:
-- - Anyone added to a baby has FULL access
-- - No owner/admin/member complexity
-- - All users are equal
-- - Dad, mom, grandparents, babysitters - all same rights

-- ============================================
-- Test Queries
-- ============================================
-- These should all work now:
-- SELECT * FROM baby_users WHERE user_id = auth.uid();
-- SELECT * FROM babies;
-- SELECT * FROM metrics WHERE baby_id = 'some-baby-id';
