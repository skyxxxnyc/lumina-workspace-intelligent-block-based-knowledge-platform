import React, { useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Page, PageMetadata, Block } from '@shared/types';
import { AppLayout } from '@/components/layout/AppLayout';
import { BlockEditor } from '@/components/editor/BlockEditor';
import { DatabaseEditor } from '@/components/database/DatabaseEditor';
import { Skeleton } from '@/components/ui/skeleton';
import { Toaster, toast } from 'sonner';
import { debounce } from '@/lib/utils';
import { ImageIcon, Share2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
export function HomePage() {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isCopied, setIsCopied] = React.useState(false);
  const { data: pagesTree } = useQuery<PageMetadata[]>({
    queryKey: ['pages', 'tree'],
    queryFn: () => api<PageMetadata[]>('/api/pages'),
  });
  useEffect(() => {
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
  const debouncedUpdateBlocks = useMemo(
    () => debounce((blocks: Block[]) => {
      updatePage.mutate({ blocks });
    }, 1000),
    [updatePage]
  );
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePage.mutate({ title: e.target.value });
  };
  const addRandomCover = () => {
    const id = Math.floor(Math.random() * 1000);
    updatePage.mutate({ cover: `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80` });
  };
  const setRandomIcon = () => {
    const icons = ["��", "💡", "🧠", "🌈", "🔥", "🛠️", "📚", "��", "🍀", "🎨"];
    updatePage.mutate({ icon: icons[Math.floor(Math.random() * icons.length)] });
  };
  const togglePublic = (checked: boolean) => {
    updatePage.mutate({ isPublic: checked });
    toast.success(checked ? "Page is now public" : "Page is now private");
  };
  const copyPublicLink = () => {
    const url = `${window.location.origin}/public/${pageId}`;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    toast.success("Public link copied");
  };
  if (isLoading) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12 space-y-8">
          <Skeleton className="h-40 w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </AppLayout>
    );
  }
  if (error || !page) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <h2 className="text-2xl font-bold tracking-tight mb-2">Page not found</h2>
          <p className="text-muted-foreground mb-6 max-w-sm">The page you're looking for doesn't exist or you don't have access.</p>
          <Button onClick={() => navigate('/')}>Return to workspace</Button>
        </div>
      </AppLayout>
    );
  }
  return (
    <AppLayout>
      <motion.div 
        key={pageId}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="min-h-full bg-background"
      >
        <div className="group/header relative h-[22vh] md:h-[28vh] w-full bg-zinc-100 dark:bg-zinc-900 overflow-hidden border-b border-zinc-200/50 dark:border-zinc-800/50">
          {page.cover ? (
            <img src={page.cover} className="w-full h-full object-cover" alt="cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center opacity-0 group-hover/header:opacity-100 transition-opacity">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/60 dark:bg-zinc-800/60 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-glass"
                onClick={addRandomCover}
              >
                <ImageIcon className="mr-2 size-4" /> Add cover
              </Button>
            </div>
          )}
          <div className="absolute top-4 right-4 flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="secondary" size="sm" className="bg-white/60 dark:bg-zinc-800/60 backdrop-blur-lg shadow-sm border border-white/20">
                  <Share2 className="mr-2 size-4" /> Share
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" align="end">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="public-toggle" className="text-sm font-medium">Publish to web</Label>
                    <Switch
                      id="public-toggle"
                      checked={!!page.isPublic}
                      onCheckedChange={togglePublic}
                    />
                  </div>
                  {page.isPublic ? (
                    <div className="pt-2 space-y-2">
                      <p className="text-xs text-muted-foreground">Anyone with the link can view this page.</p>
                      <div className="flex gap-2">
                        <input
                          readOnly
                          className="flex-1 px-2 py-1 text-[11px] bg-zinc-100 dark:bg-zinc-900 rounded border border-zinc-200 dark:border-zinc-800 focus:outline-none"
                          value={`${window.location.origin}/public/${pageId}`}
                        />
                        <Button size="icon" variant="outline" className="size-7" onClick={copyPublicLink}>
                          {isCopied ? <Check className="size-3 text-green-500" /> : <Copy className="size-3" />}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">This page is private and only visible to you.</p>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-6 md:px-10 lg:px-12 -mt-16 md:-mt-20 relative z-10">
          <div className="py-6 md:py-8 lg:py-10">
            <div className="group/title-section mb-10">
              <div className="relative inline-block mb-6">
                <div
                  className="size-24 md:size-32 rounded-[2rem] bg-white dark:bg-zinc-950 shadow-2xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-5xl md:text-6xl cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all hover:scale-105 active:scale-95"
                  onClick={setRandomIcon}
                >
                  {page.icon || "📄"}
                </div>
              </div>
              <input
                type="text"
                className="w-full text-4xl md:text-5xl font-extrabold bg-transparent border-none focus:ring-0 p-0 placeholder:text-zinc-200 dark:placeholder:text-zinc-800 outline-none leading-tight text-foreground tracking-tight"
                value={page.title}
                onChange={handleTitleChange}
                placeholder="Untitled"
              />
            </div>
            <div className="pb-32">
              {page.type === 'database' ? (
                <DatabaseEditor database={page} onUpdate={updatePage.mutate} />
              ) : (
                <BlockEditor
                  initialBlocks={page.blocks}
                  onChange={(blocks) => debouncedUpdateBlocks(blocks)}
                />
              )}
            </div>
          </div>
        </div>
      </motion.div>
      <Toaster position="bottom-right" />
    </AppLayout>
  );
}