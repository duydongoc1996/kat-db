# 🔄 Migration Guide: Multi-Baby Management

This guide explains how to safely migrate your production database to support multiple users managing multiple babies.

## 📋 Overview

The migration adds:
- **`babies` table**: Store baby information
- **`baby_users` table**: Many-to-many relationship (users ↔ babies)
- **`baby_id` column** to metrics table
- **New RLS policies**: Baby-based access control
- **Auto-migration**: Existing data preserved and linked

## ⚠️ Before You Start

1. **Backup your database** (Supabase does this automatically, but double-check)
2. **Test locally first** with your development database
3. **Read through the entire guide** before running any SQL
4. **Schedule during low-traffic time** (migration is fast but better safe)

## 🚀 Migration Steps

### Step 1: Review the Migration File

Open `MIGRATION_BABY_MANAGEMENT.sql` and read through it to understand what will happen.

**What it does:**
1. Creates `babies` and `baby_users` tables
2. Adds `baby_id` column to `metrics` (nullable initially)
3. For each existing user, creates a default baby named "My Baby"
4. Links all existing metrics to that default baby
5. Makes `baby_id` required
6. Updates RLS policies

**Data Safety:**
- ✅ NO data is deleted
- ✅ All existing metrics are preserved
- ✅ Each user gets their own baby automatically
- ✅ Users remain owners of their data

### Step 2: Run the Migration in Production

1. **Go to Supabase Dashboard** → Your Project
2. **Click "SQL Editor"** in the left sidebar
3. **Create a new query**
4. **Copy the entire contents** of `MIGRATION_BABY_MANAGEMENT.sql`
5. **Paste** into the SQL editor
6. **Review one more time**
7. **Click "Run"** or press `Cmd/Ctrl + Enter`

### Step 3: Verify the Migration

Run these queries to verify everything worked:

```sql
-- Check babies were created
SELECT COUNT(*) as baby_count FROM babies;
-- Should show at least 1 baby per user who had metrics

-- Check baby_users relationships
SELECT COUNT(*) as relationship_count FROM baby_users;
-- Should match the baby_count above

-- Check all metrics have baby_id
SELECT COUNT(*) as metrics_with_baby 
FROM metrics 
WHERE baby_id IS NOT NULL;
-- Should equal total number of metrics

-- Check no orphaned metrics
SELECT COUNT(*) as orphaned_metrics 
FROM metrics 
WHERE baby_id IS NULL;
-- Should be 0

-- View sample data
SELECT 
  b.name as baby_name,
  bu.role as user_role,
  u.email as user_email,
  COUNT(m.id) as metric_count
FROM babies b
JOIN baby_users bu ON b.id = bu.baby_id
JOIN auth.users u ON bu.user_id = u.id
LEFT JOIN metrics m ON b.id = m.baby_id
GROUP BY b.id, b.name, bu.role, u.email
ORDER BY b.created_at DESC;
```

### Step 4: Deploy Updated App Code

After the database migration succeeds:

1. **Commit and push** your code changes
2. **Vercel will auto-deploy** (or deploy manually)
3. **Test the live app**:
   - Login
   - Check that you see a baby (should be "My Baby")
   - Record a new metric
   - View analytics
   - Try creating a new baby

## 🎯 What Users Will See

### First Login After Migration

1. User logs in
2. App automatically selects their default baby ("My Baby")
3. All previous data appears normally
4. User can:
   - Continue using the app as before
   - Rename their baby in Baby Management page
   - Create additional babies
   - Invite other users (future feature)

### Changes in UI

- Baby selector appears in header
- New "Baby Management" page in navigation
- Metrics are filtered by selected baby
- No data loss - everything works as before

## 🔧 Troubleshooting

### Migration fails with "relation already exists"

**Cause**: Tables already exist from a previous migration attempt

