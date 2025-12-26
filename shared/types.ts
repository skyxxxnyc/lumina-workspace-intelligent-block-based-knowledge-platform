export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export type BlockType = 'text' | 'h1' | 'h2' | 'h3' | 'todo' | 'bullet' | 'divider';
export interface Block {
  id: string;
  type: BlockType;
  content: string;
  metadata?: {
    checked?: boolean;
  };
}
export interface Page {
  id: string;
  title: string;
  icon?: string;
  cover?: string;
  parentId: string | null;
  blocks: Block[];
  createdAt: number;
  updatedAt: number;
}
export interface PageMetadata {
  id: string;
  title: string;
  icon?: string;
  parentId: string | null;
}
export interface User {
  id: string;
  name: string;
}