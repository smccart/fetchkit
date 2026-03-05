import type {
  ColorHarmony,
  ContrastResult,
  SemanticColor,
  SemanticPalette,
  WcagLevel,
} from './types';

// --- HSL Utilities ---

interface HSL {
  h: number;
  s: number;
  l: number;
}

function hexToRgb(hex: string): [number, number, number] {
  const num = parseInt(hex.replace('#', ''), 16);
  return [(num >> 16) & 0xff, (num >> 8) & 0xff, num & 0xff];
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

function rgbToHsl(r: number, g: number, b: number): HSL {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
  else if (max === gn) h = ((bn - rn) / d + 2) / 6;
  else h = ((rn - gn) / d + 4) / 6;
  return { h: h * 360, s, l };
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const hue = ((h % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (hue < 60) { r = c; g = x; }
  else if (hue < 120) { r = x; g = c; }
  else if (hue < 180) { g = c; b = x; }
  else if (hue < 240) { g = x; b = c; }
  else if (hue < 300) { r = x; b = c; }
  else { r = c; b = x; }
  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
}

function hexToHsl(hex: string): HSL {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHsl(r, g, b);
}

function hslToHex(h: number, s: number, l: number): string {
  const [r, g, b] = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
}

// --- WCAG Contrast ---

function linearize(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

function wcagLevel(ratio: number, threshold: number): WcagLevel {
  // For normal text: AA = 4.5, AAA = 7
  // For large text: AA = 3, AAA = 4.5
  if (threshold === 4.5) {
    if (ratio >= 7) return 'AAA';
    if (ratio >= 4.5) return 'AA';
    return 'fail';
  }
  // large text thresholds
  if (ratio >= 4.5) return 'AAA';
  if (ratio >= 3) return 'AA';
  return 'fail';
}

export function computeContrastRatio(fg: string, bg: string): ContrastResult {
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  const ratio = parseFloat(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
  return {
    foreground: fg,
    background: bg,
    ratio,
    levelNormal: wcagLevel(ratio, 4.5),
    levelLarge: wcagLevel(ratio, 3),
  };
}

// --- Shade Scale ---

export function generateShadeScale(hex: string): Record<string, string> {
  const { h, s } = hexToHsl(hex);
  // Shade scale from very light (50) to very dark (950)
  const stops: [string, number][] = [
    ['50', 0.97],
    ['100', 0.94],
    ['200', 0.86],
    ['300', 0.76],
    ['400', 0.64],
    ['500', 0.50],
    ['600', 0.40],
    ['700', 0.32],
    ['800', 0.24],
    ['900', 0.17],
    ['950', 0.10],
  ];
  const shades: Record<string, string> = {};
  for (const [name, l] of stops) {
    // Reduce saturation for very light/dark shades
    const satAdj = l > 0.8 ? s * 0.6 : l < 0.2 ? s * 0.8 : s;
    shades[name] = hslToHex(h, satAdj, l);
  }
  return shades;
}

// --- Harmony Generation ---

function harmonyHues(seedHue: number, harmony: ColorHarmony): number[] {
  switch (harmony) {
    case 'complementary':
      return [seedHue, (seedHue + 180) % 360];
    case 'analogous':
      return [seedHue, (seedHue + 30) % 360, (seedHue + 330) % 360];
    case 'triadic':
      return [seedHue, (seedHue + 120) % 360, (seedHue + 240) % 360];
    case 'split-complementary':
      return [seedHue, (seedHue + 150) % 360, (seedHue + 210) % 360];
    case 'monochromatic':
      return [seedHue];
  }
}

function buildSemanticColor(
  hex: string,
  name: string,
  role: string,
): SemanticColor {
  return {
    hex,
    name,
    role,
    contrastOnWhite: computeContrastRatio(hex, '#ffffff'),
    contrastOnBlack: computeContrastRatio(hex, '#000000'),
    shades: generateShadeScale(hex),
  };
}

// --- Main Generator ---

export function generateSemanticPalette(
  seedHex: string,
  harmony: ColorHarmony = 'analogous',
): SemanticPalette {
  const seed = hexToHsl(seedHex);
  const hues = harmonyHues(seed.h, harmony);

  const primaryHex = hslToHex(hues[0], seed.s, Math.min(0.5, seed.l));
  const secondaryHue = hues[1] ?? (hues[0] + 30) % 360;
  const secondaryHex = hslToHex(secondaryHue, seed.s * 0.85, 0.45);
  const surfaceHex = hslToHex(hues[0], seed.s * 0.1, 0.96);

  // Fixed semantic hues adjusted by seed saturation
  const sat = Math.max(0.5, seed.s);
  const errorHex = hslToHex(0, sat, 0.45);
  const warningHex = hslToHex(45, sat, 0.50);
  const successHex = hslToHex(140, sat * 0.9, 0.40);
  const infoHex = hslToHex(210, sat, 0.50);

  const colors = {
    primary: buildSemanticColor(primaryHex, 'primary', 'Primary brand color. Use for CTAs, active states, and key UI elements.'),
    secondary: buildSemanticColor(secondaryHex, 'secondary', 'Secondary brand color. Use for accents, secondary buttons, and supporting elements.'),
    surface: buildSemanticColor(surfaceHex, 'surface', 'Background surface color. Use for cards, panels, and page backgrounds.'),
    error: buildSemanticColor(errorHex, 'error', 'Error state color. Use for error messages, destructive actions, and validation failures.'),
    warning: buildSemanticColor(warningHex, 'warning', 'Warning state color. Use for caution messages and non-critical alerts.'),
    success: buildSemanticColor(successHex, 'success', 'Success state color. Use for success messages, confirmations, and positive states.'),
    info: buildSemanticColor(infoHex, 'info', 'Informational color. Use for tips, help text, and neutral informational elements.'),
  };

  // Build light/dark mode flat maps
  const light: Record<string, string> = {};
  const dark: Record<string, string> = {};
  for (const [key, color] of Object.entries(colors)) {
    light[`--color-${key}`] = color.hex;
    for (const [shade, value] of Object.entries(color.shades)) {
      light[`--color-${key}-${shade}`] = value;
    }
    // Dark mode: invert shade scale
    const shadeEntries = Object.entries(color.shades);
    const reversed = [...shadeEntries].reverse();
    dark[`--color-${key}`] = color.shades['300'] ?? color.hex;
    for (let i = 0; i < shadeEntries.length; i++) {
      dark[`--color-${shadeEntries[i][0]}-${key}`] = reversed[i][1];
    }
  }

  // Fix dark mode key format to match light
  const darkFixed: Record<string, string> = {};
  for (const [key, color] of Object.entries(colors)) {
    darkFixed[`--color-${key}`] = color.shades['300'] ?? color.hex;
    const shadeEntries = Object.entries(color.shades);
    const reversed = [...shadeEntries].reverse();
    for (let i = 0; i < shadeEntries.length; i++) {
      darkFixed[`--color-${key}-${shadeEntries[i][0]}`] = reversed[i][1];
    }
  }

  const harmonyLabel =
    harmony === 'split-complementary' ? 'Split Complementary' :
    harmony.charAt(0).toUpperCase() + harmony.slice(1);

  return {
    name: `${harmonyLabel} palette from ${seedHex}`,
    harmony,
    seedColor: seedHex,
    colors,
    light,
    dark: darkFixed,
    metadata: {
      generatedAt: new Date().toISOString(),
      guidelines: [
        'Use primary (500) for main CTAs and interactive elements.',
        'Use secondary for accents and supporting visual hierarchy.',
        'Surface colors should be used for backgrounds — pair with primary/secondary text.',
        'Error, warning, success, and info colors are pre-tuned for semantic UI states.',
        'All shade scales run from 50 (lightest) to 950 (darkest).',
        'Check contrastOnWhite/contrastOnBlack to ensure WCAG AA compliance for text.',
        'Dark mode swaps shade scale direction — 50 becomes darkest, 950 lightest.',
      ],
    },
  };
}

// --- Deterministic palette from brand name ---

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

export function generatePaletteFromName(brandName: string): SemanticPalette {
  const hash = hashString(brandName.toLowerCase().trim());
  const hue = hash % 360;
  const saturation = 0.55 + (((hash >> 8) % 30) / 100); // 0.55–0.85
  const lightness = 0.40 + (((hash >> 16) % 15) / 100); // 0.40–0.55
  const seedHex = hslToHex(hue, saturation, lightness);

  const harmonies: ColorHarmony[] = [
    'analogous', 'complementary', 'triadic', 'split-complementary', 'monochromatic',
  ];
  const harmony = harmonies[(hash >> 4) % harmonies.length];

  return generateSemanticPalette(seedHex, harmony);
}
