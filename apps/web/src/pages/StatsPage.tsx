import { useState, useEffect, useMemo } from 'react';
import { useSiteColor } from '@/hooks/useSiteColor';
import { getAnalyticsStats, type AnalyticsStats } from '@/hooks/useAnalytics';

const SERVICE_META: Record<string, { label: string; color: string }> = {
  brand: { label: 'Brand Kit', color: '#6366f1' },
  legal: { label: 'Legal Docs', color: '#f59e0b' },
  seo: { label: 'SEO Toolkit', color: '#10b981' },
  security: { label: 'Security', color: '#ef4444' },
  palette: { label: 'Palette', color: '#8b5cf6' },
  placeholder: { label: 'Placeholders', color: '#06b6d4' },
};

const ACTION_LABELS: Record<string, string> = {
  generate: 'Generations',
  export: 'Exports',
  download: 'Downloads',
};

function AnimatedCounter({ value, duration = 1200 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (value === 0) { setDisplay(0); return; }
    const start = performance.now();
    const from = 0;
    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (value - from) * eased));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [value, duration]);

  return <span>{display.toLocaleString()}</span>;
}

function StatCard({
  label,
  value,
  accent,
  subtitle,
}: {
  label: string;
  value: number;
  accent: string;
  subtitle?: string;
}) {
  return (
    <div className="border rounded-xl p-5 bg-card/50">
      <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
      <p className="text-3xl font-bold" style={{ color: accent }}>
        <AnimatedCounter value={value} />
      </p>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  );
}

