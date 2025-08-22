import Link from 'next/link';
import Layout from '../components/layout';
import Bio from '../components/bio';
import { getAllPosts, PostMeta } from '../lib/posts';
import { GetStaticProps } from 'next';

interface Props {
  posts: PostMeta[];
}

export default function Home({ posts }: Props) {
  return (
    <Layout>
      <Bio />
      {posts.map((post) => (
        <article key={post.slug}>
          <h2>
            <Link href={`/posts/${post.slug}`}>{post.title}</Link>
          </h2>
          <small>
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
            {post.readingTime && ` • ${post.readingTime} min read`}
          </small>
          <p>{post.description}</p>
          {Array.isArray(post.tags) && post.tags.length > 0 && (
            <div className="post-tags">
              {post.tags.map((tag) => (
                <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="tag">
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </article>
      ))}
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = getAllPosts();
  return { props: { posts } };
};
