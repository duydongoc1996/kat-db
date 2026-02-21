-- ============================================
-- Enable User Listing for Invite Feature
-- ============================================
-- This allows the app to list all authenticated users
-- so you can invite them to manage babies

-- ============================================
-- Option 1: Create a view of users (Recommended)
-- ============================================
-- Create a simplified view of auth.users for inviting
CREATE OR REPLACE VIEW public_users AS
SELECT 
  id,
  email,
  raw_user_meta_data->>'full_name' as full_name,
  raw_user_meta_data->>'avatar_url' as avatar_url,
  created_at
FROM auth.users
ORDER BY created_at DESC;

-- Enable RLS on the view
ALTER VIEW public_users SET (security_invoker = on);

-- Anyone authenticated can view all users (for invite dropdown)
-- Note: This is safe because we're only exposing email and name, not sensitive data

-- ============================================
-- Option 2: Create a server function (Recommended)
-- ============================================
-- Function to get all users for invite dropdown
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
-- Verification
-- ============================================
-- Test the function:
-- SELECT * FROM get_all_users();
-- Should return all registered users

-- Test the view:
-- SELECT * FROM public_users;
-- Should also return all users

-- ============================================
-- Usage in App
-- ============================================
-- Use the function in your React app:
-- const { data } = await supabase.rpc('get_all_users');
--
-- Or use the view:
-- const { data } = await supabase.from('public_users').select('*');