**Solution**:
```sql
-- Check what exists
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- If babies and baby_users exist but are empty, drop them:
DROP TABLE IF EXISTS baby_users CASCADE;
DROP TABLE IF EXISTS babies CASCADE;

-- Then run the migration again
```

### Some metrics don't have baby_id

**Cause**: Migration script had an error during the data migration step

**Solution**:
```sql
-- Find affected users
SELECT DISTINCT user_id 
FROM metrics 
WHERE baby_id IS NULL;

-- For each user, manually create and link:
DO $$
DECLARE
  orphaned_user_id UUID := 'paste-user-id-here';
  new_baby_id UUID;
BEGIN
  INSERT INTO babies (name, created_by)
  VALUES ('My Baby', orphaned_user_id)
  RETURNING id INTO new_baby_id;
  
  INSERT INTO baby_users (baby_id, user_id, role, added_by)
  VALUES (new_baby_id, orphaned_user_id, 'owner', orphaned_user_id);
  
  UPDATE metrics 
  SET baby_id = new_baby_id 
  WHERE user_id = orphaned_user_id AND baby_id IS NULL;
END $$;
```

### App shows "No babies" after migration

**Cause**: BabyContext isn't loading properly or RLS policies blocking access

**Solution**:
```sql
-- Verify baby_users has correct data
SELECT * FROM baby_users WHERE user_id = auth.uid();

-- If empty, manually add yourself:
INSERT INTO baby_users (baby_id, user_id, role, added_by)
VALUES (
  (SELECT id FROM babies LIMIT 1),
  auth.uid(),
  'owner',
  auth.uid()
);
```

### RLS policies denying access

**Cause**: Policy syntax error or circular reference

**Solution**:
```sql
-- Temporarily disable RLS to test
ALTER TABLE babies DISABLE ROW LEVEL SECURITY;
ALTER TABLE baby_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE metrics DISABLE ROW LEVEL SECURITY;

-- Test if app works now
-- If yes, review and fix the policies
-- Don't forget to re-enable RLS!
```

## 🔄 Rollback

If something goes wrong, you can rollback:

1. **Run** `ROLLBACK_MIGRATION.sql`
2. **Revert** code changes in your repository
3. **Redeploy** the previous version

**Note**: Rollback preserves your metrics data but removes babies/baby_users tables.

## ✅ Post-Migration Checklist

After successful migration:

- [ ] All users can log in
- [ ] Users see their existing data
- [ ] New metrics can be created
- [ ] Analytics work correctly
- [ ] Baby selector appears in header
- [ ] Baby Management page is accessible
- [ ] No console errors in browser
- [ ] No errors in Supabase logs

## 📊 Migration Impact

**Downtime**: ~0 seconds (migration runs in < 1 second for typical data volumes)

**Performance Impact**: 
- Queries remain fast (indexes added)
- Slightly more complex RLS checks (negligible)

**Data Volume**:
- For 1000 existing metrics: Creates 1-10 babies, 1-10 baby_users rows
- Minimal storage increase

## 🎓 Understanding the New Schema

### Before (User-based)
```
User → Metrics (user owns metrics directly)
```

### After (Baby-based)
```
User → Baby_Users → Baby → Metrics
(user can access multiple babies, each baby has multiple metrics)
```

### Benefits
- Multiple users can manage the same baby
- One user can manage multiple babies (twins, siblings)
- Better data organization
- Easier to share access (invite grandparents, babysitters)

## 📝 Next Steps

After successful migration:

1. **Update documentation** for users about the new baby management feature
2. **Consider adding** baby invitation feature (allow users to invite others)
3. **Add baby photos** and more metadata fields
4. **Create baby switching UI** improvements

## 🆘 Need Help?

If migration fails or you encounter issues:

1. Check Supabase logs (Dashboard → Database → Logs)
2. Run verification queries above
3. Check browser console for errors
4. Review `ROLLBACK_MIGRATION.sql` if needed

---

**Remember**: Always test migrations in development first! 🧪
