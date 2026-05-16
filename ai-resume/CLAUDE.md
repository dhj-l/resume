# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Resume Builder (大学生智能简历生成系统) — a Vue 3 SPA for creating, editing, and exporting resumes. Backend is a separate NestJS + MongoDB app running on `localhost:3000`. The UI is entirely in Chinese.

## Common Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev server (Vite)
pnpm build            # Type-check + production build (vue-tsc -b && vite build)
pnpm preview          # Preview production build
pnpm lint             # ESLint check + auto-fix
pnpm lint:check       # ESLint check only (no fix, for CI)
pnpm lint:fix         # ESLint auto-fix only
pnpm format           # Prettier format all files
pnpm format:check     # Prettier check only (for CI)
```

No test framework is configured. There are no unit or e2e tests.

## Architecture

### Path Alias

`@/` maps to `src/`. Use this for all internal imports.

### Entry Flow

`main.ts` → installs Pinia (with persistedstate plugin), Vue Router, Element Plus (full import), Ant Design Vue (full import) → mounts `App.vue` which wraps `<router-view>` in Ant Design's `<a-config-provider :locale="zhCN">`.

### Routing (`src/router/index.ts`)

- `/` → HomePage layout (NavBar + Footer), redirects to `/home`
- `/editor` → Resume editor (standalone, no layout wrapper)
- `/auth/login`, `/auth/register` → AuthLayout (split-screen)
- `/user/resumes` → requires auth (checked via `meta.requiresAuth` in `beforeEach` guard)
- `/templates`, `/templates/:id` → template browsing

### State Management (`src/stores/`)

Two Pinia stores:

- **auth** (`auth.ts`): persisted to localStorage. Holds `token`, `userInfo`. Actions: login, register, logout, fetchProfile, updateProfile.
- **resumeStore** (`resumeStore.ts`): NOT persisted. Central resume data model with 10 modules (basicInfo, jobIntention, educationBackground, workExperience, projectExperience, campusExperience, internshipExperience, skills, certificates, selfEvaluation). Supports module reordering via `globalSort`/`localSort`. `basicInfo` and `jobIntention` are fixed-position modules that cannot be reordered.

### API Layer (`src/api/`)

Each domain (auth, user, resume, templates, upload) has its own directory with `*.ts` (functions) and `type.ts` (TypeScript interfaces). All HTTP requests go through `src/http/request.ts` — an Axios instance with:
- `VITE_API_BASE_URL` as base (default `http://localhost:3000/api/v1`)
- 100s timeout
- Bearer token injected from localStorage
- 401 responses trigger automatic logout + redirect to login

API response convention: `response.data.code` in 200-299 range = success.

### Editor (`src/views/editor/`)

The core feature. Structure:
- `components/drawer/` — 11 form components, one per resume section
- `components/preview/` — preview rendering components + TS logic files
- `templates/` — 3 resume templates: "default", "double-column", "simple"
- `hooks/usePagination.ts` — calculates A4-like page breaks (fixed height 1122px)

### UI Libraries

Both **Ant Design Vue** and **Element Plus** are used together. Primary UI is Ant Design Vue (`a-` prefix components). Element Plus is used selectively. Icons come from three sources: `@ant-design/icons-vue`, `@element-plus/icons-vue`, and `lucide-vue-next`.

## Code Conventions

- **Vue components**: always `<script setup lang="ts">` (Composition API only)
- **Styling**: Tailwind CSS for utility classes, SASS for component styles
- **Formatter**: Prettier — double quotes, semicolons, 2-space indent, 100 char width, trailing commas, LF endings
- **Import order**: external packages → `@/` internal imports → relative imports, with blank lines between groups (enforced by ESLint)
- **Commit messages**: conventional commits format, Chinese descriptions (e.g., `feat(editor): 优化自动保存功能`)
- **TypeScript**: strict mode enabled; `no-explicit-any` is warn, not error; unused vars prefixed with `_` are ignored
- **Rich text**: WangEditor wrapped in `src/components/basic-editor/`
