import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ExportPanel } from '@/components/ExportPanel';
import type { LogoConfig } from '@/lib/types';

export default function ExportPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [config, setConfig] = useState<LogoConfig | null>(null);

  useEffect(() => {
    const state = location.state as { config?: LogoConfig } | null;
    if (state?.config) {
      setConfig(state.config);
    } else {
      navigate('/create');
    }
  }, [location.state, navigate]);

  if (!config) return null;

  return (
    <div className="flex-1 container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Export Your Logo</h1>
          <p className="text-sm text-muted-foreground">
            Download your logo in SVG format for both light and dark backgrounds.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Back to Refine
          </Button>
          <Button variant="outline" onClick={() => navigate('/create')}>
            Start Over
          </Button>
        </div>
      </div>

      <ExportPanel config={config} />
    </div>
  );
}
