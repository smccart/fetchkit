import { useState, useCallback, useMemo } from 'react';
import type { ColorHarmony, SemanticPalette, PaletteExport } from '@fetchkit/brand';
import { generateSemanticPalette, generatePaletteFromName, bundlePaletteExport } from '@fetchkit/brand';

interface UsePaletteGeneratorReturn {
  seedColor: string;
  setSeedColor: (hex: string) => void;
  harmony: ColorHarmony;
  setHarmony: (h: ColorHarmony) => void;
  palette: SemanticPalette;
  exportData: PaletteExport;
  downloadZip: () => Promise<void>;
  generateFromName: (name: string) => void;
  randomize: () => void;
}

const HARMONIES: ColorHarmony[] = [
  'analogous', 'complementary', 'triadic', 'split-complementary', 'monochromatic',
];

export function usePaletteGenerator(
  initialSeed: string = '#6366f1',
): UsePaletteGeneratorReturn {
  const [seedColor, setSeedColor] = useState(initialSeed);
  const [harmony, setHarmony] = useState<ColorHarmony>('analogous');

  const palette = useMemo(
    () => generateSemanticPalette(seedColor, harmony),
    [seedColor, harmony],
  );

  const exportData = useMemo(
    () => bundlePaletteExport(palette),
    [palette],
  );

  const generateFromName = useCallback((name: string) => {
    const result = generatePaletteFromName(name);
    setSeedColor(result.seedColor);
    setHarmony(result.harmony);
  }, []);

  const randomize = useCallback(() => {
    const hue = Math.floor(Math.random() * 360);
    const sat = 50 + Math.floor(Math.random() * 40);
    const lit = 35 + Math.floor(Math.random() * 25);
    // Convert HSL to hex for the seed color
    const h = hue / 360;
    const s = sat / 100;
    const l = lit / 100;
    const a2 = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h * 12) % 12;
      const c = l - a2 * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * c).toString(16).padStart(2, '0');
    };
    setSeedColor(`#${f(0)}${f(8)}${f(4)}`);
    setHarmony(HARMONIES[Math.floor(Math.random() * HARMONIES.length)]);
  }, []);

  const downloadZip = useCallback(async () => {
    if (!exportData) return;
    const { default: JSZip } = await import('jszip');
    const zip = new JSZip();

    zip.file('palette.css', exportData.cssVariables);
    zip.file('tailwind-colors.js', exportData.tailwindConfig);
    zip.file('tokens.json', exportData.tokensJson);
    zip.file('manifest.json', JSON.stringify({
      name: exportData.palette.name,
      harmony: exportData.palette.harmony,
      seedColor: exportData.palette.seedColor,
      generatedAt: exportData.palette.metadata.generatedAt,
      files: ['palette.css', 'tailwind-colors.js', 'tokens.json'],
    }, null, 2));

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'palette.zip';
    a.click();
    URL.revokeObjectURL(url);
  }, [exportData]);

  return {
    seedColor,
    setSeedColor,
    harmony,
    setHarmony,
    palette,
    exportData,
    downloadZip,
    generateFromName,
    randomize,
  };
}
