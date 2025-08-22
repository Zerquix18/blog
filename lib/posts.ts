import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'content', 'blog');

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description?: string;
  tags?: string[];
  readingTime?: number;
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
      return {
        slug,
        readingTime: calculateReadingTime(content),
        ...(data as { title: string; date: string; description?: string; tags?: string[] }),
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
    .use(html, { sanitize: false })
    .process(content);
  const contentHtml = processedContent.toString();
  
  return {
    slug,
    contentHtml,
    readingTime: calculateReadingTime(content),
    ...(data as { title: string; date: string; description?: string; tags?: string[] }),
  };
}
