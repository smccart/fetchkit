import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ColorHarmony, SemanticPalette, WcagLevel } from '@fetchkit/brand';

interface PalettePanelProps {
  seedColor: string;
  onSeedColorChange: (hex: string) => void;
  harmony: ColorHarmony;
  onHarmonyChange: (h: ColorHarmony) => void;
  onGenerate: () => void;
  palette: SemanticPalette | null;
}

const HARMONIES: { value: ColorHarmony; label: string }[] = [
  { value: 'analogous', label: 'Analogous' },
  { value: 'complementary', label: 'Complementary' },
  { value: 'triadic', label: 'Triadic' },
  { value: 'split-complementary', label: 'Split Comp.' },
  { value: 'monochromatic', label: 'Monochromatic' },
];

const SHADE_KEYS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];

function ContrastBadge({ level }: { level: WcagLevel }) {
  const bg =
    level === 'AAA' ? 'bg-green-100 text-green-800' :
    level === 'AA' ? 'bg-yellow-100 text-yellow-800' :
    'bg-red-100 text-red-800';
  return (
    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${bg}`}>
      {level}
    </span>
  );
}

export function PalettePanel({
  seedColor,
  onSeedColorChange,
  harmony,
  onHarmonyChange,
  onGenerate,
  palette,
}: PalettePanelProps) {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="flex flex-wrap items-end gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Seed Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={seedColor}
              onChange={(e) => onSeedColorChange(e.target.value)}
              className="h-9 w-12 rounded border cursor-pointer"
            />
            <Input
              value={seedColor}
              onChange={(e) => onSeedColorChange(e.target.value)}
              className="w-28 font-mono text-sm"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Harmony</label>
          <div className="flex gap-1">
            {HARMONIES.map((h) => (
              <button
                key={h.value}
                onClick={() => onHarmonyChange(h.value)}
                className={`text-xs px-2.5 py-1.5 rounded-md border transition-colors ${
                  harmony === h.value
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-background text-muted-foreground border-border hover:border-foreground'
                }`}
              >
                {h.label}
              </button>
            ))}
          </div>
        </div>

        <Button onClick={onGenerate}>Generate Palette</Button>
      </div>

      {/* Palette Display */}
      {palette && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">{palette.name}</h3>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-xs px-2.5 py-1 rounded-md border border-border hover:border-foreground transition-colors"
            >
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>

          <div
            className={`grid gap-6 p-6 rounded-xl border ${
              darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-border'
            }`}
          >
            {Object.entries(palette.colors).map(([name, color]) => (
              <div key={name} className="space-y-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded-full border border-black/10"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className={`text-sm font-medium capitalize ${darkMode ? 'text-zinc-200' : ''}`}>
                    {name}
                  </span>
                  <span className={`text-xs font-mono ${darkMode ? 'text-zinc-500' : 'text-muted-foreground'}`}>
                    {color.hex}
                  </span>
                  <ContrastBadge level={darkMode ? color.contrastOnBlack.levelNormal : color.contrastOnWhite.levelNormal} />
                </div>
                <p className={`text-xs ${darkMode ? 'text-zinc-500' : 'text-muted-foreground'}`}>
                  {color.role}
                </p>
                <div className="flex gap-0.5 rounded-lg overflow-hidden">
                  {SHADE_KEYS.map((shade) => (
                    <div
                      key={shade}
                      className="flex-1 h-8 group relative"
                      style={{ backgroundColor: color.shades[shade] }}
                      title={`${shade}: ${color.shades[shade]}`}
                    >
                      <span className="absolute inset-0 flex items-center justify-center text-[8px] font-mono opacity-0 group-hover:opacity-100 transition-opacity mix-blend-difference text-white">
                        {shade}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
