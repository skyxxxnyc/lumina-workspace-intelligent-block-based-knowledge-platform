import { IndexedEntity } from "./core-utils";
import type { Page, PageMetadata } from "@shared/types";
export class PageEntity extends IndexedEntity<Page> {
  static readonly entityName = "page";
  static readonly indexName = "pages";
  static readonly initialState: Page = {
    id: "",
    title: "Untitled",
    parentId: null,
    blocks: [],
    createdAt: 0,
    updatedAt: 0
  };
  static seedData: Page[] = [
    {
      id: "welcome-home",
      title: "Welcome to Lumina",
      parentId: null,
      blocks: [
        { id: "b1", type: "h1", content: "Getting Started" },
        { id: "b2", type: "text", content: "This is your new block-based workspace. Try typing or use the drag handle to move things around." },
        { id: "b3", type: "todo", content: "Create your first page", metadata: { checked: false } }
      ],
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
  ];
  async updateBlocks(blocks: Page['blocks']): Promise<Page> {
    return this.mutate(s => ({ ...s, blocks, updatedAt: Date.now() }));
  }
  async updateMetadata(patch: Partial<Pick<Page, 'title' | 'icon' | 'cover' | 'parentId'>>): Promise<Page> {
    return this.mutate(s => ({ ...s, ...patch, updatedAt: Date.now() }));
  }
  static async getTree(env: any): Promise<PageMetadata[]> {
    const { items } = await this.list(env);
    return items.map(p => ({
      id: p.id,
      title: p.title,
      icon: p.icon,
      parentId: p.parentId
    }));
  }
}