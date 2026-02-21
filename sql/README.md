# 📊 SQL Scripts - Execution Order

Run these SQL scripts in **Supabase SQL Editor** in the order shown below.

## 🚀 For Fresh Setup (New Project)

If you're setting up Supabase for the first time:

```bash
1. 1-initial-schema.sql          # Create tables (babies, baby_users, metrics)
2. 2-simple-rls-policies.sql     # Set up Row Level Security
3. 3-update-role-values.sql      # Configure role values (mom/dad/other)
4. 4-enable-user-listing.sql     # Enable user invite feature
5. 5-fix-members-display.sql     # Fix member list display
```

## 🔄 For Existing Project (Migration)

If you already have data and want to upgrade:

```bash
1. 1-migration-from-single-user.sql  # Migrate from user-based to baby-based
2. 2-simple-rls-policies.sql         # Set up Row Level Security
3. 3-update-role-values.sql          # Configure role values (mom/dad/other)
4. 4-enable-user-listing.sql         # Enable user invite feature
5. 5-fix-members-display.sql         # Fix member list display
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
