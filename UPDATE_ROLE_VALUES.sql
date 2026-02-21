-- ============================================
-- Update Role Column to Family-Friendly Values
-- ============================================
-- Run this in Supabase SQL Editor to change role values
-- from 'owner/admin/member' to 'mom/dad/other'

-- ============================================
-- Step 1: Drop the old CHECK constraint
-- ============================================
ALTER TABLE baby_users DROP CONSTRAINT IF EXISTS baby_users_role_check;

-- ============================================
-- Step 2: Migrate existing data
-- ============================================
-- Convert old role values to family-friendly ones
UPDATE baby_users SET role = 'mom' WHERE role = 'owner';
UPDATE baby_users SET role = 'other' WHERE role IN ('admin', 'member');

-- ============================================
-- Step 3: Add new CHECK constraint
-- ============================================
-- Only allow mom, dad, or other
ALTER TABLE baby_users ADD CONSTRAINT baby_users_role_check 
  CHECK (role IN ('mom', 'dad', 'other'));

-- ============================================
-- Step 4: Update default value
-- ============================================
ALTER TABLE baby_users ALTER COLUMN role SET DEFAULT 'other';

-- ============================================
-- Verification
-- ============================================
-- Check that all roles are valid now:
SELECT role, COUNT(*) as count 
FROM baby_users 
GROUP BY role 
ORDER BY count DESC;

-- Should only show: mom, dad, or other

-- ============================================
-- DONE!
-- ============================================
-- Now you can use these role values:
-- - 'mom'  - Mother / Primary caregiver
-- - 'dad'  - Father / Secondary caregiver
-- - 'other' - Grandparents, babysitters, etc.
--
-- These values are just for display/categorization
-- All roles have EQUAL permissions (no restrictions)
