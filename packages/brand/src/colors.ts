import type { ColorPalette, GradientDef, SemanticPalette } from './types';
import { generateSemanticPalette } from './palette-generator';

interface PaletteTemplate {
  name: string;
  colors: string[];
}

export const PALETTE_TEMPLATES: PaletteTemplate[] = [
  // Original 12
  { name: 'Ocean', colors: ['#0077B6', '#00B4D8', '#0096C7', '#023E8A', '#48CAE4', '#90E0EF'] },
  { name: 'Sunset', colors: ['#FF6B35', '#F7931E', '#FFB627', '#E63946', '#FF8C42', '#FFA62B'] },
  { name: 'Forest', colors: ['#2D6A4F', '#40916C', '#52B788', '#1B4332', '#74C69D', '#95D5B2'] },
  { name: 'Berry', colors: ['#7B2D8E', '#9B59B6', '#C39BD3', '#6C3483', '#A569BD', '#D2B4DE'] },
  { name: 'Ember', colors: ['#D62828', '#F77F00', '#FCBF49', '#E85D04', '#DC2F02', '#F48C06'] },
  { name: 'Midnight', colors: ['#1B263B', '#415A77', '#778DA9', '#0D1B2A', '#2B4570', '#5C7FA3'] },
  { name: 'Coral', colors: ['#FF6B6B', '#FF8E8E', '#FFA5A5', '#EE6C4D', '#F4845F', '#F7A072'] },
  { name: 'Mint', colors: ['#06D6A0', '#1B9AAA', '#07BEB8', '#3DCCC7', '#68D8D6', '#9CEAEF'] },
  { name: 'Slate', colors: ['#2F3E46', '#354F52', '#52796F', '#84A98C', '#3A5A40', '#588157'] },
  { name: 'Royal', colors: ['#3A0CA3', '#4361EE', '#4895EF', '#4CC9F0', '#560BAD', '#7209B7'] },
  { name: 'Autumn', colors: ['#BC6C25', '#DDA15E', '#606C38', '#283618', '#FEFAE0', '#9B8816'] },
  { name: 'Neon', colors: ['#00F5D4', '#00BBF9', '#FEE440', '#F15BB5', '#9B5DE5', '#FB5607'] },
  // Dark themes
  { name: 'Obsidian', colors: ['#1A1A2E', '#16213E', '#0F3460', '#E94560', '#533483', '#2B2D42'] },
  { name: 'Void', colors: ['#0B0C10', '#1F2833', '#C5C6C7', '#66FCF1', '#45A29E', '#202833'] },
  // Pastels
  { name: 'Blush', colors: ['#FFB5A7', '#FCD5CE', '#F8EDEB', '#F9DCC4', '#FEC89A', '#FFDDD2'] },
  { name: 'Lavender', colors: ['#E2CFEA', '#A06CD5', '#6247AA', '#B388EB', '#8B5CF6', '#C4B5FD'] },
  // Duotones
  { name: 'Electric', colors: ['#0D00A4', '#6002EE', '#FF6D00', '#FFAB00', '#304FFE', '#651FFF'] },
  { name: 'Contrast', colors: ['#0A1128', '#001F54', '#034078', '#1282A2', '#FEFCFB', '#6FFFE9'] },
  // Earth tones
  { name: 'Terra', colors: ['#8B4513', '#A0522D', '#CD853F', '#D2691E', '#DEB887', '#F4A460'] },
  { name: 'Clay', colors: ['#6B4226', '#87603E', '#C19A6B', '#D4A574', '#E3C09C', '#F0D8B8'] },
  // Neon-on-dark
  { name: 'Cyber', colors: ['#39FF14', '#00FFFF', '#FF00FF', '#FFFF00', '#FF3131', '#7DF9FF'] },
  { name: 'Plasma', colors: ['#FF006E', '#FB5607', '#FFBE0B', '#8338EC', '#3A86FF', '#06D6A0'] },
  // Cool tones
  { name: 'Arctic', colors: ['#A8DADC', '#457B9D', '#1D3557', '#F1FAEE', '#E63946', '#2A9D8F'] },
  { name: 'Steel', colors: ['#4A4E69', '#22223B', '#9A8C98', '#C9ADA7', '#F2E9E4', '#6B705C'] },
];

export function assignLetterColors(companyName: string, template: PaletteTemplate): ColorPalette {
  const letterColors: string[] = [];

  for (let i = 0; i < companyName.length; i++) {
    if (companyName[i] === ' ') {
      letterColors.push('transparent');
    } else {
      letterColors.push(template.colors[i % template.colors.length]);
    }
  }

  return {
    name: template.name,
    iconColor: template.colors[0],
    letterColors,
    fillMode: 'solid',
  };
}

// For monochrome logo styles - single color for all text
export function assignMonochromeColors(companyName: string, template: PaletteTemplate): ColorPalette {
  const mainColor = template.colors[0];
  const letterColors = Array.from(companyName).map((c) =>
    c === ' ' ? 'transparent' : mainColor,
  );

  return {
    name: `${template.name} Mono`,
    iconColor: template.colors[1] ?? mainColor,
    letterColors,
    fillMode: 'solid',
  };
}

// Gradient palette - one gradient per word
export function assignWordGradients(companyName: string, template: PaletteTemplate): ColorPalette {
  const words = companyName.split(' ');
  const gradients: GradientDef[] = words.map((_, wordIdx) => {
    const c1 = template.colors[(wordIdx * 2) % template.colors.length];
    const c2 = template.colors[(wordIdx * 2 + 1) % template.colors.length];
    return {
      id: `grad-${template.name.toLowerCase().replace(/\s+/g, '-')}-word${wordIdx}`,
      stops: [
        { color: c1, offset: 0 },
        { color: c2, offset: 1 },
      ],
      angle: 90,
      type: 'linear' as const,
    };
  });

  const iconGradient: GradientDef = {
    id: `grad-${template.name.toLowerCase().replace(/\s+/g, '-')}-icon`,
    stops: [
      { color: template.colors[0], offset: 0 },
      { color: template.colors[1], offset: 1 },
    ],
    angle: 135,
    type: 'linear',
  };

  // Solid fallback letterColors (for dark mode, favicons, social cards)
  const letterColors: string[] = [];
  for (let i = 0; i < companyName.length; i++) {
    if (companyName[i] === ' ') {
      letterColors.push('transparent');
    } else {
      letterColors.push(template.colors[i % template.colors.length]);
    }
  }

  return {
    name: `${template.name} Gradient`,
    iconColor: template.colors[0],
    letterColors,
    fillMode: 'gradient',
    gradients,
    iconGradient,
  };
}

function lightenHex(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.round(((num >> 16) & 0xff) + (255 - ((num >> 16) & 0xff)) * amount));
  const g = Math.min(255, Math.round(((num >> 8) & 0xff) + (255 - ((num >> 8) & 0xff)) * amount));
  const b = Math.min(255, Math.round((num & 0xff) + (255 - (num & 0xff)) * amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

export function getDarkModeColors(palette: ColorPalette): ColorPalette {
  return {
    ...palette,
    name: `${palette.name} (Dark)`,
    iconColor: lightenHex(palette.iconColor, 0.6),
    letterColors: palette.letterColors.map((c) =>
      c === 'transparent' ? 'transparent' : lightenHex(c, 0.5),
    ),
    // Resolve gradients to solid for dark mode
    fillMode: 'solid',
    gradients: undefined,
    iconGradient: undefined,
  };
}

export function semanticPaletteFromColorPalette(
  palette: ColorPalette,
): SemanticPalette {
  return generateSemanticPalette(palette.iconColor);
}
