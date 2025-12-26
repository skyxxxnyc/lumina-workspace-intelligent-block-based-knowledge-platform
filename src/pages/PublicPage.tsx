import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Page } from '@shared/types';
import { Skeleton } from '@/components/ui/skeleton';
import { BlockItem } from '@/components/editor/Block';
import { ShieldAlert, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
export function PublicPage() {
  const { pageId } = useParams();
  const { data: page, isLoading, error } = useQuery<Page>({
    queryKey: ['public-page', pageId],
    queryFn: () => api<Page>(`/api/public/pages/${pageId}`),
    enabled: !!pageId,
  });
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="flex flex-col items-center gap-4 py-20">
            <Loader2 className="size-8 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground font-medium">Loading content...</p>
          </div>
        </div>
      </div>
    );
  }
  if (error || !page) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col items-center justify-center text-center">
        <div className="bg-zinc-50 dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 max-w-md w-full shadow-soft">
          <ShieldAlert className="size-12 text-destructive mx-auto mb-6" />
          <h2 className="text-2xl font-bold tracking-tight mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
            This page is either private, has been deleted, or doesn't exist. Please check the URL or contact the owner.
          </p>
          <Button variant="outline" className="w-full" onClick={() => window.location.href = '/'}>
            Lumina Workspace
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background selection:bg-zinc-200 dark:selection:bg-zinc-800">
      {page.cover && (
        <div className="h-[30vh] md:h-[35vh] w-full bg-zinc-100 dark:bg-zinc-900 overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
          <img src={page.cover} className="w-full h-full object-cover" alt="cover" />
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="max-w-3xl mx-auto py-12 md:py-16">
          <div className="mb-16 flex flex-col items-start">
            {page.icon && (
              <div className="size-32 rounded-3xl bg-white dark:bg-zinc-900 shadow-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-7xl mb-10">
                {page.icon}
              </div>
            )}
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              {page.title || "Untitled"}
            </h1>
          </div>
          <div className="space-y-1">
            {page.blocks.map((block) => (
              <BlockItem
                key={block.id}
                block={block}
                isFocused={false}
                onUpdate={() => {}}
                onAdd={() => {}}
                onDelete={() => {}}
                onFocus={() => {}}
                onTypeChange={() => {}}
                readOnly={true}
              />
            ))}
          </div>
          <div className="mt-32 pt-12 border-t border-zinc-100 dark:border-zinc-900 text-center">
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
              Built with <span className="font-bold text-foreground tracking-tight">Lumina Workspace</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}