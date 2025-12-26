import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Page } from '@shared/types';
import { Skeleton } from '@/components/ui/skeleton';
import { BlockItem } from '@/components/editor/Block';
export function PublicPage() {
  const { pageId } = useParams();
  const { data: page, isLoading, error } = useQuery<Page>({
    queryKey: ['public-page', pageId],
    queryFn: () => api<Page>(`/api/public/pages/${pageId}`),
    enabled: !!pageId,
  });
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto py-24 px-6 space-y-6">
        <Skeleton className="h-12 w-3/4 mb-12" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
      </div>
    );
  }
  if (error || !page) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4 px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Access Denied</h2>
        <p className="text-muted-foreground max-w-md">
          This page is either private or does not exist. Please contact the owner for access.
        </p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background">
      {page.cover && (
        <div className="h-[30vh] w-full bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
          <img src={page.cover} className="w-full h-full object-cover" alt="cover" />
        </div>
      )}
      <div className="max-w-3xl mx-auto px-6 pb-32 pt-20">
        <div className="mb-12 flex flex-col items-start">
          {page.icon && (
            <div className="text-7xl mb-6">{page.icon}</div>
          )}
          <h1 className="text-5xl font-bold tracking-tight bg-transparent border-none p-0 outline-none">
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
      </div>
    </div>
  );
}