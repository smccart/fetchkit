import { PlaceholderPanel } from '@/components/PlaceholderPanel';
import { usePlaceholders } from '@/hooks/usePlaceholders';

export default function PlaceholdersPage() {
  const placeholders = usePlaceholders();

  return (
    <div className="flex-1 container mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Placeholder Images</h1>
        <p className="text-sm text-muted-foreground">
          Generate themed SVG placeholders for heroes, avatars, products, charts, and more.
        </p>
      </div>

      <PlaceholderPanel
        bundle={placeholders.bundle}
        isGenerating={placeholders.isGenerating}
        selectedCategories={placeholders.selectedCategories}
        onSelectedCategoriesChange={placeholders.setSelectedCategories}
        onGenerate={placeholders.generate}
        onDownloadAll={placeholders.downloadAll}
        onDownloadSingle={placeholders.downloadSingle}
      />
    </div>
  );
}
