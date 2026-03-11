import { useState, useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useSiteColor } from '@/hooks/useSiteColor';
import { trackEvent } from '@/hooks/useAnalytics';
import { toast } from 'sonner';
import {
  Rocket, Loader2, Download, Check, Palette, Scale,
  Search, Shield, CheckCircle2, Copy,
} from 'lucide-react';

import type { LegalDocType, LegalInput } from '@fetchkit/legal';
import { generateBundle as generateLegalBundle, LEGAL_DOC_TYPES } from '@fetchkit/legal';
import type { SeoArtifactType, SeoInput } from '@fetchkit/seo';
import { generateBundle as generateSeoBundle, SEO_ARTIFACT_TYPES } from '@fetchkit/seo';
import type { SecurityArtifactType, SecurityInput } from '@fetchkit/security';
import { generateBundle as generateSecurityBundle, SECURITY_ARTIFACT_TYPES } from '@fetchkit/security';
import { generateSemanticPalette, bundlePaletteExport } from '@fetchkit/brand';

const ALL_LEGAL_TYPES = Object.keys(LEGAL_DOC_TYPES) as LegalDocType[];
const ALL_SEO_TYPES = Object.keys(SEO_ARTIFACT_TYPES) as SeoArtifactType[];
const ALL_SECURITY_TYPES = Object.keys(SECURITY_ARTIFACT_TYPES) as SecurityArtifactType[];

interface GenerateAllResult {
  legal: { type: string; filename: string; content: string }[];
  seo: { type: string; filename: string; content: string }[];
  security: { type: string; filename: string; content: string }[];
  palette: { filename: string; content: string }[];
}

const SERVICE_STEPS = [
  { key: 'legal', label: 'Legal Docs', icon: Scale, color: '#f59e0b' },
  { key: 'seo', label: 'SEO Config', icon: Search, color: '#10b981' },
  { key: 'security', label: 'Security', icon: Shield, color: '#ef4444' },
  { key: 'palette', label: 'Color Palette', icon: Palette, color: '#8b5cf6' },
];

