# Architecture — Bioplastic pH Scanner

**Date:** 2026-07-14
**Status:** Technical implementation phase complete; visual-design phase pending.

---

## 1. High-Level Architecture

```
Browser (Client-Side Only)
├── Next.js 16 App Router
│   ├── /           → Landing page (server component)
│   ├── /scan       → Scanner page (client component — requires browser APIs)
│   ├── /result     → Result page (client component — reads sessionStorage)
│   ├── /ph-scale   → pH scale reference (server component)
│   ├── /about      → About page (server component)
│   └── not-found   → 404 page (server component)
├── Camera: navigator.mediaDevices.getUserMedia
├── Image Processing: Canvas 2D API
├── State Transfer: sessionStorage
└── No backend, no API, no database
```

---

## 2. App Router Structure

| Route      | Component Type | Reason                                  |
| ---------- | -------------- | --------------------------------------- |
| `/`        | Server         | Static content, no browser APIs         |
| `/scan`    | Client         | Camera (`getUserMedia`), canvas, upload |
| `/result`  | Client         | Reads `sessionStorage`                  |
| `/ph-scale`| Server         | Static reference data display           |
| `/about`   | Server         | Static placeholder content              |

The `"use client"` directive is used only where browser APIs (`getUserMedia`, Canvas, `sessionStorage`) are required.

---

## 3. Feature Modules

### 3.1 Scanner (`features/scanner/`)

```
scanner/
  types.ts                    # CameraState, CaptureState, etc.
  hooks/
    useCamera.ts              # Camera lifecycle (start, stop, cleanup, error states)
    useImageUpload.ts         # File validation, preview, revoke
  utils/
    canvas-utils.ts           # drawVideoFrameToCanvas, drawImageToCanvas, etc.
```

**Camera states:** `idle | requesting | active | captured | permission-denied | not-supported | device-not-found | stopped | error`

**Stream cleanup:** On unmount, `pagehide`, `visibilitychange` (hidden), and explicit stop.

### 3.2 pH Analysis (`features/ph-analysis/`)

```
ph-analysis/
  types.ts                    # RgbColor, HslColor, PhReference, PhAnalysisResult
  data/
    ref-table.ts              # TEMPORARY_REF_TABLE (14-point legacy REF)
  utils/
    rgb-to-hsl.ts             # Pure RGB → HSL conversion
    hue-to-ph.ts              # Hue → pH interpolation (red-wrap, desaturation)
    sample-center-region.ts   # Center square sampling, RGB averaging
    analyze-ph.ts             # Pipeline composition
    eligibility.ts            # getEligibilityStatus (pH 5.5–7 rule)
```

All utils are pure functions with no DOM, React, or browser dependencies. They are tested independently via Vitest.

### 3.3 Results (`features/results/`)

```
results/
  types.ts                    # ResultPageState
  hooks/
    useResultData.ts          # Reads + validates sessionStorage
```

---

## 4. Camera Hook Design

**Hook:** `useCamera()`

- Does NOT auto-start — requires explicit `start()` call.
- Requests `video` only; no `audio`.
- Prefers `facingMode: { ideal: "environment" }`.
- Single active stream (previous stream stopped before new one).
- Cleanup on unmount, pagehide, and visibilitychange.
- Typed error handling: `NotAllowedError`, `NotFoundError`, `NotReadableError`, `OverconstrainedError`.
- Feature detection: checks `navigator.mediaDevices` before calling `getUserMedia`.

---

## 5. Analysis Pipeline

```
Image Capture (video frame or upload)
  → Canvas draw
  → Center-region crop (30% of shorter side)
  → Pixel iteration (R, G, B averaging; alpha ignored)
  → RGB → HSL conversion
  → Hue → pH interpolation (REF table, red-wrap, desaturation penalty)
  → Eligibility check (5.5 ≤ pH ≤ 7)
  → Structured result
  → sessionStorage
```

---

## 6. Result Transfer

- After analysis, `PhAnalysisResult` is stored in `sessionStorage`.
- A small preview data URL is stored alongside (capped at ~200 KB).
- `/result` reads and validates from `sessionStorage`.
- If no valid result is found, an empty state with CTA to `/scan` is shown.
- Stale data is cleared via `clearStoredResult()`.

**Limitation:** `sessionStorage` is per-tab and cleared on tab close. This is intentional for a prototype with no scan history.

---

## 7. Temporary Data Boundary

All calibration data in `features/ph-analysis/data/ref-table.ts` is explicitly marked as temporary (`isTemporary: true`). The application:

- Labels every reference entry as "Data Sementara".
- Displays a calibration-notice alert on the result page.
- Shows a temporary-data warning on the pH scale page.
- Does not present the REF data as scientifically validated.

When the client supplies the final validated dataset, only `ref-table.ts` needs to be updated — the analysis pipeline is designed to accept any valid reference table.

---

## 8. Why No Backend

This is an intentional architectural decision:

- All image processing runs on the client via Canvas API.
- No image data leaves the browser.
- No server is needed for computation, storage, or authentication.
- The application can be deployed as a static site (`output: "export"`).

This is appropriate for a prototype. If future requirements include scan history, multi-device sync, or centralized calibration, a backend may be warranted — but those are explicitly excluded from the current scope.

---

## 9. Static Export

`next.config.ts` configures `output: "export"`. All routes are compatible with static generation:

- `/`, `/ph-scale`, `/about` — fully static (server components, no dynamic data).
- `/scan`, `/result` — client components; rendered as static shells, hydrated in browser.
- `/result` — works because it reads from `sessionStorage` at runtime, not from server data.

Build output: `out/`. Serve with any static HTTP server. Camera requires HTTPS (or localhost).

---

## 10. Known Technical Debt

1. Center-only sampling with simple RGB averaging (no outlier rejection, no segmentation).
2. No white-balance correction (camera auto-WB affects hue readings across devices).
3. Review and session previews use JPEG, but pH analysis reads raw canvas pixels without a JPEG round-trip.
4. `sessionStorage` result transfer is per-tab and not suitable for production persistence.
5. The pH 8–11 range spans only 3° of hue clustering — effectively indistinguishable from lighting noise.
