# Callisto Astronomy & Deep Space Exploration Engine

<div align="center">
  <img src="public/logo.png" alt="Callisto Insignia" width="120" height="120" />
  <br />
  <strong>A journey to the edge of wonder. Your mission begins here.</strong>
  <p>The official web portal and computational astrophysics platform for Callisto Club — Chennai Institute of Technology (CIT).</p>
  <p>
    <img src="public/icons/badge-astro.png" alt="Astro 5 SSG" height="26" />
    <img src="public/icons/badge-react.png" alt="React 19" height="26" />
    <img src="public/icons/badge-sqlite.png" alt="SQLite 3" height="26" />
    <img src="public/icons/badge-vercel.png" alt="Vercel Ready" height="26" />
    <img src="public/icons/badge-audit.png" alt="5-Pillar Tested" height="26" />
  </p>
</div>

---

## Overview

The **Callisto Exploration Engine** is a high-performance, space-grade web portal and observational astrophysics hub engineered with Astro 5 and interactive React 19 client islands. Designed around the architectural metaphor of a deep-space science expedition vessel, each club division operates as a specialized ship module leading stargazing expeditions, telescope clinics, exoplanet transit research, and space robotics missions.

The platform is built for modern edge deployment (optimized for Vercel, Cloudflare, and GitHub Pages), combines static site compilation with hydration-isolated interactive components, and integrates an offline-capable SQLite database with an extensible REST API backend.

---

## Core Systems & Scientific Engines

### 1. Real-Time Mathematical Celestial Ephemeris Engine
- **Algorithmic Foundation**: Implements Jean Meeus spherical astronomy algorithms and Keplerian orbital dynamics in `src/lib/astronomy.ts`.
- **Local Sidereal Time (LST)**: Dynamically computed for Chennai coordinates (13.0827 deg N, 80.2707 deg E) at Julian Epoch 2000.0.
- **Dynamic Telemetry Readouts**: Solves real-time Hour Angle (HA), True Altitude (a), True Azimuth (A), 16-point Compass Heading, Air Mass column depth (X), and meridian transit / rise / set windows.
- **16-Target Catalog**: Tracks the complete Solar System (Moon, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Mercury) and premier deep-sky objects (Orion M42, Ring M57, Dumbbell M27, Crab M1, Andromeda M31, Pleiades M45, Hercules M13, Double Cluster, Albireo, Castor, Sirius).

### 2. Callisto Deep Space Observatory & Cosmic Discovery Engine
- **100% Offline-Ready**: Completely decoupled from third-party APIs. Renders 8 curated high-resolution vector SVG assets located in `public/nasa/`:
  - Pillars of Creation in Eagle Nebula (M16)
  - Great Red Spot and Swirling Jovian Storm Belts
  - Webb First Deep Field (SMACS 0723)
  - Saturn Rings in Infrared with Titan Transit
  - Cosmic Cliffs of Carina Nebula (NGC 3324)
  - Core Bulge of Andromeda Galaxy (M31)
  - Io Volcanic Calderas and Loki Patera Plumes
  - Event Horizon of Sagittarius A* (Milky Way Supermassive Core)
- **Spectral Filters**: 4 real-time visual modes (VIS Optical, NIR Infrared, H-Alpha Narrowband, High-Contrast Solar Flare).
- **Interactive Optical Loupe**: 2.5x magnification viewport reticle with full touch and mouse tracking.
- **Academic Citations**: One-click citation ledger copy formatted for astrophysical publications.

### 3. Jovian Surface Expedition Simulator
- **Interactive 2D Canvas Orrery**: Mathematical simulation of planetary orbits with speed controls (0.25x to 10x), reverse time, and touch tap body selection.
- **True Physical Diameter Scale Mode**: True-to-scale planetary comparison against Earth (12,742 km).
- **Astrobiology Dossiers**: Detailed planetary habitability indices, surface gravity readouts, atmospheric compositions, and detection methodologies.

### 4. Sector 404 Deep-Space Drift Radar
- Custom error recovery screen (`src/pages/404.astro`) featuring an animated SVG radar scanner with rotating sweep line, anomaly blips, and telemetry coordinates.
- Provides 6 emergency course recalibration vectors with dedicated image icons.

---

## Tech Stack & Architecture

| Layer | Technology | Specification |
|---|---|---|
| **Framework** | Astro 5 | Static Site Generation (SSG) with selective Client Islands |
| **Interactive UI** | React 19 | Fast virtual DOM islands with zero runtime bloat |
| **Database** | SQLite 3 | Offline-ready persistent store (`data/callisto.db`) via native `node:sqlite` |
| **Backend API** | Node.js HTTP Server | Microservice REST API (`scripts/start-backend.cjs`) on port 4322 |
| **Styling** | Scoped CSS | Custom Properties Design Tokens (`--void`, `--deep`, `--orbit`, `--moon`) |
| **Typography** | Fontsource | Cormorant Garamond, Inter, JetBrains Mono |
| **Deployment** | Vercel Edge / Cloudflare | Global Edge CDN, Zero-Config Git CI/CD |

---

## Backend & Database Architecture

Callisto includes a dedicated backend and database layer configured for local development and future server deployments:

### 1. Database Schema (`data/callisto.db`)
- `members`: Crew onboarding registry (id, full_name, email, department, role, callsign, status, created_at).
- `telemetry_logs`: Real-time celestial observation records (id, target_name, ra, dec, alt, az, air_mass, observer, notes).
- `flight_passes`: Verified astronaut passes and credentials (id, callsign, rank, specialization, vessel, qr_signature).
- `contact_inquiries`: Ground station comms messages (id, name, email, subject, message, priority, status).
- `events_rsvp`: Launch reservations (id, event_slug, attendee_name, attendee_email, status).

