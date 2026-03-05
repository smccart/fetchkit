export function createGradientDef(
  id: string,
  colors: string[],
  angle: number = 135,
): string {
  const rad = (angle * Math.PI) / 180;
  const x1 = Math.round(50 - Math.cos(rad) * 50);
  const y1 = Math.round(50 - Math.sin(rad) * 50);
  const x2 = Math.round(50 + Math.cos(rad) * 50);
  const y2 = Math.round(50 + Math.sin(rad) * 50);

  const stops = colors
    .map((c, i) => {
      const offset = colors.length === 1 ? 0 : (i / (colors.length - 1)) * 100;
      return `<stop offset="${offset}%" stop-color="${c}" />`;
    })
    .join('');

  return `<linearGradient id="${id}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">${stops}</linearGradient>`;
}

export function createRadialGradientDef(
  id: string,
  colors: string[],
  cx: number = 50,
  cy: number = 50,
): string {
  const stops = colors
    .map((c, i) => {
      const offset = colors.length === 1 ? 0 : (i / (colors.length - 1)) * 100;
      return `<stop offset="${offset}%" stop-color="${c}" />`;
    })
    .join('');

  return `<radialGradient id="${id}" cx="${cx}%" cy="${cy}%" r="70%">${stops}</radialGradient>`;
}

export function createPatternDef(
  id: string,
  shape: 'dots' | 'lines' | 'triangles' | 'hexagons',
  color: string,
  spacing: number = 20,
): string {
  let content = '';
  switch (shape) {
    case 'dots':
      content = `<circle cx="${spacing / 2}" cy="${spacing / 2}" r="${spacing / 8}" fill="${color}" opacity="0.3" />`;
      break;
    case 'lines':
      content = `<line x1="0" y1="0" x2="${spacing}" y2="${spacing}" stroke="${color}" stroke-width="1" opacity="0.2" />`;
      break;
    case 'triangles':
      content = `<polygon points="${spacing / 2},${spacing / 6} ${spacing / 6},${spacing * 5 / 6} ${spacing * 5 / 6},${spacing * 5 / 6}" fill="none" stroke="${color}" stroke-width="0.5" opacity="0.25" />`;
      break;
    case 'hexagons': {
      const s = spacing / 4;
      const cx = spacing / 2, cy = spacing / 2;
      const points = Array.from({ length: 6 }, (_, i) => {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        return `${cx + s * Math.cos(a)},${cy + s * Math.sin(a)}`;
      }).join(' ');
      content = `<polygon points="${points}" fill="none" stroke="${color}" stroke-width="0.5" opacity="0.2" />`;
      break;
    }
  }

  return `<pattern id="${id}" patternUnits="userSpaceOnUse" width="${spacing}" height="${spacing}">${content}</pattern>`;
}

export function createNoiseDef(id: string, intensity: number = 0.4): string {
  return `<filter id="${id}"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /><feComponentTransfer><feFuncA type="linear" slope="${intensity}" /></feComponentTransfer></filter>`;
}

export function createGeometricShapes(
  colors: string[],
  bounds: { w: number; h: number },
): string {
  const c = (i: number) => colors[i % colors.length];
  const { w, h } = bounds;
  return [
    `<circle cx="${w * 0.8}" cy="${h * 0.2}" r="${Math.min(w, h) * 0.15}" fill="${c(0)}" opacity="0.15" />`,
    `<circle cx="${w * 0.15}" cy="${h * 0.75}" r="${Math.min(w, h) * 0.1}" fill="${c(1)}" opacity="0.12" />`,
    `<rect x="${w * 0.6}" y="${h * 0.6}" width="${w * 0.25}" height="${w * 0.25}" rx="${w * 0.03}" fill="${c(2)}" opacity="0.08" transform="rotate(15 ${w * 0.725} ${h * 0.725})" />`,
    `<line x1="${w * 0.1}" y1="${h * 0.3}" x2="${w * 0.4}" y2="${h * 0.15}" stroke="${c(0)}" stroke-width="1.5" opacity="0.1" />`,
    `<line x1="${w * 0.5}" y1="${h * 0.85}" x2="${w * 0.9}" y2="${h * 0.7}" stroke="${c(1)}" stroke-width="1" opacity="0.1" />`,
  ].join('');
}
