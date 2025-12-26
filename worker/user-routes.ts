import { Hono } from "hono";
import type { Env } from './core-utils';
import { PageEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // GET PAGE TREE
  app.get('/api/pages', async (c) => {
    await PageEntity.ensureSeed(c.env);
    const tree = await PageEntity.getTree(c.env);
    return ok(c, tree);
  });
  // GET FULL PAGE
  app.get('/api/pages/:id', async (c) => {
    const id = c.req.param('id');
    const page = new PageEntity(c.env, id);
    if (!await page.exists()) return notFound(c, 'Page not found');
    return ok(c, await page.getState());
  });
  // CREATE PAGE
  app.post('/api/pages', async (c) => {
    const body = await c.req.json();
    const id = body.id || crypto.randomUUID();
    const pageData = {
      id,
      title: body.title || "Untitled",
      parentId: body.parentId || null,
      blocks: body.blocks || [{ id: crypto.randomUUID(), type: 'text', content: '' }],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    const created = await PageEntity.create(c.env, pageData);
    return ok(c, created);
  });
  // UPDATE PAGE
  app.put('/api/pages/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();
    const page = new PageEntity(c.env, id);
    if (!await page.exists()) return notFound(c, 'Page not found');
    if (body.blocks) {
      return ok(c, await page.updateBlocks(body.blocks));
    }
    return ok(c, await page.updateMetadata(body));
  });
  // DELETE PAGE
  app.delete('/api/pages/:id', async (c) => {
    const id = c.req.param('id');
    const deleted = await PageEntity.delete(c.env, id);
    return ok(c, { deleted });
  });
}