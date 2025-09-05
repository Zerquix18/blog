import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeStringify from 'rehype-stringify';
import { parsePostDate } from './date-utils';

const postsDirectory = path.join(process.cwd(), 'content', 'blog');

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  readingTime: number;
}

export interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
}

export interface PostData extends PostMeta {
  contentHtml: string;
  tableOfContents: TableOfContentsItem[];
}

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

function extractTableOfContents(content: string): TableOfContentsItem[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const toc: TableOfContentsItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    // Create slug from text (same logic as rehype-slug)
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    toc.push({
      id,
      text,
      level
    });
  }

  return toc;
}


export function getAllPosts(): PostMeta[] {
  const slugs = fs.readdirSync(postsDirectory);
  const posts = slugs.map((slug) => {
    try {
      const fullPath = path.join(postsDirectory, slug, 'index.md');
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      const readingTime = calculateReadingTime(content);
      const description = data.description || '';
      // Parse tags - they can be a string or array
      let tags: string[] = [];
      if (data.tags) {
        if (Array.isArray(data.tags)) {
          tags = data.tags;
        } else if (typeof data.tags === 'string') {
          tags = data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        }
      }
      const { title, date } = data as { title: string; date: string };
      
      return {
        slug,
        title,
        date,
        description,
        tags,
        readingTime,
      };
    } catch (error) {
      console.warn(`Error reading post ${slug}:`, error);
      return null;
    }
  }).filter(Boolean) as PostMeta[];
  
  return posts.sort((a, b) => {
    const dateA = parsePostDate(a.date);
    const dateB = parsePostDate(b.date);
    return dateA < dateB ? 1 : -1;
  });
}

function generateTocHtml(tableOfContents: TableOfContentsItem[]): string {
  if (!tableOfContents || tableOfContents.length === 0) {
    return '';
  }

  const tocItems = tableOfContents.map(item => 
    `<li class="toc-level-${item.level}"><a href="#${item.id}">${item.text}</a></li>`
  ).join('\n');

  return `<div class="table-of-contents">
<h3>Table of Contents</h3>
<nav>
<ul>
${tocItems}
</ul>
</nav>
</div>`;
}

export async function getPostData(slug: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, slug, 'index.md');
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  // Extract table of contents before processing
  const tableOfContents = extractTableOfContents(content);

  // Replace [toc] markers with actual table of contents HTML
  let processedMarkdown = content;
  const tocMarkerRegex = /\[toc\]/gi;
  const tocHtml = generateTocHtml(tableOfContents);
  processedMarkdown = processedMarkdown.replace(tocMarkerRegex, tocHtml);

  const processedContent = await remark()
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { 
      behavior: 'wrap',
      properties: {
        className: ['header-link']
      }
    })
    .use(rehypeHighlight)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(processedMarkdown);
  const contentHtml = processedContent.toString();

  const readingTime = calculateReadingTime(content);
  const description = data.description || '';
  // Parse tags - they can be a string or array
  let tags: string[] = [];
  if (data.tags) {
    if (Array.isArray(data.tags)) {
      tags = data.tags;
    } else if (typeof data.tags === 'string') {
      tags = data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    }
  }
  const { title, date } = data as { title: string; date: string };

  return {
    slug,
    title,
    date,
    description,
    tags,
    readingTime,
    contentHtml,
    tableOfContents,
  };
}

// Archive filtering functions
export function getPostsByYear(year: string): PostMeta[] {
  const posts = getAllPosts();
  return posts.filter(post => {
    const postDate = parsePostDate(post.date);
    return postDate.getFullYear().toString() === year;
  });
}

export function getPostsByYearMonth(year: string, month: string): PostMeta[] {
  const posts = getAllPosts();
  return posts.filter(post => {
    const postDate = parsePostDate(post.date);
    return postDate.getFullYear().toString() === year &&
           (postDate.getMonth() + 1).toString().padStart(2, '0') === month;
  });
}

export function getPostsByYearMonthDay(year: string, month: string, day: string): PostMeta[] {
  const posts = getAllPosts();
  return posts.filter(post => {
    const postDate = parsePostDate(post.date);
    return postDate.getFullYear().toString() === year &&
           (postDate.getMonth() + 1).toString().padStart(2, '0') === month &&
           postDate.getDate().toString().padStart(2, '0') === day;
  });
}

export function getAvailableArchivePaths(): { year: string; month?: string; day?: string }[] {
  const posts = getAllPosts();
  const paths = new Set<string>();

  posts.forEach(post => {
    const postDate = parsePostDate(post.date);
    const year = postDate.getFullYear().toString();
    const month = (postDate.getMonth() + 1).toString().padStart(2, '0');
    const day = postDate.getDate().toString().padStart(2, '0');

    // Add year path
    paths.add(`${year}`);
    // Add year/month path
    paths.add(`${year}/${month}`);
    // Add year/month/day path
    paths.add(`${year}/${month}/${day}`);
  });

  return Array.from(paths).map(path => {
    const parts = path.split('/');
    return {
      year: parts[0],
      month: parts[1],
      day: parts[2]
    };
  });
}

// Tag-related functions
export function getAllTags(): { tag: string; count: number }[] {
  const posts = getAllPosts();
  const tagCounts = new Map<string, number>();

  posts.forEach(post => {
    if (Array.isArray(post.tags)) {
      post.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    }
  });

  // Convert to array and sort by count (descending) then alphabetically
  return Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => {
      if (a.count !== b.count) {
        return b.count - a.count; // Sort by count descending
      }
      return a.tag.localeCompare(b.tag); // Sort alphabetically
    });
}

export function getPostsByTag(tag: string): PostMeta[] {
  const posts = getAllPosts();
  return posts.filter(post => {
    return Array.isArray(post.tags) && post.tags.includes(tag);
  });
}

export function getAvailableTagPaths(): string[] {
  const tags = getAllTags();
  return tags.map(tagInfo => tagInfo.tag);
}
