import { GetStaticProps } from 'next';
import Link from 'next/link';
import Layout from '../components/layout';
import { getAllPosts } from '../lib/posts';

interface ArchiveIndexProps {
  years: { year: string; count: number }[];
}

export default function ArchiveIndex({ years }: ArchiveIndexProps) {
  return (
    <Layout title="Archive">
      <div className="archive-index">
        <h1>Archive</h1>
        <p className="archive-description">
          Browse posts by year, month, or day.
        </p>

        <div className="years-grid">
          {years.map(({ year, count }) => (
            <Link key={year} href={`/archive/${year}`} className="year-card">
              <div className="year-card-content">
                <h2>{year}</h2>
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
  const posts = getAllPosts();

  // Group posts by year
  const yearsMap = new Map<string, number>();

  posts.forEach(post => {
    const year = new Date(post.date).getFullYear().toString();
    yearsMap.set(year, (yearsMap.get(year) || 0) + 1);
  });

  // Convert to array and sort by year (newest first)
  const years = Array.from(yearsMap.entries())
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => parseInt(b.year) - parseInt(a.year));

  return {
    props: {
      years,
    },
  };
};
