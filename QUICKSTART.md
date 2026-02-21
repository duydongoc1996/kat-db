# 🚀 Quick Start Guide

Get Kat's Baby Tracker running locally in 5 minutes!

## Prerequisites

- Node.js (version 18 or higher)
- npm (comes with Node.js)

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase (5 minutes)

1. Go to [https://supabase.com](https://supabase.com) and create a free account
2. Create a new project (takes ~2 minutes to provision)
3. Go to SQL Editor and run the schema from `SUPABASE_SCHEMA.sql`
4. Go to Settings → API and copy:
   - Project URL
   - Anon/Public Key

### 3. Configure Environment

1. Open the `.env` file
2. Replace the placeholder values with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run the App

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser!

## Testing on Mobile

1. Make sure your phone and computer are on the same WiFi network
2. Find your computer's local IP address:
   - Mac: System Settings → Network → Your network → IP Address
   - Windows: Run `ipconfig` in command prompt, look for IPv4 Address
3. On your phone, visit: `http://YOUR_IP_ADDRESS:5173`
   Example: `http://192.168.1.100:5173`

## Next Steps

- Read `DEPLOYMENT.md` to deploy to Vercel (free)
- Check `README.md` for full documentation
- Start tracking Kat's metrics! 👶

## Common Issues

**"Module not found" error**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Port 5173 already in use**
```bash
# Vite will automatically use the next available port
# Or specify a different port:
npm run dev -- --port 3000
```

**Supabase connection error**
- Double-check your environment variables in `.env`
- Make sure the Supabase project is not paused (free tier pauses after 7 days of inactivity)
- Verify you ran the SQL schema

## What's Included

- ✅ Form to record baby metrics
- ✅ Analytics with interactive charts
- ✅ Multi-language support (English/Vietnamese)
- ✅ Mobile-responsive design
- ✅ Today's summary statistics

Enjoy! 💕
