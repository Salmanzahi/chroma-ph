# Repository Audit — Bioplastic Anthocyanin pH Scanner

**Audit date:** 2026-07-14
**Auditor role:** Repository auditor / migration planner
**Scope:** Full static analysis of every tracked file in the repository

---

## 1. Current Repository Structure

```
D:\bioplastic\bioplastic\
├── .git\                          # Git metadata
├── index.html                     # 16,942 bytes — entire application
└── README.md                      # 3,268 bytes — project documentation
```

### 1.1 What Exists

| Artifact | Present? | Notes |
|----------|----------|-------|
| `package.json` | No | No Node.js dependencies |
| `tsconfig.json` | No | No TypeScript configuration |
| `.gitignore` | No | No ignore rules |
| `.env` / `.env.local` | No | No environment variables |
| `vercel.json` | No | No deployment configuration file |
| Netlify / Docker / CI config | No | None of these exist |
| `CLAUDE.md` | No | No AI-agent instruction file |
| `.claude/` directory | No | No project-level agent configuration |
| `docs/` directory | No (created by this audit) | — |
| License file | No (MIT declared in README) | — |

### 1.2 Git History

| Commit | Date (UTC+7) | Message |
|--------|-------------|---------|
| `a586b19` | 2026-07-14 14:03 | Initial commit |
| `f54f258` | 2026-07-14 14:04 | Add initial HTML structure for pH indicator app |
| `2d34df1` | 2026-07-14 14:05 | Update README with deployment instructions and notes |
| `371b26d` | 2026-07-14 14:05 | Update README header formatting |
| `39e715d` | 2026-07-14 14:05 | Remove 'bioplastic' section from README |
| `0a3fff3` | 2026-07-14 14:41 | Revise styles and update pH reference information |
| `d0ff119` | 2026-07-14 14:45 | Adjust spacing in confirm-row and upload-alt styles |
| `742af53` | 2026-07-14 14:57 | Revise README for Bioplastic Anthocyanin pH Scanner |

**Branches:** `main`, `refactor/frontend-rebuild` (both at `742af53`; currently on `refactor/frontend-rebuild`).

All 8 commits were made within a 54-minute window on the same day. The repository is brand new.

---

## 2. Current Technology & Deployment Approach

### 2.1 Technology Stack

| Layer | Technology | Details |
|-------|-----------|---------|
| Structure | HTML5 | Single `index.html`, 582 lines |
| Styling | CSS3 | Inline `<style>` block, CSS custom properties, no preprocessor, no framework |
| Logic | Vanilla JavaScript | IIFE (lines 380–578), no modules, no bundler, no TypeScript |
| Camera | `navigator.mediaDevices.getUserMedia` | `facingMode: { ideal: 'environment' }` |
| Image processing | Canvas 2D API | Offscreen `<canvas>`, `drawImage`, `getImageData`, `toDataURL` |
| Fonts | Google Fonts — Inter | Weights 400, 500, 600, 700, 800 via `<link>` |
| Language | Indonesian (`lang="id"`) | All UI text in Indonesian |

### 2.2 Deployment

- **Current deployment:** Vercel static site (README references `vercel --prod`)
- **Local development:** `python3 -m http.server 8000` (or any static file server)
- **No build step, no bundler, no minification, no CI/CD pipeline**
- **No `vercel.json` exists** — deployment relies on Vercel's default static behavior

---

## 3. Existing Functionality — Complete Inventory

### 3.1 DOM Element References (lines 381–396)

All DOM elements are cached as `const` at the top of the IIFE. Every element references `index.html:323–377`:

