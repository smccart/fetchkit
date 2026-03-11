import { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExportPanel } from '@/components/ExportPanel';
import { FaviconPanel } from '@/components/FaviconPanel';
import { DesignTokensPanel } from '@/components/DesignTokensPanel';
import { SocialCardPanel } from '@/components/SocialCardPanel';
import { PaletteExportPanel } from '@/components/PaletteExportPanel';
import { PlaceholderPanel } from '@/components/PlaceholderPanel';
import { useFavicon } from '@/hooks/useFavicon';
import { useSocialCards } from '@/hooks/useSocialCards';
import { usePlaceholders } from '@/hooks/usePlaceholders';
import { useSiteColor } from '@/hooks/useSiteColor';
import { Copy, Download } from 'lucide-react';
import type { LogoConfig } from '@fetchkit/brand';
import {
  semanticPaletteFromColorPalette, bundlePaletteExport,
  letterheadFromLogo, appIconFromLogo, emailSignatureFromLogo, guidelinesFromLogo,
  fetchIconSvg,
} from '@fetchkit/brand';
import type { LetterheadResult } from '@fetchkit/brand';
import type { AppIconResult } from '@fetchkit/brand';
import type { EmailSignatureResult } from '@fetchkit/brand';
import type { BrandGuidelinesResult } from '@fetchkit/brand';

