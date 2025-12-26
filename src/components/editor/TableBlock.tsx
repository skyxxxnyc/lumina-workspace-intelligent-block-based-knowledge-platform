import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Block } from "@shared/types";
import { cn } from "@/lib/utils";
interface TableBlockProps {
  block: Block;
  onUpdate: (updates: Partial<Block>) => void;
  readOnly?: boolean;
}
export function TableBlock({ block, onUpdate, readOnly }: TableBlockProps) {
  const data = block.metadata?.tableData || [["", ""], ["", ""]];
  const headers = block.metadata?.tableHeaders || ["Column 1", "Column 2"];
  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    if (readOnly) return;
    const newData = [...data.map(row => [...row])];
    newData[rowIndex][colIndex] = value;
    onUpdate({ metadata: { ...block.metadata, tableData: newData } });
  };
  const updateHeader = (colIndex: number, value: string) => {
    if (readOnly) return;
    const newHeaders = [...headers];
    newHeaders[colIndex] = value;
    onUpdate({ metadata: { ...block.metadata, tableHeaders: newHeaders } });
  };
  const addRow = () => {
    if (readOnly) return;
    const newRow = new Array(headers.length).fill("");
    onUpdate({ metadata: { ...block.metadata, tableData: [...data, newRow] } });
  };
  const addColumn = () => {
    if (readOnly) return;
    const newHeaders = [...headers, `Column ${headers.length + 1}`];
    const newData = data.map(row => [...row, ""]);
    onUpdate({ metadata: { ...block.metadata, tableHeaders: newHeaders, tableData: newData } });
  };
  return (
    <div className="my-4 group/table-container relative">
      <div className="rounded-md border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-50 dark:bg-zinc-900/50">
              {headers.map((header, i) => (
                <TableHead key={i} className="p-0 h-10 border-r border-zinc-200 dark:border-zinc-800 last:border-0">
                  <input
                    className="w-full h-full bg-transparent px-3 font-semibold focus:outline-none focus:bg-white dark:focus:bg-zinc-800"
                    value={header}
                    onChange={(e) => updateHeader(i, e.target.value)}
                    readOnly={readOnly}
                  />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex} className="hover:bg-transparent">
                {row.map((cell, colIndex) => (
                  <TableCell key={colIndex} className="p-0 border-r border-zinc-200 dark:border-zinc-800 last:border-0">
                    <input
                      className="w-full h-full min-h-[40px] bg-transparent px-3 py-2 focus:outline-none focus:bg-white dark:focus:bg-zinc-800"
                      value={cell}
                      onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                      readOnly={readOnly}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {!readOnly && (
        <div className="flex gap-2 mt-2 opacity-0 group-hover/table-container:opacity-100 transition-opacity">
          <Button variant="ghost" size="sm" onClick={addRow} className="h-7 text-xs gap-1">
            <Plus className="size-3" /> Add row
          </Button>
          <Button variant="ghost" size="sm" onClick={addColumn} className="h-7 text-xs gap-1">
            <Plus className="size-3" /> Add column
          </Button>
        </div>
      )}
    </div>
  );
}