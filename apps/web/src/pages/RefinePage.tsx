import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogoGrid } from '@/components/LogoGrid';
import { LogoCanvas } from '@/components/LogoCanvas';
import { IconPicker } from '@/components/IconPicker';
import { FontPicker } from '@/components/FontPicker';
import { ColorEditor } from '@/components/ColorEditor';
import { useInfiniteLogos } from '@/hooks/useInfiniteLogos';
import type { FontConfig, IconConfig, ColorPalette } from '@fetchkit/brand';

export default function RefinePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { companyName?: string } | null;
  const companyName = state?.companyName ?? '';

  const {
    variations,
    isInitialLoading,
    isLoadingMore,
    hasMore,
    generateInitial,
    loadMore,
    selected,
    select,
    updateFont,
    updateIcon,
    updateColors,
  } = useInfiniteLogos(companyName);

  useEffect(() => {
    if (!companyName) {
      navigate('/create');
      return;
    }
    generateInitial();
  }, [companyName, navigate, generateInitial]);

  const handleExport = () => {
    if (selected) {
      navigate('/create/export', { state: { config: selected.config } });
    }
  };

  return (
    <div className="flex-1 container mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Choose Your Logo</h1>
          <p className="text-sm text-muted-foreground">
            {isInitialLoading
              ? 'Searching for icons and generating logos...'
              : 'Click a logo to select it, then customize it below. Scroll for more variations.'}
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/create')}>
          Start Over
        </Button>
      </div>

      {/* Logo Grid with Infinite Scroll */}
      <LogoGrid
        variations={variations}
        selectedId={selected?.id ?? null}
        onSelect={select}
        onLoadMore={loadMore}
        isLoadingMore={isInitialLoading || isLoadingMore}
        hasMore={hasMore}
      />

      {/* Refinement Panel */}
      {selected && (
        <div className="mt-8 border-t pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
            {/* Preview */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Preview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-xl p-8 bg-white flex items-center justify-center">
                  <LogoCanvas config={selected.config} layout="horizontal" />
                </div>
                <div className="border rounded-xl p-8 bg-white flex items-center justify-center">
                  <LogoCanvas config={selected.config} layout="vertical" />
                </div>
                <div className="border rounded-xl p-8 bg-gray-900 flex items-center justify-center">
                  <LogoCanvas config={selected.config} layout="horizontal" />
                </div>
                <div className="border rounded-xl p-8 bg-gray-900 flex items-center justify-center">
                  <LogoCanvas config={selected.config} layout="vertical" />
                </div>
              </div>
              <div className="flex justify-center">
                <Button size="lg" onClick={handleExport}>
                  Export This Logo
                </Button>
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-6 border rounded-xl p-4">
              <IconPicker
                currentIcon={selected.config.icon}
                onSelect={(icon: IconConfig) => updateIcon(icon)}
              />
              <FontPicker
                currentFont={selected.config.font}
                onSelect={(font: FontConfig) => updateFont(font)}
              />
              <ColorEditor
                companyName={selected.config.companyName}
                currentColors={selected.config.colors}
                onChange={(colors: ColorPalette) => updateColors(colors)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
