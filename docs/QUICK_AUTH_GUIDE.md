# ⚡ Quick Authentication Setup

## TL;DR - 5 Steps to Enable Google Login

### 1️⃣ Google Cloud Console (5 min)

Visit: https://console.cloud.google.com

```
1. Create new project
2. Enable Google+ API
3. Create OAuth credentials:
   - Type: Web application
   - Authorized redirect URIs: 
     https://YOUR_PROJECT.supabase.co/auth/v1/callback
4. Copy Client ID & Client Secret
```

### 2️⃣ Supabase Dashboard (2 min)

Visit: https://supabase.com/dashboard

```
1. Go to Authentication → Providers
2. Enable Google
3. Paste:
   - Client ID (from Google)
   - Client Secret (from Google)
4. Copy the Callback URL shown
5. Save
```

### 3️⃣ Back to Google Cloud Console (1 min)

```
1. Add Supabase callback URL to "Authorized redirect URIs"
2. Add your app URL:
   - http://localhost:5173 (development)
   - https://your-app.vercel.app (production)
3. Save
```

### 4️⃣ Supabase URL Configuration (1 min)

```
1. Go to Authentication → URL Configuration
2. Site URL: http://localhost:5173 (or your domain)
3. Add Redirect URLs:
   - http://localhost:5173
   - https://your-app.vercel.app
4. Save
```

### 5️⃣ Run Database Migration (1 min)

```sql
-- In Supabase SQL Editor, run SUPABASE_SCHEMA.sql
-- This adds user_id column and enables RLS
```

## Test It

```bash
npm run dev
```

Visit http://localhost:5173 → Click "Sign in with Google" → Done! ✅

## Restrict Access (Optional)

### Only allow specific Gmail accounts:

Edit `src/contexts/AuthContext.jsx`, add after line 21:

```javascript
const ALLOWED_EMAILS = ['mom@gmail.com', 'dad@gmail.com'];

// In useEffect after getSession:
if (currentUser && !ALLOWED_EMAILS.includes(currentUser.email)) {
  await supabase.auth.signOut();
  alert('Email not authorized');
}
```

## Common Issues

| Problem | Solution |
|---------|----------|
| "Redirect URI mismatch" | URIs must match exactly in Google Console |
| Login redirects to blank page | Check Site URL in Supabase matches your URL |
| "Access blocked" error | Add your email to test users in Google Console |
| Data not saving | Run SUPABASE_SCHEMA.sql to add user_id column |

## Need More Details?

See **`AUTH_SETUP.md`** for the complete step-by-step guide with screenshots and troubleshooting.

---

**That's it! Your app is now secured with Google OAuth** 🔐
