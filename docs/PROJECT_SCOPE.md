# PROJECT SCOPE — Bioplastic Anthocyanin pH Scanner

**Priority:** Highest. This document overrides all other project documentation when conflicts arise.
**Last updated:** 2026-07-14
**Status:** Locked until client supplies outstanding data items.

---

## 1. Project Identity

| Field | Status |
|-------|--------|
| Temporary public name | **Bioplastic** |
| Final project name | Not provided |
| Logo | Not provided |
| Tagline | Not provided |
| Team name | Not provided |
| Organization / institution | Not provided |

**Rule:** Unknown branding content must use explicit Indonesian placeholders. See [Section 11 — Placeholder Policy](#11-placeholder-policy).

---

## 2. Purpose

A browser-based bioplastic anthocyanin pH scanner. The tool captures an image of a butterfly pea flower (BPF) bioplastic indicator film via camera or file upload, analyzes the indicator color locally in the browser, and estimates pH.

---

## 3. Deadline

**Final deadline: August 1, 2026.**

---

## 4. Responsibility

### 4.1 DeepSeek — Primary Implementation Agent

DeepSeek owns:

- Repository preservation and migration
- Application architecture
- Route structure
- Semantic component structure
- Camera lifecycle (`getUserMedia`, start, stop, error recovery, cleanup)
- Canvas operations (capture, pixel sampling)
- Image sampling
- Color-analysis extraction from legacy
- RGB/HSL conversion
- pH estimation
- Eligibility calculation
- Application state
- Integration
- Accessibility behavior
- Testing
- Build verification (`npm run build` must succeed)
- Technical documentation
- Minimal neutral styling required to make the application usable before the visual-design phase

### 4.2 Codex — Visual Design Agent (Future Phase)

Codex will be invoked later and owns only the final visual-design phase:

- Final visual direction
- Final responsive page composition
- Typography refinement
- Spacing refinement
- Final color and design-token refinement
- Component presentation
- Final Tailwind styling
- Manually authored final SVG icons
- Visual polish

### 4.3 Codex Restrictions

Codex must **never** modify:

- Camera lifecycle
- Canvas operations
- Image sampling
- Color calculations
- pH calculations
- Eligibility rules
- Data models
- Application state architecture
- Business logic

### 4.4 Integration Responsibility

DeepSeek remains responsible for integrating the Codex visual output with the functional application and resolving any integration defects.

---

## 5. Confirmed Product Flow

1. User opens the landing page (`/`).
2. User navigates to the scanner (`/scan`).
3. User grants camera permission or uploads an image.
4. User takes a photo.
5. User reviews the image.
6. User confirms or retakes the image.
7. Color analysis runs locally in the browser.
8. The application shows an estimated pH.
9. The application shows an eligibility indication.
10. The result includes a disclaimer regarding camera, lighting, calibration, and image quality.

---

## 6. Routes

| Route | Purpose |
|-------|---------|
| `/` | Landing page |
| `/scan` | Camera capture and image upload |
| `/result` | pH estimate, eligibility verdict, disclaimers |
| `/ph-scale` | Educational pH scale reference |
| `/about` | Project background and credits |

---

## 7. Eligibility Rule

### 7.1 Confirmed Thresholds

| pH Range | Indication |
|----------|------------|
| pH 5.5 through pH 7 inclusive | Eligible (within research parameters) |
| Below pH 5.5 | Outside eligible range |
| Above pH 7 | Outside eligible range |

### 7.2 Required UI Wording

The UI must use wording such as:

> Indikasi kelayakan berdasarkan parameter penelitian.

### 7.3 Important Restriction

**Do not claim that pH alone guarantees food safety.** The eligibility indication is a research-parameter assessment, not a food-safety certification.

---

## 8. pH Reference Data

### 8.1 Legacy REF Table

The existing REF table in `index.html:523–538` (14-point hue-to-pH calibration) must be preserved as a **technical reference only**. It must not be treated as scientifically final.

### 8.2 Final Dataset Status

The client has **not yet supplied** the final validated 14-color reference dataset.

### 8.3 Requirements Until Final Dataset Arrives

- The application must clearly identify the calibration data as temporary or placeholder.
- Do **not** silently invent or replace scientific reference colors.
- Keep the reference data isolated in a dedicated data module so it can be swapped without touching analysis logic.

---

## 9. Architecture

### 9.1 Target Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 |
| Router | App Router |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Camera | Browser `getUserMedia` |
| Image processing | Browser Canvas API |
| Processing location | Client-side only (this milestone) |

### 9.2 Processing Boundary

- Captured image pixels and analysis results are processed locally in the browser.
- They are not uploaded to an application backend.
- Ordinary browser requests for application assets or fonts are outside that image-processing statement and are permitted as standard web behavior.

---

## 10. Explicit Exclusions

The following must **not** be planned, designed, or implemented:

- Backend
- REST API
- Database
- Authentication
- Admin CMS
- Dashboard
- Bulk import
- Scan history
- QR decoding
- AI / machine learning
- Server-side image processing
- Cron jobs
- Scheduled tasks

---

## 11. Design Direction

### 11.1 Style

- **Modern Scientific Editorial**
- Formal but visually engaging
- Bright off-white background
- Charcoal or dark navy text
- Anthocyanin purple as the main accent
- Green, amber, and red only for semantic status

### 11.2 Prohibited

- Neon colors
- Glassmorphism
- Cyberpunk aesthetic
- Excessive gradients
- Excessive shadows
- Oversized border radius

---

## 12. Icon Restrictions

### 12.1 Prohibited

- Emoji
- Unicode symbols used as icons
- Icon fonts
- Lucide
- Heroicons
- Font Awesome
- Material Icons
- Any external icon library

### 12.2 Required Approach

All icons must be manually authored reusable inline SVG components or pure CSS.

---

## 13. Placeholder Policy

### 13.1 Rule

Unknown content must use explicit Indonesian placeholder text.

### 13.2 Standard Placeholders

```
Ini tempat nama project
Ini tempat judul utama
Ini tempat deskripsi
Ini tempat gambar
Ini tempat nama tim
Ini tempat logo
```

### 13.3 Prohibited

Do **not** invent:

- Research claims
- Final branding
- Institution names
- Organization names
- Team member names
- Scientific conclusions

---

## 14. Local & Deployment Requirements

| Context | Requirement |
|---------|------------|
| Production deployment | HTTPS (required for `getUserMedia`) |
| Local development | Run through `localhost` (camera works without HTTPS) |
| `file://` protocol | Camera will not work — do not claim otherwise |
| Handoff | Provide clear local run instructions |

---

## 15. Current Priority

The **first implementation phase** (Phase 0 and Phase 1) covers:

- Repository preservation
- Next.js foundation
- Route shells
- Semantic layouts
- TypeScript boundaries
- Minimal technical tokens
- Accessible base styles
- Placeholder content

Do **not** immediately implement color analysis or the complete scanner flow.

The final visual design, final design tokens, final responsive page composition, and final SVG icon set are deferred to the Codex visual-design phase.

DeepSeek may create technical icon component contracts or minimal temporary SVG icons only when required for accessibility or functionality. These must not be treated as the final visual icon system.

Follow the phased approach in `docs/MIGRATION_PLAN.md`, starting with Phase 0 (repository preservation) and Phase 1 (Next.js foundation).

---

## 16. Document Precedence

When conflicts arise between project documents, the following order applies:

1. **`docs/PROJECT_SCOPE.md`** (this file) — highest
2. `docs/CODEX_HANDOFF.md`
3. `docs/MIGRATION_PLAN.md`
4. `docs/REPOSITORY_AUDIT.md`
5. The rebuilt root `README.md`
6. `legacy/README-legacy.md`
7. `legacy/index.html` (reference only)

**Rule:** Any new client decision must first be recorded in `docs/PROJECT_SCOPE.md` before it is treated as an implementation instruction. Chat history must not be used as an undocumented source of truth.

---

## 17. Outstanding Client Decisions

These items are blocking specific phases. See `docs/MIGRATION_PLAN.md` for phase-level detail.

| # | Decision Needed | Priority | Blocking |
|---|----------------|----------|----------|
| 1 | Final validated 14-color reference dataset | Critical | Blocks final scientific calibration and final result validation, but does **not** block project foundation, camera work, or UI development |
| 2 | Final project name, tagline, logo | High | No — use explicit Indonesian placeholders |
| 3 | Exact brand and semantic colors (anthocyanin purple, green, amber, red) | Medium | No — use clearly documented provisional design tokens until Codex finalizes the visual system |
| 4 | Final disclaimer text for result page | Medium | No — use the currently confirmed research-estimation disclaimer temporarily |
| 5 | Institution, team, and organization credits | Medium | No — use placeholders |
| 6 | Educational content for `/ph-scale` page | Medium | No — use placeholders |
| 7 | Production deployment target and domain | Medium | Does **not** block local implementation |
| 8 | Calibration-math decisions (desaturation penalty threshold, red-wrap threshold, pull factor) | Low | Blocks final calibration approval only |
