import Layout from '../../components/layout';
import { getAllPosts, getPostData } from '../../lib/posts';
import { GetStaticPaths, GetStaticProps } from 'next';

export default function Post({ post }: { post: Awaited<ReturnType<typeof getPostData>> }) {
  return (
    <Layout title={post.title}>
      <article>
        <h1>{post.title}</h1>
        <small>{post.date}</small>
        <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
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
