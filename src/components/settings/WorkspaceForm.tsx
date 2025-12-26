import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Workspace } from '@shared/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
const COLORS = ['blue', 'zinc', 'orange', 'red', 'green', 'purple'];
export function WorkspaceForm() {
  const queryClient = useQueryClient();
  const { data: workspace, isLoading } = useQuery<Workspace>({
    queryKey: ['workspace'],
    queryFn: () => api<Workspace>('/api/workspace'),
  });
  const updateWorkspace = useMutation({
    mutationFn: (updates: Partial<Workspace>) => api<Workspace>('/api/workspace', {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
    onSuccess: (updated) => {
      queryClient.setQueryData(['workspace'], updated);
      toast.success("Workspace updated");
    }
  });
  if (isLoading || !workspace) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/3 mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="space-y-6">
      <Card className="border-zinc-200 dark:border-zinc-800 shadow-soft">
        <CardHeader>
          <CardTitle className="text-xl">General</CardTitle>
          <CardDescription>How your workspace appears to you and others.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="space-y-4 flex-1 w-full">
              <div className="space-y-2">
                <Label htmlFor="ws-name">Workspace Name</Label>
                <Input
                  id="ws-name"
                  value={workspace.name}
                  onChange={(e) => updateWorkspace.mutate({ name: e.target.value })}
                  placeholder="Acme Corp"
                />
              </div>
              <div className="space-y-2">
                <Label>Brand Color</Label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => updateWorkspace.mutate({ color: c })}
                      className={cn(
                        "size-8 rounded-full border-2 transition-all",
                        workspace.color === c ? "border-primary scale-110" : "border-transparent",
                        c === 'blue' ? 'bg-blue-500' : 
                        c === 'zinc' ? 'bg-zinc-500' :
                        c === 'orange' ? 'bg-orange-500' :
                        c === 'red' ? 'bg-red-500' :
                        c === 'green' ? 'bg-green-500' : 'bg-purple-500'
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-4 shrink-0 flex flex-col items-center">
              <Label>Icon Preview</Label>
              <div className={cn(
                "size-24 rounded-3xl flex items-center justify-center text-4xl shadow-xl border border-zinc-200 dark:border-zinc-800",
                workspace.color === 'blue' ? 'bg-blue-600' : 'bg-zinc-900 dark:bg-zinc-100'
              )}>
                {workspace.icon || "🏠"}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  const icons = ["🚀", "💡", "🧠", "🔥", "🌈", "🛠️"];
                  updateWorkspace.mutate({ icon: icons[Math.floor(Math.random() * icons.length)] });
                }}
              >
                Random Icon
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-zinc-200 dark:border-zinc-800 shadow-soft">
        <CardHeader>
          <CardTitle className="text-xl">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions for your workspace.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" disabled>Delete Entire Workspace</Button>
          <p className="text-[11px] text-muted-foreground mt-2">Deleting the workspace will permanently remove all pages and data.</p>
        </CardContent>
      </Card>
    </div>
  );
}