| Variable | Element ID | Purpose |
|----------|-----------|---------|
| `video` | `video` | Live camera stream display |
| `canvas` | `canvas` | Offscreen canvas for capture and analysis |
| `captured` | `captured` | `<img>` for captured photo preview |
| `placeholder` | `placeholder` | Camera activation status text |
| `shootBtn` | `shootBtn` | Shutter button |
| `confirmRow` | `confirmRow` | Confirm/retake button row |
| `retakeBtn` | `retakeBtn` | "Ambil ulang" button |
| `confirmBtn` | `confirmBtn` | "Gunakan foto ini" button |
| `fileInput` | `fileInput` | File upload input |
| `sampleRing` | `sampleRing` | Center sample ring overlay |
| `scanStatus` | `scanStatus` | "Sampel diambil" label |
| `phValueEl` | `phValue` | Displayed pH number |
| `phUnitEl` | `phUnit` | "pH" unit span |
| `marker` | `marker` | Gradient strip position marker |
| `verdictText` | `verdictText` | Verdict paragraph |
| `stream` | (variable) | Active `MediaStream`, initialized `null` |
| `capturedDataUrl` | (variable) | Data URL of captured image, initialized `null` |

### 3.2 Function Inventory

| Function | Lines | Signature | Purpose |
|----------|-------|-----------|---------|
| `startCamera()` | 401–413 | `async function startCamera()` | Initialize rear camera stream |
| `showCaptureState()` | 416–423 | `function showCaptureState()` | Switch UI to capture review mode |
| `showLiveState()` | 425–432 | `function showLiveState()` | Switch UI back to live camera |
| `drawFromVideo()` | 434–443 | `function drawFromVideo()` | Capture frame from video to canvas |
| `analyzeCapturedColor()` | 477–498 | `function analyzeCapturedColor()` | Sample center region, compute RGB avg, convert to pH |
| `rgbToHsl(r, g, b)` | 500–517 | `function rgbToHsl(r, g, b)` | Standard RGB → HSL conversion |
| `hueToPH(hue, sat)` | 540–558 | `function hueToPH(hue, sat)` | Hue → pH via linear interpolation of REF table |
| `verdictFor(ph)` | 560–564 | `function verdictFor(ph)` | 3-band food-safety verdict |
| `renderResult(ph)` | 566–576 | `function renderResult(ph)` | Update DOM with pH, marker position, verdict |

### 3.3 Event Listeners

| Element | Event | Handler | Line |
|---------|-------|---------|------|
| `shootBtn` | `click` | `drawFromVideo` | 445 |
| `fileInput` | `change` | Anonymous (file upload) | 447–464 |
| `retakeBtn` | `click` | Arrow → `showLiveState()` | 466–469 |
| `confirmBtn` | `click` | Arrow → `analyzeCapturedColor()` | 471–473 |

---

## 4. Camera Lifecycle Implementation

### 4.1 Initialization (`startCamera`, lines 401–413)

```javascript
async function startCamera(){
  try{
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' } },
      audio: false
    });
    video.srcObject = stream;
    placeholder.style.display = 'none';
    video.style.display = 'block';
  }catch(err){
    placeholder.innerHTML = 'Kamera tidak tersedia.<br>Gunakan tombol unggah foto di bawah.';
  }
}
startCamera(); // line 414 — called immediately at script load
```

**Observations:**
- Camera starts automatically on page load — no user gesture required before `getUserMedia` call
- Requests rear camera with `facingMode: { ideal: 'environment' }` (graceful fallback if unavailable)
- No `audio` track requested
- No specific resolution or frame rate constraints

### 4.2 Capture (`drawFromVideo`, lines 434–443)

1. Reads `video.videoWidth` / `video.videoHeight`
2. Sets canvas dimensions to match video resolution
3. Draws full video frame to canvas
4. Converts canvas to JPEG Data URL at 92% quality
5. Sets Data URL as `captured` `<img>` source
6. Calls `showCaptureState()` to toggle UI

### 4.3 State Transitions

| State | Live camera visible | Captured image visible | Shutter button | Confirm row | Sample ring |
|-------|---------------------|----------------------|----------------|-------------|-------------|
| **Live** (initial) | Yes | No | Visible | Hidden | Hidden |
| **Capture** | No | Yes | Hidden | Visible | Visible |
| **Live** (retake) | Yes | No | Visible | Hidden | Hidden |

### 4.4 Defects in Camera Lifecycle

