import React, { useCallback, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Page, PageMetadata, Block } from '@shared/types';
import { AppLayout } from '@/components/layout/AppLayout';
import { BlockEditor } from '@/components/editor/BlockEditor';
import { Skeleton } from '@/components/ui/skeleton';
import { Toaster, toast } from 'sonner';
import { debounce } from '@/lib/utils';
import { ImageIcon, Smile, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
export function HomePage() {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: pagesTree } = useQuery<PageMetadata[]>({
    queryKey: ['pages', 'tree'],
    queryFn: () => api<PageMetadata[]>('/api/pages'),
  });
  React.useEffect(() => {
    if (!pageId && pagesTree && pagesTree.length > 0) {
      navigate(`/p/${pagesTree[0].id}`, { replace: true });
    }
  }, [pageId, pagesTree, navigate]);
  const { data: page, isLoading, error } = useQuery<Page>({
    queryKey: ['page', pageId],
    queryFn: () => api<Page>(`/api/pages/${pageId}`),
    enabled: !!pageId,
  });
  const updatePage = useMutation({
    mutationFn: (updates: Partial<Page>) => api<Page>(`/api/pages/${pageId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
    onSuccess: (updatedPage) => {
      queryClient.setQueryData(['page', pageId], updatedPage);
      queryClient.invalidateQueries({ queryKey: ['pages', 'tree'] });
    }
  });
  const debouncedUpdateBlocks = useCallback(
    debounce((blocks: Block[]) => {
      updatePage.mutate({ blocks });
    }, 1000),
    [pageId]
  );
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePage.mutate({ title: e.target.value });
  };
  const addRandomCover = () => {
    const id = Math.floor(Math.random() * 1000);
    updatePage.mutate({ cover: `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80` });
  };
  const setRandomIcon = () => {
    const icons = ["🚀", "💡", "📝", "🌈", "🔥", "🛠️", "📚", "⭐", "🍀", "🎨"];
    updatePage.mutate({ icon: icons[Math.floor(Math.random() * icons.length)] });
  };
  if (isLoading) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto py-12 px-8 space-y-4">
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
          <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')}>Go back home</Button>
        </div>
      </AppLayout>
    );
  }
  return (
    <AppLayout>
      <div className="min-h-full bg-background pb-20">
        <div className="group/header relative h-[30vh] w-full bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
          {page.cover ? (
            <img src={page.cover} className="w-full h-full object-cover" alt="cover" />
          ) : (
            <div className="w-full h-full flex items-end justify-center pb-8 opacity-0 group-hover/header:opacity-100 transition-opacity">
              <Button 
                variant="secondary" 
                size="sm" 
                className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur"
                onClick={addRandomCover}
              >
                <ImageIcon className="mr-2 size-4" /> Add cover
              </Button>
            </div>
          )}
          {page.cover && (
            <div className="absolute bottom-4 right-4 opacity-0 group-hover/header:opacity-100 transition-opacity">
              <Button 
                variant="secondary" 
                size="sm" 
                className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur"
                onClick={addRandomCover}
              >
                Change cover
              </Button>
            </div>
          )}
        </div>
        <div className="max-w-4xl mx-auto px-8 lg:px-12 -mt-16 relative z-10">
          <div className="group/title-section mb-12">
            <div className="relative inline-block mb-4">
              <div 
                className="size-32 rounded-3xl bg-white dark:bg-zinc-900 shadow-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-6xl cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-950 transition-colors"
                onClick={setRandomIcon}
              >
                {page.icon || "📄"}
              </div>
              {!page.icon && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="absolute -top-2 -right-2 size-8 rounded-full p-0 bg-white dark:bg-zinc-900 opacity-0 group-hover/title-section:opacity-100 transition-opacity"
                  onClick={setRandomIcon}
                >
                  <Smile className="size-4" />
                </Button>
              )}
            </div>
            <div className="flex items-center justify-between mb-2 opacity-0 group-hover/title-section:opacity-100 transition-opacity">
              <div className="flex gap-2">
                {!page.icon && <Button variant="ghost" size="sm" onClick={setRandomIcon} className="text-xs h-7">Add icon</Button>}
                {!page.cover && <Button variant="ghost" size="sm" onClick={addRandomCover} className="text-xs h-7">Add cover</Button>}
              </div>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreHorizontal className="size-4" />
              </Button>
            </div>
            <input
              type="text"
              className="w-full text-5xl font-bold bg-transparent border-none focus:ring-0 p-0 placeholder:text-zinc-200 dark:placeholder:text-zinc-800 outline-none"
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