-- ============================================
-- Fix get_all_users() Function Type Mismatch
-- ============================================
-- This fixes the "structure of query does not match function result type" error
-- The issue: email column is VARCHAR(255) in auth.users, not TEXT

-- ============================================
-- Drop the old function
-- ============================================
DROP FUNCTION IF EXISTS get_all_users();

-- ============================================
-- Create corrected function
-- ============================================
CREATE OR REPLACE FUNCTION get_all_users()
RETURNS TABLE (
  id UUID,
  email VARCHAR(255),
  full_name TEXT,
  avatar_url TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.email::VARCHAR(255),
    (u.raw_user_meta_data->>'full_name')::TEXT as full_name,
    (u.raw_user_meta_data->>'avatar_url')::TEXT as avatar_url
  FROM auth.users u
  ORDER BY u.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Grant permissions
-- ============================================
GRANT EXECUTE ON FUNCTION get_all_users() TO authenticated;

-- ============================================
-- Test the function
-- ============================================
-- Run this to verify it works:
-- SELECT * FROM get_all_users();