export default function GenerateAllPage() {
  usePageTitle('Generate Everything');
  const { color } = useSiteColor();

  const [searchParams] = useSearchParams();
  const autoGenRef = useRef(false);

  const [companyName, setCompanyName] = useState(searchParams.get('name') || '');
  const [websiteUrl, setWebsiteUrl] = useState(searchParams.get('url') || '');
  const [contactEmail, setContactEmail] = useState(searchParams.get('email') || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<GenerateAllResult | null>(null);

  const canGenerate = companyName.trim().length > 0 && websiteUrl.trim().length > 0;

  const generate = useCallback(async () => {
    if (!canGenerate) return;
    setIsGenerating(true);
    setCompletedSteps(new Set());
    setResult(null);

    const name = companyName.trim();
    const url = websiteUrl.trim();
    const email = contactEmail.trim() || `legal@${new URL(url).hostname}`;

    // Run all generators with small delays so the UI can show progress
    await new Promise<void>((resolve) => setTimeout(resolve, 50));

    // Legal
    const legalInput: LegalInput = {
      companyName: name,
      websiteUrl: url,
      contactEmail: email,
      appType: 'website',
    };
    const legalBundle = generateLegalBundle(ALL_LEGAL_TYPES, legalInput);
    const legalFiles = legalBundle.documents.flatMap((doc) => [
      { type: doc.type, filename: `${doc.type}.md`, content: doc.markdown },
      { type: doc.type, filename: `${doc.type}.html`, content: doc.html },
    ]);
    setCompletedSteps((prev) => new Set([...prev, 'legal']));

    await new Promise<void>((resolve) => setTimeout(resolve, 100));

    // SEO
    const seoInput: SeoInput = {
      siteName: name,
      siteUrl: url,
      description: `${name} — built with FetchKit`,
    };
    const seoBundle = generateSeoBundle(ALL_SEO_TYPES, seoInput);
    const seoFiles = seoBundle.artifacts.map((a) => ({
      type: a.type,
      filename: a.filename,
      content: a.content,
    }));
    setCompletedSteps((prev) => new Set([...prev, 'seo']));

    await new Promise<void>((resolve) => setTimeout(resolve, 100));

    // Security
    const securityInput: SecurityInput = {
      siteName: name,
      siteUrl: url,
      framework: 'express',
    };
    const securityBundle = generateSecurityBundle(ALL_SECURITY_TYPES, securityInput);
    const securityFiles = securityBundle.artifacts.map((a) => ({
      type: a.type,
      filename: a.filename,
      content: a.content,
    }));
    setCompletedSteps((prev) => new Set([...prev, 'security']));

    await new Promise<void>((resolve) => setTimeout(resolve, 100));

    // Palette
    const palette = generateSemanticPalette(color, 'analogous');
    const paletteExport = bundlePaletteExport(palette);
    const paletteFiles = [
      { filename: 'palette.css', content: paletteExport.cssVariables },
      { filename: 'tailwind-colors.js', content: paletteExport.tailwindConfig },
      { filename: 'tokens.json', content: paletteExport.tokensJson },
    ];
    setCompletedSteps((prev) => new Set([...prev, 'palette']));

    setResult({
      legal: legalFiles,
      seo: seoFiles,
      security: securityFiles,
      palette: paletteFiles,
    });
    setIsGenerating(false);
    trackEvent('generate-all:generate');
    toast.success('All scaffolding generated!');
  }, [canGenerate, companyName, websiteUrl, contactEmail, color]);

  // Auto-generate when URL params are present (from examples)
  useEffect(() => {
    if (!autoGenRef.current && canGenerate && searchParams.get('name')) {
      autoGenRef.current = true;
      generate();
    }
  }, [canGenerate, generate, searchParams]);

  const downloadAll = useCallback(async () => {
    if (!result) return;
    const { default: JSZip } = await import('jszip');
    const zip = new JSZip();

    const legal = zip.folder('legal')!;
    for (const f of result.legal) legal.file(f.filename, f.content);

    const seo = zip.folder('seo')!;
    for (const f of result.seo) seo.file(f.filename, f.content);

    const security = zip.folder('security')!;
    for (const f of result.security) security.file(f.filename, f.content);

    const palette = zip.folder('palette')!;
    for (const f of result.palette) palette.file(f.filename, f.content);

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${companyName.trim().toLowerCase().replace(/\s+/g, '-')}-scaffold.zip`;
    a.click();
    URL.revokeObjectURL(url);
    trackEvent('generate-all:download');
    toast.success('ZIP downloaded!');
  }, [result, companyName]);

  const totalFiles = result
    ? result.legal.length + result.seo.length + result.security.length + result.palette.length
    : 0;

  return (
    <div className="flex-1 container mx-auto px-6 py-8 max-w-2xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Rocket className="h-6 w-6" style={{ color }} />
          <h1 className="text-2xl font-bold">Generate Everything</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Enter your project details and get legal docs, SEO configs, security hardening,
          and a color palette — all in one ZIP.
        </p>
      </div>

      {/* Form */}
      <div className="space-y-4 mb-8">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Company / Project Name *</label>
          <Input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g. Acme Corp"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Website URL *</label>
          <Input
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="e.g. https://acme.com"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Contact Email</label>
          <Input
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="e.g. legal@acme.com (auto-derived if blank)"
          />
        </div>

        <Button
          onClick={generate}
          disabled={!canGenerate || isGenerating}
          size="lg"
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Rocket className="h-4 w-4 mr-2" />
              Generate All Services
            </>
          )}
        </Button>
      </div>

      {/* Progress */}
      {(isGenerating || result) && (
        <div className="space-y-3 mb-8">
          {SERVICE_STEPS.map((step) => {
            const done = completedSteps.has(step.key);
            return (
              <div
                key={step.key}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors ${
                  done ? 'bg-card/80 border-border' : 'border-border/50'
                }`}
              >
                {done ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0" style={{ color: step.color }} />
                ) : isGenerating ? (
                  <Loader2 className="h-5 w-5 shrink-0 animate-spin text-muted-foreground" />
                ) : (
                  <step.icon className="h-5 w-5 shrink-0 text-muted-foreground/40" />
                )}
                <span className={`text-sm font-medium ${done ? '' : 'text-muted-foreground'}`}>
                  {step.label}
                </span>
                {done && (
                  <Check className="h-4 w-4 ml-auto text-muted-foreground" />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              {totalFiles} files generated across 4 services
            </p>
            <Button onClick={downloadAll} size="sm">
              <Download className="h-4 w-4 mr-1.5" />
              Download ZIP
            </Button>
          </div>

          {/* File list */}
          <div className="space-y-4">
            {([
              { label: 'Legal', files: result.legal, color: '#f59e0b' },
              { label: 'SEO', files: result.seo, color: '#10b981' },
              { label: 'Security', files: result.security, color: '#ef4444' },
              { label: 'Palette', files: result.palette, color: '#8b5cf6' },
            ] as const).map((section) => (
              <div key={section.label}>
                <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2" style={{ color: section.color }}>
                  {section.label} ({section.files.length} files)
                </h3>
                <div className="grid gap-1">
                  {section.files.map((f) => (
                    <div
                      key={f.filename}
                      className="flex items-center gap-2 px-3 py-1.5 rounded border border-border/50 bg-card/30 text-xs"
                    >
                      <span className="font-mono text-muted-foreground flex-1 truncate">{f.filename}</span>
                      <button
                        onClick={async () => {
                          await navigator.clipboard.writeText(f.content);
                          toast.success(`Copied ${f.filename}`);
                        }}
                        className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                        title="Copy contents"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
