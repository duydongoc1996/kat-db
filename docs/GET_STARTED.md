# 🎉 Welcome to Kat's Baby Tracker!

## What is This?

A beautiful, easy-to-use mobile web app for tracking Kat's daily metrics like feeding, sleep, weight, and diapers. View analytics with interactive charts and multi-language support (English/Vietnamese).

## ⚡ Quick Setup (5 Minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Supabase Database

1. **Create Account**: Go to [supabase.com](https://supabase.com) → Sign up (free)
2. **Create Project**: Click "New Project" → Wait 2 minutes
3. **Run Schema**: 
   - Open SQL Editor tab
   - Copy everything from `SUPABASE_SCHEMA.sql`
   - Paste and run
4. **Enable Google OAuth**: 
   - Follow detailed instructions in `AUTH_SETUP.md`
   - Required for user authentication
5. **Get Keys**: Settings → API → Copy:
   - Project URL
   - Anon/Public Key

### Step 3: Add Your Keys

Open `.env` file and paste your keys:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### Step 4: Run the App
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) - Done! 🎉

## 📱 Use on Mobile

1. Get your computer's IP address:
   - Mac: System Settings → Network
   - Windows: Run `ipconfig`
2. On your phone: `http://192.168.x.x:5173`
3. Add to home screen for app-like experience

## 🚀 Deploy to Production (Free)

### Deploy to Vercel (Recommended)

```bash
# Push to GitHub first
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_URL
git push -u origin main

# Then go to vercel.com
# Click Import → Select your repo → Add env vars → Deploy
```

**See `DEPLOYMENT.md` for detailed step-by-step instructions with screenshots.**

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `GET_STARTED.md` | This file - quick overview |
| `AUTH_SETUP.md` | **Authentication setup guide** ⭐ |
| `QUICKSTART.md` | Local development setup |
| `DEPLOYMENT.md` | Complete deployment guide |
| `FEATURES.md` | Feature documentation & tips |
| `PROJECT_SUMMARY.md` | Technical overview |
| `README.md` | Full documentation |
| `SUPABASE_SCHEMA.sql` | Database schema with RLS |

## 🎯 Key Features

- 🔐 **Secure Google Authentication**
- ✅ Record 9 different baby metrics
- ✅ View data in beautiful charts (line/bar)
- ✅ Today's summary statistics
- ✅ Time range filters (24h, 7d, 30d, all)
- ✅ English & Vietnamese languages
- ✅ Mobile-optimized design
- ✅ Cloud sync via Supabase
- ✅ Row Level Security - users only see their own data
- ✅ Free hosting on Vercel

## 📊 Metrics You Can Track

1. Milk Produced (ml)
2. Milk Consumed (ml)
3. Weight (grams)
4. Wet Diapers (count)
5. Dirty Diapers (count)
6. Sleep Duration (minutes)
7. Feeding Duration (minutes)
8. Temperature (°C)
9. Formula (ml)

## 🛠️ Built With

- React 19 + Vite (fast & modern)
- Tailwind CSS (beautiful styling)
- Supabase (database + API)
- Recharts (interactive charts)
- 100% free to run!

## 💡 Usage Tips

**For Mom**:
- Record data right after events (while you remember)
- Check "Today's Summary" each evening
- Use charts to spot patterns
- Add notes for important details

**For Analytics**:
- Start with "Last 7 Days" view
- Switch to "Last 24 Hours" to see hourly patterns
- Compare metrics week-over-week
- Don't stress over single outliers - look for trends

## ❓ Need Help?

- **Can't save data?** → Check internet connection & Supabase keys
- **Charts not showing?** → Make sure you've recorded data first
- **Want to customize?** → All code is well-commented and easy to modify
- **Deployment issues?** → See troubleshooting section in `DEPLOYMENT.md`

## 🎨 Customization Ideas

Want to personalize the app?

- **Colors**: Edit Tailwind classes in components (change `blue-500` to `pink-500`)
- **Metrics**: Add new ones in `src/constants/metrics.js` and translations in `src/i18n/config.js`
- **Languages**: Add more languages in `src/i18n/config.js`
- **Features**: Check `FEATURES.md` for future enhancement ideas

## 🌟 What's Next?

1. ✅ Get it running locally
2. ✅ Test recording some metrics
3. ✅ Check the analytics
4. ✅ Deploy to Vercel
5. ✅ Share with mom
6. 💕 Track Kat's growth!

---

**Made with ❤️ for Kat and her mom**

If you found this useful, consider sharing with other parents!

## Quick Command Reference

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Run linter

# Git
git add .
git commit -m "message"
git push

# Vercel (after installing: npm i -g vercel)
vercel                  # Deploy
vercel --prod          # Deploy to production
```

Happy tracking! 👶📊💕
