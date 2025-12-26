import { IndexedEntity } from "./core-utils";
import type { Page, PageMetadata, Workspace } from "@shared/types";
export class WorkspaceEntity extends IndexedEntity<Workspace> {
  static readonly entityName = "workspace";
  static readonly indexName = "workspaces";
  static readonly initialState: Workspace = {
    id: "default",
    name: "My Workspace",
    icon: "🏠",
    color: "blue",
    preferences: {
      theme: 'system',
      language: 'en',
      notifications: {
        emailUpdates: true,
        pageViews: false
      }
    },
    privacy: {
      publicByDefault: false,
      showActivity: true
    },
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  static seedData: Workspace[] = [
    {
      id: "default",
      name: "My Workspace",
      icon: "🏠",
      color: "blue",
      preferences: {
        theme: 'system',
        language: 'en',
        notifications: {
          emailUpdates: true,
          pageViews: false
        }
      },
      privacy: {
        publicByDefault: false,
        showActivity: true
      },
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
  ];
}
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
    }
  ];
  async softDelete(): Promise<Page> {
    return this.mutate(s => ({ ...s, deletedAt: Date.now(), updatedAt: Date.now() }));
  }
  async restore(): Promise<Page> {
    return this.mutate(s => {
      const { deletedAt, ...rest } = s;
      return { ...rest, updatedAt: Date.now() } as Page;
    });
  }
  static async getTree(env: any): Promise<PageMetadata[]> {
    const { items } = await this.list(env);
    return items
      .filter(p => !p.deletedAt)
      .map(p => ({
        id: p.id,
        type: p.type || 'page',
        title: p.title,
        icon: p.icon,
        parentId: p.parentId
      }));
  }
  static async getTrash(env: any): Promise<PageMetadata[]> {
    const { items } = await this.list(env);
    return items
      .filter(p => !!p.deletedAt)
      .map(p => ({
        id: p.id,
        type: p.type || 'page',
        title: p.title,
        icon: p.icon,
        parentId: p.parentId,
        deletedAt: p.deletedAt
      }));
  }
}