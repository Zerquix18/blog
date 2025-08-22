import { NextApiRequest, NextApiResponse } from 'next';
import { generateFeeds } from '../../lib/feed';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { type } = req.query;
  
  try {
    const feeds = await generateFeeds();
    
    if (type === 'rss') {
      res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
      res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
      res.status(200).send(feeds.rss2);
    } else if (type === 'atom') {
      res.setHeader('Content-Type', 'application/atom+xml; charset=utf-8');
      res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
      res.status(200).send(feeds.atom);
    } else {
      res.status(404).json({ error: 'Feed type not found' });
    }
  } catch (error) {
    console.error('Error generating feed:', error);
    res.status(500).json({ error: 'Failed to generate feed' });
  }
}