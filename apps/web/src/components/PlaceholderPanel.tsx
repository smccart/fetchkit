import { Button } from '@/components/ui/button';
import { PlaceholderCard } from '@/components/PlaceholderCard';
import type { PlaceholderBundle, PlaceholderImage } from '@fetchkit/brand';

interface PlaceholderPanelProps {
  bundle: PlaceholderBundle | null;
  isGenerating: boolean;
  onDownloadAll: () => Promise<void>;
  onDownloadSingle: (image: PlaceholderImage) => void;
}

export function PlaceholderPanel({
  bundle,
  isGenerating,
  onDownloadAll,
  onDownloadSingle,
}: PlaceholderPanelProps) {
  if (isGenerating && !bundle) {
    return <p className="text-sm text-muted-foreground">Generating placeholders...</p>;
  }

  if (!bundle) return null;

  const basicImages = bundle.images.filter((img) => !img.category.startsWith('screenshot-'));
  const screenshotImages = bundle.images.filter((img) => img.category.startsWith('screenshot-'));

  const sections = [
    { title: 'Basic', images: basicImages },
    { title: 'Screenshots', images: screenshotImages },
  ].filter((s) => s.images.length > 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {bundle.images.length} placeholder{bundle.images.length !== 1 ? 's' : ''} generated
          {isGenerating && ' — updating...'}
        </p>
        <Button variant="outline" onClick={onDownloadAll}>
          Download All as ZIP
        </Button>
      </div>

      {sections.map((section) => (
        <div key={section.title} className="space-y-4">
          <h2 className="text-lg font-semibold">{section.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {section.images.map((image) => (
              <PlaceholderCard
                key={image.id}
                image={image}
                onDownload={onDownloadSingle}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
