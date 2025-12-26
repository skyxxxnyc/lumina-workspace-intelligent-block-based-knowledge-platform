import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTheme } from '@/hooks/use-theme';
import { Moon, Sun, Monitor, Command } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Workspace } from '@shared/types';
import { toast } from 'sonner';
export function PreferencesForm() {
  const { isDark, toggleTheme } = useTheme();
  const queryClient = useQueryClient();
  const { data: workspace } = useQuery<Workspace>({
    queryKey: ['workspace'],
    queryFn: () => api<Workspace>('/api/workspace'),
  });
  const updatePreferences = useMutation({
    mutationFn: (prefs: Partial<Workspace['preferences']>) => 
      api<Workspace>('/api/workspace', {
        method: 'PUT',
        body: JSON.stringify({ preferences: { ...workspace?.preferences, ...prefs } })
      }),
    onSuccess: (updated) => {
      queryClient.setQueryData(['workspace'], updated);
      toast.success("Preferences saved");
    }
  });
  return (
    <div className="space-y-6">
      <Card className="border-zinc-200 dark:border-zinc-800 shadow-soft">
        <CardHeader>
          <CardTitle className="text-xl">Appearance</CardTitle>
          <CardDescription>Customize how Lumina looks on your device.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Interface Theme</Label>
            <RadioGroup 
              defaultValue={isDark ? "dark" : "light"} 
              onValueChange={(v) => {
                if ((v === 'dark' && !isDark) || (v === 'light' && isDark)) {
                  toggleTheme();
                }
              }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              <Label
                htmlFor="theme-light"
                className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
              >
                <RadioGroupItem value="light" id="theme-light" className="sr-only" />
                <Sun className="mb-3 size-6" />
                <span className="text-xs font-semibold">Light</span>
              </Label>
              <Label
                htmlFor="theme-dark"
                className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
              >
                <RadioGroupItem value="dark" id="theme-dark" className="sr-only" />
                <Moon className="mb-3 size-6" />
                <span className="text-xs font-semibold">Dark</span>
              </Label>
              <Label
                htmlFor="theme-system"
                className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
              >
                <RadioGroupItem value="system" id="theme-system" className="sr-only" />
                <Monitor className="mb-3 size-6" />
                <span className="text-xs font-semibold">System</span>
              </Label>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
      <Card className="border-zinc-200 dark:border-zinc-800 shadow-soft">
        <CardHeader>
          <CardTitle className="text-xl">Notifications</CardTitle>
          <CardDescription>Stay updated on changes and activity.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-semibold">Email Updates</Label>
              <p className="text-xs text-muted-foreground">Receive weekly summaries of your activity.</p>
            </div>
            <Switch 
              checked={workspace?.preferences?.notifications?.emailUpdates} 
              onCheckedChange={(checked) => updatePreferences.mutate({ 
                notifications: { ...workspace?.preferences.notifications, emailUpdates: checked } 
              })} 
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-semibold">Public Page Views</Label>
              <p className="text-xs text-muted-foreground">Notify me when someone views a public page.</p>
            </div>
            <Switch 
              checked={workspace?.preferences?.notifications?.pageViews} 
              onCheckedChange={(checked) => updatePreferences.mutate({ 
                notifications: { ...workspace?.preferences.notifications, pageViews: checked } 
              })} 
            />
          </div>
        </CardContent>
      </Card>
      <Card className="border-zinc-200 dark:border-zinc-800 shadow-soft overflow-hidden">
        <CardHeader className="bg-zinc-50 dark:bg-zinc-900/50">
          <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
            <Command className="size-4" /> Keyboard Shortcuts
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
            <div className="flex items-center justify-between px-6 py-3">
              <span className="text-xs font-medium">Create new block</span>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">Enter</span>
              </kbd>
            </div>
            <div className="flex items-center justify-between px-6 py-3">
              <span className="text-xs font-medium">Slash menu</span>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">/</span>
              </kbd>
            </div>
            <div className="flex items-center justify-between px-6 py-3">
              <span className="text-xs font-medium">Quick Search</span>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}