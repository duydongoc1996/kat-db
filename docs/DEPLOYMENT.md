# 🚀 Deployment Guide for Kat's Baby Tracker

This guide will walk you through deploying your baby tracking app to Vercel (free tier).

## Prerequisites

- A GitHub account
- A Supabase account (free tier)
- A Vercel account (free tier)

## Step 1: Set Up Supabase Database

1. **Create a Supabase Project**
   - Go to [https://supabase.com](https://supabase.com)
   - Click "Start your project"
   - Sign in with GitHub (recommended)
   - Click "New Project"
   - Fill in:
     - Project name: `kat-tracker` (or any name you prefer)
     - Database password: Choose a strong password
     - Region: Select the closest to your location
   - Click "Create new project" (this takes ~2 minutes)

2. **Create the Database Schema**
   - Once your project is ready, click on the "SQL Editor" tab in the left sidebar
   - Click "New query"
   - Copy the entire content from `SUPABASE_SCHEMA.sql` file
   - Paste it into the SQL editor
   - Click "Run" or press `Cmd/Ctrl + Enter`
   - You should see "Success. No rows returned"

3. **Get Your API Keys**
   - Click on the "Settings" icon (gear icon) in the left sidebar
   - Click "API" under Project Settings
   - You'll need two values:
     - **Project URL**: Copy the URL under "Project URL"
     - **Anon/Public Key**: Copy the key under "Project API keys" → "anon public"
   - Save these somewhere safe (you'll need them in Step 3)

## Step 2: Push Code to GitHub

1. **Initialize Git Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Kat's Baby Tracker"
   ```

2. **Create a New GitHub Repository**
   - Go to [https://github.com/new](https://github.com/new)
   - Repository name: `kat-baby-tracker` (or any name you prefer)
   - Make it Private (recommended since it's a personal app)
   - Don't initialize with README (we already have one)
   - Click "Create repository"

3. **Push Your Code**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/kat-baby-tracker.git
   git branch -M main
   git push -u origin main
   ```

## Step 3: Deploy to Vercel

1. **Connect to Vercel**
   - Go to [https://vercel.com](https://vercel.com)
   - Click "Sign Up" or "Login"
   - Sign up with your GitHub account (easiest option)
   - Authorize Vercel to access your GitHub

2. **Import Your Project**
   - Click "Add New..." → "Project"
   - You'll see a list of your GitHub repositories
   - Find `kat-baby-tracker` (or whatever you named it)
   - Click "Import"

3. **Configure Project**
   - Project Name: `kat-baby-tracker` (or customize it)
   - Framework Preset: Vite (should be auto-detected)
   - Root Directory: `./` (leave as is)
   - Build Command: `npm run build` (should be auto-filled)
   - Output Directory: `dist` (should be auto-filled)

4. **Add Environment Variables**
   This is the most important step!
   
   - Click on "Environment Variables" section
   - Add the following variables:

   **Variable 1:**
   - Name: `VITE_SUPABASE_URL`
   - Value: Paste the Project URL from Step 1
   - Click "Add"

   **Variable 2:**
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: Paste the Anon/Public Key from Step 1
   - Click "Add"

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (~1-2 minutes)
   - You'll see a success message with confetti 🎉

6. **Visit Your App**
   - Click "Visit" or go to the URL shown (e.g., `kat-baby-tracker.vercel.app`)
   - Your app is now live! 🚀

## Step 4: Test Your App

1. **Open the app on your phone**
   - Visit the Vercel URL on your mobile browser
   - Add it to your home screen:
     - **iOS Safari**: Tap Share → Add to Home Screen
     - **Android Chrome**: Tap Menu → Add to Home screen

2. **Test the form**
   - Select a metric (e.g., "Milk Consumed")
   - Enter a value (e.g., 100)
   - Add a note (optional)
   - Click "Save Record"
   - You should see a success message

3. **Check the analytics**
   - Tap on the "Analytics" tab
   - Select the same metric you just recorded
   - You should see your data point in the chart
   - Check "Today's Summary" for the totals

## Step 5: Share with Mom

1. **Get the URL**
   - Your app URL is: `https://YOUR_PROJECT_NAME.vercel.app`
   - Example: `https://kat-baby-tracker.vercel.app`

2. **Share it**
   - Send the URL via text, email, or messaging app
   - Mom can open it on her phone and add it to her home screen

## Updating the App

Whenever you make changes to the code:

```bash
git add .
git commit -m "Description of changes"
git push
```

Vercel will automatically detect the changes and redeploy your app (usually takes 1-2 minutes).

## Troubleshooting

### "Failed to save record"
- Check that your Supabase environment variables are correct in Vercel
- Go to Vercel Dashboard → Your Project → Settings → Environment Variables
- Make sure the values match your Supabase project

### Data not showing in Analytics
- Make sure you've recorded some data first
- Check that the metric type matches between form and analytics
- Open browser console (F12) to see any error messages

### Vercel build fails
- Check the build logs in Vercel dashboard
- Make sure all dependencies are listed in `package.json`
- Try building locally first: `npm run build`

## Alternative Free Hosting Options

If you prefer not to use Vercel, here are alternatives:

### Netlify
1. Go to [https://netlify.com](https://netlify.com)
2. Connect your GitHub repo
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variables in Site Settings → Environment Variables

### Cloudflare Pages
1. Go to [https://pages.cloudflare.com](https://pages.cloudflare.com)
2. Connect your GitHub repo
3. Build command: `npm run build`
4. Build output directory: `dist`
5. Add environment variables in Settings → Environment Variables

## Data Management

### Viewing Data Directly in Supabase
1. Go to your Supabase dashboard
2. Click "Table Editor" in the left sidebar
3. Click on the `metrics` table
4. You can view, edit, or delete records here

### Backing Up Data
1. Go to Supabase → Table Editor → `metrics`
2. Click "..." menu → "Export as CSV"
3. Save the file to your computer

### Clearing All Data
1. Go to Supabase → SQL Editor
2. Run: `DELETE FROM metrics;`
3. This will remove all records (be careful!)

## Support

If you encounter any issues:
1. Check the browser console for errors (F12 → Console tab)
2. Check Vercel deployment logs
3. Check Supabase logs (Database → Logs)

Enjoy tracking Kat's growth! 👶💕
