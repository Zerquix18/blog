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
    <Layout title="All posts">
      <Bio />
      {posts.map((post) => (
        <article key={post.slug}>
          <h2>
            <Link href={`/posts/${post.slug}`}>{post.title}</Link>
          </h2>
          <small>{post.date}</small>
          <p>{post.description}</p>
        </article>
      ))}
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = getAllPosts();
  return { props: { posts } };
};
