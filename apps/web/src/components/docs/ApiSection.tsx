import EndpointBlock from './EndpointBlock';

const BASE = 'https://fetchkit.dev/api';

export default function ApiSection() {
  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <p className="text-muted-foreground">
          FetchKit provides a free REST API for programmatic asset generation — brand, legal, SEO, and security.
          No authentication required. No rate limits (for now).
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-muted-foreground">
            Base URL: <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-foreground">{BASE}</code>
          </span>
          <a
            href="/api/openapi.json"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-primary underline underline-offset-4"
          >
            OpenAPI Spec
          </a>
        </div>
      </div>

      {/* Logo Generation */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Logo Generation</h3>

        <EndpointBlock
          method="GET"
          path="/brand/generate"
          summary="Generate logo variations for a company name. Returns up to 30 variations combining icons, fonts, and color palettes."
          params={[
            { name: 'name', type: 'string', required: true, description: 'Company or project name' },
            { name: 'count', type: 'integer', description: 'Number of variations (max 30, default 30)' },
          ]}
          curl={`curl "${BASE}/brand/generate?name=Acme+Corp&count=5"`}
          fetch={`const res = await fetch("${BASE}/brand/generate?name=Acme+Corp&count=5");
const { variations, meta } = await res.json();
// variations[0].config has font, icon, colors
// Pass config to /brand/export-svg for production SVGs`}
        />

        <EndpointBlock
          method="POST"
          path="/brand/regenerate"
          summary="Regenerate logos with specific overrides locked in (e.g. keep a specific icon but vary fonts and colors)."
          params={[
            { name: 'companyName', type: 'string', required: true, description: 'Company or project name' },
            { name: 'overrides', type: 'object', description: 'Lock icon, font, or palette' },
            { name: 'count', type: 'integer', description: 'Number of variations (max 30)' },
          ]}
          curl={`curl -X POST "${BASE}/brand/regenerate" \\
  -H "Content-Type: application/json" \\
  -d '{
    "companyName": "Acme Corp",
    "overrides": {
      "icon": { "id": "mdi:rocket-launch", "name": "rocket", "svg": "..." }
    },
    "count": 10
  }'`}
          fetch={`const res = await fetch("${BASE}/brand/regenerate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    companyName: "Acme Corp",
    overrides: { icon: selectedVariation.config.icon },
    count: 10,
  }),
});
const { variations } = await res.json();`}
        />

        <EndpointBlock
          method="POST"
          path="/brand/export-svg"
          summary="Build a production-ready SVG with text converted to paths (no font dependencies). Pass a LogoConfig from the generate endpoint."
          params={[
            { name: 'config', type: 'LogoConfig', required: true, description: 'Full logo config from generate response' },
            { name: 'layout', type: 'string', description: '"horizontal" or "vertical" (default: horizontal)' },
            { name: 'mode', type: 'string', description: '"light" or "dark" (default: light)' },
          ]}
        />
      </div>

      {/* Icons */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Icons</h3>

        <EndpointBlock
          method="GET"
          path="/brand/icons/search"
          summary="Search 200,000+ open-source icons from the Iconify database."
          params={[
            { name: 'query', type: 'string', required: true, description: 'Search term' },
            { name: 'limit', type: 'integer', description: 'Max results (max 50, default 30)' },
          ]}
          curl={`curl "${BASE}/brand/icons/search?query=rocket&limit=5"`}
          fetch={`const res = await fetch("${BASE}/brand/icons/search?query=rocket&limit=5");
const { icons } = await res.json();
// icons[0] = { id: "mdi:rocket-launch", name: "rocket-launch", svg: "..." }`}
        />

        <EndpointBlock
          method="GET"
          path="/brand/icons/{id}"
          summary="Fetch a single icon SVG by its Iconify ID. Optionally apply a color."
          params={[
            { name: 'id', type: 'string', required: true, description: 'Iconify icon ID (e.g. mdi:rocket-launch)' },
            { name: 'color', type: 'string', description: 'Hex color to apply (e.g. #6366f1)' },
          ]}
        />
      </div>

      {/* Colors */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Color Palettes</h3>

        <EndpointBlock
          method="POST"
          path="/brand/palette/generate"
          summary="Generate a full semantic color palette from a seed color. Includes shade scales (50–950), WCAG contrast ratios, and light/dark mode CSS variables."
          params={[
            { name: 'seedColor', type: 'string', required: true, description: 'Hex color (e.g. #6366f1)' },
            { name: 'harmony', type: 'string', description: 'complementary, analogous, triadic, split-complementary, or monochromatic (default: analogous)' },
          ]}
          curl={`curl -X POST "${BASE}/brand/palette/generate" \\
  -H "Content-Type: application/json" \\
  -d '{ "seedColor": "#6366f1", "harmony": "triadic" }'`}
          fetch={`const res = await fetch("${BASE}/brand/palette/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ seedColor: "#6366f1", harmony: "triadic" }),
});
const { cssVariables, tailwindConfig, tokensJson, palette } = await res.json();`}
        />

        <EndpointBlock
          method="GET"
          path="/brand/palette/from-name"
          summary="Generate a deterministic palette from a brand name. Same name always produces the same colors."
          params={[
            { name: 'name', type: 'string', required: true, description: 'Brand or company name' },
          ]}
        />
      </div>

      {/* Tokens & Assets */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Tokens & Assets</h3>

        <EndpointBlock
          method="POST"
          path="/brand/design-tokens"
          summary="Generate CSS variables, Tailwind config, and JSON design tokens from a color palette and font."
          params={[
            { name: 'colors', type: 'ColorPalette', required: true, description: 'Color palette object' },
            { name: 'font', type: 'FontConfig', required: true, description: 'Font config object' },
          ]}
        />

        <EndpointBlock
          method="GET"
          path="/brand/favicon"
          summary="Generate an SVG favicon, HTML snippet, and web manifest from an Iconify icon."
          params={[
            { name: 'iconId', type: 'string', required: true, description: 'Iconify icon ID (e.g. mdi:rocket-launch)' },
            { name: 'iconColor', type: 'string', description: 'Hex color (default: #000000)' },
            { name: 'name', type: 'string', description: 'App name for the manifest (default: App)' },
          ]}
          curl={`curl "${BASE}/brand/favicon?iconId=mdi:rocket-launch&iconColor=%236366f1&name=Acme"`}
          fetch={`const res = await fetch("${BASE}/brand/favicon?iconId=mdi:rocket-launch&iconColor=%236366f1&name=Acme");
const { svg, htmlSnippet, manifest } = await res.json();
// svg: SVG favicon markup
// htmlSnippet: <link> tags for your <head>
// manifest: web app manifest JSON`}
        />

        <EndpointBlock
          method="POST"
          path="/brand/placeholder"
          summary="Generate SVG placeholder images for UI mockups. 8 categories available: hero, avatar, product, chart, team, background, pattern, icon-grid."
          params={[
            { name: 'category', type: 'string', required: true, description: 'hero, avatar, product, chart, team, background, pattern, or icon-grid' },
            { name: 'width', type: 'integer', description: 'Custom width in pixels' },
            { name: 'height', type: 'integer', description: 'Custom height in pixels' },
            { name: 'colors', type: 'string[]', description: 'Array of hex colors' },
            { name: 'label', type: 'string', description: 'Optional text label' },
          ]}
        />
      </div>

      {/* Meta */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Meta</h3>

        <EndpointBlock
          method="GET"
          path="/brand/meta/og-tags"
          summary="Returns Open Graph meta tags as an HTML snippet for your page's <head>."
        />

        <EndpointBlock
          method="GET"
          path="/brand/meta/manifest"
          summary="Generate a web app manifest JSON."
          params={[
            { name: 'name', type: 'string', description: 'App name (default: App)' },
          ]}
        />
      </div>
      {/* SEO */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">SEO Toolkit</h3>

        <EndpointBlock
          method="POST"
          path="/seo/generate"
          summary="Generate a single SEO artifact (meta tags, sitemap, robots.txt, or JSON-LD)."
          params={[
            { name: 'type', type: 'string', required: true, description: 'meta-tags, sitemap, robots-txt, or json-ld' },
            { name: 'siteName', type: 'string', required: true, description: 'Site or company name' },
            { name: 'siteUrl', type: 'string', required: true, description: 'Site URL (e.g. https://acme.com)' },
            { name: 'title', type: 'string', description: 'Page title (defaults to siteName)' },
            { name: 'description', type: 'string', description: 'Meta description' },
            { name: 'ogImage', type: 'string', description: 'URL to Open Graph image' },
            { name: 'twitterHandle', type: 'string', description: 'Twitter handle (e.g. @acme)' },
            { name: 'pages', type: 'SitemapPage[]', description: 'Array of {path, lastmod, changefreq, priority} for sitemaps' },
            { name: 'robotsConfig', type: 'RobotsConfig', description: 'Rules, sitemapUrl, crawlDelay for robots.txt' },
            { name: 'jsonLdEntities', type: 'JsonLdEntity[]', description: 'Array of {type, data} for Schema.org markup' },
          ]}
          curl={`curl -X POST "${BASE}/seo/generate" \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "meta-tags",
    "siteName": "Acme Corp",
    "siteUrl": "https://acme.com",
    "description": "Build amazing things with Acme"
  }'`}
          fetch={`const res = await fetch("${BASE}/seo/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    type: "meta-tags",
    siteName: "Acme Corp",
    siteUrl: "https://acme.com",
    description: "Build amazing things with Acme",
  }),
});
const { artifact } = await res.json();
// artifact.content — raw HTML/XML/text to paste into your project
// artifact.filename — suggested filename (e.g. meta-tags.html)`}
        />

        <EndpointBlock
          method="POST"
          path="/seo/bundle"
          summary="Generate multiple SEO artifacts at once. Returns all selected artifacts in one response."
          params={[
            { name: 'types', type: 'string[]', required: true, description: 'Array of artifact types to generate' },
            { name: 'siteName', type: 'string', required: true, description: 'Site or company name' },
            { name: 'siteUrl', type: 'string', required: true, description: 'Site URL' },
          ]}
          curl={`curl -X POST "${BASE}/seo/bundle" \\
  -H "Content-Type: application/json" \\
  -d '{
    "types": ["meta-tags", "sitemap", "robots-txt", "json-ld"],
    "siteName": "Acme Corp",
    "siteUrl": "https://acme.com"
  }'`}
        />

        <EndpointBlock
          method="GET"
          path="/seo/types"
          summary="List all available SEO artifact types with descriptions."
          curl={`curl "${BASE}/seo/types"`}
          fetch={`const res = await fetch("${BASE}/seo/types");
const { types } = await res.json();
// types["meta-tags"] = { title, description }`}
        />
      </div>

      {/* Legal */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Legal Documents</h3>

        <EndpointBlock
          method="POST"
          path="/legal/generate"
          summary="Generate a single legal document. Returns Markdown and HTML output."
          params={[
            { name: 'type', type: 'string', required: true, description: 'privacy-policy, terms-of-service, cookie-consent, disclaimer, acceptable-use, or dmca' },
            { name: 'companyName', type: 'string', required: true, description: 'Company or project name' },
            { name: 'websiteUrl', type: 'string', required: true, description: 'Website URL' },
            { name: 'contactEmail', type: 'string', required: true, description: 'Contact email for legal inquiries' },
            { name: 'jurisdiction', type: 'string', description: 'Legal jurisdiction (default: United States)' },
            { name: 'appType', type: 'string', description: 'website, saas, mobile-app, or marketplace (default: website)' },
            { name: 'includeGdpr', type: 'boolean', description: 'Add GDPR section to privacy policy (default: false)' },
            { name: 'includeCcpa', type: 'boolean', description: 'Add CCPA section to privacy policy (default: false)' },
          ]}
          curl={`curl -X POST "${BASE}/legal/generate" \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "privacy-policy",
    "companyName": "Acme Corp",
    "websiteUrl": "https://acme.com",
    "contactEmail": "legal@acme.com",
    "includeGdpr": true
  }'`}
          fetch={`const res = await fetch("${BASE}/legal/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    type: "privacy-policy",
    companyName: "Acme Corp",
    websiteUrl: "https://acme.com",
    contactEmail: "legal@acme.com",
    includeGdpr: true,
  }),
});
const { document } = await res.json();
// document.markdown, document.html, document.metadata`}
        />

        <EndpointBlock
          method="POST"
          path="/legal/bundle"
          summary="Generate multiple legal documents at once. Returns an array of documents."
          params={[
            { name: 'types', type: 'string[]', required: true, description: 'Array of document types to generate' },
            { name: 'companyName', type: 'string', required: true, description: 'Company or project name' },
            { name: 'websiteUrl', type: 'string', required: true, description: 'Website URL' },
            { name: 'contactEmail', type: 'string', required: true, description: 'Contact email for legal inquiries' },
            { name: 'jurisdiction', type: 'string', description: 'Legal jurisdiction (default: United States)' },
            { name: 'appType', type: 'string', description: 'website, saas, mobile-app, or marketplace' },
          ]}
          curl={`curl -X POST "${BASE}/legal/bundle" \\
  -H "Content-Type: application/json" \\
  -d '{
    "types": ["privacy-policy", "terms-of-service", "cookie-consent"],
    "companyName": "Acme Corp",
    "websiteUrl": "https://acme.com",
    "contactEmail": "legal@acme.com"
  }'`}
        />

        <EndpointBlock
          method="GET"
          path="/legal/types"
          summary="List all available legal document types with descriptions."
          curl={`curl "${BASE}/legal/types"`}
          fetch={`const res = await fetch("${BASE}/legal/types");
const { types } = await res.json();
// types["privacy-policy"] = { title, description }`}
        />
      </div>

      {/* Security */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Security Configs</h3>

        <EndpointBlock
          method="POST"
          path="/security/generate"
          summary="Generate a single security artifact. Returns framework-specific code for CSP, CORS, headers, auth, env, or rate limiting."
          params={[
            { name: 'type', type: 'string', required: true, description: 'csp-header, cors-config, security-headers, auth-scaffold, env-template, or rate-limit' },
            { name: 'siteName', type: 'string', required: true, description: 'Site or company name' },
            { name: 'siteUrl', type: 'string', required: true, description: 'Site URL (e.g. https://acme.com)' },
            { name: 'framework', type: 'string', description: 'express, nextjs, fastify, hono, or generic (default: generic)' },
            { name: 'appType', type: 'string', description: 'website, saas, api, or mobile-backend (default: website)' },
            { name: 'authStrategy', type: 'string', description: 'jwt, session, oauth2, or api-key (default: jwt)' },
          ]}
          curl={`curl -X POST "${BASE}/security/generate" \\
-H "Content-Type: application/json" \\
-d '{
  "type": "csp-header",
  "siteName": "Acme Corp",
  "siteUrl": "https://acme.com",
  "framework": "express"
}'`}
          fetch={`const res = await fetch("${BASE}/security/generate", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
  type: "csp-header",
  siteName: "Acme Corp",
  siteUrl: "https://acme.com",
  framework: "express",
}),
});
const { artifact } = await res.json();
// artifact.content — framework-specific code to paste into your project
// artifact.filename — suggested filename (e.g. csp-policy.ts)`}
        />

        <EndpointBlock
          method="POST"
          path="/security/bundle"
          summary="Generate multiple security artifacts at once. Returns all selected artifacts in one response."
          params={[
            { name: 'types', type: 'string[]', required: true, description: 'Array of artifact types to generate' },
            { name: 'siteName', type: 'string', required: true, description: 'Site or company name' },
            { name: 'siteUrl', type: 'string', required: true, description: 'Site URL' },
            { name: 'framework', type: 'string', description: 'Target framework (default: generic)' },
            { name: 'appType', type: 'string', description: 'App type (default: website)' },
            { name: 'authStrategy', type: 'string', description: 'Auth strategy (default: jwt)' },
          ]}
          curl={`curl -X POST "${BASE}/security/bundle" \\
-H "Content-Type: application/json" \\
-d '{
  "types": ["csp-header", "cors-config", "security-headers", "auth-scaffold", "env-template", "rate-limit"],
  "siteName": "Acme Corp",
  "siteUrl": "https://acme.com",
  "framework": "express"
}'`}
        />

        <EndpointBlock
          method="GET"
          path="/security/types"
          summary="List all available security artifact types with descriptions."
          curl={`curl "${BASE}/security/types"`}
          fetch={`const res = await fetch("${BASE}/security/types");
const { types } = await res.json();
// types["csp-header"] = { title, description }`}
        />
      </div>
    </div>
  );
}
