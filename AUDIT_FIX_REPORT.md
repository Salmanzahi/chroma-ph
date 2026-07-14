# Audit and Fix Report

**Reviewed:** 2026-07-14  
**Input:** `send.zip`

## High-impact findings fixed

1. Added the missing Tailwind CSS 4 PostCSS configuration. Without it, builds completed but most utility classes were not generated, leaving the interface largely unstyled.
2. Removed scanner hydration-sensitive browser capability detection from render-time logic and added a stable client capability state.
3. Hardened camera lifecycle against late `getUserMedia` resolutions and stream leaks; the stream now stops during review, unmount, page hide, and backgrounding.
4. Added bounded image downscaling, stricter upload validation, object-URL cleanup, and same-file reselection support.
5. Strengthened `sessionStorage` validation and prevented navigation when result storage fails.
6. Separated raw-pixel analysis from JPEG previews; image analysis no longer depends on compressed preview data.
7. Added a center-square review overlay matching the actual 30% sampling region.
8. Fixed pH category consistency: pH values above 7 are categorized as base; pH scale cards now show category labels.
9. Replaced a Unicode-style warning treatment with the project's manual SVG icon system and improved loading-overlay contrast.
10. Added a cross-platform static export server and corrected `npm run start` documentation.
11. Removed unverified scientific-source claims from current code and handoff documentation.

## Unresolved source-integrity issue

The received ZIP did not contain the reported `legacy/index.html` and `legacy/README-legacy.md`. They were not fabricated. A notice is included in `legacy/MISSING_FROM_RECEIVED_ARCHIVE.md`; restore the exact files from the original repository.

## Scientific limitations that remain by design

- The 14-point calibration table is temporary and unvalidated.
- Camera white balance, exposure, lighting, glare, and background affect readings.
- The pH 8–11 hue values are tightly clustered.
- Center-region averaging is not segmentation or laboratory calibration.
- Eligibility is only an indication under the configured research parameters, not a food-safety certification.

## Validation results

- `npm ci --prefer-offline --no-audit --no-fund`: passed; 440 packages installed from the normalized lockfile.
- `npm run lint`: passed with 0 errors and 0 warnings.
- `npm run typecheck`: passed with 0 TypeScript errors.
- `npm run test`: passed, 6 test files and 50 tests.
- `npm run build`: passed; 7 static pages generated and exported to `out/`.
- Generated Tailwind CSS: verified at 31,371 bytes and contains application utility classes such as `.bg-accent-500` and `.text-text-primary`.
- Static-server smoke test: `/`, `/scan`, and `/result` returned HTTP 200; an unknown path returned HTTP 404.
