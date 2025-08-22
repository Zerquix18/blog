import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import Layout from '../../components/layout';
import ArchivePage from '../../components/archive';
import {
  getPostsByTag,
  getAvailableTagPaths,
  PostMeta
} from '../../lib/posts';

interface TagPageProps {
  posts: PostMeta[];
  tag: string;
}

export default function TagPage({ posts, tag }: TagPageProps) {
  const getPageTitle = () => {
    return `Posts tagged with "${tag}"`;
  };

  return (
    <Layout title={getPageTitle()}>
      <ArchivePage
        posts={posts}
        archiveType="tag"
        year=""
        month=""
        day=""
        tag={tag}
      />
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const tagPaths = getAvailableTagPaths();

  const paths = tagPaths.map(tag => ({
    params: { tag: tag }
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const tag = params?.tag as string;

  if (!tag) {
    return { notFound: true };
  }

  const posts = getPostsByTag(tag);

  return {
    props: {
      posts,
      tag,
    },
  };
};
