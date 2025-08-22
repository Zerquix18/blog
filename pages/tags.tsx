import { GetStaticProps } from 'next';
import Link from 'next/link';
import Layout from '../components/layout';
import { getAllTags } from '../lib/posts';

interface TagsIndexProps {
  tags: { tag: string; count: number }[];
}

export default function TagsIndex({ tags }: TagsIndexProps) {
  return (
    <Layout title="Tags">
      <div className="tags-index">
        <h1>Tags</h1>
        <p className="tags-description">
          Browse posts by tag. Click on any tag to see all posts with that tag.
        </p>

        <div className="tags-grid">
          {tags.map(({ tag, count }) => (
            <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="tag-card">
              <div className="tag-card-content">
                <h2>#{tag}</h2>
                <p className="post-count">{count} post{count !== 1 ? 's' : ''}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const tags = getAllTags();

  return {
    props: {
      tags,
    },
  };
};