function CodeBlock({ label, code, filename }: { label: string; code: string; filename?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">{label}</h4>
        <div className="flex gap-2">
          {filename && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const blob = new Blob([code], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              <Download className="h-3.5 w-3.5 mr-1" />
              Download
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              await navigator.clipboard.writeText(code);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
          >
            <Copy className="h-3.5 w-3.5 mr-1" />
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
      </div>
      <pre className="border rounded-lg p-4 text-xs overflow-x-auto bg-muted/50 max-h-80">
        {code}
      </pre>
    </div>
  );
}

export default function ExportPage() {
  usePageTitle('Export Brand Kit');
  const location = useLocation();
  const navigate = useNavigate();
  const [config, setConfig] = useState<LogoConfig | null>(null);
  const favicon = useFavicon(config);
  const socialCards = useSocialCards(config);
  const { color, secondaryColor } = useSiteColor();
  const placeholders = usePlaceholders(color, secondaryColor);

  // Extra brand assets
  const [letterhead, setLetterhead] = useState<LetterheadResult | null>(null);
  const [appIcon, setAppIcon] = useState<AppIconResult | null>(null);
  const [emailSig, setEmailSig] = useState<EmailSignatureResult | null>(null);
  const [guidelines, setGuidelines] = useState<BrandGuidelinesResult | null>(null);

  const paletteExport = useMemo(() => {
    if (!config) return null;
    const palette = semanticPaletteFromColorPalette(config.colors);
    return bundlePaletteExport(palette);
  }, [config?.colors.iconColor]);

  const handlePaletteDownload = async () => {
    if (!paletteExport) return;
    const { default: JSZip } = await import('jszip');
    const zip = new JSZip();
    zip.file('palette.css', paletteExport.cssVariables);
    zip.file('tailwind-colors.js', paletteExport.tailwindConfig);
    zip.file('tokens.json', paletteExport.tokensJson);
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'palette.zip';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Generate extra brand assets when config loads
  useEffect(() => {
    if (!config) return;

    const run = async () => {
      // Fetch icon SVG for letterhead/app-icon (if not already preloaded)
      let iconSvg = config.icon.svg;
      if (!iconSvg && config.icon.id) {
        iconSvg = await fetchIconSvg(config.icon.id);
      }
      const configWithSvg = { ...config, icon: { ...config.icon, svg: iconSvg } };

      setLetterhead(letterheadFromLogo(configWithSvg));
      setGuidelines(guidelinesFromLogo(configWithSvg));
      setEmailSig(emailSignatureFromLogo(configWithSvg, {
        name: 'Your Name',
        title: 'Title',
        email: `hello@${config.companyName.toLowerCase().replace(/\s+/g, '')}.com`,
        website: `https://${config.companyName.toLowerCase().replace(/\s+/g, '')}.com`,
      }));

      if (iconSvg) {
        setAppIcon(appIconFromLogo(configWithSvg));
      }
    };
    run();
  }, [config]);

  useEffect(() => {
    const state = location.state as { config?: LogoConfig } | null;
    if (state?.config) {
      setConfig(state.config);
    } else {
      navigate('/create');
    }
  }, [location.state, navigate]);

  if (!config) return null;

  return (
    <div className="flex-1 container mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Export Your Assets</h1>
          <p className="text-sm text-muted-foreground">
            Download your logo, favicon, social cards, palette, placeholders, design tokens, and more.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Back to Refine
          </Button>
          <Button variant="outline" onClick={() => navigate('/create')}>
            Start Over
          </Button>
        </div>
      </div>

      <Tabs defaultValue="logo">
        <TabsList className="mb-6 flex-wrap">
          <TabsTrigger value="logo">Logo</TabsTrigger>
          <TabsTrigger value="favicon">Favicon</TabsTrigger>
          <TabsTrigger value="social">Social Cards</TabsTrigger>
          <TabsTrigger value="palette">Palette</TabsTrigger>
          <TabsTrigger value="placeholders">Placeholders</TabsTrigger>
          <TabsTrigger value="tokens">Design Tokens</TabsTrigger>
          <TabsTrigger value="letterhead">Letterhead</TabsTrigger>
          <TabsTrigger value="app-icon">App Icon</TabsTrigger>
          <TabsTrigger value="email-sig">Email Sig</TabsTrigger>
          <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
        </TabsList>
        <TabsContent value="logo">
          <ExportPanel config={config} />
        </TabsContent>
        <TabsContent value="favicon">
          <FaviconPanel
            bundle={favicon.bundle}
            isGenerating={favicon.isGenerating}
            onDownloadAll={favicon.downloadAll}
            onDownloadSingle={favicon.downloadSingle}
          />
        </TabsContent>
        <TabsContent value="social">
          <SocialCardPanel
            cards={socialCards.cards}
            isGenerating={socialCards.isGenerating}
            onDownloadAll={socialCards.downloadAll}
            onDownloadSingle={socialCards.downloadSingle}
          />
        </TabsContent>
        <TabsContent value="palette">
          <PaletteExportPanel
            exportData={paletteExport}
            onDownloadZip={handlePaletteDownload}
          />
        </TabsContent>
        <TabsContent value="placeholders">
          <PlaceholderPanel
            bundle={placeholders.bundle}
            isGenerating={placeholders.isGenerating}
            onDownloadAll={placeholders.downloadAll}
            onDownloadSingle={placeholders.downloadSingle}
          />
        </TabsContent>
        <TabsContent value="tokens">
          <DesignTokensPanel config={config} />
        </TabsContent>

        {/* Letterhead */}
        <TabsContent value="letterhead">
          {letterhead ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Letterhead Preview</h3>
                <div className="border rounded-lg overflow-hidden bg-white p-4 max-w-md">
                  <div dangerouslySetInnerHTML={{ __html: letterhead.svg }} className="[&>svg]:w-full [&>svg]:h-auto" />
                </div>
              </div>
              <CodeBlock label="Header HTML" code={letterhead.headerHtml} filename="letterhead-header.html" />
              <CodeBlock label="Footer HTML" code={letterhead.footerHtml} filename="letterhead-footer.html" />
              <CodeBlock label="Print CSS" code={letterhead.printCss} filename="letterhead-print.css" />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Generating letterhead...</p>
          )}
        </TabsContent>

        {/* App Icon */}
        <TabsContent value="app-icon">
          {appIcon ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">App Icon Preview</h3>
                <div className="flex items-end gap-4">
                  {[512, 192, 64, 32].map((size) => {
                    const icon = appIcon.sizes.find(s => s.size === size);
                    return icon ? (
                      <div key={size} className="text-center">
                        <div
                          className="border rounded-lg overflow-hidden bg-white inline-block"
                          style={{ width: Math.min(size, 128), height: Math.min(size, 128) }}
                          dangerouslySetInnerHTML={{ __html: icon.svg }}
                        />
                        <p className="text-[11px] text-muted-foreground mt-1">{size}px</p>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
              <CodeBlock label="Manifest Entry" code={appIcon.manifestEntry} filename="app-icons-manifest.json" />
              <CodeBlock label="HTML Snippet" code={appIcon.htmlSnippet} filename="app-icon-links.html" />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Select a logo with an icon to generate app icons.</p>
          )}
        </TabsContent>

        {/* Email Signature */}
        <TabsContent value="email-sig">
          {emailSig ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Email Signature Preview</h3>
                <div className="border rounded-lg p-4 bg-white">
                  <div dangerouslySetInnerHTML={{ __html: emailSig.html }} />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Edit the name, title, and contact info in the HTML below.
                </p>
              </div>
              <CodeBlock label="HTML (paste into email client)" code={emailSig.html} filename="email-signature.html" />
              <CodeBlock label="Plain Text" code={emailSig.plainText} filename="email-signature.txt" />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Generating email signature...</p>
          )}
        </TabsContent>

        {/* Brand Guidelines */}
        <TabsContent value="guidelines">
          {guidelines ? (
            <div className="space-y-6">
              <CodeBlock label="Brand Guidelines (Markdown)" code={guidelines.markdown} filename="brand-guidelines.md" />
              <CodeBlock label="Typography CSS" code={guidelines.typographySnippet} filename="typography.css" />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Generating brand guidelines...</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
