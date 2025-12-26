export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export type BlockType =
  | 'text'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'todo'
  | 'bullet'
  | 'divider'
  | 'image'
  | 'callout'
  | 'table';
export interface Block {
  id: string;
  type: BlockType;
  content: string;
  metadata?: {
    checked?: boolean;
    icon?: string;
    src?: string;
    alt?: string;
    caption?: string;
    tableData?: string[][];
    tableHeaders?: string[];
  };
}
export interface Page {
  id: string;
  title: string;
  icon?: string;
  cover?: string;
  parentId: string | null;
  blocks: Block[];
  isPublic?: boolean;
  createdAt: number;
  updatedAt: number;
}
export interface PageMetadata {
  id: string;
  title: string;
  icon?: string;
  parentId: string | null;
  isPublic?: boolean;
}
export interface User {
  id: string;
  name: string;
}