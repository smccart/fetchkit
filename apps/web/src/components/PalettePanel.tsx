import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Shuffle } from 'lucide-react';
import type { ColorHarmony, SemanticPalette, WcagLevel } from '@fetchkit/brand';

interface PalettePanelProps {
  seedColor: string;
  onSeedColorChange: (hex: string) => void;
  harmony: ColorHarmony;
  onHarmonyChange: (h: ColorHarmony) => void;
  palette: SemanticPalette;
  onRandomize: () => void;
}

const HARMONIES: { value: ColorHarmony; label: string }[] = [
  { value: 'analogous', label: 'Analogous' },
  { value: 'complementary', label: 'Complementary' },
  { value: 'triadic', label: 'Triadic' },
  { value: 'split-complementary', label: 'Split Comp.' },
  { value: 'monochromatic', label: 'Monochromatic' },
];

const SHADE_KEYS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];

function ContrastBadge({ level, ratio }: { level: WcagLevel; ratio: number }) {
  const bg =
    level === 'AAA' ? 'bg-green-100 text-green-800' :
    level === 'AA' ? 'bg-yellow-100 text-yellow-800' :
    'bg-red-100 text-red-800';
  return (
    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${bg}`}>
      {level} {ratio.toFixed(1)}:1
    </span>
  );
}

function CopyHex({ hex, className }: { hex: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }, [hex]);

  return (
    <button
      onClick={handleCopy}
      className={`font-mono cursor-pointer hover:underline transition-colors ${className ?? ''}`}
      title="Click to copy"
    >
      {copied ? 'Copied!' : hex}
    </button>
  );
}

export function PalettePanel({
  seedColor,
  onSeedColorChange,
  harmony,
  onHarmonyChange,
  palette,
  onRandomize,
}: PalettePanelProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [copiedShade, setCopiedShade] = useState<string | null>(null);

  const copyShade = useCallback(async (hex: string, key: string) => {
    await navigator.clipboard.writeText(hex);
    setCopiedShade(key);
    setTimeout(() => setCopiedShade(null), 1200);
  }, []);

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
            <button
              onClick={onRandomize}
              className="h-9 px-2.5 rounded-md border border-border hover:border-foreground transition-colors text-muted-foreground hover:text-foreground"
              title="Randomize"
            >
              <Shuffle className="h-4 w-4" />
            </button>
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

      </div>

      {/* Palette Display */}
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
            {Object.entries(palette.colors).map(([name, color]) => {
              const contrast = darkMode ? color.contrastOnBlack : color.contrastOnWhite;
              return (
                <div key={name} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-5 h-5 rounded-full border border-black/10"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className={`text-sm font-medium capitalize ${darkMode ? 'text-zinc-200' : ''}`}>
                      {name}
                    </span>
                    <CopyHex
                      hex={color.hex}
                      className={`text-xs ${darkMode ? 'text-zinc-500' : 'text-muted-foreground'}`}
                    />
                    <ContrastBadge level={contrast.levelNormal} ratio={contrast.ratio} />
                  </div>
                  <p className={`text-xs ${darkMode ? 'text-zinc-500' : 'text-muted-foreground'}`}>
                    {color.role}
                  </p>
                  <div className="flex gap-0.5 rounded-lg overflow-hidden">
                    {SHADE_KEYS.map((shade) => {
                      const shadeHex = color.shades[shade];
                      const shadeKey = `${name}-${shade}`;
                      return (
                        <button
                          key={shade}
                          className="flex-1 h-8 group relative cursor-pointer"
                          style={{ backgroundColor: shadeHex }}
                          title={`${shade}: ${shadeHex} — click to copy`}
                          onClick={() => copyShade(shadeHex, shadeKey)}
                        >
                          <span className="absolute inset-0 flex items-center justify-center text-[8px] font-mono opacity-0 group-hover:opacity-100 transition-opacity mix-blend-difference text-white">
                            {copiedShade === shadeKey ? '✓' : shade}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
    </div>
  );
}
