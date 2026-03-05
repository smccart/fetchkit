import { useMemo } from 'react';
import { Icon } from '@iconify/react';
import type { LogoConfig, LayoutDirection } from '@fetchkit/brand';

interface LogoCanvasProps {
  config: LogoConfig;
  layout: LayoutDirection;
  className?: string;
}

function gradientToCss(stops: { color: string; offset: number }[], angle: number): string {
  const stopStr = stops.map((s) => `${s.color} ${s.offset * 100}%`).join(', ');
  return `linear-gradient(${angle}deg, ${stopStr})`;
}

export function LogoCanvas({ config, layout, className = '' }: LogoCanvasProps) {
  const { companyName, font, icon, colors, wordStyles } = config;
  const isGradient = colors.fillMode === 'gradient' && colors.gradients?.length;

  const words = useMemo(() => companyName.split(' '), [companyName]);

  // Build per-letter data for solid mode
  const letters = useMemo(() => {
    return Array.from(companyName).map((char, i) => ({
      char,
      color: colors.letterColors[i] ?? colors.letterColors[0],
    }));
  }, [companyName, colors.letterColors]);

  const baseFontSize = layout === 'horizontal' ? 28 : 28;
  const iconSize = layout === 'horizontal' ? 40 : 48;

  const renderText = () => {
    if (isGradient) {
      // Render each word as a gradient span
      let charIdx = 0;
      return (
        <span
          className="whitespace-nowrap flex items-baseline gap-[0.25em]"
          style={{ fontFamily: `'${font.family}', sans-serif` }}
        >
          {words.map((word, wi) => {
            const gradient = colors.gradients![wi % colors.gradients!.length];
            const ws = wordStyles?.[wi];
            const size = baseFontSize * (ws?.fontSize ?? 1);
            const weight = ws?.fontWeight ?? font.weight;
            charIdx += word.length + (wi > 0 ? 1 : 0); // account for space
            return (
              <span
                key={wi}
                style={{
                  background: gradientToCss(gradient.stops, gradient.angle),
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontSize: `${size}px`,
                  fontWeight: weight,
                  letterSpacing: ws?.letterSpacing ? `${ws.letterSpacing}em` : undefined,
                }}
              >
                {word}
              </span>
            );
          })}
        </span>
      );
    }

    // Solid mode: per-letter coloring with word style support
    if (wordStyles && wordStyles.length > 0) {
      let charIdx = 0;
      return (
        <span
          className="whitespace-nowrap flex items-baseline gap-[0.25em]"
          style={{ fontFamily: `'${font.family}', sans-serif` }}
        >
          {words.map((word, wi) => {
            const ws = wordStyles[wi];
            const size = baseFontSize * (ws?.fontSize ?? 1);
            const weight = ws?.fontWeight ?? font.weight;
            const startIdx = charIdx;
            charIdx += word.length + 1; // +1 for space
            return (
              <span
                key={wi}
                style={{
                  fontSize: `${size}px`,
                  fontWeight: weight,
                  letterSpacing: ws?.letterSpacing ? `${ws.letterSpacing}em` : undefined,
                }}
              >
                {Array.from(word).map((char, ci) => (
                  <span key={ci} style={{ color: letters[startIdx + ci]?.color }}>
                    {char}
                  </span>
                ))}
              </span>
            );
          })}
        </span>
      );
    }

    // Default solid mode: simple per-letter coloring
    return (
      <span
        className="whitespace-nowrap"
        style={{ fontFamily: `'${font.family}', sans-serif`, fontWeight: font.weight, fontSize: `${baseFontSize}px` }}
      >
        {letters.map((l, i) => (
          <span key={i} style={{ color: l.color }}>
            {l.char}
          </span>
        ))}
      </span>
    );
  };

  const iconColor = isGradient && colors.iconGradient
    ? colors.iconGradient.stops[0]?.color ?? colors.iconColor
    : colors.iconColor;

  if (layout === 'horizontal') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <Icon icon={icon.id} width={iconSize} height={iconSize} style={{ color: iconColor }} />
        {renderText()}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <Icon icon={icon.id} width={iconSize} height={iconSize} style={{ color: iconColor }} />
      {renderText()}
    </div>
  );
}
