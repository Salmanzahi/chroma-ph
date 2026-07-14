# Bioplastic Anthocyanin pH Scanner

A browser-based bioplastic anthocyanin pH scanner. Captures an image of a butterfly pea flower (BPF) bioplastic indicator film via camera or file upload, analyzes the indicator color locally in the browser, and estimates pH.

**Status:** Functional prototype — temporary calibration data. Final validated reference dataset pending from client.

## Tech Stack

| Layer       | Technology                             |
| ----------- | -------------------------------------- |
| Framework   | Next.js 16 (App Router)                |
| Language    | TypeScript                             |
| Styling     | Tailwind CSS 4                         |
| Camera      | Browser `navigator.mediaDevices.getUserMedia` |
| Processing  | Browser Canvas API (client-side only)  |
| Testing     | Vitest                                 |

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Camera access works on `localhost` without HTTPS.

## Scripts

| Command            | Description                    |
| ------------------ | ------------------------------ |
| `npm run dev`      | Start development server       |
| `npm run build`    | Production build (static export) |
| `npm run start`    | Serve production build         |
| `npm run lint`     | Run ESLint                     |
| `npm run typecheck`| Run TypeScript type checking   |
| `npm run test`     | Run Vitest unit tests          |

## Routes

| Route       | Purpose                                    |
| ----------- | ------------------------------------------ |
| `/`         | Landing page                               |
| `/scan`     | Camera capture and image upload            |
| `/result`   | pH estimate, eligibility, disclaimers      |
| `/ph-scale` | Educational 14-point pH reference scale    |
| `/about`    | Project background and credits             |

## Production Build

Static export is configured (`output: "export"`). Build output goes to `out/`.

```bash
npm run build
npm run start
```

**Important:** Camera access (`getUserMedia`) requires HTTPS in production. `localhost` works for development. Opening the exported HTML via `file://` will not support camera access.

## Camera Requirements

- HTTPS in production (or `localhost` for development)
- Browser with `getUserMedia` support (Chrome, Firefox, Safari, Edge)
- Camera permission must be granted by user
- Environment-facing camera preferred (rear camera on mobile)

## Temporary Calibration Notice

**All pH reference data is temporary and has not been scientifically validated.** The 14-point hue-to-pH table was preserved from the received prototype, but the received ZIP did not include a verifiable primary calibration source. The client or research team must confirm both provenance and values before production use.

## Architecture

- All image processing runs locally in the browser (Canvas API)
- No backend, no database, no authentication
- Result data is passed between routes via `sessionStorage`
- Pure analysis logic is separated from React components
- See `docs/ARCHITECTURE.md` for detailed structure

## Project Structure

```
src/
  app/                  # Next.js App Router pages
    layout.tsx
    page.tsx            # Landing page
    scan/page.tsx       # Camera + upload
    result/page.tsx     # pH result
    ph-scale/page.tsx   # Reference scale
    about/page.tsx      # About page
    not-found.tsx
  components/
    icons/              # Manual SVG icon components
    layout/             # Header, Footer, SkipToContent
    ui/                 # StatusBadge, Alert, Skeleton
    feedback/           # Loading, Empty, Error, Camera states
  features/
    scanner/            # Camera hook, image upload, canvas utils
    ph-analysis/        # Color analysis pipeline, REF data, eligibility
    results/            # Result data hook
  data/
    placeholder-content.ts  # All Indonesian placeholders
  lib/                  # Constants, utilities, browser storage
  types/                # Shared TypeScript types
```

## Testing

```bash
npm run test        # Run all tests
npm run typecheck   # Type checking
npm run lint        # Linting
```

Tests cover:
- RGB-to-HSL conversion (known colors, edge cases)
- Hue-to-pH interpolation (boundaries, red-wrap, desaturation)
- Eligibility rules (pH 5.5–7 boundaries)
- Reference data integrity (14 entries, all temporary)
- Sampling region calculation

## License

MIT

## Source integrity note

The received ZIP did not contain the reported `legacy/index.html` or `legacy/README-legacy.md`. A notice is included under `legacy/`, but the exact original files must be restored from the source repository before archival completeness can be claimed.

## Credits

- Temporary calibration values were preserved from the received prototype; primary scientific provenance remains to be confirmed.
- Built with Next.js, TypeScript, and Tailwind CSS.
