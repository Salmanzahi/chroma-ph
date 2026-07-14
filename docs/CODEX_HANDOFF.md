# Codex Handoff — Bioplastic pH Scanner Frontend Rebuild

**For:** Implementation agent (Next.js 16, App Router, TypeScript, Tailwind CSS 4)
**From:** Repository auditor / migration planner
**Date:** 2026-07-14
**Deadline:** August 1, 2026

---

## Verified Repository Facts

- **2 tracked files:** `index.html` (582 lines, 16.9 KB) and `README.md` (3.3 KB)
- **Zero dependencies:** No `package.json`, no bundler, no framework
- **Single-file app:** All HTML, CSS (~310 lines), and JavaScript (~200 lines) in one file
- **Language:** Indonesian (`lang="id"`)
- **Font:** Inter (Google Fonts CDN, weights 400–800)
- **Deployment:** Vercel static site (no `vercel.json` present)
- **Git:** 8 commits, all today; branches: `main`, `refactor/frontend-rebuild`
- **No backend, no API, no database, no auth — and none of these should be added**

---

## Product Flow (from legacy)

1. User visits the landing page
2. User opens the scanner page
3. User grants camera permission or uploads an image
4. User takes a photo
5. User reviews and confirms the photo
6. The browser analyzes the indicator color locally
7. The application displays an estimated pH
8. The application displays an eligibility indication
9. The result is labeled as an estimate affected by camera, lighting, calibration, and image quality

---

## Target Routes

| Route | Purpose |
|-------|---------|
| `/` | Landing page |
| `/scan` | Camera capture + upload |
| `/result` | pH estimate + eligibility verdict |
| `/ph-scale` | pH scale educational reference |
| `/about` | Project background |

---

## Explicit Exclusions

Do not build or plan:
- Backend, REST API, database, authentication, admin CMS
- Bulk import, scan history, AI, QR decoding
- Server-side image processing, scheduled tasks, cron jobs
- Any external icon library (Lucide, Heroicons, Font Awesome, Material Icons, icon fonts, emoji)
- Final research content (use Indonesian placeholders: `Ini tempat ...`)

---

## Functions Worth Extracting From Legacy

All line numbers reference `legacy/index.html` (or the original `index.html`).

| Function | Lines | Extractability | Notes |
|----------|-------|---------------|-------|
| `rgbToHsl(r, g, b)` | 500–517 | **Extract as-is** | Pure function, standard algorithm. Inputs 0–255, returns `{h, s, l}` with hue in degrees. |
| `REF` array | 523–538 | **Extract as-is** | 14-point calibration table. Must be `readonly`. Source: BPF-polymer film reference chart (MDPI). |
| `hueToPH(hue, sat)` | 540–558 | **Extract with care** | Pure logic but contains magic numbers. Make thresholds configurable. Descending-scan loop (high→low hue). Red-wrap at `< 30`. Desaturation penalty at `sat < 0.08`. |
| `verdictFor(ph)` | 560–564 | **Extract, but thresholds need client confirmation** | 3-band classification. Legacy uses 5 / 7.5; client spec says 5.5 / 7. |
| `sampleCenterRegion` logic | 482–493 | **Rewrite as typed function** | Centered 30% square, simple RGB averaging. No outlier rejection. Write as `sampleCenterRegion(imageData: ImageData): Rgb`. |

**Do NOT extract:** `startCamera`, `showCaptureState`, `showLiveState`, `drawFromVideo`, `analyzeCapturedColor`, `renderResult` — these are too coupled to DOM/video/canvas elements.

---

## Known Defects & Scientific Limitations

