import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Page, ViewType } from '@shared/types';
import { Button } from '@/components/ui/button';
import { Plus, Settings2, Table as TableIcon, LayoutGrid } from 'lucide-react';
import { TableView } from './TableView';
import { BoardView } from './BoardView';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
interface DatabaseEditorProps {
  database: Page;
  onUpdate: (updates: Partial<Page>) => void;
}
export function DatabaseEditor({ database, onUpdate }: DatabaseEditorProps) {
  const queryClient = useQueryClient();
  const [activeView, setActiveView] = useState<ViewType>((database.views?.[0]?.type as ViewType) || 'table');
  const { data: rows = [], isLoading } = useQuery<Page[]>({
    queryKey: ['database-rows', database.id],
    queryFn: () => api<Page[]>(`/api/databases/${database.id}/rows`),
  });
  const createRow = useMutation({
    mutationFn: (initialProps: Record<string, any> = {}) => api<Page>('/api/pages', {
      method: 'POST',
      body: JSON.stringify({
        title: '',
        parentId: database.id,
        type: 'page',
        properties: initialProps
      })
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['database-rows', database.id] });
      queryClient.invalidateQueries({ queryKey: ['pages', 'tree'] });
    }
  });
  const addProperty = () => {
    const newProp = {
      id: crypto.randomUUID(),
      name: 'New Property',
      type: 'text' as const
    };
    const schema = [...(database.propertiesSchema || []), newProp];
    onUpdate({ propertiesSchema: schema });
  };
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-full rounded-md" />
        <div className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-2 bg-background/95 backdrop-blur-sm sticky top-0 z-20">
        <Tabs value={activeView} onValueChange={(v) => setActiveView(v as ViewType)} className="w-auto">
          <TabsList className="bg-transparent p-0 gap-1 h-9">
            <TabsTrigger
              value="table"
              className="data-[state=active]:bg-zinc-100 dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-none px-3 h-8 text-xs gap-2 transition-all"
            >
              <TableIcon className="size-3.5" /> Table
            </TabsTrigger>
            <TabsTrigger
              value="board"
              className="data-[state=active]:bg-zinc-100 dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-none px-3 h-8 text-xs gap-2 transition-all"
            >
              <LayoutGrid className="size-3.5" /> Board
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800" onClick={() => createRow.mutate({})}>
            <Plus className="size-3.5 mr-1.5" /> New Item
          </Button>
          <Button variant="ghost" size="sm" className="h-8 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800" onClick={addProperty}>
            <Plus className="size-3.5 mr-1.5" /> Add Property
          </Button>
          <Button variant="ghost" size="icon" className="size-8 hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <Settings2 className="size-4" />
          </Button>
        </div>
      </div>
      <div className="relative overflow-visible min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            {activeView === 'table' ? (
              <TableView
                database={database}
                rows={rows}
                onUpdateRow={(rowId, updates) => {
                  api(`/api/pages/${rowId}`, { method: 'PUT', body: JSON.stringify(updates) })
                    .then(() => queryClient.invalidateQueries({ queryKey: ['database-rows', database.id] }));
                }}
                onUpdateDatabase={onUpdate}
              />
            ) : (
              <BoardView
                database={database}
                rows={rows}
                onUpdateRow={(rowId, updates) => {
                  api(`/api/pages/${rowId}`, { method: 'PUT', body: JSON.stringify(updates) })
                    .then(() => queryClient.invalidateQueries({ queryKey: ['database-rows', database.id] }));
                }}
                onCreateRow={(initialProps) => createRow.mutate(initialProps)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}