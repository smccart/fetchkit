import type { FontConfig } from './types';

export const CURATED_FONTS: FontConfig[] = [
  // Sans-serif
  { family: 'Montserrat', weight: 700, category: 'sans-serif' },
  { family: 'Oswald', weight: 600, category: 'sans-serif' },
  { family: 'Raleway', weight: 700, category: 'sans-serif' },
  { family: 'Poppins', weight: 700, category: 'sans-serif' },
  { family: 'Inter', weight: 700, category: 'sans-serif' },
  { family: 'Archivo Black', weight: 400, category: 'sans-serif' },
  { family: 'Space Grotesk', weight: 700, category: 'sans-serif' },
  { family: 'Quicksand', weight: 700, category: 'sans-serif' },
  { family: 'Nunito', weight: 800, category: 'sans-serif' },
  { family: 'Jost', weight: 700, category: 'sans-serif' },
  { family: 'Urbanist', weight: 700, category: 'sans-serif' },
  { family: 'Sora', weight: 700, category: 'sans-serif' },
  { family: 'Plus Jakarta Sans', weight: 700, category: 'sans-serif' },
  { family: 'Be Vietnam Pro', weight: 700, category: 'sans-serif' },
  { family: 'DM Sans', weight: 700, category: 'sans-serif' },
  // Serif
  { family: 'Playfair Display', weight: 700, category: 'serif' },
  { family: 'Lora', weight: 700, category: 'serif' },
  { family: 'DM Serif Display', weight: 400, category: 'serif' },
  { family: 'Cinzel', weight: 700, category: 'serif' },
  { family: 'Bodoni Moda', weight: 700, category: 'serif' },
  { family: 'Fraunces', weight: 700, category: 'serif' },
  // Display
  { family: 'Abril Fatface', weight: 400, category: 'display' },
  { family: 'Bebas Neue', weight: 400, category: 'display' },
  { family: 'Comfortaa', weight: 700, category: 'display' },
  { family: 'Righteous', weight: 400, category: 'display' },
  { family: 'Syne', weight: 700, category: 'display' },
  { family: 'Exo 2', weight: 700, category: 'display' },
  { family: 'Epilogue', weight: 700, category: 'display' },
  { family: 'Barlow Condensed', weight: 700, category: 'display' },
  // Handwriting
  { family: 'Pacifico', weight: 400, category: 'handwriting' },
];

export function getFontUrl(font: FontConfig): string {
  const family = font.family.replace(/\s+/g, '+');
  return `https://fonts.googleapis.com/css2?family=${family}:wght@${font.weight}&display=swap`;
}
