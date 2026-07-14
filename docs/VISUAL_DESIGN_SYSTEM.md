# Visual Design System

## Direction: Research Folio / Specimen Index

The interface is intentionally not composed as a SaaS landing page or card dashboard. It borrows the discipline of a research folio: ruled sections, indexed metadata, large editorial type, asymmetrical whitespace, specimen fields, and data-led colour. The UI avoids floating navigation, pill badges, decorative icon cards, blurred blobs, and nested rounded panels.

Three local products were reviewed as references: `arya-portfolio-sakura-laras-100x`, `tanya_hukum`, and `laras_new`. The portfolio's use of editorial scale, horizontal rules, and catalog-like metadata informed the strongest decisions. Familiar generator patterns found in the other references—split heroes, pill labels, glow blobs, equal card grids, and icon tiles—were treated as patterns to avoid rather than copy.

## Colour

Interface tokens live in `src/app/globals.css` and use OKLCH. The base is warm paper, near-black violet ink, and a controlled aubergine accent. Eligible green, warning amber, and error red are independent semantic hues and always appear with text or an icon. Calibration colours are restricted to pH data visualisation.

All visual tokens and the 14-point reference data remain provisional pending validated client input. On 14 July 2026, the display swatches were visually adjusted to resemble the client-supplied pH reference photograph more closely: red, violet, blue, cyan, teal, green, olive, and yellow. This is an interface-level visual approximation only. It does not alter the configured analysis hues, claim pixel-perfect extraction from the photograph, or constitute scientific calibration or laboratory validation.

The reference readout keeps the `pH` label and its numeric value in one non-wrapping typographic unit. This prevents the measurement from colliding at narrow widths while preserving separate styling for the label and tabular number.

## Typography

No runtime font CDN is used. Display copy uses the system editorial stack `Baskerville → Iowan Old Style → Palatino → Georgia`; body copy uses `Aptos → Segoe UI Variable → system-ui`; labels and measurements use a local monospace stack. Headings use tight optical spacing, body copy is capped near 64 characters, and measurement values use tabular numerals.

The hierarchy uses three distinct voices:

- display serif for thesis statements, page titles, and numeric results;
- neutral sans for instructions and explanatory copy;
- monospace for indices, technical labels, dimensions, and calibration metadata.

## Geometry and layout

The maximum content width is `82rem`, with `2rem` desktop and `1.25rem` narrow-screen gutters. Sections use a recurring index/content grid rather than repeated cards. Borders function as editorial rules and table structure. Radius is limited to 2–6 px for controls and media; circular geometry is reserved for the camera shutter or measurement marker.

## Interaction and performance

Buttons retain a 44 px minimum target and `scale(.96)` press feedback. Hover states move rules, underlines, data bars, or the specific element being inspected. Transitions enumerate only the properties that change. The mobile menu cross-fades its two manual SVG states using opacity, blur, and scale.

Below-fold sections use `content-visibility: auto`; result previews use native lazy loading and asynchronous decoding. Section reveals use IntersectionObserver once per block and animate only opacity and translate. Reduced-motion users receive the final state immediately.

The privacy explanation uses a three-stage process lineâ€”camera, local canvas, and temporary resultâ€”followed by a separate device boundary. On narrow screens the process turns into a vertical sequence, keeping the reading order intact without presenting privacy information as a stack of dashboard tables.

## Accessibility

The system includes a skip link, semantic landmarks, logical headings, visible focus, non-colour status communication, live camera and processing announcements, keyboard-operable reference controls, 44 px touch targets, and layouts verified without horizontal overflow at 320 px.
