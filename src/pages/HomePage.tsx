import React, { useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Page, PageMetadata, Block } from '@shared/types';
import { AppLayout } from '@/components/layout/AppLayout';
import { BlockEditor } from '@/components/editor/BlockEditor';
import { Skeleton } from '@/components/ui/skeleton';
import { Toaster, toast } from 'sonner';
import { debounce } from 'lodash-es';
// Note: Ensure lodash-es is used or replace with simple debounce
function useDebounceCallback(callback: (...args: any[]) => void, delay: number) {
  const timer = React.useRef<number>();
  return useCallback((...args: any[]) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = window.setTimeout(() => callback(...args), delay);
  }, [callback, delay]);
}
export function HomePage() {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // Fetch Page Tree to redirect if no pageId
  const { data: pagesTree } = useQuery<PageMetadata[]>({
    queryKey: ['pages', 'tree'],
    queryFn: () => api<PageMetadata[]>('/api/pages'),
  });
  // Redirect to first page if at root
  React.useEffect(() => {
    if (!pageId && pagesTree && pagesTree.length > 0) {
      navigate(`/p/${pagesTree[0].id}`, { replace: true });
    }
  }, [pageId, pagesTree, navigate]);
  // Fetch Current Page Data
  const { data: page, isLoading, error } = useQuery<Page>({
    queryKey: ['page', pageId],
    queryFn: () => api<Page>(`/api/pages/${pageId}`),
    enabled: !!pageId,
  });
  // Update Page Mutation
  const updatePage = useMutation({
    mutationFn: (updates: Partial<Page>) => api<Page>(`/api/pages/${pageId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
    onSuccess: (updatedPage) => {
      // Invalidate tree if title changed
      queryClient.setQueryData(['page', pageId], updatedPage);
      queryClient.invalidateQueries({ queryKey: ['pages', 'tree'] });
    }
  });
  const debouncedUpdateBlocks = useDebounceCallback((blocks: Block[]) => {
    updatePage.mutate({ blocks });
  }, 1000);
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    updatePage.mutate({ title });
  };
  if (isLoading) {
    return (
      <AppLayout>
        <div className="max-w-3xl mx-auto py-12 px-8 space-y-4">
          <Skeleton className="h-12 w-3/4 mb-8" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
        </div>
      </AppLayout>
    );
  }
  if (error || !page) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
          <h2 className="text-2xl font-bold">Page not found</h2>
          <p className="text-muted-foreground">The page you're looking for doesn't exist or was moved.</p>
        </div>
      </AppLayout>
    );
  }
  return (
    <AppLayout>
      <div className="min-h-full bg-background">
        {/* Cover Image Placeholder */}
        <div className="h-[25vh] bg-zinc-100 dark:bg-zinc-900 group relative">
          {page.cover ? (
            <img src={page.cover} className="w-full h-full object-cover" alt="cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="text-xs bg-white dark:bg-zinc-800 px-3 py-1.5 rounded shadow-sm border border-zinc-200 dark:border-zinc-700">Add cover</button>
            </div>
          )}
        </div>
        <div className="max-w-3xl mx-auto px-8 lg:px-12 -mt-12 relative z-10">
          <div className="mb-8">
            <div className="size-20 rounded-2xl bg-white dark:bg-zinc-900 shadow-md border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-4xl mb-4">
              {page.icon || "📄"}
            </div>
            <input
              type="text"
              className="w-full text-5xl font-bold bg-transparent border-none focus:ring-0 p-0 placeholder:text-zinc-200"
              value={page.title}
              onChange={handleTitleChange}
              placeholder="Untitled"
            />
          </div>
          <BlockEditor 
            initialBlocks={page.blocks} 
            onChange={(blocks) => debouncedUpdateBlocks(blocks)} 
          />
        </div>
      </div>
      <Toaster position="bottom-right" />
    </AppLayout>
  );
}