import Link from 'next/link';
import Layout from '../../components/layout';
import { getAllPosts, getPostData, PostData } from '../../lib/posts';
import { GetStaticPaths, GetStaticProps } from 'next';

export default function Post({ post }: { post: PostData }) {
  return (
    <Layout title={post.title}>
      <article>
        <h1>{post.title}</h1>
        <small>
          {new Date(post.date).toLocaleDateString('en-US', {
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
  const posts = getAllPosts();
  return {
    paths: posts.map((post) => ({ params: { slug: post.slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const post = await getPostData(params?.slug as string);
  return { props: { post } };
};
