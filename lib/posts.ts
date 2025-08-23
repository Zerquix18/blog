import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';

const postsDirectory = path.join(process.cwd(), 'content', 'blog');

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  readingTime: number;
}

export interface PostData extends PostMeta {
  contentHtml: string;
}

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
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
  
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostData(slug: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, slug, 'index.md');
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const processedContent = await remark()
    .use(remarkRehype)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(content);
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
  };
}

// Archive filtering functions
export function getPostsByYear(year: string): PostMeta[] {
  const posts = getAllPosts();
  return posts.filter(post => {
    const postDate = new Date(post.date);
    return postDate.getFullYear().toString() === year;
  });
}

export function getPostsByYearMonth(year: string, month: string): PostMeta[] {
  const posts = getAllPosts();
  return posts.filter(post => {
    const postDate = new Date(post.date);
    return postDate.getFullYear().toString() === year &&
           (postDate.getMonth() + 1).toString().padStart(2, '0') === month;
  });
}

export function getPostsByYearMonthDay(year: string, month: string, day: string): PostMeta[] {
  const posts = getAllPosts();
  return posts.filter(post => {
    const postDate = new Date(post.date);
    return postDate.getFullYear().toString() === year &&
           (postDate.getMonth() + 1).toString().padStart(2, '0') === month &&
           postDate.getDate().toString().padStart(2, '0') === day;
  });
}

export function getAvailableArchivePaths(): { year: string; month?: string; day?: string }[] {
  const posts = getAllPosts();
  const paths = new Set<string>();

  posts.forEach(post => {
    const postDate = new Date(post.date);
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
