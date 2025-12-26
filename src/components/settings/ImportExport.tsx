import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown, FileUp, Database, FileText, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
export function ImportExport() {
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const handleImport = () => {
    setImporting(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setImporting(false);
          setProgress(0);
          toast.success("Content imported successfully");
        }, 500);
      }
    }, 200);
  };
  return (
    <div className="space-y-6">
      <Card className="border-zinc-200 dark:border-zinc-800 shadow-soft">
        <CardHeader>
          <CardTitle className="text-xl">Import Data</CardTitle>
          <CardDescription>Bring your data from other platforms into Lumina.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={handleImport}
              disabled={importing}
              className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all group"
            >
              <FileText className="size-10 text-muted-foreground mb-4 group-hover:text-primary group-hover:scale-110 transition-all" />
              <span className="font-semibold text-sm">Markdown (.md)</span>
              <span className="text-xs text-muted-foreground mt-1">Import notes and documents</span>
            </button>
            <button 
              onClick={handleImport}
              disabled={importing}
              className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all group"
            >
              <Database className="size-10 text-muted-foreground mb-4 group-hover:text-primary group-hover:scale-110 transition-all" />
              <span className="font-semibold text-sm">CSV (.csv)</span>
              <span className="text-xs text-muted-foreground mt-1">Import structured database data</span>
            </button>
          </div>
          {importing && (
            <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-900">
              <div className="flex justify-between text-xs">
                <span className="font-medium">Importing your content...</span>
                <span className="text-muted-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="border-zinc-200 dark:border-zinc-800 shadow-soft">
        <CardHeader>
          <CardTitle className="text-xl">Export Workspace</CardTitle>
          <CardDescription>Download a complete backup of all your data.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            We support exporting your entire workspace as a ZIP file containing Markdown files for pages and CSV files for databases.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="flex-1 gap-2">
              <FileDown className="size-4" /> Export as ZIP
            </Button>
            <Button variant="outline" className="flex-1 gap-2">
              <FileDown className="size-4" /> Export as JSON
            </Button>
          </div>
          <div className="flex items-center gap-2 pt-4 text-[11px] text-muted-foreground">
            <CheckCircle2 className="size-3.5 text-green-500" />
            Your data is portable and always belongs to you.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}