import React, { useState } from 'react';
import { PropertyOption, PropertySchema } from '@shared/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Plus, Palette } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
        <Button size="icon" variant="ghost" className="size-8" onClick={addOption}>
          <Plus className="size-4" />
        </Button>
      </div>
      <div className="space-y-2 max-h-[200px] overflow-y-auto">
        {options.map((opt) => (
          <div key={opt.id} className="flex items-center justify-between group">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Badge variant="secondary" className="text-[10px] font-medium uppercase">
                {opt.label}
              </Badge>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-6">
                    <Palette className="size-3 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40 p-2" align="end">
                  <div className="grid grid-cols-4 gap-1">
                    {COLORS.map((c) => (
                      <button
                        key={c.value}
                        className={`size-6 rounded-full border border-zinc-200 dark:border-zinc-800 bg-${c.value}-100 dark:bg-${c.value}-900 hover:scale-110 transition-transform`}
                        onClick={() => updateOptionColor(opt.id, c.value)}
                        title={c.name}
                      />
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              <Button variant="ghost" size="icon" className="size-6 text-destructive hover:text-destructive" onClick={() => removeOption(opt.id)}>
                <X className="size-3" />
              </Button>
            </div>
          </div>
        ))}
        {options.length === 0 && (
          <p className="text-[10px] text-muted-foreground text-center py-2">No options created</p>
        )}
      </div>
    </div>
  );
}