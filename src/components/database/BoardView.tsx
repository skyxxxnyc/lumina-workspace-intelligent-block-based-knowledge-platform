import React from 'react';
import { Page, PropertySchema } from '@shared/types';
import { cn, getColorClass } from '@/lib/utils';
import { FileText, Plus, MoreHorizontal, LayoutPanelTop } from 'lucide-react';
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
  const groupByProp = database.propertiesSchema?.find(p => p.type === 'select');
  const columns = groupByProp?.options || [];
  if (!groupByProp) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-950/50">
        <LayoutPanelTop className="size-10 text-muted-foreground mb-4 opacity-20" />
        <p className="text-sm text-muted-foreground mb-6 font-medium">Board view requires a 'Select' property to group items.</p>
        <Button size="sm" variant="outline" className="shadow-sm">Configure Select Property</Button>
      </div>
    );
  }
  const getRowsForColumn = (optionId: string | null) => {
    return rows.filter(r => (r.properties?.[groupByProp.id] || null) === optionId);
  };
  const colItems = [...columns, { id: null, label: 'No Status', color: 'gray' }];
  return (
    <div className="flex gap-6 overflow-x-auto pb-12 min-h-[500px] scrollbar-hide px-1">
      {colItems.map((col) => {
        const columnRows = getRowsForColumn(col.id as string | null);
        return (
          <div key={col.id || 'null'} className="flex-shrink-0 w-72 flex flex-col gap-4">
            <div className="flex items-center justify-between px-1.5 py-1">
              <div className="flex items-center gap-2.5">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-wider border-none px-2 h-6 flex items-center shadow-sm",
                    getColorClass(col.color, 'badge')
                  )}
                >
                  {col.label}
                </Badge>
                <span className="text-[10px] text-muted-foreground font-bold">{columnRows.length}</span>
              </div>
              <button className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md text-muted-foreground transition-colors">
                <MoreHorizontal className="size-3.5" />
              </button>
            </div>
            <div className="flex flex-col gap-3 min-h-[100px] rounded-xl transition-colors">
              {columnRows.map((row) => (
                <Link
                  key={row.id}
                  to={`/p/${row.id}`}
                  className="group block p-4 bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm hover:border-zinc-400 dark:hover:border-zinc-600 transition-all hover:shadow-md active:scale-[0.98]"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <FileText className="size-4 text-zinc-400 mt-0.5 shrink-0" />
                    <span className="text-sm font-semibold leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {row.title || "Untitled"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {database.propertiesSchema?.filter(p => p.id !== groupByProp.id).map(p => {
                      const val = row.properties?.[p.id];
                      if (!val) return null;
                      return (
                        <div key={p.id} className="text-[10px] text-muted-foreground bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded flex items-center gap-1 border border-zinc-200/50 dark:border-zinc-700/50">
                          <span className="font-bold opacity-70 uppercase">{p.name}:</span>
                          <span className="truncate max-w-[100px]">{String(val)}</span>
                        </div>
                      );
                    })}
                  </div>
                </Link>
              ))}
              <button
                onClick={() => onCreateRow({ [groupByProp.id]: col.id })}
                className="flex items-center gap-2.5 px-4 py-3 text-xs font-medium text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all text-left border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800"
              >
                <Plus className="size-4" /> New Item
              </button>
              {columnRows.length === 0 && (
                <div className="h-20 border-2 border-dashed border-zinc-100 dark:border-zinc-900 rounded-xl flex items-center justify-center opacity-30">
                  <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-400">Empty</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}