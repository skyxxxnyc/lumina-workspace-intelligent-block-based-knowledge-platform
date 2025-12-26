import React, { useEffect, useState } from 'react';
import { 
  Heading1, Heading2, Heading3, 
  Type, CheckSquare, List, 
  Minus, Image as ImageIcon, Info 
} from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent } from '@/components/ui/popover';
import { BlockType } from '@shared/types';
interface SlashMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: BlockType) => void;
  position: { top: number; left: number };
}
const ITEMS: { type: BlockType; label: string; icon: React.ReactNode; description: string }[] = [
  { type: 'text', label: 'Text', icon: <Type className="size-4" />, description: 'Just start writing with plain text.' },
  { type: 'h1', label: 'Heading 1', icon: <Heading1 className="size-4" />, description: 'Big section heading.' },
  { type: 'h2', label: 'Heading 2', icon: <Heading2 className="size-4" />, description: 'Medium section heading.' },
  { type: 'h3', label: 'Heading 3', icon: <Heading3 className="size-4" />, description: 'Small section heading.' },
  { type: 'todo', label: 'To-do list', icon: <CheckSquare className="size-4" />, description: 'Track tasks with a checkbox.' },
  { type: 'bullet', label: 'Bulleted list', icon: <List className="size-4" />, description: 'Create a simple bulleted list.' },
  { type: 'divider', label: 'Divider', icon: <Minus className="size-4" />, description: 'Visually divide sections.' },
  { type: 'callout', label: 'Callout', icon: <Info className="size-4" />, description: 'Make writing stand out.' },
  { type: 'image', label: 'Image', icon: <ImageIcon className="size-4" />, description: 'Upload or embed with a link.' },
];
export function SlashMenu({ isOpen, onClose, onSelect, position }: SlashMenuProps) {
  const [search, setSearch] = useState('');
  useEffect(() => {
    if (!isOpen) setSearch('');
  }, [isOpen]);
  if (!isOpen) return null;
  return (
    <Popover open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <PopoverContent 
        className="p-0 w-72 shadow-xl border-zinc-200 dark:border-zinc-800" 
        align="start"
        side="bottom"
        style={{ position: 'fixed', top: position.top, left: position.left }}
      >
        <Command className="rounded-lg">
          <CommandInput 
            placeholder="Filter blocks..." 
            value={search} 
            onValueChange={setSearch}
            autoFocus 
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Basic Blocks">
              {ITEMS.map((item) => (
                <CommandItem
                  key={item.type}
                  onSelect={() => onSelect(item.type)}
                  className="flex items-center gap-3 px-2 py-1.5 cursor-pointer"
                >
                  <div className="size-8 rounded border border-zinc-200 dark:border-zinc-800 flex items-center justify-center bg-white dark:bg-zinc-900 shadow-sm">
                    {item.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{item.label}</span>
                    <span className="text-xs text-muted-foreground">{item.description}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}