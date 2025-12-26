import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { v4 as uuidv4 } from 'uuid';
import { Block, Page } from '@shared/types';
import { BlockItem } from './Block';
interface BlockEditorProps {
  initialBlocks: Block[];
  onChange: (blocks: Block[]) => void;
}
export function BlockEditor({ initialBlocks, onChange }: BlockEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  // Sync with prop updates (e.g. when switching pages)
  useEffect(() => {
    setBlocks(initialBlocks);
  }, [initialBlocks]);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over.id);
      const newBlocks = arrayMove(blocks, oldIndex, newIndex);
      setBlocks(newBlocks);
      onChange(newBlocks);
    }
  };
  const updateBlock = (id: string, updates: Partial<Block>) => {
    const newBlocks = blocks.map((b) => (b.id === id ? { ...b, ...updates } : b));
    setBlocks(newBlocks);
    onChange(newBlocks);
  };
  const addBlock = (afterId: string, type: Block['type'] = 'text') => {
    const index = blocks.findIndex((b) => b.id === afterId);
    const newBlock: Block = { id: uuidv4(), type, content: '' };
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    setBlocks(newBlocks);
    onChange(newBlocks);
    // Auto-focus logic would happen in Block components via a shared "focusedBlockId" state or ref
  };
  const deleteBlock = (id: string) => {
    if (blocks.length <= 1) return; // Keep at least one block
    const newBlocks = blocks.filter((b) => b.id !== id);
    setBlocks(newBlocks);
    onChange(newBlocks);
  };
  return (
    <div className="max-w-3xl mx-auto pb-32">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-1">
            {blocks.map((block) => (
              <BlockItem
                key={block.id}
                block={block}
                onUpdate={(updates) => updateBlock(block.id, updates)}
                onAdd={() => addBlock(block.id)}
                onDelete={() => deleteBlock(block.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}