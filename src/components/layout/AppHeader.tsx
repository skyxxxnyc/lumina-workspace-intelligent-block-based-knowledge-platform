import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, Search, FileText, Table as TableIcon } from 'lucide-react';
import { api } from '@/lib/api-client';
import { PageMetadata } from '@shared/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
export function AppHeader() {
  const { pageId } = useParams();
  const { data: pages = [] } = useQuery<PageMetadata[]>({
    queryKey: ['pages', 'tree'],
    queryFn: () => api<PageMetadata[]>('/api/pages'),
  });
  const getBreadcrumbs = () => {
    if (!pageId) return [];
    const crumbs: PageMetadata[] = [];
    let currentId: string | null = pageId;
    while (currentId) {
      const page = pages.find(p => p.id === currentId);
      if (page) {
        crumbs.unshift(page);
        currentId = page.parentId;
      } else {
        currentId = null;
      }
    }
    return crumbs;
  };
  const crumbs = getBreadcrumbs();
  return (
    <header className="sticky top-0 z-30 w-full border-b border-zinc-200/50 dark:border-zinc-800/50 bg-background/80 backdrop-blur-xl">
      <div className="flex h-12 items-center justify-between px-4 gap-4">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <div className="md:hidden w-8" /> {/* Spacer for sidebar trigger */}
          <nav className="flex items-center gap-1 text-sm font-medium text-muted-foreground overflow-hidden whitespace-nowrap">
            {crumbs.map((crumb, i) => (
              <React.Fragment key={crumb.id}>
                {i > 0 && <ChevronRight className="size-3.5 shrink-0 opacity-40" />}
                <Link
                  to={`/p/${crumb.id}`}
                  className={cn(
                    "flex items-center gap-1.5 px-1.5 py-1 rounded-md transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-foreground truncate max-w-[120px] md:max-w-[200px]",
                    i === crumbs.length - 1 && "text-foreground font-semibold"
                  )}
                >
                  {crumb.type === 'database' ? (
                    <TableIcon className="size-3.5 shrink-0" />
                  ) : (
                    <FileText className="size-3.5 shrink-0" />
                  )}
                  <span className="truncate">{crumb.title || "Untitled"}</span>
                </Link>
              </React.Fragment>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-[11px] font-medium text-muted-foreground gap-2 hidden sm:flex"
            onClick={() => {
              const event = new KeyboardEvent('keydown', {
                key: 'k',
                metaKey: true,
                bubbles: true
              });
              document.dispatchEvent(event);
            }}
          >
            <Search className="size-3.5" />
            <span>Search</span>
            <kbd className="pointer-events-none inline-flex h-4 select-none items-center gap-1 rounded border bg-muted px-1 font-mono text-[9px] font-medium opacity-100">
              <span className="text-2xs">⌘</span>K
            </kbd>
          </Button>
        </div>
      </div>
    </header>
  );
}