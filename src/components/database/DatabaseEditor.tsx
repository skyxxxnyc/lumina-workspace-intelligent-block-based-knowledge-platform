import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Page, PropertySchema } from '@shared/types';
import { Button } from '@/components/ui/button';
import { Plus, Settings2, Table as TableIcon } from 'lucide-react';
import { TableView } from './TableView';
import { Skeleton } from '@/components/ui/skeleton';
interface DatabaseEditorProps {
  database: Page;
  onUpdate: (updates: Partial<Page>) => void;
}
export function DatabaseEditor({ database, onUpdate }: DatabaseEditorProps) {
  const queryClient = useQueryClient();
  const { data: rows = [], isLoading } = useQuery<Page[]>({
    queryKey: ['database-rows', database.id],
    queryFn: () => api<Page[]>(`/api/databases/${database.id}/rows`),
  });
  const createRow = useMutation({
    mutationFn: () => api<Page>('/api/pages', {
      method: 'POST',
      body: JSON.stringify({
        title: 'New Item',
        parentId: database.id,
        type: 'page',
        properties: {}
      })
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['database-rows', database.id] });
      queryClient.invalidateQueries({ queryKey: ['pages', 'tree'] });
    }
  });
  if (isLoading) {
    return <div className="space-y-2"><Skeleton className="h-64 w-full" /></div>;
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="bg-zinc-100 dark:bg-zinc-800">
            <TableIcon className="size-4 mr-2" /> Table
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => createRow.mutate()}>
            <Plus className="size-4 mr-2" /> New
          </Button>
          <Button variant="ghost" size="icon" className="size-8">
            <Settings2 className="size-4" />
          </Button>
        </div>
      </div>
      <TableView 
        database={database} 
        rows={rows} 
        onUpdateRow={(rowId, updates) => {
            api(`/api/pages/${rowId}`, { method: 'PUT', body: JSON.stringify(updates) })
              .then(() => queryClient.invalidateQueries({ queryKey: ['database-rows', database.id] }));
        }}
        onUpdateDatabase={onUpdate}
      />
    </div>
  );
}