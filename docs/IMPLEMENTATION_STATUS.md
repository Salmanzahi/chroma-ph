# Implementation Status — Bioplastic pH Scanner

**Date:** 2026-07-14  
**Phase:** Implementation and visual integration complete; validated client data remains pending.

## Complete

- Next.js 16 App Router application with static export.
- Routes: `/`, `/scan`, `/result`, `/ph-scale`, `/about`, and 404.
- Explicit camera start, live capture, review, retake, confirmation, and local analysis.
- JPEG, PNG, and WebP upload with MIME and size validation and object URL cleanup.
- Center-region sampling, RGB-to-HSL conversion, hue interpolation, and eligibility interpretation.
- Safe sessionStorage result transfer and empty/error states.
- Research Folio / Specimen Index visual system across all routes.
- OKLCH interface tokens, local/system typography, manual SVG icons, reduced motion, visible focus, live regions, and 44 px targets.
- Responsive validation with no horizontal route overflow at 320 px; representative visual inspection at 390 × 844 and 1440 × 900.
- Unit coverage for conversion, interpolation, eligibility, reference status, sampling, transparent pixels, and storage validation.

## Intentionally excluded

Authentication, accounts, databases, CMS, dashboards, scan history, QR decoding, analytics, AI prediction, server image upload, cloud storage, food-expiry prediction, and background jobs remain outside scope.

## Pending client input

1. Validated 14-point calibration data.
2. Final project name, logo, and tagline.
3. Team, organization, and institution identity.
4. Approved research disclaimer and supporting educational copy.
5. Deployment target and domain for a later phase.

## Known limitations

- The configured pH 8–11 hues cluster closely and are difficult to distinguish under real lighting noise.
- Lighting, glare, exposure, camera white balance, framing, and device variation affect estimates.
- Sampling uses the central 30% square and has no user-positioned crop.
- Result transfer is per-tab and temporary by design.
- Hardware camera behavior requires manual HTTPS testing on real iOS and Android devices.

## Verification

`npm run typecheck`, `npm run lint`, `npm run test`, and `npm run build` pass. The build exports every application route as static content.
