import React from 'react';
import { Page, PropertyOption, PropertySchema } from '@shared/types';
import { cn } from '@/lib/utils';
import { FileText, Plus, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
interface BoardViewProps {
  database: Page;
  rows: Page[];
  onUpdateRow: (rowId: string, updates: Partial<Page>) => void;
  onCreateRow: (initialProps: Record<string, any>) => void;
}
export function BoardView({ database, rows, onUpdateRow, onCreateRow }: BoardViewProps) {
  // Find the first 'select' property to use for grouping
  const groupByProp = database.propertiesSchema?.find(p => p.type === 'select');
  const columns = groupByProp?.options || [];
  if (!groupByProp) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg">
        <p className="text-muted-foreground mb-4">Board view requires a 'Select' property to group items.</p>
        <Button size="sm" variant="outline">Add a Select Property</Button>
      </div>
    );
  }
  const getRowsForColumn = (optionId: string | null) => {
    return rows.filter(r => (r.properties?.[groupByProp.id] || null) === optionId);
  };
  return (
    <div className="flex gap-6 overflow-x-auto pb-8 min-h-[500px] scrollbar-hide">
      {[...columns, { id: null, label: 'No Status', color: 'zinc' }].map((col) => {
        const columnRows = getRowsForColumn(col.id as string | null);
        return (
          <div key={col.id || 'null'} className="flex-shrink-0 w-72 flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-zinc-100 dark:bg-zinc-800 text-xs font-medium border-none px-2 h-5">
                  {col.label}
                </Badge>
                <span className="text-xs text-muted-foreground font-medium">{columnRows.length}</span>
              </div>
              <button className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-muted-foreground">
                <MoreHorizontal className="size-3.5" />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {columnRows.map((row) => (
                <Link
                  key={row.id}
                  to={`/p/${row.id}`}
                  className="group block p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all hover:shadow-md"
                >
                  <div className="flex items-start gap-2 mb-2">
                    <FileText className="size-3.5 text-zinc-400 mt-0.5 shrink-0" />
                    <span className="text-sm font-medium leading-tight group-hover:text-primary transition-colors">
                      {row.title || "Untitled"}
                    </span>
                  </div>
                  {/* Property previews could go here */}
                  <div className="flex flex-wrap gap-1.5">
                    {database.propertiesSchema?.filter(p => p.id !== groupByProp.id).slice(0, 2).map(p => {
                      const val = row.properties?.[p.id];
                      if (!val) return null;
                      return (
                        <div key={p.id} className="text-[10px] text-muted-foreground truncate max-w-full">
                          {p.name}: {String(val)}
                        </div>
                      )
                    })}
                  </div>
                </Link>
              ))}
              <button
                onClick={() => onCreateRow({ [groupByProp.id]: col.id })}
                className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors text-left"
              >
                <Plus className="size-3.5" /> New Item
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}