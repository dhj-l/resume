# Repository Guidelines

## Project Structure & Module Organization

This repository contains one frontend application, `ai-resume/` — an AI resume builder using Vue 3, TypeScript, and Vite. The backend is a separate repository (`ai-resume-server`, NestJS + MongoDB).

- `ai-resume/src/` — application source: `api/` (API definitions), `components/` and `views/` (UI and pages), `stores/` (Pinia), `router/` (routes and guards), `http/` (Axios wrapper), `utils/` and `directives/` (helpers and custom directives)
- `ai-resume/tests/` — Playwright E2E tests (`specs/`, `fixtures/`, `mocks/`)
- `ai-resume/docs/` — API and promotion documentation
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

## Coding Style & Naming Conventions

- Use 2-space indentation, semicolons, double quotes, trailing commas, a 100-character print width, and LF line endings (configured in `.prettierrc`).
- Prefer the Vue 3 Composition API (`<script setup>`) with TypeScript; use PascalCase for components and kebab-case for directories and files.
- Never use `v-html`; render rich text through the project's `v-safe-html` directive (DOMPurify).
- Run `pnpm lint` and `pnpm format` before committing. Import order is enforced by ESLint (`import/order`).

## Testing Guidelines

- This project uses Playwright for E2E testing only; there are no unit tests or coverage thresholds.
- Place specs in `tests/specs/` and name them `*.spec.ts`, e.g. `auth-flows.spec.ts`. Reuse shared fixtures and mocks from `tests/fixtures/` and `tests/mocks/`.
- Never commit `.only` in a spec (forbidden in CI). Tests target Chrome and require the local dev server.

## Commit & Pull Request Guidelines

- Follow Conventional Commits with a Chinese description: `feat:`, `fix:`, `refactor:`, `style:`, `docs:`, `chore:`, `test:`, or `release:`. Add a scope when useful, e.g. `fix(request): adjust axios timeout`.
- Create feature branches as `feature/<name>` and open PRs to `dev`; use `release/<version>` branches for releases.
- In every PR, explain what changed and why, link related issues, and include screenshots for UI changes. Build, lint, and E2E tests must pass before merging.
