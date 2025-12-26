import React, { useState, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Page, Workspace } from '@shared/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown, FileUp, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
export function ImportExport() {
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const handleExport = async () => {
    setExporting(true);
    try {
      // Fetch full workspace and page data (including blocks) from the correct endpoint
      const workspace = await api<Workspace>('/api/workspace');
      const pages = await api<Page[]>('/api/pages/export');
      const exportData = {
        workspace,
        exportedAt: new Date().toISOString(),
        version: "1.0.0",
        pages: pages
      };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lumina-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Workspace exported successfully");
    } catch (err) {
      console.error(err);
      toast.error("Export failed. Please check your connection.");
    } finally {
      setExporting(false);
    }
  };
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          if (!data.pages || !Array.isArray(data.pages)) {
            throw new Error("Invalid file format: 'pages' array missing");
          }
          await api('/api/bulk-import', {
            method: 'POST',
            body: JSON.stringify({ pages: data.pages })
          });
          // Also attempt to restore workspace settings if present
          if (data.workspace) {
            await api('/api/workspace', {
              method: 'PUT',
              body: JSON.stringify(data.workspace)
            });
          }
          queryClient.invalidateQueries({ queryKey: ['pages', 'tree'] });
          queryClient.invalidateQueries({ queryKey: ['workspace'] });
          toast.success(`Imported ${data.pages.length} pages successfully`);
        } catch (err: any) {
          toast.error(`Import failed: ${err.message || 'Invalid JSON content'}`);
        } finally {
          setImporting(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      };
      reader.readAsText(file);
    } catch (err) {
      toast.error("File reading failed");
      setImporting(false);
    }
  };
  return (
    <div className="space-y-6">
      <Card className="border-zinc-200 dark:border-zinc-800 shadow-soft">
        <CardHeader>
          <CardTitle className="text-xl">Data Portability</CardTitle>
          <CardDescription>Import or export your entire workspace data as JSON for backup and migration.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
              className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all group disabled:opacity-50"
            >
              {importing ? (
                <Loader2 className="size-10 text-primary animate-spin mb-4" />
              ) : (
                <FileUp className="size-10 text-muted-foreground mb-4 group-hover:text-primary group-hover:scale-110 transition-all" />
              )}
              <span className="font-semibold text-sm">Import JSON Backup</span>
              <span className="text-xs text-muted-foreground mt-1 text-center">Restore content from a previously exported file</span>
              <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleImport} />
            </button>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all group disabled:opacity-50"
            >
              {exporting ? (
                <Loader2 className="size-10 text-primary animate-spin mb-4" />
              ) : (
                <FileDown className="size-10 text-muted-foreground mb-4 group-hover:text-primary group-hover:scale-110 transition-all" />
              )}
              <span className="font-semibold text-sm">Export Workspace</span>
              <span className="text-xs text-muted-foreground mt-1 text-center">Download all documents and settings to your device</span>
            </button>
          </div>
          <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 flex gap-3">
             <AlertCircle className="size-4 text-zinc-500 shrink-0 mt-0.5" />
             <p className="text-[11px] text-muted-foreground leading-relaxed">
               Lumina backups are comprehensive. They include all nested pages, database schemas, and block contents. We recommend exporting regularly to keep your data safe.
             </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}