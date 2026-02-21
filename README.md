# 👶 Kat's Baby Tracker

A mobile-friendly web application for tracking baby metrics like milk consumption, weight, diapers, and more. Built with React, Tailwind CSS, and Supabase.

## Features

- 🔐 **Secure Authentication**: Google OAuth login via Supabase
- 📝 **Record Metrics**: Easy-to-use form for logging various baby metrics
- 📊 **Analytics Dashboard**: Visualize data with interactive charts (line/bar)
- 🌐 **Multi-language Support**: English and Vietnamese
- 📱 **Mobile-Responsive**: Optimized for mobile devices
- ☁️ **Cloud-Based**: Data stored securely in Supabase
- 🔒 **Privacy**: Row Level Security ensures users only see their own data

## Metrics Tracked

- Milk Produced (ml)
- Milk Consumed (ml)
- Weight (grams)
- Wet Diapers (count)
- Dirty Diapers (count)
- Sleep Duration (minutes)
- Feeding Duration (minutes)
- Body Temperature (°C)
- Formula (ml)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd kat-db
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a free account at [Supabase](https://supabase.com)
2. Create a new project
3. Go to the SQL Editor and run the schema from `SUPABASE_SCHEMA.sql`
4. **Enable Google OAuth** - Follow `AUTH_SETUP.md` for detailed instructions
5. Get your project URL and anon key from Settings > API

### 4. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 5. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Deployment to Vercel

### Option 1: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Add your environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Click "Deploy"

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Add environment variables when prompted
# or add them in the Vercel dashboard
```

## Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Database & API**: Supabase
- **Routing**: React Router
- **Internationalization**: i18next
- **Hosting**: Vercel (recommended)

## Project Structure

```
kat-db/
├── src/
│   ├── components/
│   │   ├── Layout.jsx          # Main layout with navigation
│   │   ├── LanguageSelector.jsx # Language switcher
│   │   └── ProtectedRoute.jsx  # Auth route guard
│   ├── contexts/
│   │   └── AuthContext.jsx     # Authentication context
│   ├── pages/
│   │   ├── LoginPage.jsx       # Google OAuth login
│   │   ├── FormPage.jsx        # Metric input form
│   │   └── AnalyticsPage.jsx   # Charts and analytics
│   ├── lib/
│   │   └── supabase.js         # Supabase client
│   ├── i18n/
│   │   └── config.js           # i18n configuration
│   ├── constants/
│   │   └── metrics.js          # Metric types and units
│   ├── App.jsx                 # Main app component
│   └── main.jsx                # Entry point
├── AUTH_SETUP.md               # Google OAuth setup guide
├── SUPABASE_SCHEMA.sql         # Database schema with RLS
├── vercel.json                 # Vercel configuration
└── README.md
```

## Usage

### Recording Data

1. Select a metric type from the dropdown
2. Enter the value (unit is shown based on metric type)
3. Optionally add a note
4. Click "Save Record"

### Viewing Analytics

1. Navigate to the Analytics page
2. Select a metric to view
3. Choose chart type (line or bar)
4. Select time range (24 hours, 7 days, 30 days, or all time)
5. View today's summary for quick insights

### Changing Language

Click the language selector in the header to switch between English (ENG) and Vietnamese (VI).

## Alternative Free Hosting Options

While Vercel is recommended, you can also use:

- **Netlify**: Similar to Vercel, free tier available
- **Cloudflare Pages**: Fast and free
- **Firebase Hosting**: Part of Google's Firebase platform
- **Railway**: Great for full-stack apps

All of these platforms support React apps and environment variables.

## Support

For issues or questions, please open an issue in the GitHub repository.

## License

MIT
