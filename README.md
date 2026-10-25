# Callisto Astronomy Club — Expedition Portal

> **A journey to the edge of wonder. Your mission begins here.**  
> The official web portal for Callisto Club — the collegiate astronomy, space robotics, and observational astrophysics collective of Chennai Institute of Technology (CIT).

---

## Overview

The **Callisto Expedition** website is an immersive, space-grade web experience designed with Astro 5 and interactive React 19 islands. Built as a deep-space vessel manifest, each club division represents an active module on the ship, leading stargazing expeditions, telescope clinics, exoplanet transit research, and space hackathons.

### Key Features
- **Act 0 Pre-Launch Loader**: Custom SVG arc drawing, starburst morphing, and typewriter telemetry initialization.
- **Dynamic Starfield Engine**: Multi-depth canvas starfield with organic drift, twinkling, and mouse parallax.
- **Live Launch Countdown**: Real-time telemetry countdown timers with launched state handling.
- **Dual Display Modes**: Toggle between Immersive Deep Space mode and clean Flat Mode.
- **Dynamic Routing**: Automatic static path generation for all 11 ship modules (`/crew/[department]`) and scheduled launch events (`/events/[slug]`).
- **Interactive Forms**: Client-validated Boarding Application (`/join`) and Signal Comms Relay (`/contact`).
- **Sol Day Telemetry**: Real-time Martian solar day counter synchronized with founding epochs.

---

## Tech Stack & Architecture

