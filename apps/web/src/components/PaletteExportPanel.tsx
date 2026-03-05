import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import type { PaletteExport } from '@fetchkit/brand';

interface PaletteExportPanelProps {
  exportData: PaletteExport | null;
  onDownloadZip: () => Promise<void>;
}

function CodeBlock({ label, code }: { label: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">{label}</h4>
        <Button variant="outline" size="sm" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </div>
      <pre className="border rounded-lg p-4 text-xs overflow-x-auto bg-muted/50">
        {code}
      </pre>
    </div>
  );
}

export function PaletteExportPanel({ exportData, onDownloadZip }: PaletteExportPanelProps) {
  if (!exportData) {
    return (
      <p className="text-sm text-muted-foreground">
        Generate a palette first to see export options.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <CodeBlock
          label="CSS Custom Properties (Light + Dark)"
          code={exportData.cssVariables}
        />
        <CodeBlock
          label="Tailwind Config"
          code={exportData.tailwindConfig}
        />
        <CodeBlock
          label="Design Tokens (JSON)"
          code={exportData.tokensJson}
        />
      </div>

      <Button onClick={onDownloadZip}>
        Download All as ZIP
      </Button>
    </div>
  );
}
