# 🔧 RLS Infinite Recursion Fix

## Problem

You encountered this error:
```
"message": "infinite recursion detected in policy for relation \"baby_users\""
```

## Root Cause

The original `baby_users` INSERT policy had a **circular dependency**:

```sql
-- PROBLEMATIC CODE:
CREATE POLICY "Owners and admins can add users" ON baby_users
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM baby_users  -- ← Checking baby_users...
      WHERE baby_users.baby_id = baby_users.baby_id
      AND baby_users.user_id = auth.uid()
      AND baby_users.role IN ('owner', 'admin')
    )
  );
```

**What happens:**
1. User tries to INSERT into `baby_users`
2. Policy checks: "Is user owner/admin?" by querying `baby_users`
3. That query triggers the same policy again
4. Step 2 repeats → **Infinite recursion!**

## Solution

Use a **SECURITY DEFINER function** to break the recursion:

```sql
-- Create helper function (runs with elevated privileges)
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

-- New policy without recursion
CREATE POLICY "Users can add members to their babies" ON baby_users
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid()  -- Allow adding yourself
    OR is_baby_owner_or_admin(baby_id, auth.uid())  -- OR if owner/admin
  );
```

## Why This Works

1. **SECURITY DEFINER**: Function runs with creator's privileges, bypassing RLS
2. **No recursion**: The function query doesn't trigger INSERT policy
3. **Two conditions**:
   - `user_id = auth.uid()` - Allows trigger to add creator as owner
   - `is_baby_owner_or_admin()` - Allows owners/admins to add others

## How to Fix Your Database

### Option 1: Run Fix Script (Recommended)

In Supabase SQL Editor:
```sql
-- Copy and paste FIX_RLS_POLICIES.sql
-- Run it
```

### Option 2: Manual Fix

```sql
-- 1. Drop bad policies
DROP POLICY IF EXISTS "Owners and admins can add users" ON baby_users;
DROP POLICY IF EXISTS "Owners and admins can remove users" ON baby_users;

-- 2. Create helper function
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

-- 3. Create new policies
CREATE POLICY "Users can add members to their babies" ON baby_users
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    OR is_baby_owner_or_admin(baby_id, auth.uid())
  );

CREATE POLICY "Owners and admins can remove members" ON baby_users
  FOR DELETE
  USING (
    is_baby_owner_or_admin(baby_id, auth.uid())
  );
```

## Verification

After applying the fix:

```sql
-- Should work without recursion error:
SELECT * FROM baby_users WHERE user_id = auth.uid();

-- Test in your app:
-- 1. Login
-- 2. Create a baby
-- 3. View babies list
-- Should see your baby(ies) without errors
```

## Why It Happened

The original migration script had this issue because:
1. It's a common RLS pitfall when policies reference their own table
2. The INSERT policy needed to check existing records
3. PostgreSQL detects the circular dependency and throws an error

## Prevention

When writing RLS policies:
- ❌ Avoid referencing the same table in INSERT/UPDATE policies
- ✅ Use SECURITY DEFINER functions for complex checks
- ✅ Keep policies simple when possible
- ✅ Test policies thoroughly before production

## Other Policies (These are fine)

The SELECT policy is OK because it doesn't cause recursion:
```sql
CREATE POLICY "Users can view baby members" ON baby_users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM baby_users bu  -- Uses alias, checks existing records
      WHERE bu.baby_id = baby_users.baby_id
      AND bu.user_id = auth.uid()
    )
  );
```

This works because:
- SELECT only reads existing data
- The subquery uses an alias (`bu`)
- No circular INSERT/UPDATE dependency

## Summary

✅ **Problem**: Circular dependency in baby_users INSERT policy  
✅ **Solution**: SECURITY DEFINER function to bypass RLS  
✅ **Fix**: Run `FIX_RLS_POLICIES.sql`  
✅ **Result**: No more infinite recursion errors  

---

**After applying fix, your app should work perfectly!** 🎉
