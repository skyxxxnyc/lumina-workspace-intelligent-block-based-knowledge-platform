import React, { useState } from 'react';
import { PropertySchema, PropertyOption } from '@shared/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Check, Plus } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
interface PropertyCellProps {
  property: PropertySchema;
  value: any;
  onChange: (v: any) => void;
  className?: string;
}
export function PropertyCell({ property, value, onChange, className }: PropertyCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const renderEditor = () => {
    switch (property.type) {
      case 'checkbox':
        return (
          <div className="flex items-center justify-center h-full w-full">
            <Checkbox 
              checked={!!value} 
              onCheckedChange={(val) => onChange(!!val)} 
            />
          </div>
        );
      case 'date':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <button className={cn(
                "flex items-center gap-2 px-3 py-2 w-full h-full text-sm text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors",
                !value && "text-zinc-400"
              )}>
                <CalendarIcon className="size-3.5" />
                {value ? format(new Date(value), 'MMM d, yyyy') : 'Empty'}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={value ? new Date(value) : undefined}
                onSelect={(date) => onChange(date?.toISOString())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );
      case 'select':
        const selectedOption = property.options?.find(o => o.id === value);
        return (
          <Popover open={isEditing} onOpenChange={setIsEditing}>
            <PopoverTrigger asChild>
              <button className="flex items-center px-3 py-2 w-full h-full text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                {selectedOption ? (
                  <Badge variant="secondary" className="text-xs font-normal">
                    {selectedOption.label}
                  </Badge>
                ) : (
                  <span className="text-zinc-400">Empty</span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[200px]" align="start">
              <Command>
                <CommandInput placeholder="Search options..." />
                <CommandList>
                  <CommandEmpty>No options found.</CommandEmpty>
                  <CommandGroup>
                    {property.options?.map((opt) => (
                      <CommandItem
                        key={opt.id}
                        onSelect={() => {
                          onChange(opt.id);
                          setIsEditing(false);
                        }}
                        className="flex items-center justify-between"
                      >
                        <Badge variant="secondary" className="text-xs font-normal">{opt.label}</Badge>
                        {value === opt.id && <Check className="size-3.5" />}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        );
      default:
        return (
          <input
            className="w-full h-full bg-transparent px-3 py-2 text-sm focus:outline-none focus:bg-white dark:focus:bg-zinc-800 border-none transition-colors"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Empty"
          />
        );
    }
  };
  return (
    <div className={cn("h-full min-h-[40px] border-r border-zinc-200 dark:border-zinc-800 last:border-r-0", className)}>
      {renderEditor()}
    </div>
  );
}