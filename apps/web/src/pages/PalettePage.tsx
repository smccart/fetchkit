import { useState } from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { PalettePanel } from '@/components/PalettePanel';
import { PaletteExportPanel } from '@/components/PaletteExportPanel';
import { usePaletteGenerator } from '@/hooks/usePaletteGenerator';
import { useSiteColor } from '@/hooks/useSiteColor';
import { useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pipette, Sparkles } from 'lucide-react';

export default function PalettePage() {
  usePageTitle('Color Palette');
  const [searchParams] = useSearchParams();
  const initialSeed = searchParams.get('seed') || '#6366f1';
  const paletteGen = usePaletteGenerator(initialSeed);
  const { color } = useSiteColor();
  const [brandName, setBrandName] = useState('');

  const handleGenerateFromName = (e: React.FormEvent) => {
    e.preventDefault();
    if (brandName.trim()) {
      paletteGen.generateFromName(brandName.trim());
    }
  };

  return (
    <div className="flex-1 container mx-auto px-6 py-8 space-y-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Color Palette Generator</h1>
        <p className="text-sm text-muted-foreground">
          Generate semantic color palettes with contrast data, shade scales, and agent-ready metadata.
        </p>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap items-end gap-4">
        <form onSubmit={handleGenerateFromName} className="space-y-1.5">
          <label className="text-sm font-medium">Generate from brand name</label>
          <div className="flex items-center gap-2">
            <Input
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="e.g. Acme Corp"
              className="w-48 text-sm"
            />
            <Button type="submit" variant="outline" size="sm" disabled={!brandName.trim()}>
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Generate
            </Button>
          </div>
        </form>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Quick start</label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => paletteGen.setSeedColor(color)}
            className="flex items-center gap-1.5"
          >
            <Pipette className="h-3.5 w-3.5" />
            Use brand color
            <div
              className="h-3 w-3 rounded-full border border-border ml-0.5"
              style={{ backgroundColor: color }}
            />
          </Button>
        </div>
      </div>

      {/* Palette controls + display */}
      <PalettePanel
        seedColor={paletteGen.seedColor}
        onSeedColorChange={paletteGen.setSeedColor}
        harmony={paletteGen.harmony}
        onHarmonyChange={paletteGen.setHarmony}
        palette={paletteGen.palette}
        onRandomize={paletteGen.randomize}
      />

      {/* Export */}
      <div className="border-t border-border pt-10">
        <h2 className="text-lg font-bold mb-6">Export</h2>
        <PaletteExportPanel
          exportData={paletteGen.exportData}
          onDownloadZip={paletteGen.downloadZip}
        />
      </div>
    </div>
  );
}
