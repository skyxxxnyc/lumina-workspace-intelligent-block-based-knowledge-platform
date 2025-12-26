# Cloudflare Workers React Template

[cloudflarebutton]

A production-ready full-stack template for building applications on Cloudflare Workers. This template features a React frontend with Tailwind CSS and shadcn/ui, powered by a Cloudflare Workers backend using Durable Objects for stateful entities (users, chats, messages). It demonstrates scalable, type-safe entity management with indexing, pagination, and CRUD operations.

## Features

- **Serverless Backend**: Cloudflare Workers with Hono routing and Durable Objects for multi-tenant storage.
- **Stateful Entities**: One Durable Object per entity (e.g., User, ChatBoard) with automatic indexing for efficient listing/pagination.
- **Type-Safe API**: Shared TypeScript types between frontend and backend.
- **Modern Frontend**: React 18, Vite, Tailwind CSS, shadcn/ui components, TanStack Query, React Router.
- **Real-time Chat Demo**: Users, chat boards, and threaded messages with optimistic updates.
- **Dark Mode**: Automatic theme detection with persistence.
- **Error Handling**: Global error boundaries and client error reporting.
- **Development Tools**: Hot reload, TypeScript strict mode, ESLint, Bun support.
- **Production-Ready**: CORS, logging, health checks, SPA asset handling.

## Tech Stack

- **Backend**: Cloudflare Workers, Durable Objects, Hono, TypeScript
- **Frontend**: React, Vite, Tailwind CSS, shadcn/ui, TanStack Query, React Router, Zustand, Framer Motion
- **Data**: SQLite-backed Durable Objects (via core-utils library)
- **Tools**: Bun, Wrangler, ESLint, TypeScript 5.x
- **UI**: Lucide React icons, Sonner toasts, Headless UI

## Quick Start

1. **Prerequisites**:
   - [Bun](https://bun.sh/) installed
   - [Cloudflare CLI (Wrangler)](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed
   - Cloudflare account with Workers enabled

2. **Clone & Install**:
   ```bash
   git clone <your-repo-url>
   cd <project-name>
   bun install
   ```

3. **Development**:
   ```bash
   bun dev
   ```
   Opens at `http://localhost:3000` (frontend) with Worker proxying API calls.

4. **Type Generation** (for Worker bindings):
   ```bash
   bun cf-typegen
   ```

## Development

### Scripts
| Command | Description |
|---------|-------------|
| `bun dev` | Start dev server (frontend + Worker preview) |
| `bun build` | Build production assets |
| `bun lint` | Run ESLint |
| `bun preview` | Preview production build |
| `bun deploy` | Build + deploy to Cloudflare |

### Project Structure
```
├── shared/          # Shared TypeScript types & mock data
├── src/             # React frontend (Vite)
├── worker/          # Cloudflare Worker backend
├── tailwind.config.js # Tailwind + shadcn/ui config
└── wrangler.jsonc   # Worker config
```

### Adding Entities
1. Extend `IndexedEntity` in `worker/entities.ts`.
2. Add routes in `worker/user-routes.ts`.
3. Use `api()` hook in frontend for type-safe calls.

### Frontend Customization
- Edit `src/pages/HomePage.tsx` for homepage.
- Use shadcn/ui components from `@/components/ui/*`.
- API calls via `src/lib/api-client.ts` (powered by TanStack Query).
- Layouts: `AppLayout.tsx` (optional sidebar).

### Backend Customization
- **Strict**: Edit only `worker/entities.ts` and `worker/user-routes.ts`.
- Core storage/utils in `worker/core-utils.ts` (do not modify).

## Deployment

Deploy to Cloudflare Workers in one command:

```bash
bun deploy
```

Or manually:

1. Login: `wrangler login`
2. Deploy: `wrangler deploy`

Configuration is in `wrangler.jsonc`. Assets are automatically bundled and served as a SPA.

[cloudflarebutton]

## Environment Variables

Set via Wrangler dashboard or `wrangler.toml`:

```
None required for basic usage.
```

## Contributing

1. Fork & clone.
2. Install: `bun install`.
3. Develop: `bun dev`.
4. PR to `main`.

## License

MIT License. See [LICENSE](LICENSE) for details.

## Support

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- File issues here on GitHub.