function BarChart({
  data,
  color: barColor,
}: {
  data: { label: string; value: number; color?: string }[];
  color: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="space-y-2">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground w-28 shrink-0 text-right">{d.label}</span>
          <div className="flex-1 h-7 bg-muted/30 rounded-md overflow-hidden relative">
            <div
              className="h-full rounded-md transition-all duration-700 ease-out"
              style={{
                width: `${(d.value / max) * 100}%`,
                backgroundColor: d.color || barColor,
                minWidth: d.value > 0 ? '2px' : '0',
              }}
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
              {d.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function MiniTimeline({ data, color: lineColor }: { data: { date: string; count: number }[]; color: string }) {
  if (data.length === 0) return null;

  // Show last 14 days
  const today = new Date();
  const days: { date: string; count: number }[] = [];
  const countMap = new Map(data.map((d) => [d.date, d.count]));

  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    days.push({ date: dateStr, count: countMap.get(dateStr) || 0 });
  }

  const max = Math.max(...days.map((d) => d.count), 1);

  return (
    <div className="flex items-end gap-1 h-20">
      {days.map((d) => (
        <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-sm transition-all duration-500"
            style={{
              height: `${Math.max((d.count / max) * 64, d.count > 0 ? 4 : 0)}px`,
              backgroundColor: d.count > 0 ? lineColor : 'transparent',
              opacity: d.count > 0 ? 0.8 : 0.15,
              border: d.count === 0 ? '1px dashed var(--border)' : 'none',
              minHeight: '2px',
            }}
            title={`${d.date}: ${d.count} events`}
          />
        </div>
      ))}
    </div>
  );
}

function RecentActivity({ events }: { events: AnalyticsStats['recentEvents'] }) {
  if (events.length === 0) return null;

  return (
    <div className="space-y-1.5 max-h-64 overflow-y-auto">
      {events.map((e, i) => {
        const [service, action] = e.event.split(':');
        const meta = SERVICE_META[service];
        const time = new Date(e.timestamp);
        const relative = getRelativeTime(time);

        return (
          <div key={i} className="flex items-center gap-3 text-sm py-1.5 px-2 rounded-md hover:bg-muted/30">
            <div
              className="h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: meta?.color || '#888' }}
            />
            <span className="font-medium text-foreground">{meta?.label || service}</span>
            <span className="text-muted-foreground">{action}</span>
            {e.meta && Object.entries(e.meta).map(([k, v]) => (
              <span key={k} className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                {k}: {v}
              </span>
            ))}
            <span className="ml-auto text-xs text-muted-foreground shrink-0">{relative}</span>
          </div>
        );
      })}
    </div>
  );
}

function getRelativeTime(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function EmptyState({ color }: { color: string }) {
  return (
    <div className="border rounded-xl p-12 bg-card/50 text-center space-y-4">
      <div
        className="inline-flex items-center justify-center h-16 w-16 rounded-2xl mx-auto"
        style={{ backgroundColor: `${color}1a` }}
      >
        <svg
          className="h-8 w-8"
          style={{ color }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-1">No activity yet</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Start generating assets to see your stats here. Try creating a brand kit, legal docs,
          SEO config, or security headers — your usage will be tracked locally.
        </p>
      </div>
    </div>
  );
}

export default function StatsPage() {
  const { color, secondaryColor } = useSiteColor();
  const [stats, setStats] = useState<AnalyticsStats | null>(null);

  useEffect(() => {
    setStats(getAnalyticsStats());
  }, []);

  const serviceData = useMemo(() => {
    if (!stats) return [];
    return Object.entries(SERVICE_META)
      .map(([key, meta]) => ({
        label: meta.label,
        value: stats.byService[key] || 0,
        color: meta.color,
      }))
      .filter((d) => d.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [stats]);

  const actionData = useMemo(() => {
    if (!stats) return [];
    return Object.entries(ACTION_LABELS)
      .map(([key, label]) => ({
        label,
        value: stats.byAction[key] || 0,
      }))
      .filter((d) => d.value > 0);
  }, [stats]);

  if (!stats) return null;

  const isEmpty = stats.totalEvents === 0;
  const daysSinceFirst = Math.max(1, Math.ceil((Date.now() - stats.firstSeen) / 86400000));

  return (
    <div className="flex-1">
      {/* Header */}
      <section
        className="py-12 px-6 border-b"
        style={{ background: `radial-gradient(ellipse 80% 50% at 50% -10%, ${color}1a, transparent)` }}
      >
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Stats</h1>
          <p className="text-lg text-muted-foreground">
            Your local FetchKit usage analytics. All data stays in your browser.
          </p>
        </div>
      </section>

      <div className="container mx-auto max-w-4xl py-12 px-6 space-y-10">
        {isEmpty ? (
          <EmptyState color={color} />
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                label="Total Events"
                value={stats.totalEvents}
                accent={color}
              />
              <StatCard
                label="Generations"
                value={stats.byAction['generate'] || 0}
                accent={secondaryColor}
              />
              <StatCard
                label="Downloads"
                value={(stats.byAction['download'] || 0) + (stats.byAction['export'] || 0)}
                accent="#10b981"
              />
              <StatCard
                label="Active Days"
                value={stats.timeline.length}
                accent="#f59e0b"
                subtitle={`over ${daysSinceFirst} day${daysSinceFirst !== 1 ? 's' : ''}`}
              />
            </div>

            {/* Activity Timeline */}
            {stats.timeline.length > 0 && (
              <div className="border rounded-xl p-6 bg-card/50">
                <h2 className="text-lg font-semibold mb-4">Last 14 Days</h2>
                <MiniTimeline data={stats.timeline} color={color} />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-2 px-0.5">
                  <span>14 days ago</span>
                  <span>Today</span>
                </div>
              </div>
            )}

            {/* Service Breakdown */}
            {serviceData.length > 0 && (
              <div className="border rounded-xl p-6 bg-card/50">
                <h2 className="text-lg font-semibold mb-4">By Service</h2>
                <BarChart data={serviceData} color={color} />
              </div>
            )}

            {/* Action Breakdown */}
            {actionData.length > 0 && (
              <div className="border rounded-xl p-6 bg-card/50">
                <h2 className="text-lg font-semibold mb-4">By Action</h2>
                <BarChart data={actionData} color={secondaryColor} />
              </div>
            )}

            {/* Recent Activity */}
            {stats.recentEvents.length > 0 && (
              <div className="border rounded-xl p-6 bg-card/50">
                <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                <RecentActivity events={stats.recentEvents} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
