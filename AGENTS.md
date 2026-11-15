# Repository Guidelines

## Project Structure & Module Organization

This repository contains one frontend application, `ai-resume/` — an AI resume builder (大学生智能简历生成系统) using Vue 3, TypeScript, and Vite. The backend is a separate repository (`ai-resume-server`, NestJS + MongoDB); production is `https://ai-jl.top`. All user-facing text is in Chinese.

- `ai-resume/src/` — application source: `api/` (API definitions, one directory per domain), `views/` and `components/` (pages and UI), `layouts/`, `stores/` (Pinia), `router/` (routes and guards), `http/` (Axios wrapper), `directives/` (incl. `v-safe-html`), `utils/`
- `ai-resume/tests/` — Playwright E2E tests (`specs/`, `fixtures/`, `mocks/`)
- `ai-resume/docs/` — `API_DOCS.md` and `接口文档.md` (backend interface docs); read these before changing API calls or data models
- `ai-resume/public/` — static assets; `ai-resume/dist/` — build output

## Build, Test, and Development Commands

Run commands from `ai-resume/` using pnpm (Node.js >= 18, pnpm >= 8).

- `pnpm install` — install dependencies
- `pnpm dev` — start the Vite dev server at http://localhost:5173
- `pnpm build` — type-check with `vue-tsc`, then create a production build
- `pnpm preview` — preview the production build locally
- `pnpm lint` / `pnpm lint:check` — run ESLint with autofix / check only
- `pnpm format` / `pnpm format:check` — run Prettier (write) / verify formatting
- `pnpm test:e2e` / `pnpm test:e2e:ui` — run Playwright E2E tests / open the interactive UI

Copy `.env.example` to `.env` and fill in the backend URL before developing locally. Never commit `.env`.

## Architecture Rules

- Imports use the `@/` path alias for `src/`; order is external packages → `@/` imports → relative imports, enforced by ESLint.
- All HTTP goes through `src/http/request.ts` (Axios): base URL `VITE_API_BASE_URL`, 100s timeout, Bearer token injected, and 401 responses trigger automatic logout + redirect to login. API functions live in `src/api/<domain>/` (auth, user, resume, resume-ai, templates, upload, interview) with types in `type.ts` in the same directory.
- Response convention: `response.data.code` in the 200–299 range means success — check this field, not just HTTP status.
- Pinia stores in `src/stores/`: `auth.ts` (persisted to localStorage: token, userInfo), `resumeStore.ts` (central resume model, NOT persisted; module ordering via `globalSort`/`localSort`, with `basicInfo` and `jobIntention` fixed-position), `aiGenerateStore.ts` (AI generation state).
- Router guard in `src/router/index.ts`: routes with `meta.requiresAuth` redirect to login when unauthenticated.
- The resume editor (`src/views/editor/`) is the core feature: `components/drawer/` (one form component per resume section), `components/preview/`, `templates/` ("default", "double-column", "simple"), and `hooks/usePagination.ts` (A4-like page breaks at a fixed 1122px height). Rich text uses WangEditor wrapped in `src/components/basic-editor/`.

## Coding Style & Naming Conventions

- Use 2-space indentation, semicolons, double quotes, trailing commas, a 100-character print width, and LF line endings (configured in `.prettierrc`).
- Prefer the Vue 3 Composition API (`<script setup>`) with TypeScript; use PascalCase for components and kebab-case for directories and files.
- Ant Design Vue is the sole UI library (`a-*` components, Chinese locale via `a-config-provider`); icons come from both `@ant-design/icons-vue` and `lucide-vue-next`. Style with Tailwind CSS utilities plus SASS for component styles.
- Never use `v-html`; render rich text through the project's `v-safe-html` directive (DOMPurify).
- TypeScript is strict mode; `no-explicit-any` is a warning, not an error. Prefix intentionally unused variables with `_`.
- Run `pnpm lint` and `pnpm format` before committing. Import order is enforced by ESLint (`import/order`).

## Testing Guidelines

- This project uses Playwright for E2E testing only; there are no unit tests or coverage thresholds.
- Place specs in `tests/specs/` and name them `*.spec.ts`, e.g. `auth-flows.spec.ts`. Reuse shared fixtures and mocks from `tests/fixtures/` and `tests/mocks/`.
- Never commit `.only` in a spec (forbidden in CI). Tests target Chrome and require the local dev server.

## Commit & Pull Request Guidelines

- Follow Conventional Commits with a Chinese description: `feat:`, `fix:`, `refactor:`, `style:`, `docs:`, `chore:`, `test:`, or `release:`. Add a scope when useful, e.g. `fix(request): adjust axios timeout`.
- Create feature branches as `feature/<name>` and open PRs to `dev`; use `release/<version>` branches for releases.
- In every PR, explain what changed and why, link related issues, and include screenshots for UI changes. Build, lint, and E2E tests must pass before merging.
