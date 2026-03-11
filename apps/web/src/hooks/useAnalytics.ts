import { useCallback } from 'react';

export type AnalyticsEvent =
  | 'brand:generate'
  | 'brand:export'
  | 'brand:download'
  | 'legal:generate'
  | 'legal:download'
  | 'seo:generate'
  | 'seo:download'
  | 'security:generate'
  | 'security:download'
  | 'palette:generate'
  | 'placeholder:generate'
  | 'generate-all:generate'
  | 'generate-all:download';

export interface AnalyticsEntry {
  event: AnalyticsEvent;
  timestamp: number;
  meta?: Record<string, string | number>;
}

export interface AnalyticsStats {
  totalEvents: number;
  byService: Record<string, number>;
  byAction: Record<string, number>;
  recentEvents: AnalyticsEntry[];
  firstSeen: number;
  timeline: { date: string; count: number }[];
}

const STORAGE_KEY = 'fetchkit:analytics';

function getEntries(): AnalyticsEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveEntries(entries: AnalyticsEntry[]) {
  try {
    // Keep last 1000 entries to prevent localStorage bloat
    const trimmed = entries.slice(-1000);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // localStorage full or unavailable
  }
}

export function trackEvent(event: AnalyticsEvent, meta?: Record<string, string | number>) {
  const entries = getEntries();
  entries.push({ event, timestamp: Date.now(), meta });
  saveEntries(entries);
}

export function getAnalyticsStats(): AnalyticsStats {
  const entries = getEntries();

  const byService: Record<string, number> = {};
  const byAction: Record<string, number> = {};
  const dailyCounts: Record<string, number> = {};

  for (const entry of entries) {
    const [service, action] = entry.event.split(':');
    byService[service] = (byService[service] || 0) + 1;
    byAction[action] = (byAction[action] || 0) + 1;

    const date = new Date(entry.timestamp).toISOString().slice(0, 10);
    dailyCounts[date] = (dailyCounts[date] || 0) + 1;
  }

  const timeline = Object.entries(dailyCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));

  return {
    totalEvents: entries.length,
    byService,
    byAction,
    recentEvents: entries.slice(-20).reverse(),
    firstSeen: entries[0]?.timestamp || Date.now(),
    timeline,
  };
}

export function useAnalytics() {
  const track = useCallback((event: AnalyticsEvent, meta?: Record<string, string | number>) => {
    trackEvent(event, meta);
  }, []);

  return { track, getStats: getAnalyticsStats };
}
