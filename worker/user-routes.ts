import { Hono } from "hono";
import type { Env } from './core-utils';
import { PageEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.get('/api/pages', async (c) => {
    await PageEntity.ensureSeed(c.env);
    const tree = await PageEntity.getTree(c.env);
    return ok(c, tree);
  });
  app.get('/api/databases/:id/rows', async (c) => {
    const id = c.req.param('id');
    const { items } = await PageEntity.list(c.env);
    const rows = items.filter(p => p.parentId === id);
    return ok(c, rows);
  });
  app.get('/api/pages/:id', async (c) => {
    const id = c.req.param('id');
    const page = new PageEntity(c.env, id);
    if (!await page.exists()) return notFound(c, 'Page not found');
    return ok(c, await page.getState());
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
      isPublic: false,
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
    const deleted = await PageEntity.delete(c.env, id);
    return ok(c, { deleted });
  });
}