import type { NextApiRequest, NextApiResponse } from 'next';

import { getAllPosts, getAllTags, getAvailableArchivePaths } from '../../lib/posts';
import { parsePostDate } from '../../lib/date-utils';

const BASE_URL = 'https://blog.zerquix18.com';

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

type SitemapUrl = {
  loc: string;
  lastmod?: string;
};

function buildSitemapXml(urls: SitemapUrl[]): string {
  const body = urls
    .map(({ loc, lastmod }) => {
      const parts = [`<loc>${xmlEscape(loc)}</loc>`];
      if (lastmod) parts.push(`<lastmod>${xmlEscape(lastmod)}</lastmod>`);
      return `<url>${parts.join('')}</url>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`;
}

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const urls: SitemapUrl[] = [];

    // Static pages
    urls.push({ loc: `${BASE_URL}/` });
    urls.push({ loc: `${BASE_URL}/archive` });
    urls.push({ loc: `${BASE_URL}/tags` });

    // Feeds (rewritten to /api/feeds)
    urls.push({ loc: `${BASE_URL}/rss.xml` });
    urls.push({ loc: `${BASE_URL}/atom.xml` });

    // Posts
    const posts = getAllPosts();
    for (const post of posts) {
      const lastmod = parsePostDate(post.date).toISOString();
      urls.push({
        loc: `${BASE_URL}/posts/${encodeURIComponent(post.slug)}`,
        lastmod,
      });
    }

    // Tags
    const tags = getAllTags();
    for (const { tag } of tags) {
      urls.push({ loc: `${BASE_URL}/tags/${encodeURIComponent(tag)}` });
    }

    // Archive paths (year / year-month / year-month-day)
    const archivePaths = getAvailableArchivePaths();
    for (const p of archivePaths) {
      const parts = [p.year, p.month, p.day].filter(Boolean).join('/');
      urls.push({ loc: `${BASE_URL}/archive/${parts}` });
    }

    // Deduplicate while preserving first occurrence
    const seen = new Set<string>();
    const deduped = urls.filter((u) => {
      if (seen.has(u.loc)) return false;
      seen.add(u.loc);
      return true;
    });

    const xml = buildSitemapXml(deduped);

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.status(200).send(xml);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).json({ error: 'Failed to generate sitemap' });
  }
}
