import React, { useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TextareaAutosize from 'react-textarea-autosize';
import { GripVertical, Plus } from 'lucide-react';
import { Block } from '@shared/types';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
interface BlockItemProps {
  block: Block;
  onUpdate: (updates: Partial<Block>) => void;
  onAdd: () => void;
  onDelete: () => void;
}
export function BlockItem({ block, onUpdate, onAdd, onDelete }: BlockItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onAdd();
    } else if (e.key === 'Backspace' && block.content === '') {
      e.preventDefault();
      onDelete();
    }
  };
  const renderContent = () => {
    const baseClass = "w-full bg-transparent border-none focus:ring-0 resize-none p-0 placeholder:text-zinc-300 dark:placeholder:text-zinc-700";
    switch (block.type) {
      case 'h1':
        return (
          <TextareaAutosize
            className={cn(baseClass, "text-3xl font-bold tracking-tight mb-2")}
            value={block.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            onKeyDown={handleKeyDown}
            placeholder="Heading 1"
          />
        );
      case 'h2':
        return (
          <TextareaAutosize
            className={cn(baseClass, "text-2xl font-semibold tracking-tight mb-1")}
            value={block.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            onKeyDown={handleKeyDown}
            placeholder="Heading 2"
          />
        );
      case 'todo':
        return (
          <div className="flex items-start gap-2 pt-1">
            <Checkbox 
              checked={block.metadata?.checked} 
              onCheckedChange={(val) => onUpdate({ metadata: { ...block.metadata, checked: !!val } })}
              className="mt-1"
            />
            <TextareaAutosize
              className={cn(baseClass, block.metadata?.checked && "line-through text-muted-foreground")}
              value={block.content}
              onChange={(e) => onUpdate({ content: e.target.value })}
              onKeyDown={handleKeyDown}
              placeholder="To-do"
            />
          </div>
        );
      case 'divider':
        return <hr className="my-4 border-zinc-200 dark:border-zinc-800" />;
      default:
        return (
          <TextareaAutosize
            className={cn(baseClass, "text-base leading-relaxed")}
            value={block.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            onKeyDown={handleKeyDown}
            placeholder="Type '/' for commands..."
          />
        );
    }
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative flex items-start gap-1 px-1 py-0.5 rounded-sm hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors",
        isDragging && "z-50 opacity-50 bg-white shadow-xl dark:bg-zinc-900"
      )}
    >
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity absolute -left-8 top-1">
        <button className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded text-zinc-400" onClick={onAdd}>
          <Plus className="size-3.5" />
        </button>
        <div 
          className="p-1 cursor-grab active:cursor-grabbing hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded text-zinc-400"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-3.5" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        {renderContent()}
      </div>
    </div>
  );
}