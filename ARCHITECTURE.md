# 🏗️ Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER DEVICES                         │
│  📱 Mobile Phone  💻 Tablet  🖥️ Desktop  (Any Browser)   │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTPS
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    VERCEL (Hosting)                         │
│  • Serves static React app (HTML/CSS/JS)                   │
│  • Global CDN for fast loading                             │
│  • Free SSL certificate                                    │
│  • Environment variable management                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   REACT APPLICATION                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Components                                          │  │
│  │  • Layout (Navigation + Header)                      │  │
│  │  • LanguageSelector (ENG/VI switcher)              │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Pages                                               │  │
│  │  • FormPage (Record metrics)                        │  │
│  │  • AnalyticsPage (View charts & stats)             │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Libraries                                           │  │
│  │  • React Router (routing)                           │  │
│  │  • i18next (translations)                           │  │
│  │  • Recharts (charts)                                │  │
│  │  • Supabase Client (API)                            │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │ REST API
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  SUPABASE (Backend)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  PostgreSQL Database                                 │  │
│  │  ┌───────────────────────────────────────────────┐  │  │
│  │  │  metrics table                                │  │  │
│  │  │  • id (UUID, Primary Key)                     │  │  │
│  │  │  • input_type (VARCHAR) - metric type         │  │  │
│  │  │  • value (DECIMAL) - numeric value            │  │  │
│  │  │  • note (TEXT) - optional note                │  │  │
│  │  │  • recorded_at (TIMESTAMP) - when recorded    │  │  │
│  │  │  • created_at (TIMESTAMP) - when created      │  │  │
│  │  └───────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  REST API                                            │  │
│  │  • Auto-generated from database schema              │  │
│  │  • Row Level Security (RLS) enabled                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### Recording a Metric

```
User Input → Form Validation → Supabase API → Database → Success Message
   ↓
[Mom selects "Milk Consumed" + enters "100ml"]
   ↓
[FormPage validates input]
   ↓
[POST to Supabase /metrics endpoint]
   ↓
[Row inserted with timestamp]
   ↓
[Success message shown + form cleared]
```

### Viewing Analytics

```
User Selection → Query Builder → Supabase API → Database → Chart Render
   ↓
[Mom selects metric + time range]
   ↓
[AnalyticsPage builds query with filters]
   ↓
[GET from Supabase /metrics endpoint with WHERE clause]
   ↓
[Matching rows returned]
   ↓
[Data formatted for Recharts]
   ↓
[Line/Bar chart displayed]
```

## Component Hierarchy

```
App (Router)
│
├── Layout
│   ├── Header
│   │   ├── Title "👶 Kat's Tracker"
│   │   └── LanguageSelector
│   │       ├── [ENG] button
│   │       └── [VI] button
│   │
│   └── Navigation
│       ├── [📝 Form] link
│       └── [📊 Analytics] link
│
├── Route: "/" → FormPage
│   ├── Metric Type Dropdown
│   ├── Value Input (number)
│   ├── Note Textarea
│   ├── Submit Button
│   └── Message Display (success/error)
│
└── Route: "/analytics" → AnalyticsPage
    ├── Metric Selector Dropdown
    ├── Chart Type Buttons (Line/Bar)
    ├── Time Range Buttons (24h/7d/30d/all)
    ├── Today's Summary Card
    │   ├── Total
    │   ├── Average
    │   └── Record Count
    └── Chart Display (Recharts)
        ├── Line Chart or
        └── Bar Chart
```

## Technology Integration

```
┌─────────────────────────────────────────────────────────┐
│  FRONTEND (React)                                       │
│  ┌───────────────────────────────────────────────────┐ │
│  │  Vite                                             │ │
│  │  • Dev server with HMR                            │ │
│  │  • Production builds                              │ │
│  │  • Asset optimization                             │ │
│  └───────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────┐ │
│  │  Tailwind CSS                                     │ │
│  │  • Utility-first styling                          │ │
│  │  • Responsive design                              │ │
│  │  • Custom theme colors                            │ │
│  └───────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────┐ │
│  │  React Router                                     │ │
│  │  • Client-side routing                            │ │
│  │  • No page reloads                                │ │
│  └───────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────┐ │
│  │  i18next                                          │ │
│  │  • English translations                           │ │
│  │  • Vietnamese translations                        │ │
│  │  • Persistent language preference                 │ │
│  └───────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────┐ │
│  │  Recharts                                         │ │
│  │  • Line charts                                    │ │
│  │  • Bar charts                                     │ │
│  │  • Responsive containers                          │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## API Communication

### Supabase Client Calls

**Insert Record (FormPage.jsx)**:
```javascript
supabase
  .from('metrics')
  .insert([{
    input_type: 'milk_consumed',
    value: 100,
    note: 'After nap'
  }])
