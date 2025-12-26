import React from 'react';
import { Page, PropertySchema } from '@shared/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from 'react-router-dom';
import { FileText, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
interface TableViewProps {
  database: Page;
  rows: Page[];
  onUpdateRow: (rowId: string, updates: Partial<Page>) => void;
  onUpdateDatabase: (updates: Partial<Page>) => void;
}
export function TableView({ database, rows, onUpdateRow, onUpdateDatabase }: TableViewProps) {
  const schema = database.propertiesSchema || [];
  const handlePropertyChange = (row: Page, propertyId: string, value: any) => {
    const newProps = { ...(row.properties || {}), [propertyId]: value };
    onUpdateRow(row.id, { properties: newProps });
  };
  return (
    <div className="rounded-md border border-zinc-200 dark:border-zinc-800 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-zinc-50 dark:bg-zinc-900/50">
            <TableHead className="w-[300px] border-r border-zinc-200 dark:border-zinc-800">Name</TableHead>
            {schema.map((prop) => (
              <TableHead key={prop.id} className="min-w-[150px] border-r border-zinc-200 dark:border-zinc-800">
                {prop.name}
              </TableHead>
            ))}
            <TableHead className="w-10">
              <button className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors">
                <Plus className="size-3" />
              </button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} className="group/row">
              <TableCell className="p-0 border-r border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2 px-3 py-2">
                  <FileText className="size-4 text-zinc-400" />
                  <Link to={`/p/${row.id}`} className="flex-1 hover:underline truncate">
                    {row.title || "Untitled"}
                  </Link>
                </div>
              </TableCell>
              {schema.map((prop) => (
                <TableCell key={prop.id} className="p-0 border-r border-zinc-200 dark:border-zinc-800">
                  <PropertyCell 
                    property={prop} 
                    value={row.properties?.[prop.id]} 
                    onChange={(val) => handlePropertyChange(row, prop.id, val)}
                  />
                </TableCell>
              ))}
              <TableCell />
            </TableRow>
          ))}
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={schema.length + 2} className="h-24 text-center text-muted-foreground">
                No items in this database.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
function PropertyCell({ property, value, onChange }: { property: PropertySchema, value: any, onChange: (v: any) => void }) {
  if (property.type === 'select') {
    const option = property.options?.find(o => o.id === value);
    return (
      <div className="px-3 py-2 h-full flex items-center">
        {option ? (
          <Badge variant="secondary" className={cn("text-xs font-normal")}>
            {option.label}
          </Badge>
        ) : (
          <span className="text-zinc-300 dark:text-zinc-700 text-xs">Empty</span>
        )}
      </div>
    );
  }
  return (
    <input
      className="w-full h-full bg-transparent px-3 py-2 text-sm focus:outline-none focus:bg-white dark:focus:bg-zinc-800"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Empty"
    />
  );
}