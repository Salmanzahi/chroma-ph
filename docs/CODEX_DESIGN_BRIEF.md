# Codex Design Brief — Final State

**Date:** 2026-07-14  
**Status:** Fulfilled and browser-verified.

## Product direction

The Bioplastic Anthocyanin pH Scanner estimates pH from the detected colour of an indicator film. The interface must describe the output as an indication based on configured research parameters, never as food-safety certification or a guarantee.

## Implemented visual concept

The final direction is **Research Folio / Specimen Index**. It uses warm paper, near-black violet ink, controlled aubergine, ruled layouts, indexed metadata, strong serif display type, and monospace measurement labels. The pH spectrum is used only for data.

The design intentionally avoids floating rounded navigation, pill badges, glow blobs, decorative icon grids, equal card collections, oversized radius, glassmorphism, and generic dashboard composition.

## Reference audit

The local `arya-portfolio-sakura-laras-100x`, `tanya_hukum`, and `laras_new` repositories were inspected. Editorial scale, catalog metadata, horizontal rules, and deliberate whitespace informed the redesign. Their generic split-hero, pill, blob, and card-grid patterns were not copied.

## Required product behavior retained

- Camera never starts automatically.
- Upload remains visible as fallback.
- Analysis starts only after explicit confirmation.
- Camera streams and object URLs are cleaned up.
- The central 30% sampling field shown in the UI matches the algorithm.
- Eligibility remains inclusive from pH 5.5 through 7.
- Calibration is explicitly temporary.
- No external icon or UI library is used.
- Fonts are local/system stacks only.

## Responsive and accessibility baseline

All routes fit 320 px without horizontal overflow. Controls maintain approximately 44 px targets. The application includes a skip link, landmarks, logical headings, visible focus, status text and icons, polite processing announcements, keyboard-operable calibration controls, and reduced-motion support.

## Source of truth

See `docs/VISUAL_DESIGN_SYSTEM.md` for tokens and patterns, `docs/ARCHITECTURE.md` for application boundaries, `docs/CAMERA.md` for camera lifecycle, and `docs/PH_ANALYSIS.md` for measurement behavior.
