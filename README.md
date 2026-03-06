# FetchKit

Free scaffolding-as-a-service for developers and AI agents.

FetchKit generates production-ready assets — brand kits, legal docs, SEO configs, and more — so you can focus on building. Enter a name, get assets. No account, no paywall, open source.

## What It Does

### Brand Service (`@fetchkit/brand`)

Enter a company name, get a complete brand identity kit:

- **Logo Generator** — 30 variations from Iconify icons + Google Fonts + color palettes. SVG exports with text-to-path (horizontal/vertical, light/dark).
- **Favicon Generator** — SVG, ICO, PNG (16/32/48/180/192/512), manifest.json, HTML snippet.
- **Social Cards** — 1200x630 og:image PNGs (light + dark), meta tags.
- **Color System** — CSS custom properties, Tailwind config, JSON design tokens.
- **Typography Config** — CSS font declaration, Google Fonts link, Tailwind config.

### Legal Service (`@fetchkit/legal`)

Enter your company details, get production-ready legal documents:

- **6 document types** — Privacy Policy, Terms of Service, Cookie Consent, Disclaimer, Acceptable Use, DMCA.
- **Output formats** — Markdown + HTML, ready to paste into your project.
- **Configurable** — Jurisdiction, app type, optional GDPR/CCPA sections.

### SEO Toolkit (`@fetchkit/seo`)

Enter a site name and URL, get search-engine-ready artifacts:

- **Meta Tags** — HTML meta tags with Open Graph, Twitter Cards, canonical URL.
- **XML Sitemap** — Valid sitemap.xml with URLs, change frequency, and priority.
- **robots.txt** — Configurable crawl directives with allow/disallow rules.
- **Schema.org JSON-LD** — Structured data for 12 entity types (Organization, Product, Article, FAQ, and more).

### What's Coming

- **Security** — CSP headers, CORS config, auth scaffolds

## Access Methods

Every service is available three ways:

1. **Web UI** — [fetchkit.dev](https://fetchkit.dev) — client-side, nothing leaves your machine
2. **REST API** — `https://fetchkit.dev/api/{brand,legal,seo}/` — free, no auth required
3. **MCP Server** — `npx @fetchkit/mcp` — native tool calls for AI agents

## Philosophy

- **Speed over perfection** — A brand kit in 60 seconds beats a perfect one in 60 hours.
- **Developer-first** — Outputs are code-friendly: SVGs, CSS variables, Tailwind configs, copy-paste snippets.
- **Agent-first** — Every service is a standalone package callable by AI agents via API or MCP.
- **No accounts, no paywalls** — Client-side web app. No backend, no sign-up, no tracking.

## Tech Stack

- Turborepo + pnpm workspaces
- React 19 + TypeScript + Vite
- Tailwind CSS 4 + shadcn/ui
- Iconify (icon search + rendering)
- opentype.js (font parsing + SVG text-to-path)
- JSZip (bundle downloads)

## Project Structure

```
packages/
├── brand/              @fetchkit/brand — core brand generation logic (pure TS)
├── legal/              @fetchkit/legal — legal document generation (pure TS)
├── seo/                @fetchkit/seo — SEO artifact generation (pure TS)
├── mcp/                @fetchkit/mcp — MCP server (stdio, wraps all services)
├── tsconfig/           @fetchkit/tsconfig — shared TypeScript configs
└── eslint-config/      @fetchkit/eslint-config — shared linting
apps/
└── web/                @fetchkit/web — web UI (React + Vite)
api/
├── brand.ts            Vercel serverless — brand endpoints
├── legal.ts            Vercel serverless — legal endpoints
└── seo.ts              Vercel serverless — SEO endpoints
```

## Development

```bash
pnpm install
pnpm dev          # runs all packages via turbo
pnpm build        # builds all packages, then web app
pnpm typecheck    # type-check all packages
```

## License

MIT