1. **No stream cleanup** — `stream.getTracks().forEach(t => t.stop())` is never called. The camera stays active after upload, retake, or page navigation. This is a battery and privacy concern on mobile.
2. **No `pagehide` / `beforeunload` / `visibilitychange` listener** — stream persists when the tab is backgrounded or the page is left.
3. **No `navigator.mediaDevices` feature detection** before calling `getUserMedia` — will throw unhandled in older browsers or insecure contexts.
4. **No retry logic** — if camera fails once, there is no automatic retry or alternative camera selection.
5. **No orientation handling** — video may be mirrored or rotated on some devices.
6. **Autoplay on load** — camera starts immediately without user consent gesture. Some browsers may block this.

---

## 5. Image Upload Implementation (`fileInput` handler, lines 447–464)

### 5.1 Flow

1. User clicks "atau unggah foto dari galeri" (`<label>` linked to hidden `fileInput`)
2. `fileInput` triggers `change` event
3. File read via `FileReader.readAsDataURL()`
4. Result loaded into a new `Image()` object
5. Image drawn to offscreen canvas
6. Canvas converted to JPEG Data URL at 92% quality
7. Data URL displayed in `captured` `<img>`
8. `showCaptureState()` called

### 5.2 Defects

1. **No file size validation** — arbitrarily large files will be read into memory
2. **No MIME type verification** — `accept="image/*"` is a hint only; any file can be selected
3. **No dimension limits** — very large images may cause memory issues or slow analysis
4. **No error handling** around `FileReader` or `Image` loading — exceptions are uncaught
5. **No loading indicator** during file read + canvas draw + JPEG conversion
6. **Re-encodes to JPEG** — uploaded PNGs lose transparency and may shift colors slightly

---

## 6. Canvas & Color Sampling Implementation

### 6.1 Canvas Usage

The `<canvas id="canvas">` element (line 377) is hidden via `display: none` (line 319). It serves exclusively as an offscreen buffer for:
1. Capturing video frames (`drawFromVideo`, line 434)
2. Rendering uploaded images (file handler, line 453)
3. Sampling pixel data (`analyzeCapturedColor`, line 477)

### 6.2 Color Sampling (`analyzeCapturedColor`, lines 477–498)

```javascript
const size = Math.floor(Math.min(w, h) * 0.3);
const sx = Math.floor((w - size) / 2);
const sy = Math.floor((h - size) / 2);
const data = ctx.getImageData(sx, sy, size, size).data;
```

- Samples a **centered square region** equal to **30% of the shorter image dimension**
- Iterates every pixel (4 bytes per pixel: R, G, B, A) in that region
- **Alpha channel is ignored** — `data[i+3]` is never read
- Computes simple arithmetic mean of R, G, B across all sampled pixels
- **No outlier rejection, no median filtering, no clustering, no segmentation**
- The entire analysis assumes the bioplastic indicator fills the center of the frame

### 6.3 Defects

1. **No edge detection or region-of-interest detection** — just assumes center is the indicator
2. **Simple averaging** — a shadow, reflection, or background object in the center will skew the result
3. **No white balancing** — camera auto-white-balance will shift hue in unpredictable ways
4. **No reference card or calibration target** — every device/camera will produce different hues for the same pH
5. **JPEG re-encoding (92% quality)** before analysis may introduce compression artifacts that shift colors

---

## 7. RGB/HSL Conversion Implementation (`rgbToHsl`, lines 500–517)

### 7.1 Algorithm

Standard RGB→HSL conversion:
1. Normalize R, G, B to [0, 1]
2. Compute max, min, delta, lightness
3. Compute saturation from delta
4. Compute hue from dominant channel (0–360°)

### 7.2 Assessment

- **Algorithmically correct** — matches the standard HSL conversion formula
- **No clamping of inputs** — values are raw averages from `getImageData` (0–255), normalized by division
- **Returns hue in degrees** (0–360), saturation and lightness in [0, 1]
- **The function is pure** — no DOM access, no side effects — it is the most readily extractable piece of logic

---

## 8. pH Estimation Implementation

### 8.1 Reference Table (`REF`, lines 523–538)

