# QuickBrand

Rapid brand identity generation for developers who ship fast.

You're spinning up side projects, MVPs, and experiments constantly. Each one needs a logo, a favicon, consistent colors, maybe a letterhead or social card. You don't need a designer for every throwaway project — you need something that generates a decent, consistent branding kit in under a minute.

QuickBrand is that tool. Enter a name, get a full set of brand assets. Not award-winning design — functional, consistent, good-enough branding that lets you focus on building.

## What It Does Today

**Logo Generator** — Enter a company name, get 30 variations combining:
- Icons from Iconify (200,000+ icons)
- Curated display fonts from Google Fonts
- Harmonious color palettes applied per-letter and to the icon
- Horizontal and vertical layouts
- SVG exports for both light and dark backgrounds (text converted to paths, fully self-contained)

## What's Coming

The goal is a complete branding kit from a single input. Planned assets:

- **Favicon** — Generate .ico, .png (16/32/48/180/192/512), and SVG favicons from your logo icon + colors. Include manifest.json and HTML meta tags ready to paste.
- **Social Cards / OG Images** — Generate og:image and twitter:card templates (1200x630) with your logo, name, and brand colors. PNG and SVG.
- **Color System** — Export your palette as CSS custom properties, Tailwind theme config, and design tokens. Include semantic mappings (primary, secondary, accent, destructive, muted).
- **Typography Config** — Export font-family CSS, Google Fonts `<link>` tags, and Tailwind font config. Include recommended size scale and line heights.
- **Letterhead / Doc Header** — Simple header template with logo + company name for docs, invoices, READMEs.
- **App Icon** — Square format icon (for PWA, app stores, desktop shortcuts) in all required sizes.
- **Brand Guidelines Sheet** — Single-page PDF/SVG summarizing the logo, colors, fonts, and usage rules. Drop it in your repo as `BRAND.md` or `brand-guidelines.pdf`.
- **Email Signature** — HTML email signature block with logo, name, and brand colors.

## Philosophy

- **Speed over perfection** — A consistent brand kit in 60 seconds beats a perfect one in 60 hours.
- **Developer-first** — Outputs are code-friendly: SVGs, CSS variables, Tailwind configs, copy-paste HTML snippets.
- **No accounts, no paywalls** — Everything runs client-side. No backend, no sign-up, no tracking.
- **Consistency** — Every asset shares the same icon, colors, and typography. Change one, regenerate all.

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS 4
- shadcn/ui
- Iconify (icon search + rendering)
- opentype.js (font parsing + SVG text-to-path for exports)
- JSZip (bundle downloads)

## Development

```bash
pnpm install
pnpm dev
```

## Project Structure

```
src/
├── lib/                    # Core engine (pure TypeScript, no React)
│   ├── types.ts            # Shared type definitions
│   ├── fonts.ts            # Curated font list + dynamic loading
│   ├── icons.ts            # Iconify API search + SVG fetching
│   ├── colors.ts           # Color palettes + per-letter assignment
│   ├── generator.ts        # Combination algorithm (→ 30 variations)
│   ├── svg-builder.ts      # Preview SVG composition
│   └── svg-export.ts       # Export SVG with text-to-path conversion
├── pages/
│   ├── HomePage.tsx         # Marketing landing page
│   ├── CreatePage.tsx       # Enter company name
│   ├── RefinePage.tsx       # Browse + customize logos
│   └── ExportPage.tsx       # Preview + download SVGs
├── components/             # UI components (pickers, grid, canvas, etc.)
└── hooks/                  # useExport (SVG/ZIP download)
```

## License

MIT
