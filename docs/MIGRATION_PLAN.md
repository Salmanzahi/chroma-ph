# Migration Plan — Bioplastic pH Scanner Frontend Rebuild

**Target completion:** August 1, 2026
**Source:** `index.html` (582-line single-file prototype)
**Target stack:** Next.js 16, App Router, TypeScript, Tailwind CSS 4

---

## Phase 0 — Repository Preservation & Branch Strategy

### Objective
Preserve the legacy prototype as an immutable reference. Set up the branch structure for the rebuild.

### Actions
1. Ensure `main` is clean and the legacy prototype is committed
2. Tag `main` as `legacy-prototype-v1.0`
3. Copy `index.html` and `README.md` into `legacy/` directory on `main` (or a `legacy` branch) for archival reference, with a `legacy/README.md` explaining the archive
4. Create `.gitignore` for the Next.js project
5. Confirm `refactor/frontend-rebuild` is the active development branch
6. Verify the legacy prototype still opens correctly in a browser from the `legacy/` copy

### Files Expected
- `.gitignore` (new)
- `legacy/index.html` (archival copy)
- `legacy/README.md` (archival note)

### Dependencies
- None

### Risks
- Accidental modification or deletion of the only reference implementation
- Git tag pushed to remote prematurely

### Completion Criteria
- [ ] Git tag `legacy-prototype-v1.0` exists on `main`
- [ ] `legacy/index.html` opens correctly in a browser and produces identical behavior to the original
- [ ] `.gitignore` covers `node_modules/`, `.next/`, `out/`, `.env*.local`

### Client Data Required
- None

---

## Phase 1 — Next.js Foundation, Design Tokens, Routes, Layouts, SVG Icons

### Objective
Scaffold the Next.js 16 App Router project with TypeScript and Tailwind CSS 4. Establish the design system foundation: tokens, shared layout, route stubs, and manual SVG icon components.

