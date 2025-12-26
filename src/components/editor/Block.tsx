import React, { useRef, useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TextareaAutosize from 'react-textarea-autosize';
import { GripVertical, Plus, Info, Image as ImageIcon } from 'lucide-react';
import { Block, BlockType } from '@shared/types';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { SlashMenu } from './SlashMenu';
import { Input } from '@/components/ui/input';
interface BlockItemProps {
  block: Block;
  isFocused: boolean;
  onUpdate: (updates: Partial<Block>) => void;
  onAdd: () => void;
  onDelete: () => void;
  onFocus: () => void;
  onTypeChange: (type: BlockType) => void;
}
export function BlockItem({ block, isFocused, onUpdate, onAdd, onDelete, onFocus, onTypeChange }: BlockItemProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isSlashMenuOpen, setIsSlashMenuOpen] = useState(false);
  const [slashMenuPos, setSlashMenuPos] = useState({ top: 0, left: 0 });
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
  useEffect(() => {
    if (isFocused && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isFocused]);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isSlashMenuOpen) {
      e.preventDefault();
      onAdd();
    } else if (e.key === 'Backspace' && block.content === '') {
      e.preventDefault();
      onDelete();
    } else if (e.key === 'Escape') {
      setIsSlashMenuOpen(false);
    }
  };
  const handleContentChange = (content: string) => {
    onUpdate({ content });
    if (content.startsWith('/')) {
      const rect = textareaRef.current?.getBoundingClientRect();
      if (rect) {
        setSlashMenuPos({ top: rect.bottom + 5, left: rect.left });
        setIsSlashMenuOpen(true);
      }
    } else {
      setIsSlashMenuOpen(false);
    }
  };
  const handleSlashSelect = (type: BlockType) => {
    onTypeChange(type);
    onUpdate({ content: '' });
    setIsSlashMenuOpen(false);
  };
  const renderContent = () => {
    const baseClass = "w-full bg-transparent border-none focus:ring-0 resize-none p-0 placeholder:text-zinc-300 dark:placeholder:text-zinc-700 outline-none";
    switch (block.type) {
      case 'h1':
        return (
          <TextareaAutosize
            ref={textareaRef}
            className={cn(baseClass, "text-3xl font-bold tracking-tight mb-2")}
            value={block.content}
            onChange={(e) => handleContentChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={onFocus}
            placeholder="Heading 1"
          />
        );
      case 'h2':
        return (
          <TextareaAutosize
            ref={textareaRef}
            className={cn(baseClass, "text-2xl font-semibold tracking-tight mb-1")}
            value={block.content}
            onChange={(e) => handleContentChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={onFocus}
            placeholder="Heading 2"
          />
        );
      case 'h3':
        return (
          <TextareaAutosize
            ref={textareaRef}
            className={cn(baseClass, "text-xl font-semibold tracking-tight")}
            value={block.content}
            onChange={(e) => handleContentChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={onFocus}
            placeholder="Heading 3"
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
              ref={textareaRef}
              className={cn(baseClass, block.metadata?.checked && "line-through text-muted-foreground")}
              value={block.content}
              onChange={(e) => handleContentChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={onFocus}
              placeholder="To-do"
            />
          </div>
        );
      case 'bullet':
        return (
          <div className="flex items-start gap-2">
            <div className="size-1.5 rounded-full bg-zinc-400 mt-2.5 flex-shrink-0" />
            <TextareaAutosize
              ref={textareaRef}
              className={baseClass}
              value={block.content}
              onChange={(e) => handleContentChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={onFocus}
              placeholder="List item"
            />
          </div>
        );
      case 'callout':
        return (
          <div className="flex items-start gap-3 p-4 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <div className="mt-0.5 text-zinc-500">
              <Info className="size-5" />
            </div>
            <TextareaAutosize
              ref={textareaRef}
              className={baseClass}
              value={block.content}
              onChange={(e) => handleContentChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={onFocus}
              placeholder="Callout"
            />
          </div>
        );
      case 'image':
        return (
          <div className="space-y-2 group/image">
            {block.metadata?.src ? (
              <div className="relative rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800">
                <img src={block.metadata.src} alt={block.metadata.alt || "Page image"} className="w-full h-auto max-h-[500px] object-contain" />
                <button 
                  onClick={() => onUpdate({ metadata: { ...block.metadata, src: '' } })}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded hover:bg-black/70 opacity-0 group-hover/image:opacity-100 transition-opacity"
                >
                  Edit
                </button>
              </div>
            ) : (
              <div className="p-8 rounded-lg border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center gap-3">
                <ImageIcon className="size-8 text-zinc-400" />
                <Input 
                  placeholder="Paste image URL..." 
                  className="max-w-xs"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onUpdate({ metadata: { ...block.metadata, src: (e.target as HTMLInputElement).value } });
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground">Press Enter to embed</p>
              </div>
            )}
            <TextareaAutosize
              ref={textareaRef}
              className={cn(baseClass, "text-sm text-center italic text-muted-foreground")}
              value={block.content}
              onChange={(e) => handleContentChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={onFocus}
              placeholder="Add a caption..."
            />
          </div>
        );
      case 'divider':
        return <hr className="my-6 border-zinc-200 dark:border-zinc-800" />;
      default:
        return (
          <TextareaAutosize
            ref={textareaRef}
            className={cn(baseClass, "text-base leading-relaxed")}
            value={block.content}
            onChange={(e) => handleContentChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={onFocus}
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
        isDragging && "z-50 opacity-50 bg-white shadow-xl dark:bg-zinc-900",
        block.type === 'divider' && "hover:bg-transparent"
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
      <SlashMenu 
        isOpen={isSlashMenuOpen} 
        onClose={() => setIsSlashMenuOpen(false)} 
        onSelect={handleSlashSelect}
        position={slashMenuPos}
      />
    </div>
  );
}