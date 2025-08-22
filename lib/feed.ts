import { Feed } from 'feed';
import { getAllPosts, getPostData } from './posts';

const siteUrl = process.env.SITE_URL || 'https://yourdomain.com';
const authorName = 'Luis Martinez';
const siteTitle = "It's Luis's Blog";
const siteDescription = 'Personal blog about web development, programming, and technology';

export async function generateFeeds() {
  const posts = getAllPosts();
  
  const feed = new Feed({
    title: siteTitle,
    description: siteDescription,
    id: siteUrl,
    link: siteUrl,
    language: 'en',
    image: `${siteUrl}/favicon.ico`,
    favicon: `${siteUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, ${authorName}`,
    updated: new Date(),
    generator: 'Next.js using Feed for Node.js',
    feedLinks: {
      rss2: `${siteUrl}/rss.xml`,
      atom: `${siteUrl}/atom.xml`,
    },
    author: {
      name: authorName,
      link: siteUrl,
    },
  });

  for (const post of posts.slice(0, 20)) {
    try {
      const postData = await getPostData(post.slug);
      
      feed.addItem({
        title: postData.title,
        id: `${siteUrl}/posts/${postData.slug}`,
        link: `${siteUrl}/posts/${postData.slug}`,
        description: postData.description || postData.title,
        content: postData.contentHtml,
        author: [
          {
            name: authorName,
            link: siteUrl,
          },
        ],
        date: new Date(postData.date),
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
