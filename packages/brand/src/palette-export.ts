import type { PaletteExport, SemanticPalette } from './types';

export function generatePaletteCssVariables(
  palette: SemanticPalette,
  mode: 'light' | 'dark' = 'light',
): string {
  const vars = mode === 'light' ? palette.light : palette.dark;
  const entries = Object.entries(vars)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n');

  if (mode === 'dark') {
    return `[data-theme="dark"] {\n${entries}\n}`;
  }
  return `:root {\n${entries}\n}`;
}

export function generatePaletteTailwindConfig(palette: SemanticPalette): string {
  const colorEntries: string[] = [];

  for (const [name, color] of Object.entries(palette.colors)) {
    const shadeLines = Object.entries(color.shades)
      .map(([shade, hex]) => `          ${shade}: '${hex}',`)
      .join('\n');
    colorEntries.push(`        ${name}: {\n          DEFAULT: '${color.hex}',\n${shadeLines}\n        },`);
  }

  return `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
${colorEntries.join('\n')}
      },
    },
  },
};`;
}

export function generatePaletteTokensJson(palette: SemanticPalette): string {
  const tokens: Record<string, unknown> = {};

  for (const [name, color] of Object.entries(palette.colors)) {
    tokens[name] = {
      value: color.hex,
      type: 'color',
      role: color.role,
      contrast: {
        onWhite: {
          ratio: color.contrastOnWhite.ratio,
          levelNormal: color.contrastOnWhite.levelNormal,
          levelLarge: color.contrastOnWhite.levelLarge,
        },
        onBlack: {
          ratio: color.contrastOnBlack.ratio,
          levelNormal: color.contrastOnBlack.levelNormal,
          levelLarge: color.contrastOnBlack.levelLarge,
        },
      },
      shades: color.shades,
    };
  }

  return JSON.stringify(
    {
      palette: {
        name: palette.name,
        harmony: palette.harmony,
        seedColor: palette.seedColor,
        colors: tokens,
        metadata: palette.metadata,
      },
    },
    null,
    2,
  );
}

export function bundlePaletteExport(palette: SemanticPalette): PaletteExport {
  const lightCss = generatePaletteCssVariables(palette, 'light');
  const darkCss = generatePaletteCssVariables(palette, 'dark');

  return {
    cssVariables: `${lightCss}\n\n${darkCss}`,
    tailwindConfig: generatePaletteTailwindConfig(palette),
    tokensJson: generatePaletteTokensJson(palette),
    palette,
  };
}