```javascript
const REF = [
  { ph: 1,  hue: 362 },   // red
  { ph: 2,  hue: 358 },   // red
  { ph: 3,  hue: 279 },   // purple/violet
  { ph: 4,  hue: 264 },   // purple
  { ph: 5,  hue: 239 },   // blue
  { ph: 6,  hue: 237 },   // blue
  { ph: 7,  hue: 196 },   // cyan
  { ph: 8,  hue: 183 },   // teal
  { ph: 9,  hue: 182 },   // teal
  { ph: 10, hue: 181 },   // teal
  { ph: 11, hue: 180 },   // teal
  { ph: 12, hue: 119 },   // dark green
  { ph: 13, hue: 50  },   // olive/gold
  { ph: 14, hue: 40  }    // gold/yellow
];
```

**Source claim:** "measured from the butterfly pea flower (BPF) polymer film indicator" reference chart, values sampled directly from the chart.

**Scientific concern:** pH 8–11 are all clustered within 3 hue degrees (180–183). This is an extremely narrow range — a single degree of hue shift from lighting or camera variation would change the pH reading by ~1 unit. The comment on line 372 acknowledges this: *"rentang pH 8–11 memiliki warna toska yang berdekatan, jadi sedikit lebih sensitif terhadap pencahayaan"*.

### 8.2 Hue-to-pH Interpolation (`hueToPH`, lines 540–558)

1. **Red-wrap handling** (line 543): If `hue < 30`, adds 360 to make reds continuous (pH 1 hue=362 wraps around to near 0)
2. **Clamping** (line 544): Constrains hue to [40, 362] — the REF bounds
3. **Descending scan** (lines 546–555): REF is ordered high-hue→low-hue (362→40). The loop finds the segment where `clamped` falls between two adjacent REF entries and does linear interpolation of pH.
4. **Desaturation penalty** (line 553): If `sat < 0.08` (near-gray), pH is pulled 30% toward neutral (7): `ph = ph + (7 - ph) * 0.3`
5. **Rounding** (line 554): `Math.round(ph * 10) / 10` — one decimal place
6. **Fallback** (line 557): Returns 7 if no matching segment found

### 8.3 Hardcoded Scientific Values

| Value | Location | Meaning |
|-------|----------|---------|
| `0.3` | Line 483 | Sample region = 30% of shorter image side |
| `0.08` | Line 553 | Saturation threshold for near-gray detection |
| `0.3` | Line 553 | Desaturation penalty pull factor toward neutral |
| `7` | Lines 553, 557 | Neutral pH target for desaturation and fallback |
| `30` | Line 543 | Red-wrap threshold in hue degrees |
| `40` | Lines 537, 544 | Minimum hue in REF (pH 14) |
| `362` | Lines 524, 544 | Maximum hue in REF (pH 1) |
| `0.92` | Lines 440, 457 | JPEG compression quality |
| `5` | Line 561 | Acidic verdict threshold |
| `7.5` | Line 562 | Alkaline verdict threshold |
| `1`–`14` | Lines 524–537 | pH range of REF chart |
| All 14 `hue` values | Lines 524–537 | The entire REF calibration table |

---

## 9. Eligibility Verdict Implementation (`verdictFor`, lines 560–564)

```javascript
function verdictFor(ph){
  if(ph <= 5)   return { text: 'Tidak layak. Terlalu asam.', cls: 'acid' };
  if(ph < 7.5)  return { text: 'Layak makan/minum.', cls: 'ok' };
  return { text: 'Tidak layak. Terlalu basa.', cls: 'base' };
}
```

### 9.1 Thresholds

| Band | pH Range | Verdict | CSS Class |
|------|----------|---------|-----------|
| Acidic | pH ≤ 5 | "Tidak layak. Terlalu asam." | `acid` |
| Safe | 5 < pH < 7.5 | "Layak makan/minum." | `ok` |
| Alkaline | pH ≥ 7.5 | "Tidak layak. Terlalu basa." | `base` |

### 9.2 Mismatch with Requirements

The user's specification states: **"The current configured eligible range is pH 5.5 through 7 inclusive."**

