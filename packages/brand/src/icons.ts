import type { IconConfig } from './types';
import { generateFreepikIcons } from './freepik';

interface IconifySearchResponse {
  icons: string[];
  total: number;
}

export async function searchIcons(query: string, limit = 30): Promise<IconConfig[]> {
  const url = `https://api.iconify.design/search?query=${encodeURIComponent(query)}&limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data: IconifySearchResponse = await res.json();
  return data.icons.map((id) => ({
    id,
    name: id.split(':')[1] ?? id,
    svg: '',
  }));
}

export async function fetchIconSvg(iconId: string, preloadedSvg?: string): Promise<string> {
  // If SVG is already available (e.g. Freepik AI icons), return it directly
  if (preloadedSvg) return preloadedSvg;

  const [prefix, name] = iconId.split(':');
  if (!prefix || !name) return '';
  const url = `https://api.iconify.design/${prefix}/${name}.svg`;
  const res = await fetch(url);
  if (!res.ok) return '';
  return res.text();
}

export function colorizeIconSvg(svg: string, color: string): string {
  // Replace currentColor and any fill/stroke colors with the target color
  let result = svg.replace(/currentColor/g, color);
  // Set fill on the root svg if not already set
  if (!result.includes('fill=')) {
    result = result.replace('<svg', `<svg fill="${color}"`);
  }
  return result;
}

// Pre-defined icon sets for common business categories
const FALLBACK_ICONS = [
  'mdi:lightning-bolt',
  'mdi:rocket-launch',
  'mdi:star-four-points',
  'mdi:diamond-stone',
  'mdi:hexagon',
  'mdi:shield-check',
  'mdi:cube-outline',
  'mdi:leaf',
  'mdi:fire',
  'mdi:flash',
  'mdi:compass',
  'mdi:atom',
  'mdi:crown',
  'mdi:infinity',
  'mdi:lightning-bolt-circle',
  'mdi:star-circle',
  'mdi:triangle',
  'mdi:circle-slice-8',
  'mdi:shape',
  'mdi:creation',
];

export async function getIconsForCompany(
  companyName: string,
  freepikApiKey?: string,
): Promise<IconConfig[]> {
  const words = companyName.toLowerCase().split(/\s+/).filter((w) => w.length > 2);

  // Search Iconify per word + full name
  const iconifyPromise = (async () => {
    const searchPromises = [
      ...words.map((word) => searchIcons(word, 20)),
      searchIcons(companyName.toLowerCase(), 20),
    ];
    const results = await Promise.all(searchPromises);
    return results.flat();
  })();

  // Generate AI icons if Freepik key is available
  const freepikPromise = freepikApiKey
    ? generateFreepikIcons(companyName, freepikApiKey).catch(() => [] as IconConfig[])
    : Promise.resolve([] as IconConfig[]);

  const [iconifyIcons, aiIcons] = await Promise.all([iconifyPromise, freepikPromise]);

  // AI icons first, then Iconify results
  const seen = new Set<string>();
  const unique: IconConfig[] = [];

  for (const icon of [...aiIcons, ...iconifyIcons]) {
    if (seen.has(icon.id)) continue;
    seen.add(icon.id);
    unique.push(icon);
  }

  // If we don't have enough icons, add fallbacks
  if (unique.length < 10) {
    for (const id of FALLBACK_ICONS) {
      if (!seen.has(id) && unique.length < 20) {
        unique.push({ id, name: id.split(':')[1] ?? id, svg: '' });
        seen.add(id);
      }
    }
  }

  return unique.slice(0, 20);
}
