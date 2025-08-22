# Repository Guidelines

## Project Structure & Module Organization
- `pages/`: Next.js Pages Router (SSG) — `index.tsx`, `posts/[slug].tsx`, `api/feeds.ts`.
- `lib/`: data utilities — `posts.ts` (Markdown → HTML, reading time), `feed.ts` (RSS/Atom).
- `components/`: UI building blocks (`layout.tsx`, `bio.tsx`).
- `content/blog/<slug>/index.md`: Markdown posts with frontmatter.
- `public/`: static assets; `styles/`: global CSS; `next.config.js`: Next config.

## Build, Test, and Development Commands
- `npm install`: install dependencies.
- `npm run dev`: start local dev at `http://localhost:3000`.
- `npm run build`: production build; validates TypeScript and page generation.
- `npm start`: run the production server.
- Feeds: visit `/api/feeds?type=rss` or `/api/feeds?type=atom` after build/start.

## Coding Style & Naming Conventions
- TypeScript with `strict: true` (see `tsconfig.json`).
- Prettier enforced: 2 spaces, no semicolons, double quotes, `trailingComma: es5`.
  - Example: `npx prettier --write .` (or Prettier editor integration).
- Components: `PascalCase` in `components/`. Functions/variables: `camelCase`.
- Slugs: `kebab-case` folder names under `content/blog/`.
- Post frontmatter: `title`, `date` (ISO, e.g., `2024-08-21`), `description?`, `tags?`.

## Testing Guidelines
- No automated test suite yet (`npm test` is a stub).
- Use `npm run build` as a smoke test; verify pages render and paths generate.
- Validate feeds: ensure `200` responses for RSS/Atom and correct metadata.
- Prefer small PRs; include manual test notes in the PR description.

## Commit & Pull Request Guidelines
- Commits: imperative mood, concise scope (e.g., `posts: add DynamoDB article`).
- PRs: include purpose, screenshots for UI changes, steps to verify, and linked issues.
- Ensure Prettier passes and TypeScript compiles before requesting review.

## Security & Configuration Tips
- Set `SITE_URL` (used in feeds) via `.env.local`, e.g.:
  
  ```
  SITE_URL=https://example.com
  ```
- Do not commit secrets. Content lives in `content/blog/` and is built at compile time.

## Architecture Overview
- Markdown posts parsed in `lib/posts.ts` using `gray-matter` + `remark` → HTML.
- Pages use `getStaticProps/getStaticPaths` for static generation.
- `lib/feed.ts` produces RSS/Atom; served by `pages/api/feeds.ts`.

