import { useState, useCallback, useMemo } from 'react';
import type { ColorHarmony, SemanticPalette, PaletteExport } from '@fetchkit/brand';
import { generateSemanticPalette, bundlePaletteExport } from '@fetchkit/brand';

interface UsePaletteGeneratorReturn {
  seedColor: string;
  setSeedColor: (hex: string) => void;
  harmony: ColorHarmony;
  setHarmony: (h: ColorHarmony) => void;
  palette: SemanticPalette;
  exportData: PaletteExport;
  downloadZip: () => Promise<void>;
}

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
  };
}
