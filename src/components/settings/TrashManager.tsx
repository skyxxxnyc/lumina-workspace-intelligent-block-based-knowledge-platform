import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { PageMetadata } from '@shared/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, RotateCcw, AlertCircle, FileText, Table as DatabaseIcon } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
export function TrashManager() {
  const queryClient = useQueryClient();
  const { data: trash = [], isLoading } = useQuery<PageMetadata[]>({
    queryKey: ['trash'],
    queryFn: () => api<PageMetadata[]>('/api/trash'),
  });
  const restoreMutation = useMutation({
    mutationFn: (id: string) => api(`/api/pages/${id}/restore`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trash'] });
      queryClient.invalidateQueries({ queryKey: ['pages', 'tree'] });
      toast.success("Page restored");
    }
  });
  const deletePermanentMutation = useMutation({
    mutationFn: (id: string) => api(`/api/pages/${id}/permanent`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trash'] });
      toast.success("Permanently deleted");
    }
  });
  return (
    <div className="space-y-6">
      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/50 rounded-xl p-4 flex gap-4 items-start">
        <AlertCircle className="size-5 text-amber-600 dark:text-amber-500 mt-0.5 shrink-0" />
        <div className="space-y-1">
          <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">7-Day Recovery Period</p>
          <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
            Items in the trash can be restored within 7 days. After that, they will be automatically and permanently deleted from our servers.
          </p>
        </div>
      </div>
      <Card className="border-zinc-200 dark:border-zinc-800 shadow-soft">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl">Recently Deleted</CardTitle>
            <CardDescription>Manage and restore recently deleted content.</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="text-destructive h-8" disabled={trash.length === 0}>
            Empty Trash
          </Button>
        </CardHeader>
        <CardContent>
          {trash.length > 0 ? (
            <div className="rounded-md border border-zinc-200 dark:border-zinc-800">
              <Table>
                <TableHeader>
                  <TableRow className="bg-zinc-50 dark:bg-zinc-900/50">
                    <TableHead className="text-xs uppercase font-bold tracking-wider">Page</TableHead>
                    <TableHead className="text-xs uppercase font-bold tracking-wider">Deleted On</TableHead>
                    <TableHead className="text-right text-xs uppercase font-bold tracking-wider">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trash.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="py-3">
                        <div className="flex items-center gap-3">
                          {item.type === 'database' ? <DatabaseIcon className="size-4 text-zinc-400" /> : <FileText className="size-4 text-zinc-400" />}
                          <span className="text-sm font-medium">{item.title || "Untitled"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {item.deletedAt ? format(item.deletedAt, 'MMM d, yyyy') : 'Unknown'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="size-8" 
                            title="Restore"
                            onClick={() => restoreMutation.mutate(item.id)}
                          >
                            <RotateCcw className="size-4 text-blue-500" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="size-8" 
                            title="Delete Permanently"
                            onClick={() => deletePermanentMutation.mutate(item.id)}
                          >
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="size-16 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center mb-4">
                <Trash2 className="size-8 text-muted-foreground opacity-20" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">Trash is empty</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}