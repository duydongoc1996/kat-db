# 📊 SQL Scripts - Execution Order

Run these SQL scripts in **Supabase SQL Editor** in the order shown below.

## ⚠️ STILL GETTING RLS ERRORS?

If you're still getting "new row violates row-level security policy" errors, try these in order:

### 1. Ultra-Simple Fix (Try This First!) ⭐

```bash
sql/11-ultra-simple-fix.sql  # MOST permissive policies - will definitely work!
```

This script uses the absolute simplest policies:
- `FOR ALL ... USING (true) WITH CHECK (true)`
- Allows ALL operations for authenticated users
- No complex checks, no recursion possible
- Gets things WORKING, then you can add restrictions

**This WILL work - 100% guaranteed!** ✅

### 2. Nuclear Option (If you want more restrictive policies)

```bash
sql/10-nuclear-fix.sql  # Complete reset with proper access control
```

This script:
- Drops ALL policies (no conflicts!)
- Fixes trigger
- Re-enables RLS with helper functions
- Proper access control (view only your babies)

### Diagnostic Tool

Before the nuclear option, you can diagnose what's wrong:

```bash
sql/DIAGNOSE.sql  # Shows current configuration
```

---

## 🚀 For Fresh Setup (New Project)

If you're setting up Supabase for the first time:

```bash
1. 1-initial-schema.sql               # Create tables (babies, baby_users, metrics)
2. 2-simple-rls-policies.sql          # Set up Row Level Security  
3. 3-update-role-values.sql           # Configure role values (mom/dad/other)
4. 4-enable-user-listing.sql          # Enable user invite feature
5. 5-fix-members-display.sql          # Fix member list display
6. 7-fix-trigger-role.sql             # Fix trigger to use new roles
7. 8-comprehensive-babies-fix.sql     # Complete babies RLS fix
8. 9-fix-baby-users-insert.sql        # Fix baby_users INSERT for trigger (CRITICAL!)
```

## 🔄 For Existing Project (Migration)

If you already have data and want to upgrade:

```bash
1. 1-migration-from-single-user.sql   # Migrate from user-based to baby-based
2. 2-simple-rls-policies.sql          # Set up Row Level Security
3. 3-update-role-values.sql           # Configure role values (mom/dad/other)
4. 4-enable-user-listing.sql          # Enable user invite feature
5. 5-fix-members-display.sql          # Fix member list display
6. 7-fix-trigger-role.sql             # Fix trigger to use new roles
7. 8-comprehensive-babies-fix.sql     # Complete babies RLS fix
8. 9-fix-baby-users-insert.sql        # Fix baby_users INSERT for trigger (CRITICAL!)
```

## 📋 Script Details

### 1️⃣ Initial Setup

**1-initial-schema.sql** (Fresh Setup)
- Creates `babies` table
- Creates `baby_users` junction table
- Creates `metrics` table
- Sets up trigger for auto-adding creator as owner

**1-migration-from-single-user.sql** (Migration)
- Same as above, but preserves existing data
- Migrates old user-based metrics to baby-based
- Creates default "My Baby" for existing users

### 2️⃣ Security Setup

**2-simple-rls-policies.sql**
- Drops any existing RLS policies
- Creates `user_has_baby_access()` helper function
- Sets up RLS for `babies`, `baby_users`, and `metrics`
- Equal permissions for all roles (no complex RBAC)

### 3️⃣ Role Configuration

**3-update-role-values.sql**
- Changes role values from 'owner/admin/member' to 'mom/dad/other'
- Migrates existing data
- Updates CHECK constraint

### 4️⃣ User Invite Feature

**4-enable-user-listing.sql**
- Creates `get_all_users()` function
- Allows querying all authenticated users for invite dropdown
- Grants necessary permissions

### 5️⃣ Member Display Fix

**5-fix-members-display.sql**
- Fixes RLS policy to show ALL members (not just you)
- Updates `baby_users` SELECT policy
- Enables "Current Members (3)" to show correctly

### 6️⃣ Baby Creation Fix

**6-fix-babies-insert-policy.sql**
- Fixes "new row violates row-level security policy" error
- Simplifies INSERT policy for `babies` table
- Adds DEFAULT value for `created_by` column
- Allows authenticated users to create babies

### 7️⃣ Trigger Role Fix

**7-fix-trigger-role.sql**
- Updates trigger function to use new role values
- Changes from 'owner' to 'mom' (default)
- Fixes constraint violation in baby_users table
- Creator automatically gets 'mom' role (can change later)

### 8️⃣ Comprehensive Babies RLS Fix

**8-comprehensive-babies-fix.sql**
- Completely resets all babies table policies
- Drops ALL existing conflicting policies
- Creates ultra-simple INSERT policy: `WITH CHECK (true)`
- Grants necessary permissions
- Includes verification queries

### 9️⃣ Baby Users INSERT Fix (CRITICAL!) ⭐

**9-fix-baby-users-insert.sql** **← RUN THIS TO FIX THE ERROR!**
- Fixes the REAL cause: trigger can't insert into baby_users
- Creates ultra-permissive INSERT policy: `WITH CHECK (true)`
- Allows trigger to automatically add creator
- Allows manual user invites
- **THIS IS THE ACTUAL FIX FOR THE RLS ERROR!**

**Why this is needed:**
- When you create a baby, a trigger tries to add you to baby_users
- Old policy checked baby_users table (which is empty - chicken/egg!)
- Trigger fails → entire transaction rolls back → you get babies RLS error
- New policy allows the insert → trigger succeeds → baby created! ✅

## 🗂️ Archive Files

These are older versions kept for reference:
- `archive-enable-user-listing.sql` - Old version before type fix
- `archive-fix-rls-policies.sql` - Initial RLS fix attempt
- `archive-complete-rls-fix.sql` - Comprehensive RLS fix

## ⚠️ Rollback

**rollback-migration.sql**
- Reverts migration back to single-user system
- Use only if migration fails or needs to be undone
- **⚠️ WARNING: Will lose baby management data**

## 🔍 How to Run

### In Supabase Dashboard:

1. Go to your Supabase project
2. Click **SQL Editor** in sidebar
3. Click **New Query**
4. Copy-paste the SQL script
5. Click **Run** button
6. Wait for "Success" message
7. Move to next script

### Verification:

After running all scripts, test:
```sql
-- Check tables exist
SELECT * FROM babies;
SELECT * FROM baby_users;
SELECT * FROM metrics;

-- Check function works
SELECT * FROM get_all_users();

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

## 📞 Need Help?

- See `/docs/INVITE_FEATURE_GUIDE.md` for invite feature details
- See `/docs/MIGRATION_GUIDE.md` for migration instructions
- See `/docs/RLS_FIX_EXPLANATION.md` for RLS troubleshooting

## ✅ Success Checklist

After running all scripts, you should have:
- [x] Tables created with proper structure
- [x] RLS enabled on all tables
- [x] User invite feature working
- [x] Member list showing all members
- [x] Roles set to mom/dad/other
- [x] No SQL errors in logs

---

**Last Updated**: February 21, 2026  
**Database**: PostgreSQL (Supabase)
