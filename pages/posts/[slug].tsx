import Link from 'next/link';
import Head from 'next/head';
import Layout from '../../components/layout';
import { PostData } from '../../lib/posts';
import { parsePostDate } from '../../lib/date-utils';
import { GetStaticPaths, GetStaticProps } from 'next';
import type { BlogPosting, WithContext } from 'schema-dts';
import { AUTHOR_NAME, SITE_TITLE, SITE_URL } from '../../constants';

export default function Post({ post }: { post: PostData }) {
  const postUrl = `${SITE_URL}/posts/${post.slug}`;
  const publishedIso = parsePostDate(post.date).toISOString();

  const jsonLd: WithContext<BlogPosting> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    url: postUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    datePublished: publishedIso,
    author: {
      '@type': 'Person',
      name: AUTHOR_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_TITLE,
      url: SITE_URL,
    },
  };

  return (
    <Layout title={post.title}>
      <Head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <article>
        <h1>{post.title}</h1>
        <small>
          {parsePostDate(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
          {post.readingTime && ` • ${post.readingTime} min read`}
        </small>
        <div className="post-content" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
        {Array.isArray(post.tags) && post.tags.length > 0 && (
          <div className="post-tags">
            <h3>Tags:</h3>
            {post.tags.map((tag) => (
              <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="tag">
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </article>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { getAllPosts } = await import('../../lib/posts');
  const posts = getAllPosts();
  return {
    paths: posts.map((post) => ({ params: { slug: post.slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { getPostData } = await import('../../lib/posts');
  const post = await getPostData(params?.slug as string);
  return { props: { post } };
};
