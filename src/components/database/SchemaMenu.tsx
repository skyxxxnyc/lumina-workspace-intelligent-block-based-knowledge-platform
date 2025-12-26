import React from 'react';
import { 
  Type, 
  Hash, 
  Calendar as CalendarIcon, 
  CheckSquare, 
  ChevronDown, 
  Trash2, 
  Settings, 
  List
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { PropertySchema, PropertyType } from '@shared/types';
import { Input } from '@/components/ui/input';
interface SchemaMenuProps {
  property: PropertySchema;
  onUpdate: (updates: Partial<PropertySchema>) => void;
  onDelete: () => void;
  children: React.ReactNode;
}
const PROPERTY_TYPES: { type: PropertyType; label: string; icon: React.ReactNode }[] = [
  { type: 'text', label: 'Text', icon: <Type className="size-4" /> },
  { type: 'number', label: 'Number', icon: <Hash className="size-4" /> },
  { type: 'select', label: 'Select', icon: <List className="size-4" /> },
  { type: 'date', label: 'Date', icon: <CalendarIcon className="size-4" /> },
  { type: 'checkbox', label: 'Checkbox', icon: <CheckSquare className="size-4" /> },
];
export function SchemaMenu({ property, onUpdate, onDelete, children }: SchemaMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <div className="p-2">
          <Input 
            className="h-8 text-xs mb-2" 
            value={property.name} 
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="Property name"
          />
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-[10px] uppercase text-muted-foreground font-bold">Property Type</DropdownMenuLabel>
        {PROPERTY_TYPES.map((pt) => (
          <DropdownMenuItem 
            key={pt.type} 
            onClick={() => onUpdate({ type: pt.type })}
            className="gap-2"
          >
            <div className="text-zinc-500">{pt.icon}</div>
            <span className="flex-1">{pt.label}</span>
            {property.type === pt.type && <div className="size-1.5 rounded-full bg-primary" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive gap-2">
          <Trash2 className="size-4" />
          <span>Delete Property</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}