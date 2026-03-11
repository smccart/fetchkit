import { useEffect } from 'react';

export function usePageTitle(title: string) {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} — FetchKit` : 'FetchKit — Scaffolding as a Service';
    return () => { document.title = prev; };
  }, [title]);
}