```

**Query Records (AnalyticsPage.jsx)**:
```javascript
supabase
  .from('metrics')
  .select('*')
  .eq('input_type', 'milk_consumed')
  .gte('recorded_at', '2024-02-14T00:00:00')
  .order('recorded_at', { ascending: true })
```

## Security Model

```
┌────────────────────────────────────────────┐
│  Environment Variables (Never in Code)    │
│  • VITE_SUPABASE_URL                      │
│  • VITE_SUPABASE_ANON_KEY                 │
└────────────┬───────────────────────────────┘
             │ Injected at build time
             ▼
┌────────────────────────────────────────────┐
│  Supabase Client (Authenticated)          │
└────────────┬───────────────────────────────┘
             │ HTTPS with API key
             ▼
┌────────────────────────────────────────────┐
│  Row Level Security (RLS)                 │
│  • Policy: Allow all (personal app)       │
│  • Can be restricted later if needed      │
└────────────────────────────────────────────┘
```

## Deployment Pipeline

```
Local Development
    ↓ git push
GitHub Repository
    ↓ webhook trigger
Vercel Build Server
    ↓ npm install
    ↓ npm run build
    ↓ optimize assets
Build Output (dist/)
    ↓ deploy
Vercel CDN (Global)
    ↓ serve
End Users (Worldwide)
```

## State Management

```
┌─────────────────────────────────────────┐
│  React useState (Local Component State)│
│  • Form inputs (inputType, value, note)│
│  • Loading states                      │
│  • Error/success messages              │
│  • Chart selections                    │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  LocalStorage (Persistent)             │
│  • Language preference                 │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Supabase (Database - Source of Truth) │
│  • All metric records                  │
│  • Queried on-demand                   │
└─────────────────────────────────────────┘
```

## Performance Characteristics

- **Initial Load**: ~1-2 seconds (CDN cached)
- **Form Submission**: ~200-500ms (API call)
- **Analytics Query**: ~300-800ms (depends on data size)
- **Chart Render**: ~100-200ms (client-side)
- **Language Switch**: Instant (no reload)

## Scalability Notes

**Current Setup** (suitable for):
- ✅ Single family use
- ✅ ~100 records/day
- ✅ ~3,000 records/month
- ✅ Years of data storage

**If Scaling Needed**:
- Add authentication (Supabase Auth)
- Implement data pagination
- Add caching layer (React Query)
- Use database indexes (already implemented)
- Enable service workers for offline support

## File Size Budget

- **HTML**: ~0.5 KB
- **CSS**: ~15 KB (Tailwind)
- **JavaScript**: ~823 KB (includes React, Router, Charts)
  - React: ~130 KB
  - Recharts: ~400 KB
  - Other libraries: ~293 KB

**Total First Load**: ~850 KB (reasonable for modern web)

## Browser Compatibility

- ✅ Chrome (mobile & desktop)
- ✅ Safari (iOS & macOS)
- ✅ Firefox
- ✅ Edge
- ✅ Samsung Internet
- ✅ Any modern browser (2020+)

Requires:
- ES6+ JavaScript support
- Fetch API
- LocalStorage

## Development vs Production

| Aspect | Development | Production |
|--------|-------------|------------|
| Build Tool | Vite dev server | Vite build |
| Hot Reload | ✅ Yes | ❌ No |
| Source Maps | ✅ Yes | ❌ No |
| Minification | ❌ No | ✅ Yes |
| Code Splitting | ❌ No | ✅ Yes |
| Asset Optimization | ❌ No | ✅ Yes |
| Environment | .env file | Vercel vars |

---

This architecture provides:
- 🚀 Fast performance
- 💰 Zero cost
- 📱 Mobile-first
- 🔒 Secure
- 📈 Scalable
- 🛠️ Easy to maintain
