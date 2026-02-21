-- ============================================
-- Fix Trigger to Use Correct Role Values
-- ============================================
-- Problem: Trigger uses 'owner' but constraint only allows 'mom'/'dad'/'other'
-- Solution: Update trigger function to use 'mom' as default role

-- ============================================
-- Step 1: Drop old trigger function
-- ============================================
DROP FUNCTION IF EXISTS add_creator_as_owner() CASCADE;

-- ============================================
-- Step 2: Create updated trigger function
-- ============================================
CREATE OR REPLACE FUNCTION add_creator_as_member()
RETURNS TRIGGER AS $$
BEGIN
  -- Automatically add the creator to baby_users with 'mom' role
  -- (They can change it later if needed)
  INSERT INTO baby_users (baby_id, user_id, role, added_by)
  VALUES (NEW.id, NEW.created_by, 'mom', NEW.created_by);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Step 3: Recreate trigger
-- ============================================
DROP TRIGGER IF EXISTS on_baby_created ON babies;

CREATE TRIGGER on_baby_created
  AFTER INSERT ON babies
  FOR EACH ROW
  EXECUTE FUNCTION add_creator_as_member();

-- ============================================
-- Explanation
-- ============================================
-- The trigger now:
-- 1. Uses 'mom' as the default role (valid per new constraint)
-- 2. Still adds creator automatically to baby_users
-- 3. SECURITY DEFINER ensures trigger has permission to insert
-- 4. User can change their role later in the UI if needed
--
-- Why 'mom' as default?
-- - Most likely the primary caregiver creates the baby
-- - Can be changed to 'dad' or 'other' after creation
-- - All roles have equal permissions anyway (just labels)
