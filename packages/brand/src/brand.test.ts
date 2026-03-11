import { describe, it, expect } from 'vitest';
import {
  generateSemanticPalette,
  generatePaletteFromName,
  computeContrastRatio,
  generateShadeScale,
  generateCssVariables,
  generateTailwindColors,
  generateColorTokensJson,
  generateBrandGuidelines,
  generateLetterhead,
  generateAppIcon,
  generateEmailSignature,
  buildFaviconSvg,
  generateManifest,
  generateHtmlSnippet,
} from './index';
import type { ColorPalette, FontConfig } from './index';

describe('palette generation', () => {
  it('generates a semantic palette from seed color', () => {
    const palette = generateSemanticPalette('#6366f1');
    expect(palette.colors.primary.hex).toBeTruthy();
    expect(palette.colors.secondary.hex).toBeTruthy();
    expect(palette.colors.surface.hex).toBeTruthy();
  });

  it('generates deterministic palette from name', () => {
    const a = generatePaletteFromName('Acme');
    const b = generatePaletteFromName('Acme');
    expect(a.colors.primary.hex).toBe(b.colors.primary.hex);
  });

  it('generates different palettes for different names', () => {
    const a = generatePaletteFromName('Acme');
    const b = generatePaletteFromName('Nexus');
    expect(a.colors.primary.hex).not.toBe(b.colors.primary.hex);
  });

  it('computes contrast ratio', () => {
    const result = computeContrastRatio('#000000', '#ffffff');
    expect(result.ratio).toBeCloseTo(21, 0);
  });

  it('generates shade scale', () => {
    const shades = generateShadeScale('#6366f1');
    expect(shades['500']).toBeTruthy();
    expect(shades['50']).toBeTruthy();
    expect(shades['950']).toBeTruthy();
  });
});

describe('design tokens', () => {
  const colors: ColorPalette = {
    name: 'test',
    iconColor: '#6366f1',
    letterColors: ['#8b5cf6', '#1a1a2e'],
  };

  it('generates CSS variables', () => {
    const css = generateCssVariables(colors);
    expect(css).toContain('--brand-');
    expect(css).toContain('#6366f1');
  });

  it('generates Tailwind colors', () => {
    const tw = generateTailwindColors(colors);
    expect(tw).toContain('brand');
    expect(tw).toContain('6366f1');
  });

  it('generates JSON tokens', () => {
    const json = generateColorTokensJson(colors);
    const parsed = JSON.parse(json);
    expect(parsed.brand.color.primary.value).toBe('#6366f1');
  });
});

describe('brand guidelines', () => {
  it('generates markdown guidelines', () => {
    const colors: ColorPalette = {
      name: 'test',
      iconColor: '#6366f1',
      letterColors: ['#8b5cf6', '#1a1a2e'],
    };
    const font: FontConfig = { family: 'Inter', weight: 700, category: 'sans-serif' };
    const result = generateBrandGuidelines({
      companyName: 'Acme',
      colors,
      font,
    });
    expect(result.markdown).toContain('Acme');
    expect(result.markdown).toContain('Brand Guidelines');
    expect(result.colorTable).toContain('Icon');
  });
});

describe('letterhead', () => {
  it('generates SVG letterhead', () => {
    const result = generateLetterhead({
      companyName: 'Acme',
      website: 'https://acme.com',
      colors: { primary: '#6366f1', secondary: '#8b5cf6', text: '#1a1a2e' },
      font: { family: 'Inter', category: 'sans-serif' },
    });
    expect(result.svg).toContain('<svg');
    expect(result.headerHtml).toContain('Acme');
    expect(result.printCss).toContain('@media print');
  });
});

describe('app icon', () => {
  it('generates app icons at multiple sizes', () => {
    const result = generateAppIcon({
      iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z"/></svg>',
      iconColor: '#6366f1',
    });
    expect(result.sizes.length).toBeGreaterThan(0);
    expect(result.sizes[0].svg).toContain('<svg');
    expect(result.manifestEntry).toContain('src');
  });
});

describe('email signature', () => {
  it('generates HTML and text signatures', () => {
    const result = generateEmailSignature({
      name: 'Jane Doe',
      title: 'CEO',
      companyName: 'Acme',
      email: 'jane@acme.com',
      colors: { primary: '#6366f1' },
      font: { family: 'Inter', category: 'sans-serif' },
    });
    expect(result.html).toContain('Jane Doe');
    expect(result.html).toContain('table');
    expect(result.plainText).toContain('Jane Doe');
  });
});

describe('favicon', () => {
  it('generates favicon SVG', () => {
    const svg = buildFaviconSvg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0" fill="currentColor"/></svg>',
      '#6366f1',
    );
    expect(svg).toContain('<svg');
    expect(svg).toContain('#6366f1');
  });

  it('generates manifest JSON', () => {
    const manifest = generateManifest('Acme');
    const parsed = JSON.parse(manifest);
    expect(parsed.name).toBe('Acme');
    expect(parsed.icons).toBeDefined();
  });

  it('generates HTML snippet', () => {
    const html = generateHtmlSnippet();
    expect(html).toContain('<link');
    expect(html).toContain('favicon');
  });
});