| Layer | Technology |
|---|---|
| **Framework** | [Astro 5](https://astro.build/) (Static Site Generation / Islands) |
| **UI Components** | React 19 (`@astrojs/react`) |
| **Language** | TypeScript (Strict Mode) |
| **Styling** | Scoped CSS with Global Custom Properties Design Tokens |
| **Typography** | Self-hosted `@fontsource` packages (*Cormorant Garamond*, *Inter*, *JetBrains Mono*) |
| **Deployment** | [Cloudflare Pages](https://pages.cloudflare.com/) via Wrangler |

---

## Design System

All components utilize the core Callisto chromatic design tokens:

```css
--void: #060919;        /* Darkest void background */
--deep: #0C1237;        /* Section cards & surface fill */
--navy: #14204F;        /* Mid-blue telemetry panels */
--steel: #4A5A7C;       /* Secondary text & orbital borders */
--dusk: #5B4B8A;        /* Interactive hover surfaces */
--orbit: #9C84D6;       /* Primary stellar accent & links */
--star: #CFCBF2;        /* Secondary highlights & button fills */
--moon: #F7F5FF;        /* Headings & primary typography */
--sol-dust: #C98A66;    /* Mars warmth & origin badge accent */
--astrophage: #FFB86B;  /* First-contact golden glow */
```

### Typography Hierarchy
- **Display**: `'Cormorant Garamond', Georgia, serif` — Hero titles, act headers, and section names.
- **Body**: `'Inter', sans-serif` — Prose descriptions, instructions, and form fields.
- **Mono**: `'JetBrains Mono', monospace` — Sol counters, timestamps, coordinates, and telemetry badges.

---

## Quickstart & Setup Guide

### 1. Prerequisites
Ensure you have the following installed on your local workstation:
- **Node.js**: `v18.20.0` or `>= v20.0.0` (LTS recommended)
- **Package Manager**: `npm` (v9+), `pnpm` (v8+), or `yarn` (v1.22+)
- **Git**: `>= 2.30`

Verify your Node version:
```bash
node -v
npm -v
```

---

### 2. Clone the Repository

```bash
git clone https://github.com/Vijajraj/Callisto_website.git
cd Callisto_website
```

---

### 3. Install Dependencies

Install all core dependencies including Astro, React, and self-hosted fonts:

```bash
npm install
```

*(Alternatively, run `pnpm install` or `yarn install`)*

---

### 4. Start the Local Development Server

Launch the Astro local development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

Once initialized, open your browser and navigate to:
```text
http://localhost:4321/
```

---

### 5. Build for Production

Compile optimized static HTML, CSS, JavaScript chunks, and asset bundles:

```bash
npm run build
```

The production output will be generated inside the `dist/` directory.

---

### 6. Preview the Production Build

Test the production bundle locally before deploying:

```bash
npm run preview
```

---

## Project Directory Structure

```text
callisto/
├── public/
│   ├── favicon.svg                # Celestial crescent guide star favicon
│   └── og-default.png             # OpenGraph social share card
├── src/
│   ├── assets/                    # Vector illustrations and badges
│   ├── components/                # Astro UI components
│   │   ├── DepartmentCard.astro   # Module manifest card
│   │   ├── EventCard.astro        # Mission launch card
│   │   ├── Footer.astro           # Global site footer & back-to-top
│   │   ├── Navigation.astro       # Responsive header with mobile menu
│   │   └── SectionHeading.astro   # Standardized section headings
│   ├── components/react/          # Interactive React Islands
│   │   ├── ContactForm.tsx        # Signal relay transmission form
│   │   ├── CrescentLoader.tsx     # Act 0 pre-launch animation overlay
│   │   ├── EventCountdown.tsx     # Precision launch countdown timer
│   │   ├── FlatModeToggle.tsx     # Immersive vs flat display toggle
│   │   ├── JoinForm.tsx           # Flight crew recruitment application
│   │   └── Starfield.tsx          # Multi-layer canvas background starfield
│   ├── data/                      # Structured content data
│   │   ├── departments.ts         # 11 ship modules and leadership data
│   │   └── events.ts              # Upcoming and past expedition logs
│   ├── layouts/
│   │   └── BaseLayout.astro       # Main HTML shell, SEO meta, navigation
│   ├── lib/
│   │   └── utils.ts               # Sol calculator, date formatters, slugify
│   ├── pages/                     # Application routes
│   │   ├── 404.astro              # Standalone 'Signal Lost' error page
│   │   ├── about.astro            # Mission briefing & club history
│   │   ├── avatar.astro           # Spacesuit fabricator preview
│   │   ├── contact.astro          # Comms relay & channels
│   │   ├── crew/
│   │   │   ├── [department].astro # Dynamic department detail dossier
│   │   │   └── index.astro        # Full ship crew manifest
│   │   ├── events/
│   │   │   ├── [slug].astro       # Dynamic event launch dossier
│   │   │   └── index.astro        # Launch schedule & archive
│   │   ├── expedition.astro       # Acts I–IV narrative odyssey
│   │   ├── gallery.astro          # Astrophotography visual log
│   │   ├── index.astro            # Home page & primary hero
│   │   ├── missions.astro         # Active research project directory
│   │   ├── observatory.astro      # Night sky ephemeris & APOD
│   │   └── join.astro             # Boarding application portal
│   └── styles/
│       ├── global.css             # Base resets, typography, and utility classes
│       └── tokens.css             # CSS custom properties and theme tokens
├── astro.config.mjs               # Astro configuration
├── package.json                   # Project dependencies and run scripts
├── tsconfig.json                  # TypeScript strict compiler options
└── wrangler.toml                  # Cloudflare Pages deployment configuration
```

---

## Pages & Route Manifest

| Path | Description | Key Components |
|---|---|---|
| `/` | Expedition Gateway | `Starfield`, `CrescentLoader`, `EventCountdown`, `DepartmentCard` |
| `/about` | Mission Briefing & Charter | Activity cards, Sol counter, founding quote |
| `/crew` | Ship Crew Manifest | 11 ship department stations |
| `/crew/[department]` | Dynamic Module Dossier | Module schematics, role vacancies, commanding leads |
| `/events` | Launch Schedule | Active countdowns, upcoming launches, archive |
| `/events/[slug]` | Dynamic Mission Dossier | Location coordinates, timing windows, speaker roster |
| `/join` | Boarding Application | `JoinForm` island, membership advantages, FAQ |
| `/contact` | Ground Station Comms | `ContactForm` island, social beacons, campus map |
| `/expedition` | Interactive Odyssey | Acts I to IV vertical timeline |
| `/missions` | Active Research Projects | Classified mission briefings & proposal portal |
| `/observatory` | Sky Watch & Ephemeris | Celestial target timetable, research journal |
| `/gallery` | Visual Astrophotography | Reticle image framing & photo submission |
| `/avatar` | Spacesuit Identity Suite | Vector astronaut suit silhouette & feature preview |
| `/404` | Signal Lost | Standalone error screen with rotating 4-point star |

---

## Deployment

### Deploying to Cloudflare Pages via Wrangler
The repository is pre-configured with `wrangler.toml` for seamless deployment to Cloudflare:

```bash
# Authenticate with Cloudflare
npx wrangler login

# Build and deploy the dist folder
npm run build
npx wrangler pages deploy dist --project-name=callisto-website
```

### Automatic CI/CD via GitHub Integration
1. Go to the [Cloudflare Dashboard](https://dash.cloudflare.com/) > **Workers & Pages**.
2. Select **Create application** > **Pages** > **Connect to Git**.
3. Choose the `Vijajraj/Callisto_website` repository.
4. Set the build parameters:
   - **Framework preset**: `Astro`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node.js version**: `20` (add environment variable `NODE_VERSION = 20`)
5. Click **Save and Deploy**.

---

## Transmissions & Community

- **Instagram**: [@callistospace_cit](https://instagram.com/callistospace_cit)
- **Official Inquiries**: `callistospace.cit@gmail.com`
- **Campus Base**: Chennai Institute of Technology, Kundrathur, Chennai, TN, India.

---

## Backend & Database Architecture

Callisto features a modular backend and persistent database architecture powered by SQLite (`data/callisto.db`) using native `node:sqlite`:
- **Database Seeder**: `npm run db:seed`
- **Backend API Server**: `npm run backend` (launches HTTP REST microservice on `http://localhost:4322`)
- **API Endpoints**:
  - `/api/health.json` — System healthcheck & database status
  - `/api/telemetry.json` — Synchronous astronomical observation logs
  - `/api/manifest.json` — Crew registration & department roster

---

## Author & Systems Architecture

- **Lead Software Architect & Developer**: **vijayraj.s**
- **GitHub**: [@Vijajraj](https://github.com/Vijajraj)
- **Repository**: [https://github.com/Vijajraj/Callisto_website](https://github.com/Vijajraj/Callisto_website)

---

## License

Distributed under the [MIT License](LICENSE).  
&copy; 2026 Callisto Club. Architected & Developed by **vijayraj.s** (@Vijajraj). *All systems nominal.*
