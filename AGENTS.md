# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Markdown-powered blog built with Next.js 15 and TypeScript. The blog uses static site generation to render posts from the `content/blog` directory at build time. The architecture is inspired by Dan Abramov's overreacted.io.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build production version  
- `npm start` - Start production server
- `npm run test` - Currently returns no-op (no tests configured)

## Architecture

### Content Management
- Blog posts are stored as Markdown files in `content/blog/{slug}/index.md`
- Each post directory can contain the post's markdown file and associated images
- Posts use gray-matter for frontmatter parsing (title, date, description, tags)
- Content is processed with remark and remark-html for HTML conversion

### Core Files
- `lib/posts.ts` - Core post management functions (getAllPosts, getPostData)
- `lib/feed.ts` - RSS/Atom feed generation using the `feed` package
- `pages/index.tsx` - Homepage listing all posts
- `pages/posts/[slug].tsx` - Dynamic post page using getStaticPaths/getStaticProps
- `pages/api/feeds.ts` - API endpoint for RSS/Atom feeds
- `components/layout.tsx` - Main layout wrapper
- `components/bio.tsx` - Author bio component

### Post Structure
Posts must have frontmatter with:
- `title` (string) - Post title
- `date` (string) - Publication date
- `description` (string) - Post description/excerpt (defaults to empty string if not provided)
- `tags` (string[]) - Post tags (defaults to empty array if not provided)
- `readingTime` (number) - Automatically calculated reading time (200 words per minute)

All PostMeta fields are required in the interface for consistent type safety.

### Feed Generation
- RSS and Atom feeds are automatically generated from the latest 20 posts
- Feeds are accessible at `/rss.xml` and `/atom.xml` via Next.js rewrites
- Feed metadata is configured in `lib/feed.ts` with site info

### TypeScript Configuration
- Strict TypeScript enabled with Next.js plugin
- Path mapping configured with `@/*` pointing to root
- All components and utilities are fully typed

## File Organization

```
content/blog/           # Blog posts (each in own directory)
components/            # React components
lib/                  # Utility functions and data fetching
pages/                # Next.js pages and API routes
public/               # Static assets
styles/               # Global CSS
```

## Code Style Preferences

### Function Returns and Destructuring
- Extract values to variables before returning objects
- Use explicit object structure in returns rather than spread operators
- Example:
```typescript
// Preferred
const readingTime = calculateReadingTime(content);
const description = data.description || '';
const tags = data.tags || [];
const { title, date } = data as { title: string; date: string };

return {
  slug,
  title,
  date,
  description,
  tags,
  readingTime,
};

// Avoid
return {
  slug,
  readingTime: calculateReadingTime(content),
  ...(data as { title: string; date: string; description?: string; tags?: string[] }),
};
```
- If asked to generate a new article, always fetch the current date. DO NOT write the article yourself. Only add the metadata.

## Security Headers
The Next.js config includes security headers for X-Frame-Options, X-Content-Type-Options, and Referrer-Policy.