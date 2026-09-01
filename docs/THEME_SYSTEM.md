# 🎨 THEME SYSTEM IMPLEMENTATION & EXTENSION MANUAL

> **Repository:** `aruna-undangan`  
> **Status:** Active & Standardized  
> **Core Principle:** Standardized Contract, Unlimited Creative Expression  

---

## 🌟 1. CORE VS THEME ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│                        CORE SYSTEM                          │
│ ├── Unified Data Models (`bride`, `groom`, `events`, etc.) │
│ ├── Business Logic & Dynamic Event Pricing                  │
│ ├── Database Persistence & Firebase Security Rules          │
│ ├── Routing & Lazy-Loaded Code Splitting                    │
│ └── API Endpoints & Anti-Tampering Handlers                 │
└──────────────────────────────┬──────────────────────────────┘
                               │ Provides standard data & APIs
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                        THEME SYSTEM                         │
│ ├── Isolated Layouts (`src/invitation/`)                   │
│ ├── Unique Storytelling, Narrative, & Chapters              │
│ ├── Bespoke Interactivity (Curtain Intros, Timelines, etc.) │
│ ├── Scoped Styling (`.cm-`, `.rb-`, `.jb-`, `.gz-`)        │
│ └── Dynamic Theme Manifests & Schema Validation             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📜 2. THEME MANIFEST CONTRACT

Every theme is defined by a validated manifest via `validateThemeManifest()` in `src/invitation/themeContract.js`:

```javascript
{
  id: 'cinematic-minimal',           // Unique string identifier
  name: 'Cinematic Editorial',      // Display name in catalog
  tag: 'Premium',                   // Badge label ('Premium', 'Reference', 'Bespoke')
  tags: ['editorial', 'dark-mode'], // Search filter tags
  layout: 'cinematic-minimal',       // Layout dispatch key
  cover: '/themes/cover.jpg',        // Card preview image
  opener: 'AN EDITORIAL BY',        // Header kicker
  fonts: {
    display: '"Playfair Display", serif',
    script: '"Alex Brush", cursive',
    body: '"Plus Jakarta Sans", sans-serif'
  },
  colors: {
    bg: '#0D1117',
    paper: '#161B22',
    fg: '#F0F6FC',
    muted: '#8B949E',
    accent: '#D4AF37',
    accentSoft: '#21262D',
    cover: '#05070A'
  }
}
```

---

## 🚀 3. HOW TO IMPLEMENT A BESPOKE THEME (4 STEPS)

### Step 1: Create Component in `src/invitation/Theme[Name].jsx`
```jsx
import React from 'react'
import { safeUrl, formatLongDate } from '../lib/utils'
import { addRsvp, addWish } from '../lib/api'
import './Theme[Name].css'

export default function ThemeCustom({ data, guest, preview, theme }) {
  // Use data.bride, data.groom, data.events, etc.
  return (
    <div className="tc-root">
      {/* Custom storytelling & layout */}
    </div>
  )
}
```

### Step 2: Create Scoped CSS in `src/invitation/Theme[Name].css`
Prefix all classes with a theme identifier (e.g. `.tc-`):
```css
.tc-root {
  background: #0f172a;
  color: #f8fafc;
}
.tc-headline {
  font-size: 2.5rem;
}
```

### Step 3: Register in `src/data/themes.js`
Add the manifest to the `themes` array.

### Step 4: Register in the Theme Registry (`src/invitation/Invitation.jsx`)
```jsx
import ThemeCustom from './ThemeCustom'
import { registerThemeComponent } from './themeRegistry'

// Top-level, sekali saja:
registerThemeComponent('custom-id', ThemeCustom)
```
Dispatch otomatis via `getThemeComponent(theme.layout)` di `Invitation.jsx` — JANGAN menambah if-chain `if (theme.layout === ...)`.

---

## 🛡️ 4. THEME CREATIVE INTEGRITY RULES

1. **Freedom of Structure:** Themes are free to reorder sections, use full-screen intros, horizontal timelines, or chapter tabs.
2. **Safe Link Protocol:** All external `<a>` tags must wrap URLs with `safeUrl(url)`.
3. **No Schema Alteration:** Themes must read standard fields without creating conflicting database keys.