### 2. Available Backend Commands
```bash
# Seed initial database records
npm run db:seed

# Start the standalone backend REST API server on port 4322
npm run backend

# Verify and enforce code watermarks across all files
npm run watermark
```

### 3. Built-In API Endpoints
- `/api/health.json` — System healthcheck, engine version, and database status
- `/api/telemetry.json` — Synchronous astronomical observation logs
- `/api/manifest.json` — Registered crew manifest and department roster

---

## Quickstart & Local Setup

### 1. Prerequisites
- **Node.js**: `>= v20.0.0` (LTS recommended)
- **Package Manager**: `npm` (v9+) or `pnpm` (v8+)
- **Git**: `>= 2.30`

### 2. Clone the Repository
```bash
git clone https://github.com/Vijajraj/Callisto_website.git
cd Callisto_website
```

### 3. Install Dependencies
```bash
npm install
```
*(Automatically triggers the `postinstall` watermark check)*

### 4. Start Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:4321/`

### 5. Build for Production
```bash
npm run build
```
Production output is generated inside `dist/`.

---

## Deployment Guide

### Option 1: Deploying to Vercel (Recommended)

Vercel provides zero-configuration hosting for Astro 5 static sites on its global Edge Network with free tier benefits including custom domains, automated SSL, preview deployments, and seamless project transfer.

1. **Connect Repository**:
   - Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
   - Click **Add New...** -> **Project**.
   - Select `Vijajraj/Callisto_website` from your GitHub repository list.
2. **Auto-Detected Settings**:
   - **Framework Preset**: `Astro`
   - **Root Directory**: `./`
   - **Build Command**: `astro build` (or `npm run build`)
   - **Output Directory**: `dist`
3. **Deploy**:
   - Click **Deploy**. Vercel will build the project and output your live production URL (e.g., `https://callisto-website.vercel.app`).
4. **Project Transfer**:
   - To transfer ownership to another team member or account in the future, navigate to **Project Settings** -> **General** -> scroll to **Transfer Project**, enter the recipient's Vercel username or team slug, and confirm. All DNS configurations, domains, and deployment history transfer smoothly.

---

### Option 2: Deploying to Cloudflare

Cloudflare hosts the static assets through Wrangler or Cloudflare Pages.
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Configuration**: Uses modern `wrangler.toml` assets configuration (`[assets] directory = "./dist"`).

---

### Option 3: Deploying to GitHub Pages

An automated GitHub Actions workflow is provided in `.github/workflows/deploy.yml`:
1. In your GitHub repository, navigate to **Settings** -> **Pages**.
2. Under **Build and deployment** -> **Source**, select **GitHub Actions**.
3. Every push to the `main` branch automatically builds and deploys to `https://vijajraj.github.io/Callisto_website/`.

---

## Automated 5-Pillar Quality & Security Suite

Callisto includes an automated test suite across 5 critical operational pillars:

```bash
# Pillar 1: Functionality & Link Integrity (23 routes, 58 internal assets)
node scripts/test-functionality.cjs

# Pillar 2: Security & Negative Constraint Audit (zero secrets, zero forbidden names)
node scripts/test-security.cjs

# Pillar 3: Performance & Bundle Weight (146 kB gzip total client JS)
node scripts/test-performance.cjs

# Pillar 4: Mobile Responsiveness & Touch Handlers (320px to 1440px viewports)
node scripts/test-mobile-responsive.cjs

# Pillar 5: Search Engine Optimization (robots.txt, sitemap.xml, Open Graph)
node scripts/test-seo.cjs
```

---

## Pages & Route Manifest

| Route | Division / View | Key Modules |
|---|---|---|
| `/` | Mission Control Gateway | `Starfield`, `CrescentLoader`, `EventCountdown`, `SoundHud` |
| `/observatory` | Virtual Deep Space Observatory | `TonightSkyEphemeris`, `NasaDeepSpaceFeed`, `TelescopeSimulator` |
| `/expedition` | Jovian Flight Deck | `ExpeditionSimulator`, interactive canvas orrery |
| `/missions` | Orbital Mechanics & Trajectory | `MissionsConsole`, Hohmann transfer calculator |
| `/gallery` | Astrophotography Visual Log | `GalleryViewer`, multi-mode photographic matrix |
| `/events` | Launch Schedule & Celestial Calendar | `EventExplorer`, countdown timers, past logs |
| `/crew` | Ship Crew Manifest | 11 department stations and lead dossiers |
| `/avatar` | Flight Identity & Pass Generator | `AvatarBuilder`, custom suit canvas exporter |
| `/join` | Flight Crew Recruitment | `JoinForm`, department selection |
| `/contact` | Ground Station Comms Relay | `ContactForm`, priority transmitter |
| `/404` | Sector 404 Deep-Space Drift | Radar sweep scanner, 6 recovery vectors |

---

## Automated Developer Watermark

This codebase features automated watermark enforcement across all lifecycle scripts:
- **Lead Software Architect & Developer**: **vijayraj.s**
- **GitHub**: [@Vijajraj](https://github.com/Vijajraj)
- **Repository**: [https://github.com/Vijajraj/Callisto_website](https://github.com/Vijajraj/Callisto_website)

Every source file (`.ts`, `.tsx`, `.astro`, `.css`, `.cjs`, `.mjs`) automatically receives the official code watermark header on clone, install, dev, and build via `scripts/inject-watermarks.cjs`.

---

## License

Distributed under the [MIT License](LICENSE).  
Copyright 2026 Callisto Club. Architected & Developed by **vijayraj.s** (@Vijajraj). *All systems nominal.*
