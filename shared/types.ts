export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export type BlockType =
  | 'text' | 'h1' | 'h2' | 'h3' | 'todo' | 'bullet' | 'divider' | 'image' | 'callout' | 'table';
export type PageType = 'page' | 'database';
export type PropertyType = 
  | 'text' | 'number' | 'date' | 'select' | 'multi-select' | 'checkbox' | 'url';
export interface PropertyOption {
  id: string;
  label: string;
  color?: string;
}
export interface PropertySchema {
  id: string;
  name: string;
  type: PropertyType;
  options?: PropertyOption[];
}
export type ViewType = 'table' | 'board' | 'gallery' | 'list' | 'calendar';
export interface DatabaseView {
  id: string;
  name: string;
  type: ViewType;
  config?: any;
}
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
  type: PageType;
  title: string;
  icon?: string;
  cover?: string;
  parentId: string | null;
  blocks: Block[];
  propertiesSchema?: PropertySchema[];
  views?: DatabaseView[];
  properties?: Record<string, any>; // For row items
  isPublic?: boolean;
  createdAt: number;
  updatedAt: number;
}
export interface PageMetadata {
  id: string;
  type: PageType;
  title: string;
  icon?: string;
  parentId: string | null;
  isPublic?: boolean;
}
export interface User {
  id: string;
  name: string;
}