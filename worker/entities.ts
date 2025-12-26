import { IndexedEntity } from "./core-utils";
import type { Page, PageMetadata } from "@shared/types";
export class PageEntity extends IndexedEntity<Page> {
  static readonly entityName = "page";
  static readonly indexName = "pages";
  static readonly initialState: Page = {
    id: "",
    type: "page",
    title: "Untitled",
    parentId: null,
    blocks: [],
    createdAt: 0,
    updatedAt: 0
  };
  static seedData: Page[] = [
    {
      id: "welcome-home",
      type: "page",
      title: "Welcome to Lumina",
      parentId: null,
      blocks: [
        { id: "b1", type: "h1", content: "Getting Started" },
        { id: "b2", type: "text", content: "This is your new block-based workspace. Try typing or use the drag handle to move things around." },
        { id: "b3", type: "todo", content: "Create your first page", metadata: { checked: false } }
      ],
      createdAt: Date.now(),
      updatedAt: Date.now()
    },
    {
      id: "tasks-db",
      type: "database",
      title: "Tasks",
      parentId: null,
      blocks: [],
      propertiesSchema: [
        { id: "p1", name: "Status", type: "select", options: [
          { id: "o1", label: "To Do", color: "gray" },
          { id: "o2", label: "In Progress", color: "blue" },
          { id: "o3", label: "Done", color: "green" }
        ]},
        { id: "p2", name: "Priority", type: "select", options: [
          { id: "v1", label: "Low", color: "zinc" },
          { id: "v2", label: "Medium", color: "orange" },
          { id: "v3", label: "High", color: "red" }
        ]},
        { id: "p3", name: "Due Date", type: "date" }
      ],
      views: [{ id: "v1", name: "Table View", type: "table" }],
      createdAt: Date.now(),
      updatedAt: Date.now()
    },
    {
      id: "task-1",
      type: "page",
      title: "Design System",
      parentId: "tasks-db",
      blocks: [{ id: "t1b1", type: "text", content: "Start with color tokens." }],
      properties: { "p1": "o2", "p2": "v3" },
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
  ];
  async updateBlocks(blocks: Page['blocks']): Promise<Page> {
    return this.mutate(s => ({ ...s, blocks, updatedAt: Date.now() }));
  }
  async updateMetadata(patch: Partial<Page>): Promise<Page> {
    return this.mutate(s => ({ ...s, ...patch, updatedAt: Date.now() }));
  }
  static async getTree(env: any): Promise<PageMetadata[]> {
    const { items } = await this.list(env);
    return items.map(p => ({
      id: p.id,
      type: p.type || 'page',
      title: p.title,
      icon: p.icon,
      parentId: p.parentId
    }));
  }
}