export interface FontConfig {
  family: string;
  weight: number;
  category: 'serif' | 'sans-serif' | 'display' | 'handwriting' | 'monospace';
}

export interface IconConfig {
  id: string;
  name: string;
  svg: string;
}

export interface ColorPalette {
  name: string;
  iconColor: string;
  letterColors: string[];
}

export interface LogoConfig {
  companyName: string;
  font: FontConfig;
  icon: IconConfig;
  colors: ColorPalette;
}

export interface LogoVariation {
  id: string;
  config: LogoConfig;
}

export type LayoutDirection = 'horizontal' | 'vertical';
export type ColorMode = 'light' | 'dark';