1. **Camera stream never stops** — `stream.getTracks().forEach(t => t.stop())` is absent. Fix this.
2. **Camera auto-starts on page load** — requires user gesture on many browsers. Fix this.
3. **No feature detection** — `navigator.mediaDevices` is assumed. Add a guard.
4. **No white balance or calibration** — every device produces different hue readings. Document this limitation; do not attempt to solve it without client-provided calibration data.
5. **pH 8–11 spans only 3° of hue** (180–183) — effectively indistinguishable from lighting noise. The legacy code itself acknowledges this on line 372.
6. **Center-only sampling with simple averaging** — shadows, glare, or off-center indicators produce wrong results. No segmentation, no outlier rejection.
7. **JPEG re-encoding at 92% quality before analysis** — compression artifacts may shift hues. Consider using raw pixel data from the canvas instead of Data URL round-trip.
8. **Verdict thresholds mismatch** — legacy uses `pH ≤ 5` / `pH < 7.5` / `pH ≥ 7.5`. Client says eligible range is **5.5 through 7 inclusive**. Get confirmation before implementing.
9. **Desaturation threshold (0.08) and red-wrap threshold (30)** are arbitrary magic numbers with no cited empirical justification.
10. **The desaturation penalty** pulls pH 30% toward neutral (7). The factor `0.3` is uncalibrated.
11. **No accessibility** — keyboard-only users cannot complete the scan flow.
12. **Single breakpoint at 460px** — not tested at 320px or on desktop.

---

## Client Decisions Already Confirmed

| Decision | Status |
|----------|--------|
| Next.js 16 with App Router | Confirmed |
| TypeScript | Confirmed |
| Tailwind CSS 4 | Confirmed |
| No backend, no database, no auth | Confirmed |
| No external icon library | Confirmed |
| Design direction: Modern Scientific Editorial, anthocyanin purple accent | Confirmed |
| Indonesian placeholders for unknown content | Confirmed |
| 5 routes (`/`, `/scan`, `/result`, `/ph-scale`, `/about`) | Confirmed |
| Deadline: August 1, 2026 | Confirmed |

---

## Information Still Missing From Client

| # | Question | Priority | Blocks |
|---|----------|----------|--------|
| 1 | **What is the exact eligible pH range?** Legacy uses 5–7.5; spec says 5.5–7. | Critical | Phase 5 (verdict logic) |
| 2 | **Is the REF calibration table (lines 523–538) still the accepted reference?** | Critical | Phase 4 (color analysis) |
| 3 | **What is the project name and tagline?** | High | Phase 1 (metadata), Phase 2 (landing) |
| 4 | **What are the exact hex values for anthocyanin purple, semantic green/amber/red?** | High | Phase 1 (design tokens) |
| 5 | **What is the final disclaimer text?** | Medium | Phase 5 (result page) |
| 6 | **What institution, team, or research group should be credited?** | Medium | Phase 2 (about page) |
| 7 | **What educational content goes on the pH scale page?** | Medium | Phase 2 (pH scale page) |
| 8 | **Is the desaturation penalty (0.08 threshold, 0.3 pull factor) scientifically acceptable?** | Medium | Phase 4 (color analysis defaults) |
| 9 | **What is the production deployment target?** (Vercel team, custom domain) | Medium | Phase 7 (deployment) |
| 10 | **Are there any regulatory or institutional disclaimer requirements?** | Low | Phase 5 (result page) |

---

## Placeholder Policy

Every piece of content not yet confirmed by the client must use an Indonesian placeholder:

```
Ini tempat nama project
Ini tempat judul utama
Ini tempat deskripsi
Ini tempat gambar
Ini tempat nama tim
```

Placeholders must be visibly distinguishable from real content (e.g., wrapped in a `<span>` with a dashed border or italic styling so the client can identify them).

---

## First Recommended Implementation Milestone

### Milestone: `/scan` route with camera lifecycle + capture + upload fallback

**What to build:**
1. Scaffold Next.js 16 project with TypeScript and Tailwind CSS 4
2. Create root layout with Inter font (bundled locally, not CDN) and shared navigation
3. Build `useCamera` hook with proper lifecycle (start, stop, error states, cleanup)
4. Build `useImageUpload` hook with file validation
5. Build `/scan` page: viewfinder, shutter button, capture review, retake, upload fallback
6. Build the manual SVG icon system (Camera, Capture, Retake, Upload, Check, Warning)
7. Do NOT build the result page or color analysis yet — just pass captured data and display a placeholder result

