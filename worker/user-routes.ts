import { Hono } from "hono";
import type { Env } from './core-utils';
import { PageEntity, WorkspaceEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.get('/api/workspace', async (c) => {
    await WorkspaceEntity.ensureSeed(c.env);
    const ws = new WorkspaceEntity(c.env, "default");
    return ok(c, await ws.getState());
  });
  app.put('/api/workspace', async (c) => {
    const body = await c.req.json();
    const ws = new WorkspaceEntity(c.env, "default");
    return ok(c, await ws.mutate(s => ({ ...s, ...body, updatedAt: Date.now() })));
  });
  app.get('/api/pages', async (c) => {
    await PageEntity.ensureSeed(c.env);
    const tree = await PageEntity.getTree(c.env);
    return ok(c, tree);
  });
  app.get('/api/pages/export', async (c) => {
    const { items } = await PageEntity.list(c.env);
    // Return full page objects including blocks for backup
    return ok(c, items.filter(p => !p.deletedAt));
  });
  app.get('/api/search', async (c) => {
    const { items } = await PageEntity.list(c.env);
    const searchData = items
      .filter(p => !p.deletedAt)
      .map(p => ({
        id: p.id,
        title: p.title,
        type: p.type,
        icon: p.icon,
        parentId: p.parentId
      }));
    return ok(c, searchData);
  });
  app.get('/api/public/pages/:id', async (c) => {
    const id = c.req.param('id');
    const page = new PageEntity(c.env, id);
    if (!await page.exists()) return notFound(c, 'Page not found');
    const state = await page.getState();
    if (!state.isPublic || !!state.deletedAt) return bad(c, 'This page is not public or has been deleted');
    return ok(c, state);
  });
  app.get('/api/trash', async (c) => {
    const trash = await PageEntity.getTrash(c.env);
    return ok(c, trash);
  });
  app.post('/api/pages/:id/restore', async (c) => {
    const id = c.req.param('id');
    const page = new PageEntity(c.env, id);
    if (!await page.exists()) return notFound(c);
    return ok(c, await page.restore());
  });
  app.delete('/api/pages/:id/permanent', async (c) => {
    const id = c.req.param('id');
    const deleted = await PageEntity.delete(c.env, id);
    return ok(c, { deleted });
  });
  app.get('/api/databases/:id/rows', async (c) => {
    const id = c.req.param('id');
    const { items } = await PageEntity.list(c.env);
    const rows = items.filter(p => p.parentId === id && !p.deletedAt);
    return ok(c, rows);
  });
  app.get('/api/pages/:id', async (c) => {
    const id = c.req.param('id');
    const page = new PageEntity(c.env, id);
    if (!await page.exists()) return notFound(c, 'Page not found');
    const state = await page.getState();
    if (state.deletedAt) return bad(c, 'Page is in trash');
    return ok(c, state);
  });
  app.post('/api/pages', async (c) => {
    const body = await c.req.json();
    const id = body.id || crypto.randomUUID();
    const type = body.type || 'page';
    const pageData = {
      id,
      type,
      title: body.title || "Untitled",
      parentId: body.parentId || null,
      blocks: body.blocks || (type === 'page' ? [{ id: crypto.randomUUID(), type: 'text', content: '' }] : []),
      propertiesSchema: body.propertiesSchema || (type === 'database' ? [{ id: 'p1', name: 'Status', type: 'select', options: [] }] : undefined),
      views: body.views || (type === 'database' ? [{ id: 'v1', name: 'Table', type: 'table' }] : undefined),
      properties: body.properties || {},
      isPublic: body.isPublic || false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    const created = await PageEntity.create(c.env, pageData);
    return ok(c, created);
  });
  app.put('/api/pages/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();
    const page = new PageEntity(c.env, id);
    if (!await page.exists()) return notFound(c, 'Page not found');
    return ok(c, await page.mutate(s => ({
      ...s,
      ...body,
      updatedAt: Date.now()
    })));
  });
  app.delete('/api/pages/:id', async (c) => {
    const id = c.req.param('id');
    const page = new PageEntity(c.env, id);
    if (!await page.exists()) return notFound(c);
    await page.softDelete();
    return ok(c, { success: true });
  });
  app.post('/api/bulk-import', async (c) => {
    const { pages } = await c.req.json();
    if (!Array.isArray(pages)) return bad(c, 'Invalid payload');
    for (const p of pages) {
      // Use create to ensure index is updated
      await PageEntity.create(c.env, p);
    }
    return ok(c, { imported: pages.length });
  });
}