import React, { useState } from 'react';
import { PropertyOption, PropertySchema } from '@shared/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Plus, Palette, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn, getColorClass } from '@/lib/utils';
const COLORS = [
  { name: 'Gray', value: 'gray' },
  { name: 'Blue', value: 'blue' },
  { name: 'Green', value: 'green' },
  { name: 'Yellow', value: 'yellow' },
  { name: 'Orange', value: 'orange' },
  { name: 'Red', value: 'red' },
  { name: 'Purple', value: 'purple' },
  { name: 'Pink', value: 'pink' },
];
interface OptionManagerProps {
  property: PropertySchema;
  onUpdate: (updates: Partial<PropertySchema>) => void;
}
export function OptionManager({ property, onUpdate }: OptionManagerProps) {
  const [newLabel, setNewLabel] = useState('');
  const options = property.options || [];
  const addOption = () => {
    if (!newLabel.trim()) return;
    const newOption: PropertyOption = {
      id: crypto.randomUUID(),
      label: newLabel.trim(),
      color: 'gray'
    };
    onUpdate({ options: [...options, newOption] });
    setNewLabel('');
  };
  const removeOption = (id: string) => {
    onUpdate({ options: options.filter(o => o.id !== id) });
  };
  const updateOptionColor = (id: string, color: string) => {
    onUpdate({
      options: options.map(o => o.id === id ? { ...o, color } : o)
    });
  };
  return (
    <div className="space-y-4 p-3">
      <div className="flex items-center gap-2">
        <Input
          placeholder="New option..."
          className="h-8 text-xs"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addOption()}
        />
        <Button size="icon" variant="ghost" className="size-8 hover:bg-zinc-100 dark:hover:bg-zinc-800" onClick={addOption}>
          <Plus className="size-4" />
        </Button>
      </div>
      <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
        {options.map((opt) => (
          <div key={opt.id} className="flex items-center justify-between group py-0.5">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Badge 
                variant="secondary" 
                className={cn("text-[10px] font-bold uppercase border-none", getColorClass(opt.color, 'badge'))}
              >
                {opt.label}
              </Badge>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-6 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                    <Palette className="size-3 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-44 p-2" align="end">
                  <div className="grid grid-cols-4 gap-1.5">
                    {COLORS.map((c) => (
                      <button
                        key={c.value}
                        className={cn(
                          "size-8 rounded-md border flex items-center justify-center transition-all hover:scale-105",
                          getColorClass(c.value, 'bg'),
                          getColorClass(c.value, 'border'),
                          opt.color === c.value ? "ring-2 ring-primary ring-offset-1" : ""
                        )}
                        onClick={() => updateOptionColor(opt.id, c.value)}
                        title={c.name}
                      >
                        {opt.color === c.value && <Check className="size-3 text-primary" />}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              <Button 
                variant="ghost" 
                size="icon" 
                className="size-6 text-destructive hover:text-destructive hover:bg-destructive/10" 
                onClick={() => removeOption(opt.id)}
              >
                <X className="size-3" />
              </Button>
            </div>
          </div>
        ))}
        {options.length === 0 && (
          <p className="text-[10px] text-muted-foreground text-center py-4 italic">No options created</p>
        )}
      </div>
    </div>
  );
}