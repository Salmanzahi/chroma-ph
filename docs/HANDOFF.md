# Handoff — Bioplastic pH Scanner

**Date:** 2026-07-14
**From:** DeepSeek (Technical Implementation)
**To:** Client / Codex (Visual Design) / Future Maintainers

---

## 1. Completed Functionality

A fully functional client-side browser application for estimating pH from the color of a butterfly pea flower bioplastic indicator film.

- **5 routes** implemented: `/`, `/scan`, `/result`, `/ph-scale`, `/about`.
- **Camera capture** with full lifecycle management (start, stop, cleanup, error recovery).
- **Image upload** fallback with validation.
- **Canvas-based color analysis** extracted from legacy prototype.
- **pH estimation** via hue interpolation of 14-point reference table.
- **Eligibility assessment** against confirmed pH 5.5–7 range.
- **Static export** configured — builds to `out/`.
- **Unit tests** for all pure business logic.
- **Documentation** covering architecture, camera, analysis, and handoff.

---

## 2. How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser
# http://localhost:3000
```

Camera access works on `localhost` without HTTPS.

---

## 3. How to Build

```bash
npm run build
```

Output: `out/` directory (static HTML/CSS/JS).

Serve with any static HTTP server:

```bash
npm run start
```

**Important:** Production deployment requires HTTPS for camera access.

---

## 4. How to Test

```bash
npm run test        # Vitest unit tests
npm run typecheck   # TypeScript type checking
npm run lint        # ESLint
```

---

## 5. How to Deploy

The application is configured for static export. Deploy the `out/` directory to any static host:

- **Vercel:** Import the repo; Vercel detects Next.js automatically. No special configuration needed.
- **Netlify:** Set build command to `npm run build`, publish directory to `out`.
- **Any static host:** Upload the `out/` directory.

Camera access requires HTTPS in production. Vercel and Netlify provide this automatically.

---

## 6. Temporary Scientific Data

**All pH calibration data is temporary.** The 14-point table in `src/features/ph-analysis/data/ref-table.ts` was preserved from the received prototype. The supplied archive did not include a verifiable primary calibration source, so both provenance and values require confirmation from the client or research team.

To replace with final client data:
1. Update `TEMPORARY_REF_TABLE` in `ref-table.ts`.
2. Each entry requires: `ph`, `hue`, `label`, `hexColor`, `category`.
3. Array must be sorted descending by `hue` (high → low).
4. Remove `isTemporary: true` markers from the UI after validation.

---

## 6A. Received archive integrity

The ZIP supplied for this review did **not** contain `legacy/index.html` or `legacy/README-legacy.md`, despite earlier implementation reports listing them as preserved. No substitute legacy source was fabricated. See `legacy/MISSING_FROM_RECEIVED_ARCHIVE.md`; restore the exact files from the original repository before final archival handoff.

---

## 7. Missing Client Inputs

| # | Item                                    | Priority |
|---|-----------------------------------------|----------|
| 1 | Final validated 14-color reference data | Critical |
| 2 | Project name, tagline, logo             | High     |
| 3 | Brand and semantic color hex values     | Medium   |
| 4 | Final disclaimer text                   | Medium   |
| 5 | Institution/team/organization credits   | Medium   |
| 6 | Educational content for pH scale page   | Medium   |
| 7 | Production deployment domain            | Medium   |

---

## 8. Known Limitations

1. **pH 8–11 is unreliable:** 4 pH units span only 3° of hue — lighting noise alone exceeds this resolution.
2. **No white-balance correction:** Different devices produce different readings for the same physical sample.
3. **Center-only sampling** is vulnerable to off-center indicators and shadows.
4. **Preview encoding is separate from analysis:** analysis reads raw canvas pixels, while JPEG encoding is used only for the review image and small result preview.
5. **sessionStorage transfer** is per-tab — no persistent scan history.
6. **No service worker or offline support.**
7. **No automated camera tests** — manual device testing required.

---

## 9. Next Step for Codex

Codex should run the visual-design phase using `docs/CODEX_DESIGN_BRIEF.md` as the specification.

Codex must NOT modify:
- Camera hooks or canvas utilities
- Analysis or eligibility logic
- pH reference data
- Browser storage utilities
- Business types
- Test files

---

## 10. Final Integration Responsibility (DeepSeek After Codex)

After Codex completes the visual-design phase, DeepSeek is responsible for:

1. Integrating the visual output with the functional application.
2. Verifying no functional regressions (`npm run test`, `npm run typecheck`, `npm run build`).
3. Testing camera flow end-to-end with the new visual design.
4. Resolving any integration defects.
5. Final build verification before client delivery.

---

## 11. Repository Structure (Final)

```
bioplastic/
├── legacy/                    # Preserved original prototype
│   ├── index.html
│   └── README-legacy.md
├── src/                       # Rebuilt application source
│   ├── app/                   # Next.js App Router pages
│   ├── components/            # UI components
│   ├── features/              # Feature modules (scanner, analysis, results)
│   ├── data/                  # Placeholder content
│   ├── lib/                   # Utilities, constants, storage
│   └── types/                 # Shared TypeScript types
├── docs/                      # All project documentation
├── public/                    # Static assets
├── package.json
├── tsconfig.json
├── next.config.ts
├── vitest.config.ts
├── eslint.config.mjs
├── .gitignore
└── README.md
```