**Acceptance criteria:**
- [ ] `npm run dev` starts without errors
- [ ] Camera starts on user button click, not on page load
- [ ] Camera stops when navigating away from `/scan` (verify via camera indicator light)
- [ ] Capture → review → retake cycle works
- [ ] Upload fallback works for images under 10 MB
- [ ] Camera permission denied shows appropriate error guidance
- [ ] Viewfinder is 3:4 aspect ratio and does not overflow 320px viewport
- [ ] No external icon library imported anywhere
- [ ] All camera states are typed (`idle | requesting | active | captured | error`)
- [ ] Camera errors are typed (`denied | unavailable | insecure | unknown`)

---

## Do Not Assume

1. The legacy `REF` calibration data is scientifically accurate — it needs client confirmation
2. The legacy verdict thresholds (5 / 7.5) are correct — the client stated 5.5 / 7
3. The legacy teal color palette should be carried forward — the design direction says anthocyanin purple
4. Google Fonts CDN is acceptable — bundle fonts locally with `next/font`
5. The legacy code's camera auto-start pattern is correct — wait for user gesture
6. The legacy 460px max-width is sufficient — build for 320px through large desktop
7. The legacy gradient-strip CSS colors match the REF array — they are decorative and different
8. Any scientific content beyond what's in the REF array is confirmed
9. The client wants a dark mode
10. The client wants the same single-page architecture — use App Router with multiple routes

---

## Do Not Implement Yet

1. **Color analysis module** (Phase 4) — waits for REF data confirmation and client threshold decisions
2. **Result page with real verdict** (Phase 5) — waits for eligible pH range confirmation
3. **pH scale educational page** (Phase 2) — waits for client-provided content
4. **About page with real content** (Phase 2) — waits for team/institution info
5. **Landing page final copy** (Phase 2) — waits for project name and tagline
6. **Deployment to production** (Phase 7) — waits for deployment target credentials
7. **Any form of result persistence** — explicitly excluded
8. **Service worker or offline support** — not in scope

---

## Must Preserve From Legacy

| Item | Location | Preservation Method |
|------|----------|-------------------|
| `REF` array (14 calibration points) | `index.html:523–538` | Extract to `lib/color-analysis.ts` as `readonly` constant |
| `rgbToHsl` algorithm | `index.html:500–517` | Extract to `lib/color-analysis.ts` as typed pure function |
| `hueToPH` algorithm | `index.html:540–558` | Extract to `lib/color-analysis.ts` with configurable thresholds |
| Red-wrap logic (`hue < 30 → h += 360`) | `index.html:543` | Preserve exact behavior |
| Desaturation penalty (`sat < 0.08 → pull toward 7`) | `index.html:553` | Preserve, but make configurable |
| Centered 30% sampling region | `index.html:482–486` | Preserve sampling strategy |
| Verdict 3-band structure | `index.html:560–564` | Preserve structure; thresholds are configurable |
| Viewfinder 3:4 aspect ratio | `index.html:88` | Preserve ratio |
| Corner bracket reticle design | `index.html:114–123` | Rebuild with inline SVG or CSS |
| Estimate disclaimer language | `index.html:372` | Use as basis; get final copy from client |

---

## Quick Reference: Key Line Numbers in Legacy

| What | Lines |
|------|-------|
| CSS custom properties | 12–28 |
| Viewfinder styling | 85–147 |
| Shutter button | 158–172 |
| Result card styling | 213–317 |
| HTML body | 322–377 |
| DOM element cache | 381–396 |
| `startCamera()` | 401–413 |
| `drawFromVideo()` | 434–443 |
| File upload handler | 447–464 |
| `analyzeCapturedColor()` | 477–498 |
| `rgbToHsl()` | 500–517 |
| REF array | 523–538 |
| `hueToPH()` | 540–558 |
| `verdictFor()` | 560–564 |
| `renderResult()` | 566–576 |
