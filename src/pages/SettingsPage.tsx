import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WorkspaceForm } from '@/components/settings/WorkspaceForm';
import { TrashManager } from '@/components/settings/TrashManager';
import { ImportExport } from '@/components/settings/ImportExport';
import { PreferencesForm } from '@/components/settings/PreferencesForm';
import { Shield, Settings, Trash2, Download, Sliders } from 'lucide-react';
import { motion } from 'framer-motion';
export function SettingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'workspace';
  const onTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <div className="flex flex-col space-y-8">
            <div className="flex flex-col space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
              <p className="text-muted-foreground">Manage your workspace preferences and account.</p>
            </div>
            <Tabs value={currentTab} onValueChange={onTabChange} className="w-full">
              <div className="flex flex-col lg:flex-row gap-10">
                <aside className="lg:w-64 shrink-0">
                  <TabsList className="flex flex-row lg:flex-col items-stretch justify-start bg-transparent h-auto p-0 space-y-0 lg:space-y-1 overflow-x-auto scrollbar-hide">
                    <TabsTrigger
                      value="workspace"
                      className="justify-start px-3 py-2 h-9 data-[state=active]:bg-zinc-100 dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-none text-xs font-medium gap-3"
                    >
                      <Settings className="size-4" /> Workspace
                    </TabsTrigger>
                    <TabsTrigger
                      value="preferences"
                      className="justify-start px-3 py-2 h-9 data-[state=active]:bg-zinc-100 dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-none text-xs font-medium gap-3"
                    >
                      <Sliders className="size-4" /> Preferences
                    </TabsTrigger>
                    <TabsTrigger
                      value="privacy"
                      className="justify-start px-3 py-2 h-9 data-[state=active]:bg-zinc-100 dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-none text-xs font-medium gap-3"
                    >
                      <Shield className="size-4" /> Privacy
                    </TabsTrigger>
                    <TabsTrigger
                      value="trash"
                      className="justify-start px-3 py-2 h-9 data-[state=active]:bg-zinc-100 dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-none text-xs font-medium gap-3"
                    >
                      <Trash2 className="size-4" /> Trash
                    </TabsTrigger>
                    <TabsTrigger
                      value="import"
                      className="justify-start px-3 py-2 h-9 data-[state=active]:bg-zinc-100 dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-none text-xs font-medium gap-3"
                    >
                      <Download className="size-4" /> Import & Export
                    </TabsTrigger>
                  </TabsList>
                </aside>
                <main className="flex-1">
                  <motion.div
                    key={currentTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <TabsContent value="workspace" className="mt-0">
                      <WorkspaceForm />
                    </TabsContent>
                    <TabsContent value="preferences" className="mt-0">
                      <PreferencesForm />
                    </TabsContent>
                    <TabsContent value="privacy" className="mt-0">
                      <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-8 border border-zinc-200 dark:border-zinc-800 text-center">
                        <Shield className="size-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <h2 className="text-lg font-semibold mb-1">Privacy Settings</h2>
                        <p className="text-sm text-muted-foreground max-w-sm mx-auto">Privacy controls are currently tied to your Workspace configuration.</p>
                      </div>
                    </TabsContent>
                    <TabsContent value="trash" className="mt-0">
                      <TrashManager />
                    </TabsContent>
                    <TabsContent value="import" className="mt-0">
                      <ImportExport />
                    </TabsContent>
                  </motion.div>
                </main>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}