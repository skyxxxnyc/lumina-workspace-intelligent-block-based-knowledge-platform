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
import { FileText, Plus, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PropertyCell } from './PropertyCell';
import { SchemaMenu } from './SchemaMenu';
interface TableViewProps {
  database: Page;
  rows: Page[];
  onUpdateRow: (rowId: string, updates: Partial<Page>) => void;
  onUpdateDatabase: (updates: Partial<Page>) => void;
}
export function TableView({ database, rows, onUpdateRow, onUpdateDatabase }: TableViewProps) {
  const schema = database.propertiesSchema || [];
  const updateProperty = (index: number, updates: Partial<PropertySchema>) => {
    const newSchema = [...schema];
    newSchema[index] = { ...newSchema[index], ...updates };
    onUpdateDatabase({ propertiesSchema: newSchema });
  };
  const deleteProperty = (index: number) => {
    const newSchema = schema.filter((_, i) => i !== index);
    onUpdateDatabase({ propertiesSchema: newSchema });
  };
  return (
    <div className="rounded-md border border-zinc-200 dark:border-zinc-800 overflow-x-auto bg-white dark:bg-zinc-950">
      <Table className="border-collapse">
        <TableHeader>
          <TableRow className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
            <TableHead className="w-[300px] border-r border-zinc-200 dark:border-zinc-800 font-medium text-xs uppercase tracking-wider h-10 px-3">
              Name
            </TableHead>
            {schema.map((prop, i) => (
              <TableHead key={prop.id} className="min-w-[150px] border-r border-zinc-200 dark:border-zinc-800 h-10 p-0">
                <SchemaMenu 
                  property={prop} 
                  onUpdate={(upd) => updateProperty(i, upd)}
                  onDelete={() => deleteProperty(i)}
                >
                  <button className="flex items-center justify-between w-full h-full px-3 text-xs uppercase tracking-wider font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group">
                    <span>{prop.name}</span>
                    <ChevronDown className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100" />
                  </button>
                </SchemaMenu>
              </TableHead>
            ))}
            <TableHead className="w-10 p-0">
              <button className="flex items-center justify-center w-full h-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-muted-foreground transition-colors">
                <Plus className="size-3.5" />
              </button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} className="group/row hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 border-b border-zinc-100 dark:border-zinc-900 last:border-0 h-10">
              <TableCell className="p-0 border-r border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2 px-3 h-full min-h-[40px]">
                  <FileText className="size-3.5 text-zinc-400 shrink-0" />
                  <Link to={`/p/${row.id}`} className="flex-1 hover:underline truncate text-sm">
                    {row.title || "Untitled"}
                  </Link>
                </div>
              </TableCell>
              {schema.map((prop) => (
                <TableCell key={prop.id} className="p-0 border-r border-zinc-200 dark:border-zinc-800">
                  <PropertyCell
                    property={prop}
                    value={row.properties?.[prop.id]}
                    onChange={(val) => onUpdateRow(row.id, { properties: { ...(row.properties || {}), [prop.id]: val } })}
                  />
                </TableCell>
              ))}
              <TableCell className="p-0" />
            </TableRow>
          ))}
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={schema.length + 2} className="h-32 text-center text-muted-foreground italic text-sm">
                No items found. Click 'New Item' to get started.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}