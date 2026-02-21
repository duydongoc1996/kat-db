# 🔐 Authentication Setup Guide

This guide walks you through setting up Google OAuth authentication with Supabase for Kat's Baby Tracker.

## Overview

The app now requires users to sign in with their Google account. Only authorized Gmail accounts can access the app and view/submit data.

## Step 1: Enable Google OAuth in Supabase

### 1.1 Get Google OAuth Credentials

1. **Go to Google Cloud Console**
   - Visit [https://console.cloud.google.com](https://console.cloud.google.com)
   - Sign in with your Google account

2. **Create a New Project** (or select existing)
   - Click "Select a project" at the top
   - Click "New Project"
   - Name: `kat-baby-tracker` (or your preference)
   - Click "Create"

3. **Enable Google+ API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click on it and click "Enable"

4. **Create OAuth Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - If prompted, configure the OAuth consent screen:
     - User Type: External
     - App name: `Kat's Baby Tracker`
     - User support email: Your email
     - Developer contact: Your email
     - Save and continue through the steps
   
5. **Configure OAuth Client**
   - Application type: Web application
   - Name: `Kat Tracker Web`
   - Authorized JavaScript origins:
     - `http://localhost:5173` (for local development)
     - `https://your-app-name.vercel.app` (your production URL)
   - Authorized redirect URIs:
     - `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
     - (Get this from Supabase - see next step)
   - Click "Create"

6. **Copy Your Credentials**
   - You'll see your **Client ID** and **Client Secret**
   - Keep these safe - you'll need them in the next step

### 1.2 Configure Supabase Authentication

1. **Go to Your Supabase Dashboard**
   - Visit [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project

2. **Enable Google Provider**
   - Click "Authentication" in the left sidebar
   - Click "Providers"
   - Find "Google" and toggle it ON
   - Paste your Google OAuth credentials:
     - **Client ID**: From Google Cloud Console
     - **Client Secret**: From Google Cloud Console
   - Copy the **Callback URL** shown (format: `https://xxxxx.supabase.co/auth/v1/callback`)
   - Click "Save"

3. **Go Back to Google Cloud Console**
   - Add the Supabase callback URL to "Authorized redirect URIs"
   - Click "Save"

### 1.3 Configure Site URL

In Supabase Dashboard:
1. Go to "Authentication" → "URL Configuration"
2. Set **Site URL** to:
   - Local: `http://localhost:5173`
   - Production: `https://your-app-name.vercel.app`
3. Add **Redirect URLs**:
   - `http://localhost:5173`
   - `https://your-app-name.vercel.app`
4. Click "Save"

## Step 2: Update Database Schema

1. **Go to SQL Editor** in Supabase Dashboard

2. **Run the Updated Schema**
   - Open `SUPABASE_SCHEMA.sql` file
   - Copy the entire content
   - Paste into SQL Editor
   - Click "Run"

This will:
- Add `user_id` column to metrics table
- Enable Row Level Security (RLS)
- Create policies so users can only access their own data

## Step 3: Test Authentication

### 3.1 Test Locally

1. **Start the dev server**
   ```bash
   npm run dev
   ```

2. **Open the app**
   - Go to [http://localhost:5173](http://localhost:5173)
   - You should see the login page

3. **Sign in with Google**
   - Click "Sign in with Google"
   - You'll be redirected to Google login
   - Choose your Google account
   - Approve the permissions
   - You'll be redirected back to the app

4. **Verify access**
   - You should see the form page
   - Your email should appear in the header
   - Try recording a metric
   - Check that it saves successfully

### 3.2 Test on Production

1. **Deploy to Vercel** (see DEPLOYMENT.md)

2. **Update Google OAuth**
   - Add your Vercel URL to Google Cloud Console redirect URIs
   - Update Supabase Site URL to your Vercel URL

3. **Test login on production URL**

## Step 4: Restrict Access (Optional)

By default, any Google account can sign in. To restrict to specific Gmail accounts only:

### Option A: App-Level Whitelist (Simple)

Add this code to `src/contexts/AuthContext.jsx` after line 21:

```javascript
// Whitelist of allowed emails
const ALLOWED_EMAILS = [
  'mom@example.com',
  'dad@example.com',
  'grandma@example.com',
];

// In the useEffect after getting session:
useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    const currentUser = session?.user ?? null;
    
    // Check if email is in whitelist
    if (currentUser && !ALLOWED_EMAILS.includes(currentUser.email)) {
      supabase.auth.signOut();
      alert('Your email is not authorized to access this app');
      setUser(null);
    } else {
      setUser(currentUser);
    }
    
    setLoading(false);
  });
  // ... rest of the code
}, []);
```

### Option B: Database-Level Whitelist (Advanced)

1. **Create allowed_users table**:

```sql
CREATE TABLE allowed_users (
  email TEXT PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add allowed emails
INSERT INTO allowed_users (email) VALUES 
  ('mom@example.com'),
  ('dad@example.com');
```

2. **Add RLS policy**:

```sql
-- Only allow operations if user's email is in allowed_users
ALTER TABLE metrics ADD CONSTRAINT check_allowed_user 
  CHECK (
    EXISTS (
      SELECT 1 FROM allowed_users 
      WHERE email = (SELECT email FROM auth.users WHERE id = user_id)
    )
  );
```

### Option C: OAuth Consent Screen (Production Ready)

For production apps with strict access control:

1. Go to Google Cloud Console → OAuth consent screen
2. Keep app in "Testing" status
3. Add test users (only these emails can sign in):
   - Click "Add Users"
   - Enter the Gmail addresses you want to allow
   - Save

This is the most secure method as Google handles the restriction.

## Troubleshooting

### "Error signing in with Google"

**Check:**
- Google Client ID and Secret are correct in Supabase
- Callback URL is correctly set in Google Cloud Console
- Google+ API is enabled

### Redirect loop / "Redirect URI mismatch"

**Fix:**
- Verify redirect URIs match exactly in Google Cloud Console
- Check Site URL in Supabase matches your actual URL
- Clear browser cookies and try again

### "User not authorized" after successful login

**Check:**
- If using whitelist, verify email is in the allowed list
- Check browser console for error messages
- Verify RLS policies are correct in Supabase

### Data not saving after login

**Check:**
- Run the updated SQL schema with RLS policies
- Verify `user_id` column exists in metrics table
- Check that user is actually logged in (check header for email)
- Look at browser console for errors

## Security Best Practices

1. **Keep credentials secret**
   - Never commit Google Client Secret to Git
   - Use environment variables
   - Rotate secrets periodically

2. **Use HTTPS in production**
   - Vercel provides this automatically
   - Never use OAuth with HTTP in production

3. **Limit redirect URIs**
   - Only add URIs you actually use
   - Remove development URIs in production

4. **Monitor authentication logs**
   - Check Supabase → Authentication → Logs
   - Look for suspicious activity

5. **Regular updates**
   - Keep Supabase client library updated
   - Monitor Google OAuth deprecation notices

## Migration from Old Data

If you had data before adding authentication:

1. **Backup existing data**:
   ```sql
   -- In Supabase SQL Editor
   SELECT * FROM metrics;
   -- Export as CSV
   ```

2. **Option 1: Delete old data** (if not needed):
   ```sql
   DELETE FROM metrics WHERE user_id IS NULL;
   ```

3. **Option 2: Assign to a user** (if keeping):
   ```sql
   -- Get your user_id after signing in
   SELECT id FROM auth.users WHERE email = 'your-email@gmail.com';
   
   -- Update old records
   UPDATE metrics 
   SET user_id = 'your-user-id-here' 
   WHERE user_id IS NULL;
   ```

## Testing Checklist

Before going live:

- [ ] Google OAuth credentials configured
- [ ] Supabase authentication provider enabled
- [ ] Database schema updated with RLS
- [ ] Can sign in with Google locally
- [ ] Can record metrics after signing in
- [ ] Can view analytics with own data
- [ ] Sign out button works
- [ ] Production URLs configured
- [ ] Can sign in on production
- [ ] Only authorized emails can access (if whitelist enabled)

## Support

If you encounter issues:
1. Check browser console for errors
2. Check Supabase logs (Authentication → Logs)
3. Verify all URLs match exactly
4. Try in incognito mode to rule out cache issues

---

**Security Note**: This setup provides secure, production-ready authentication. Users can only see and modify their own data thanks to Row Level Security (RLS).
