-- ============================================
-- Fix baby_users SELECT RLS to Show All Members
-- ============================================
-- Problem: Current policy only shows YOUR membership row
-- Solution: Show ALL members of babies you have access to

-- ============================================
-- Drop old SELECT policy
-- ============================================
DROP POLICY IF EXISTS "View own memberships" ON baby_users;

-- ============================================
-- Create new SELECT policy
-- ============================================
-- Allow viewing ALL members of babies you have access to
CREATE POLICY "View members of accessible babies"
  ON baby_users
  FOR SELECT
  USING (user_has_baby_access(baby_id));

-- ============================================
-- Explanation
-- ============================================
-- Old policy: USING (user_id = auth.uid())
--   - Only showed your own membership row
--   - If baby has 3 members, you only saw yourself (1)
--
-- New policy: baby_id IN (SELECT baby_id FROM baby_users WHERE user_id = auth.uid())
--   - Shows ALL members of babies you have access to
--   - If baby has 3 members, you see all 3
--
-- This allows the "Current Members" list to show everyone!