### Actions
1. Scaffold Next.js 16 with `create-next-app` using App Router + TypeScript + Tailwind CSS 4
2. Extract design tokens from legacy CSS custom properties and map to Tailwind config:
   - Surface colors: off-white backgrounds (`--bg`, `--card`)
   - Text colors: charcoal/navy (`--ink`, `--ink-dim`, `--ink-faint`)
   - Accent: Anthocyanin purple (#7B2D8E or similar, derived from the pH 3–4 range) — **not the legacy teal**
   - Semantic: green (safe), amber (borderline), red (unsafe)
3. Create root layout with:
   - HTML metadata (lang="id", charset, viewport)
   - Inter font loading (bundled locally, not from Google Fonts CDN)
   - Shared header/navigation with route links
4. Create route stubs for all five target routes:
   - `/` — `app/page.tsx`
   - `/scan` — `app/scan/page.tsx`
   - `/result` — `app/result/page.tsx`
   - `/ph-scale` — `app/ph-scale/page.tsx`
   - `/about` — `app/about/page.tsx`
5. Build manual SVG icon component library as `components/icons/`:
   - Each icon is a reusable React component rendering inline SVG
   - No external icon library, no emoji, no icon fonts
   - Minimum set: Camera, Capture, Retake, Upload, Check, Warning, Info, Arrow, Menu, Close
6. Establish shared layout components: `PageShell`, `PageHeader`, `PageFooter`

### Files Expected
- `app/layout.tsx`
- `app/page.tsx`
- `app/scan/page.tsx`
- `app/result/page.tsx`
- `app/ph-scale/page.tsx`
- `app/about/page.tsx`
- `components/icons/*.tsx` (10+ files)
- `components/layout/PageShell.tsx`
- `components/layout/PageHeader.tsx`
- `components/layout/PageFooter.tsx`
- `tailwind.config.ts` (or CSS-based config for Tailwind 4)
- `app/globals.css`

### Dependencies
- Phase 0 (branch structure, `.gitignore`)

### Risks
- Tailwind CSS 4 migration/config differences from v3 — verify exact v4 API
- Font bundling strategy (next/font vs manual)
- Icon system complexity — avoid over-engineering

### Completion Criteria
- [ ] `npm run dev` starts without errors
- [ ] All five routes render a placeholder page (Indonesian placeholders)
- [ ] Design tokens are documented and consistent across routes
- [ ] All icon components render correctly at multiple sizes
- [ ] Shared layout applies to all routes
- [ ] No external icon library imported anywhere

### Client Data Required
- Final color palette approval (anthocyanin purple exact hex, semantic color hex values)
- Project name and tagline (for `<title>`, metadata, header)
- Navigation labels for each route
- Footer content / copyright line

---

## Phase 2 — Landing Page & Public Informational Routes

### Objective
Build the landing page (`/`), about page (`/about`), and pH scale education page (`/ph-scale`) with declared Indonesian placeholders for all unknown content.

### Actions
1. Build `/` (landing page):
   - Hero section with project name placeholder, primary CTA to `/scan`
   - Brief description of the tool
   - How-it-works summary (3-step visual or numbered list)
   - Link to `/ph-scale` for educational reference
2. Build `/about`:
   - Project background placeholder
   - Team placeholder
   - Technology/approach summary
   - Contact or link placeholder
3. Build `/ph-scale`:
   - Visual pH 1–14 scale with color bands matching the REF array
   - Explanation of what pH means for bioplastic indicators
   - Link back to `/scan`
4. All unknown content uses Indonesian placeholders: `Ini tempat nama project`, `Ini tempat judul utama`, `Ini tempat deskripsi`, `Ini tempat gambar`, `Ini tempat nama tim`

### Files Expected
- `app/page.tsx` (content)
- `app/about/page.tsx` (content)
- `app/ph-scale/page.tsx` (content)
- `components/landing/HeroSection.tsx`
- `components/landing/HowItWorks.tsx`
- `components/ph-scale/PhScaleVisual.tsx`

### Dependencies
- Phase 1 (layouts, icons, design tokens, route stubs)

### Risks
- Over-investing in exact copy that will be replaced
- pH scale visualization needs to visually match the REF data, not just be decorative

### Completion Criteria
- [ ] Landing page renders at 320px, 768px, 1440px without breakage
- [ ] All placeholders use the `Ini tempat ...` pattern
- [ ] pH scale page accurately reflects the 14-point REF data visually
- [ ] Navigation between all static routes works
- [ ] No hardcoded final copy exists — all is clearly placeholder

### Client Data Required
- Project name, tagline, hero text
- About page: team names, institution, research context
- pH scale page: educational copy, references, disclaimers
- Final image assets (photography, diagrams)

---

## Phase 3 — Camera Lifecycle, Capture, Retake, Upload & Error States

### Objective
Implement the `/scan` route: camera initialization, live viewfinder, photo capture, review/retake flow, and image upload fallback. All camera state management must be clean (start/stop lifecycle, error recovery).

### Actions
1. Build `useCamera` hook:
   - `start()` / `stop()` lifecycle with proper `getTracks().forEach(t => t.stop())`
   - `facingMode: 'environment'` preference
   - Feature detection (`navigator.mediaDevices` check before access)
   - Error states: `denied`, `unavailable`, `insecure-context`, `unknown`
   - Stream cleanup on unmount (useEffect cleanup + `pagehide`/`visibilitychange`)
   - User gesture gate (don't auto-start; require button click)
2. Build `useImageUpload` hook:
   - File validation (max size, MIME type, dimensions)
   - Loading state during FileReader + canvas conversion
   - Error handling for unreadable or corrupt images
3. Build `/scan` page UI components:
   - Viewfinder with 3:4 aspect ratio, corner reticle brackets
   - Live camera `<video>` element
   - Captured image preview
   - Shutter button (large circular, anthocyanin accent)
   - Confirm/retake pill buttons
   - Upload fallback link
   - Camera error states with specific guidance per error type
   - Sample ring overlay on captured preview
4. Canvas capture logic (extracted from `drawFromVideo`, lines 434–443):
   - Draw video frame to canvas
   - Convert to Data URL for preview
   - Store for analysis (defer actual analysis to Phase 4)

### Files Expected
- `hooks/useCamera.ts`
- `hooks/useImageUpload.ts`
- `app/scan/page.tsx`
- `components/scan/Viewfinder.tsx`
- `components/scan/ShutterButton.tsx`
- `components/scan/CaptureControls.tsx`
- `components/scan/CameraError.tsx`
- `components/scan/SampleRing.tsx`
- `components/scan/UploadFallback.tsx`
- `lib/camera-utils.ts` (constants, constraints, feature detection)

### Dependencies
- Phase 1 (layouts, icons, design tokens)
- Browser camera API (no server dependency)

### Risks
- Camera permission UX varies widely across browsers and OS versions
- iOS Safari `getUserMedia` quirks (requires `playsinline`, specific constraints)
- Overly large video resolutions causing canvas memory issues on mobile
- Stream not stopping on route navigation (React Strict Mode double-mount in dev)
- HTTPS requirement for `getUserMedia` — must test on production-like environment (Vercel preview deploy or ngrok)

### Completion Criteria
- [ ] Camera starts on user gesture (button click), not on page load
- [ ] Camera stops when navigating away from `/scan`
- [ ] Camera stops when tab is backgrounded (`visibilitychange`)
- [ ] Capture → review → confirm → (placeholder result) flow works end-to-end
- [ ] Retake returns to live camera view
- [ ] Upload fallback works for image files under 10 MB
- [ ] All camera error states display appropriate guidance:
  - Permission denied → instructions to enable in browser settings
  - No camera → suggest upload fallback
  - Insecure context → explain HTTPS requirement
- [ ] Viewfinder renders correctly at 320px, 375px, 768px, 1440px
- [ ] Touch and click both work for shutter button

### Client Data Required
- None (this phase is entirely functional)

---

## Phase 4 — Extraction & Refactor of Color-Analysis Logic

### Objective
Extract the color-analysis pipeline from the legacy `index.html` into pure, typed TypeScript functions with no DOM or UI dependencies. The legacy REF array, RGB→HSL conversion, and hue→pH interpolation must be preserved exactly.

### Actions
1. Create `lib/color-analysis.ts`:
   - `REF` array — 14-point hue-to-pH calibration table, exported as `readonly`
   - `rgbToHsl(r: number, g: number, b: number): Hsl` — pixel-data-aware (inputs 0–255)
   - `hueToPh(hue: number, saturation: number): number` — linear interpolation with desaturation penalty
   - `sampleCenterRegion(imageData: ImageData): Rgb` — centered 30% square average
   - `analyzePh(imageData: ImageData): PhResult` — pipeline composition
   - Type definitions: `Hsl`, `Rgb`, `PhResult`, `RefPoint`
2. Write unit tests for each function:
   - `rgbToHsl`: verify known conversions (pure red = 0°, pure green = 120°, pure blue = 240°, white = 0° sat, black = 0° sat)
   - `hueToPh`: verify boundary values (hue 362 → pH 1, hue 40 → pH 14), verify interpolation, verify desaturation penalty, verify fallback
   - `sampleCenterRegion`: verify with synthetic image data
   - `analyzePh`: integration test with known-color synthetic canvas
3. Document every magic number with the best available scientific justification:
   - `0.3` sampling ratio → empirical choice, configurable
   - `0.08` saturation threshold → configurable
   - `0.3` desaturation pull → configurable
   - `30` red-wrap threshold → configurable
4. Make all magic numbers configurable via an options parameter with documented defaults
5. Add JSDoc comments citing the REF chart source (MDPI BPF-polymer reference)

### Files Expected
- `lib/color-analysis.ts`
- `lib/color-analysis.test.ts`
- `lib/color-analysis.types.ts`
- `lib/constants.ts` (configurable thresholds with defaults)

### Dependencies
- Phase 0 (branch for reference)
- The legacy REF array and `rgbToHsl`/`hueToPH` functions as the sole source of truth
- Testing framework (Vitest or Jest, configured in Phase 1 or added here)

### Risks
- Translating the descending-scan loop correctly (REF is ordered high→low hue)
- Red-wrap logic correctness: hue 358 → pH 2, hue 362 → pH 1, hue 5 → wraps to 365, clamped to 362 and resolves to pH 1
- Floating-point precision differences between vanilla JS and TypeScript (should be identical if logic is preserved)
- Test framework not yet set up (may need `vitest` config added to project)

### Completion Criteria
- [ ] All unit tests pass
- [ ] `rgbToHsl` produces identical results to legacy function for the same inputs
- [ ] `hueToPh` produces identical results to legacy function for the same inputs
- [ ] `sampleCenterRegion` correctly computes average RGB of centered 30% square
- [ ] All magic numbers are configurable via options parameter with documented defaults
- [ ] JSDoc comments on every exported function
- [ ] REF array is `as const` and readonly
- [ ] No DOM, no `document`, no `window`, no React imports in `lib/color-analysis.ts`

### Client Data Required
- **Critical:** Confirmation of the REF calibration data — are these values still the accepted reference for BPF-polymer film?
- Updated calibration data if the reference chart has been revised
- Confirmation of the desaturation penalty threshold (0.08) and pull factor (0.3) or preferred alternatives
- Any additional reference points or calibration batches to incorporate

---

## Phase 5 — Result Page, pH Scale, Eligibility Status & Disclaimers

### Objective
Build the `/result` route: display estimated pH, position on the gradient strip, eligibility verdict, and required disclaimers. Connect to the color-analysis module from Phase 4.

### Actions
1. Build result page UI:
   - Large pH value display (1 decimal)
   - Interactive pH gradient strip (1–14) with marker at estimated position
   - Eligibility verdict with semantic color coding (green/amber/red)
   - The verdict must label the result as an estimate
   - Disclaimer text about camera, lighting, calibration, and image quality affecting results
2. Implement the eligibility thresholds as confirmed by the client:
   - **The legacy code uses pH ≤ 5 acidic / 5–7.5 safe / ≥ 7.5 alkaline**
   - **The client's specification states eligible range is pH 5.5 through 7 inclusive**
   - **This must be resolved with the client before implementation**
3. Build `verdictFor(ph)` as a pure function with configurable thresholds
4. Result page must handle:
   - Valid result from analysis
   - No result (redirect to `/scan` if accessed directly)
   - Edge cases: pH exactly at boundaries
5. Build the gradient strip as a client component with the marker position animating on load

### Files Expected
- `app/result/page.tsx`
- `components/result/PhDisplay.tsx`
- `components/result/PhGradientStrip.tsx`
- `components/result/VerdictBanner.tsx`
- `components/result/DisclaimerBlock.tsx`
- `lib/verdict.ts` (pure function, configurable thresholds)

### Dependencies
- Phase 4 (color-analysis module)
- Phase 3 (capture flow passes data to result)
- Client confirmation of verdict thresholds

### Risks
- Data passing between `/scan` and `/result` routes — use URL search params, React context, or a simple state store
- The result page must work when accessed directly (no analysis data) — show appropriate empty state
- Verdict threshold ambiguity between legacy code and client spec

### Completion Criteria
- [ ] pH value, gradient marker, and verdict render correctly
- [ ] Gradient strip colors match the REF array (not the legacy decorative gradient)
- [ ] Verdict thresholds match client-confirmed values
- [ ] Required disclaimers are present and visible:
  - "Hasil bersifat perkiraan, bukan pengukuran laboratorium"
  - Mention of camera, lighting, calibration, image quality as limiting factors
- [ ] Direct access to `/result` without scan data shows appropriate message with link to `/scan`
- [ ] Result page is responsive from 320px to desktop

### Client Data Required
- **Critical:** Confirmed eligible pH range (5.5–7 per spec, or 5–7.5 per legacy code)
- Exact disclaimer text (the legacy note on line 372 is a starting point but may need revision)
- Any regulatory or institutional disclaimer language that must be included
- What to display when pH is exactly at the boundary (e.g., pH 5.5)

---

## Phase 6 — Responsive, Accessibility, Browser & Device Testing

### Objective
Test and fix the full application across devices, browsers, and assistive technologies. Ensure WCAG 2.1 AA compliance where achievable.

### Actions
1. **Responsive testing:**
   - Test every route at 320px, 375px, 414px, 768px, 1024px, 1440px
   - Test landscape and portrait on mobile
   - Fix layout breakage, overflow, touch target sizes (minimum 44×44px)
   - Verify the 3:4 viewfinder doesn't overflow mobile viewports
2. **Accessibility audit and fixes:**
   - Add proper heading hierarchy on every page
   - Add `aria-live` region to result page for dynamic content announcements
   - Add visible `:focus-visible` styles throughout
   - Ensure all interactive elements are keyboard-accessible
   - Add skip-to-content link
   - Verify color contrast ratios (minimum 4.5:1 for text, 3:1 for large text)
   - Add `prefers-reduced-motion` support
   - Add `prefers-color-scheme` support (optional, if design allows)
   - Test full scan→result flow with screen reader
   - Test full flow with keyboard only
3. **Browser testing:**
   - Chrome (latest)
   - Firefox (latest)
   - Safari (latest, macOS + iOS)
   - Edge (latest)
   - Test camera permission flows on each
4. **Device testing:**
   - iPhone (Safari, iOS 16+)
   - Android (Chrome, Android 13+)
   - Desktop with external webcam
   - Desktop without camera (upload-only fallback)
5. **Performance:**
   - Lighthouse audit (target ≥90 Performance, ≥90 Accessibility)
   - Verify no layout shift during camera initialization
   - Verify canvas operations complete < 500ms on mid-range mobile

### Files Expected
- Changes across many files (accessibility attributes, responsive fixes)
- `app/layout.tsx` (skip-to-content, global aria)
- `components/a11y/SkipToContent.tsx`
- Any components that fail audit

### Dependencies
- Phases 1–5 must be feature-complete
- Real devices for testing (emulators are insufficient for camera testing)

### Risks
- Camera permission UX varies so much across browsers/OS that some edge cases may be untestable without physical devices
- Screen reader behavior with live video elements is poorly standardized
- iOS Safari fullscreen/inline video behavior may require special handling
- Time constraints — testing on real devices may reveal issues that require significant rework

### Completion Criteria
- [ ] All pages pass axe DevTools audit with 0 critical and 0 serious violations
- [ ] Lighthouse Accessibility score ≥ 90 on every route
- [ ] Lighthouse Performance score ≥ 90 on every route
- [ ] Full scan→result flow works on:
  - iPhone Safari (tested on real device)
  - Android Chrome (tested on real device)
  - Desktop Chrome
- [ ] Keyboard-only flow: camera start → capture → confirm → view result → navigate to other pages
- [ ] Screen reader announces pH value and verdict when result renders
- [ ] All touch targets are ≥ 44×44 CSS pixels
- [ ] No content is cut off or overlapping at 320px viewport width

### Client Data Required
- None (testing phase)

---

## Phase 7 — Documentation, Deployment & Local Handoff

### Objective
Prepare the project for handoff: deployment configuration, build verification, and documentation for the client's team.

### Actions
1. **Deployment:**
   - Create `vercel.json` if needed (likely unnecessary for default Next.js)
   - Confirm production build succeeds (`npm run build`)
   - Deploy to Vercel preview environment
   - Test production build (camera requires HTTPS — confirm Vercel preview URL works)
   - Configure custom domain if applicable
2. **Documentation:**
   - Update `README.md` with:
     - Project name, description
     - Tech stack
     - Local development setup (`npm install`, `npm run dev`)
     - Build and deployment instructions
     - Environment requirements (HTTPS for camera, Node.js 18+)
     - Project structure overview
   - Create or update `CONTRIBUTING.md` (or internal dev guide):
     - Color-analysis module: how it works, how to update REF data
     - Adding new calibration batches
     - Camera testing notes
   - Document the design token system for future theming
3. **Handoff checklist:**
   - All placeholder content documented in a single location with what's needed to replace each
   - Known issues documented (scientific limitations, browser quirks)
   - Contact/support information for the implementation team
   - The `legacy/` directory and its contents explained

### Files Expected
- `vercel.json` (if needed)
- `README.md` (rewritten)
- `docs/PLACEHOLDER_INVENTORY.md` (list of every placeholder and what to replace with)
- `docs/KNOWN_ISSUES.md`
- `docs/COLOR_ANALYSIS.md` (explanation of the algorithm for future maintainers)

### Dependencies
- Phases 1–6 complete
- Vercel account access or deployment target credentials
- Production domain name (if applicable)

### Risks
- Deployment reveals camera issues not visible on localhost (mixed content, permissions policy headers)
- Custom domain DNS propagation delays if close to deadline
- Documentation may become outdated if changes are made after handoff

### Completion Criteria
- [ ] `npm run build` exits 0 with no warnings
- [ ] Production preview URL works and camera functions correctly over HTTPS
- [ ] README enables a new developer to clone, install, and run the project in under 5 minutes
- [ ] All placeholders are catalogued with replacement instructions
- [ ] Known scientific limitations are clearly documented
- [ ] The legacy prototype is preserved and referenced

### Client Data Required
- Production deployment target (Vercel team/project, custom domain)
- Any institutional branding/logo assets for README
- Support contact for future maintainers

---

## Dependency Chain Summary

```
Phase 0  ──► Phase 1 ──► Phase 2 ──► Phase 5
                        ├─► Phase 3 ──┘
                        └─► Phase 4 ──┘
                                           └──► Phase 6 ──► Phase 7
```

- Phases 2, 3, 4 can run in parallel after Phase 1
- Phase 5 depends on Phase 3 (data flow) and Phase 4 (analysis module)
- Phase 6 depends on all feature phases (2–5)
- Phase 7 is final

### Critical Path
Phase 0 → Phase 1 → Phase 3 → Phase 4 → Phase 5 → Phase 6 → Phase 7

(Phase 2 can run in parallel with Phase 3/4 and doesn't block the critical path.)

---

## Items That Must Wait for Client Data

| Item | Phase | What's Blocked |
|------|-------|---------------|
| Project name, tagline | 1, 2 | Page titles, metadata, hero text, footer |
| Final color palette | 1 | Design tokens, all UI components |
| Navigation labels | 1 | Header/nav component |
| Eligible pH range confirmation | 5 | Verdict logic, result page |
| REF calibration data confirmation | 4 | Color-analysis module accuracy |
| Desaturation threshold/pull values | 4 | Color-analysis module defaults |
| Final disclaimer text | 5 | Result page disclaimer block |
| Team/institution names | 2 | About page |
| Educational content for pH scale | 2 | pH scale page |
| Image assets (photos, diagrams) | 2, 7 | Landing page, about page, README |
| Production domain | 7 | Deployment configuration |
| Vercel team/project access | 7 | Deployment |