The actual code uses:
- Lower bound: **pH 5** (exclusive — safe starts above 5)
- Upper bound: **pH 7.5** (exclusive — safe is below 7.5)

**This is a confirmed discrepancy.** The verdict thresholds in the legacy code do not match the client's stated eligible range of 5.5–7. The client must confirm which thresholds the rebuild should use.

### 9.3 Defects

1. **No "uncertain" or "borderline" verdict** — pH 5.0 is "too acidic" but pH 5.01 is "safe." There is no gray zone.
2. **The safe band is asymmetric**: 5 < pH < 7.5 vs. client's stated 5.5–7
3. **No confidence indication** — the verdict is presented as binary regardless of saturation, lighting, or interpolation quality

---

## 10. UI & Styling Structure

### 10.1 CSS Custom Properties (lines 11–28)

```css
--bg: #efe6d3;           /* warm cream */
--bg-deep: #e4d8bd;      /* deeper beige */
--card: #f9f4e7;         /* off-white card surface */
--card-line: #d9c9a6;    /* warm border */
--ink: #2c2718;          /* near-black text */
--ink-dim: #6f6650;      /* muted text */
--ink-faint: #a1957a;    /* faint text */
--opal: #3d7e6f;         /* primary accent — teal green */
--opal-deep: #285c50;    /* dark teal */
--opal-light: #86bfae;   /* light teal */
--opal-pale: #d7e9de;    /* pale teal */
--verdict-warn: #a85a3d; /* acidic warning (orange-brown) */
--verdict-ok: #3d7e6f;   /* safe (same as opal) */
--verdict-warn2: #7d5a34;/* alkaline warning (brown) */
```

### 10.2 Layout Architecture

- **Body:** Radial gradient background, Inter font, `min-height: 100dvh`
- **`.app` container:** `max-width: 460px`, centered, `padding: 22px 18px 40px`
- **Scanner card:** White card with `border-radius: 28px`, `box-shadow`
- **Viewfinder:** 3:4 aspect ratio, dark background, `overflow: hidden`, contains video/img + reticle + sample ring + status
- **Result card:** Same card style, stacked below scanner

### 10.3 Styling Defects

