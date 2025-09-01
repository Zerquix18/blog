import { Feed } from 'feed';
import { getAllPosts, getPostData } from './posts';
import { parsePostDate } from './date-utils';
import { SITE_URL, AUTHOR_NAME, SITE_TITLE, SITE_DESCRIPTION } from '../constants';

export async function generateFeeds() {
  const posts = getAllPosts();
  
  const feed = new Feed({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    id: SITE_URL,
    link: SITE_URL,
    language: 'en',
    image: `${SITE_URL}/favicon.ico`,
    favicon: `${SITE_URL}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, ${AUTHOR_NAME}`,
    updated: new Date(),
    generator: 'Next.js using Feed for Node.js',
    feedLinks: {
      rss2: `${SITE_URL}/rss.xml`,
      atom: `${SITE_URL}/atom.xml`,
    },
    author: {
      name: AUTHOR_NAME,
      link: SITE_URL,
    },
  });

  for (const post of posts.slice(0, 20)) {
    try {
      const postData = await getPostData(post.slug);
      
      feed.addItem({
        title: postData.title,
        id: `${SITE_URL}/posts/${postData.slug}`,
        link: `${SITE_URL}/posts/${postData.slug}`,
        description: postData.description || postData.title,
        content: postData.contentHtml,
        author: [
          {
            name: AUTHOR_NAME,
            link: SITE_URL,
          },
        ],
        date: parsePostDate(postData.date),
      });
    } catch (error) {
      console.warn(`Error processing post ${post.slug} for feed:`, error);
    }
  }

  return {
    rss2: feed.rss2(),
    atom: feed.atom1(),
  };
}
