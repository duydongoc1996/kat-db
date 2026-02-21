# 👶 Baby Metrics Tracker

A mobile-first web application for tracking baby metrics with multi-user support, built with React, Tailwind CSS, and Supabase.

## 📁 Project Structure

```
kat-db/
├── src/                    # Application source code
│   ├── components/         # React components
│   ├── contexts/          # Context providers (Auth, Baby)
│   ├── pages/             # Page components
│   ├── constants/         # Constants and configs
│   ├── i18n/             # Translations (EN/VI)
│   └── lib/              # Supabase client
│
├── sql/                   # Database scripts (run in order!)
│   ├── README.md         # SQL execution guide
│   ├── 1-*.sql          # Initial setup
│   ├── 2-*.sql          # RLS policies
│   ├── 3-*.sql          # Role configuration
│   ├── 4-*.sql          # User invite feature
│   └── 5-*.sql          # Member display fix
│
├── docs/                  # Documentation
│   ├── README.md         # Start here!
│   ├── QUICKSTART.md     # Quick setup guide
│   ├── DEPLOYMENT.md     # Deployment instructions
│   ├── FEATURES.md       # Feature documentation
│   └── ...               # More guides
│
├── dist/                  # Build output
├── public/               # Static assets
└── index.html           # Entry point
```

## 🚀 Quick Start

### 1. Setup Database
```bash
# Go to Supabase SQL Editor and run scripts in order:
sql/1-initial-schema.sql
sql/2-simple-rls-policies.sql
sql/3-update-role-values.sql
sql/4-enable-user-listing.sql
sql/5-fix-members-display.sql
```

See `/sql/README.md` for detailed instructions.

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

### 3. Install & Run
```bash
npm install
npm run dev
```

### 4. Deploy
```bash
npm run build
# Deploy to Vercel
```

## 📚 Documentation

- **[Quick Start Guide](docs/QUICKSTART.md)** - Get up and running fast
- **[Features](docs/FEATURES.md)** - All features explained
- **[Deployment](docs/DEPLOYMENT.md)** - Deploy to Vercel
- **[SQL Guide](sql/README.md)** - Database setup
- **[Invite Feature](docs/INVITE_FEATURE_GUIDE.md)** - Multi-user setup
- **[Full Docs Index](docs/DOCUMENTATION_INDEX.md)** - All documentation

## ✨ Features

✅ **Metric Tracking** - Record milk, weight, diapers, sleep, etc.  
✅ **Analytics** - Charts and summaries  
✅ **Multi-Baby** - Manage multiple babies  
✅ **Multi-User** - Invite mom, dad, caregivers  
✅ **Google Login** - Secure authentication  
✅ **Multi-Language** - English & Vietnamese  
✅ **Mobile-First** - Optimized for phones  
✅ **Historical Data** - Record past events  

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS v4
- **Backend**: Supabase (PostgreSQL + Auth + API)
- **Charts**: Recharts
- **i18n**: i18next + react-i18next
- **Routing**: React Router
- **Deployment**: Vercel

## 📖 Common Tasks

### Add a Baby
1. Go to Babies (Bé yêu) page
2. Click "Add Baby"
3. Enter name and birth date
4. Click "Create Baby"

### Invite Someone
1. Have them sign in with Google first
2. Go to Babies page
3. Click "Invite Users" on your baby
4. Select their email from dropdown
5. Choose role (Mom/Dad/Other)
6. Click "Invite User"

### Record Metrics
1. Select baby from header dropdown
2. Go to home page
3. Choose metric type
4. Enter value and optional note
5. Click "Record"

### View Analytics
1. Select baby from header
2. Go to Analytics page
3. Choose metric to view
4. Select chart type (line/bar)
5. Select time range

## 🌐 Language Support

Switch between English and Vietnamese using the "ENG | VI" buttons in the header.

## 🔒 Security

- Google OAuth authentication
- Row Level Security (RLS)
- User-based data isolation
- Baby-based access control

## 📱 Mobile App

Add to home screen for app-like experience:
- iOS: Safari → Share → Add to Home Screen
- Android: Chrome → Menu → Add to Home Screen

## 🤝 Contributing

This is a personal project, but feedback welcome!

## 📄 License

Private project - All rights reserved

## 🐛 Troubleshooting

See `/docs/` for specific guides:
- RLS issues → `RLS_FIX_EXPLANATION.md`
- Migration → `MIGRATION_GUIDE.md`
- Auth setup → `AUTH_SETUP.md`

## 📞 Support

Check the docs first! Most questions are answered in:
- `/docs/QUICKSTART.md`
- `/docs/INVITE_FEATURE_GUIDE.md`
- `/sql/README.md`

---

Made with ❤️ for tracking baby Kat's journey