1. **Single breakpoint only** — max-width 460px, no responsive adjustments for 320px or large screens
2. **Viewfinder height on mobile** — 3:4 aspect ratio inside 460px max gives ~345px width × 460px height, which may overflow small mobile viewports
3. **No `prefers-reduced-motion`** media query — the marker transition (line 288) always animates
4. **No dark mode support** — `color-scheme` not set
5. **No `prefers-contrast` support**
6. **Text contrast** — `--ink-faint` (#a1957a) on `--bg` (#efe6d3) has ~2.9:1 contrast ratio, below WCAG AA 4.5:1 minimum for normal text

---

## 11. Logic Preservation Assessment

### 11.1 Worth Preserving (Extractable Pure Logic)

| Logic | Lines | Extractability | Notes |
|-------|-------|---------------|-------|
| `rgbToHsl(r, g, b)` | 500–517 | **Excellent** | Pure function, no side effects, standard algorithm |
| `REF` array | 523–538 | **Good** | Pure data, must be preserved exactly as scientific reference |
| `hueToPH(hue, sat)` | 540–558 | **Good** | Mixed concerns: pure computation mixed with side-effect-free logic |
| `verdictFor(ph)` | 560–564 | **Good** | Pure function, but thresholds need client confirmation |

### 11.2 Too Coupled to UI (Must Be Rewritten)

| Logic | Lines | Coupling |
|-------|-------|----------|
| `startCamera()` | 401–413 | Direct DOM manipulation (`placeholder.style.display`, `video.style.display`) |
| `showCaptureState()` | 416–423 | Pure DOM manipulation |
| `showLiveState()` | 425–432 | Pure DOM manipulation |
| `drawFromVideo()` | 434–443 | Mix of camera reading + canvas + DOM |
| `analyzeCapturedColor()` | 477–498 | Mix of canvas reading + color math + `renderResult` call |
| `renderResult(ph)` | 566–576 | Pure DOM manipulation |
| Event listeners | 445, 447, 466, 471 | Direct DOM event binding |

### 11.3 Potentially Inaccurate or Unsafe Logic

| Issue | Location | Risk |
|-------|----------|------|
| Center-only sampling | Lines 482–486 | If indicator is off-center, analysis silently reads background |
| Simple RGB averaging | Lines 488–493 | One bright pixel, shadow, or glare skews the average |
| Saturation penalty at 0.08 | Line 553 | Threshold is arbitrary; no empirical basis cited |
| Linear hue→pH interpolation | Lines 548–550 | Assumes linear relationship between hue and pH, which may not hold for anthocyanins |
| No white-balance correction | Entire pipeline | Camera auto-WB shifts all hues; a pH 7 sample will read differently on different devices |
| pH 8–11 hue clustering (180–183) | Lines 531–534 | 3° total spread for 4 pH units — essentially random within lighting noise |
| JPEG re-encoding before analysis | Lines 440, 457 | Compression may shift hue values, especially in smooth gradients |
| Red-wrap logic (`h < 30`) | Line 543 | The `30` threshold is arbitrary; no justification in comments |
| Verdict boundary mismatch | Lines 561–562 | Code uses 5/7.5, client states 5.5/7 |

---

## 12. Browser Compatibility Risks

| Risk | Severity | Details |
|------|----------|---------|
| `getUserMedia` without HTTPS | High | Camera API requires secure context (HTTPS or localhost). Vercel provides this, but local testing over HTTP on non-localhost will fail. |
| No `navigator.mediaDevices` check | Medium | Older browsers or insecure contexts won't have the API; unhandled `TypeError` |
| `aspect-ratio: 3 / 4` | Low | Supported in all modern browsers; IE does not support |
| `100dvh` | Low | Dynamic viewport height not supported in older Safari (<15.4). Falls back to `100vh` in the `min-height` shorthand cascade? No — this is set as `min-height: 100dvh` directly; older Safari will ignore it. Not critical since `body` has no fixed-height requirement. |
| `background-clip: text` | Low | `-webkit-background-clip: text` is prefixed (line 71) |
| Canvas `toDataURL('image/jpeg')` | Low | Universally supported |
| Google Fonts external dependency | Low | Failure means fallback to system sans-serif; layout may shift |

---

## 13. Camera Permission Risks

1. **Auto-start on page load** (line 414): `startCamera()` is called immediately. Some browsers require a user gesture before `getUserMedia`. Chrome and Firefox allow it on first visit if the user has granted permission previously, but may block on first visit.
2. **Permission denial is terminal**: The catch block (lines 410–412) displays a static message. There is no "try again" flow, no permission-state detection via `navigator.permissions.query()`, and no proactive messaging before the prompt.
3. **No "permission revoked" handling**: If the user revokes camera permission mid-session (e.g., via browser controls), the stream silently stops. The app does not detect or recover from this.
4. **Stream never stopped**: The `MediaStream` stays active even when not displayed (retake, upload, backgrounded tab). This wastes battery and keeps the camera indicator light on.

---

## 14. Lighting & Color Calibration Risks

1. **No white balance reference** — the app has no way to distinguish "the indicator is actually teal" from "the camera auto-WB shifted warm colors to teal"
2. **No calibration step** — every device/camera sensor has different spectral sensitivity
3. **No lighting guidance beyond a note** — the disclaimer on line 372 mentions "cahaya yang cukup dan merata" but provides no interactive guidance
4. **No exposure lock** — the camera continuously adjusts exposure during live view, so the color the user sees in the viewfinder may differ from the captured frame
5. **Ambient light color temperature is unaccounted for** — incandescent (warm) vs. daylight (cool) vs. fluorescent (green spike) will produce different RGB values for the same physical color

---

## 15. Accessibility Problems

| Problem | Severity | Details |
|---------|----------|---------|
| Shutter button has `aria-label` but no visible text | Medium | Screen-reader-only label; sighted keyboard users see an empty button |
| No focus indicators styled | High | Browser default focus rings only; no `:focus-visible` custom styles |
| No keyboard navigation for capture flow | High | Entire scan→confirm→result flow is click/tap only |
| No heading hierarchy | Medium | Single `<h1>`; result card has no heading element |
| Low-contrast text | Medium | `--ink-faint` on `--bg` is ~2.9:1; the `.note` disclaimer text at 11px is particularly hard to read |
| Empty alt on dynamic image | Medium | `<img id="captured" alt="Foto yang diambil">` — alt is present but static; does not describe the specific image |
| No `aria-live` region for result updates | Medium | pH value, verdict, and marker position change without announcement |
| Missing form labels association | Low | The upload `<label>` is styled as a link (underline, no pointer cursor change on hover) |
| No skip-to-content link | Low | — |
| Canvas has no accessible fallback | Low | The offscreen canvas has no role or accessible description |

---

## 16. Responsive Design Problems

1. **Single fixed max-width (460px)** — no breakpoints for:
   - Ultra-small viewports (320px–360px): text may overflow, buttons may be cramped
   - Tablet portrait (600px–768px): 460px feels narrow
   - Desktop (>1024px): layout doesn't adapt; huge margins on sides
2. **Fixed font sizes** — 24px `h1`, 44px `.ph-value`, 13px body; none scale with viewport
3. **No `clamp()` or fluid typography**
4. **No grid or flex-wrap for wide layouts**
5. **The 3:4 viewfinder aspect ratio** with 14px padding inside a 460px max-width card gives ~432px width × 576px height — taller than many mobile screens in landscape orientation

---

## 17. File-Level Structure Reference

```
index.html (582 lines total)
├── Lines 1–9:     DOCTYPE, meta, font preconnects
├── Lines 10–320:  <style> block (all CSS)
│   ├── 11–28:     :root custom properties
│   ├── 30–38:     Reset and body
│   ├── 40–45:     .app container
│   ├── 47–74:     Header
│   ├── 77–147:    Scanner card (viewfinder, reticle, ring, status)
│   ├── 149–211:   Controls (shutter, confirm row, pill buttons, upload)
│   ├── 213–317:   Result card (pH row, gradient strip, marker, verdict, note)
│   └── 319:       canvas{ display:none }
├── Lines 322–377: <body> HTML structure
└── Lines 379–579: <script> IIFE (all JavaScript)
    ├── 380–399:   IIFE setup, DOM cache, state variables
    ├── 401–413:   startCamera()
    ├── 416–432:   showCaptureState(), showLiveState()
    ├── 434–443:   drawFromVideo()
    ├── 445:       shootBtn listener
    ├── 447–464:   fileInput listener
    ├── 466–473:   retakeBtn, confirmBtn listeners
    ├── 477–498:   analyzeCapturedColor()
    ├── 500–517:   rgbToHsl()
    ├── 519–538:   REF array
    ├── 540–558:   hueToPH()
    ├── 560–564:   verdictFor()
    └── 566–576:   renderResult()
```

---

## 18. Summary of Critical Findings

1. **Verdict thresholds mismatch** — code uses 5/7.5, client states 5.5/7
2. **pH 8–11 is scientifically unreliable** — 4 pH units mapped to only 3° of hue; lighting noise alone exceeds this resolution
3. **No stream cleanup** — camera stays on indefinitely, battery and privacy concern
4. **No calibration or white-balance** — different devices will produce different pH readings for the same physical sample
5. **Center-only sampling with simple averaging** — vulnerable to shadows, glare, and off-center indicators
6. **No error recovery** — camera failure, upload failure, and analysis edge cases are all silently swallowed
7. **Accessibility is minimal** — keyboard-only users cannot complete the scan flow
8. **JPEG re-encoding before analysis** — introduces compression artifacts into the color data used for pH estimation
9. **The desaturation penalty (sat < 0.08)** and **red-wrap threshold (hue < 30)** are arbitrary magic numbers with no cited empirical justification
10. **Single breakpoint at 460px** — not tested or designed for 320px or desktop
