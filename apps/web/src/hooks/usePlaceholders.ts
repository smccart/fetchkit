import { useState, useCallback, useEffect, useRef } from 'react';
import type { PlaceholderBundle, PlaceholderCategory, PlaceholderImage } from '@fetchkit/brand';
import { generatePlaceholderBundle } from '@fetchkit/brand';

const ALL_CATEGORIES: PlaceholderCategory[] = [
  'hero', 'avatar', 'product', 'chart', 'team', 'background', 'pattern', 'icon-grid',
  'screenshot-dashboard', 'screenshot-table', 'screenshot-chat', 'screenshot-editor', 'screenshot-settings', 'screenshot-landing',
];

interface UsePlaceholdersReturn {
  bundle: PlaceholderBundle | null;
  isGenerating: boolean;
  color: string;
  setColor: (hex: string) => void;
  selectedCategories: PlaceholderCategory[];
  setSelectedCategories: (cats: PlaceholderCategory[]) => void;
  downloadAll: () => Promise<void>;
  downloadSingle: (image: PlaceholderImage) => void;
}

export function usePlaceholders(initialColor: string = '#6366f1'): UsePlaceholdersReturn {
  const [bundle, setBundle] = useState<PlaceholderBundle | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [color, setColor] = useState(initialColor);
  const [selectedCategories, setSelectedCategories] = useState<PlaceholderCategory[]>(ALL_CATEGORIES);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Auto-generate whenever color or categories change (debounced)
  useEffect(() => {
    if (selectedCategories.length === 0) return;

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsGenerating(true);
      // Use setTimeout(0) to avoid blocking UI during synchronous generation
      setTimeout(() => {
        const result = generatePlaceholderBundle([color], selectedCategories);
        setBundle(result);
        setIsGenerating(false);
      }, 0);
    }, 150);

    return () => clearTimeout(timerRef.current);
  }, [color, selectedCategories]);

  const downloadAll = useCallback(async () => {
    if (!bundle) return;
    const { default: JSZip } = await import('jszip');
    const zip = new JSZip();

    for (const image of bundle.images) {
      zip.file(`${image.category}.svg`, image.svg);
    }
    zip.file('manifest.json', JSON.stringify(bundle.manifest, null, 2));

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'placeholders.zip';
    a.click();
    URL.revokeObjectURL(url);
  }, [bundle]);

  const downloadSingle = useCallback((image: PlaceholderImage) => {
    const blob = new Blob([image.svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${image.category}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  return {
    bundle,
    isGenerating,
    color,
    setColor,
    selectedCategories,
    setSelectedCategories,
    downloadAll,
    downloadSingle,
  };
}
