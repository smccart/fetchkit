import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PalettePanel } from '@/components/PalettePanel';
import { PaletteExportPanel } from '@/components/PaletteExportPanel';
import { usePaletteGenerator } from '@/hooks/usePaletteGenerator';
import { useSearchParams } from 'react-router-dom';

export default function PalettePage() {
  const [searchParams] = useSearchParams();
  const initialSeed = searchParams.get('seed') || '#6366f1';
  const paletteGen = usePaletteGenerator(initialSeed);

  return (
    <div className="flex-1 container mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Color Palette Generator</h1>
        <p className="text-sm text-muted-foreground">
          Generate semantic color palettes with contrast data, shade scales, and agent-ready metadata.
        </p>
      </div>

      <Tabs defaultValue="palette">
        <TabsList className="mb-6">
          <TabsTrigger value="palette">Palette</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="palette">
          <PalettePanel
            seedColor={paletteGen.seedColor}
            onSeedColorChange={paletteGen.setSeedColor}
            harmony={paletteGen.harmony}
            onHarmonyChange={paletteGen.setHarmony}
            palette={paletteGen.palette}
          />
        </TabsContent>

        <TabsContent value="export">
          <PaletteExportPanel
            exportData={paletteGen.exportData}
            onDownloadZip={paletteGen.downloadZip}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
