import { useEffect, useRef } from 'react';
import { LogoCard } from './LogoCard';
import { Card } from '@/components/ui/card';
import type { LogoVariation } from '@fetchkit/brand';

interface LogoGridProps {
  variations: LogoVariation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  hasMore?: boolean;
}

function SkeletonCard() {
  return (
    <Card className="p-4 min-h-40 flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-3 w-full">
        <div className="w-12 h-12 bg-muted rounded-lg" />
        <div className="h-6 bg-muted rounded w-3/4" />
      </div>
    </Card>
  );
}

export function LogoGrid({ variations, selectedId, onSelect, onLoadMore, isLoadingMore, hasMore }: LogoGridProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!onLoadMore || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isLoadingMore) {
          onLoadMore();
        }
      },
      { rootMargin: '200px' },
    );

    const sentinel = sentinelRef.current;
    if (sentinel) observer.observe(sentinel);

    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [onLoadMore, isLoadingMore, hasMore]);

  if (variations.length === 0 && !isLoadingMore) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No logos generated yet. Enter a company name to get started.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {variations.map((v) => (
          <LogoCard
            key={v.id}
            variation={v}
            isSelected={v.id === selectedId}
            onSelect={onSelect}
          />
        ))}
        {isLoadingMore && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}
      </div>
      {hasMore && <div ref={sentinelRef} className="h-1" />}
    </>
  );
}
