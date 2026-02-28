# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm generate     # Generate static site
pnpm preview      # Preview production build
pnpm postinstall  # Run Nuxt prepare (postinstall hook)
```

## Architecture

**Framework**: Nuxt 4 with Vue 3, using @nuxt/ui (v4) for components and Tailwind CSS v4 for styling.

**Directory Structure**:
- `app/` - Frontend code (pages, components, assets)
  - `app/pages/` - Vue page components (auto-routed)
  - `app/assets/css/` - Global styles
- `server/` - Backend API
  - `server/api/` - API endpoints (auto-routed, `/api` prefix)
  - `server/routes/` - Custom server routes
  - `server/utils/` - Server-side utilities
- `shared/types/` - Shared TypeScript type definitions
- `prisma/` - Database schema and migrations
- `generated/` - Auto-generated Prisma client

**Database**: SQLite via Prisma with `@prisma/adapter-better-sqlite3`. The Prisma client is generated to `generated/prisma` (see `prisma/schema.prisma`).

**Authentication**: Uses `nuxt-auth-utils` with:
- Email/password authentication (bcrypt hashing)
- OAuth support (GitHub, Google) via `Account` model
- Session management via `#auth-utils` module augmentation (see `shared/types/auth.d.ts`)

**File Upload**: Supports both local storage and S3-compatible providers (MinIO, AWS S3, Aliyun OSS, Tencent COS). Configured via `runtimeConfig` in `nuxt.config.ts` and environment variables.

**Key Server Utilities**:
- `server/utils/db.ts` - Prisma client initialization
- `server/utils/db-auth.ts` - Authentication helpers (user CRUD, OAuth linking, password management)

**Icon System**: @nuxt/icon with custom aliases defined in `app/app.config.ts`.

## Environment Variables

Copy `.env.example` to `.env`. Key variables:
- `DATABASE_URL` - SQLite connection string
- `NUXT_UPLOAD_DIR` / `NUXT_UPLOAD_BASE_URL` - Local upload config
- `NUXT_S3_*` - S3/MinIO upload config (endpoint, accessKey, secretKey, bucket, region)
