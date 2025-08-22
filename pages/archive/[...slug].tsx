import { GetStaticPaths, GetStaticProps } from 'next';
import Layout from '../../components/layout';
import ArchivePage from '../../components/archive';
import {
  getPostsByYear,
  getPostsByYearMonth,
  getPostsByYearMonthDay,
  getAvailableArchivePaths,
  PostMeta
} from '../../lib/posts';

interface ArchiveProps {
  posts: PostMeta[];
  archiveType: 'year' | 'month' | 'day';
  year: string;
  month?: string;
  day?: string;
}

export default function Archive({ posts, archiveType, year, month, day }: ArchiveProps) {
  const getPageTitle = () => {
    switch (archiveType) {
      case 'year':
        return `Archive: ${year}`;
      case 'month':
        const monthName = new Date(parseInt(year), parseInt(month!) - 1).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
        return `Archive: ${monthName}`;
      case 'day':
        const dayDate = new Date(parseInt(year), parseInt(month!) - 1, parseInt(day!)).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        return `Archive: ${dayDate}`;
    }
  };

  return (
    <Layout title={getPageTitle()}>
      <ArchivePage
        posts={posts}
        archiveType={archiveType}
        year={year}
        month={month}
        day={day}
      />
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const archivePaths = getAvailableArchivePaths();

  const paths = archivePaths.map(({ year, month, day }) => {
    const params: string[] = [year];
    if (month) params.push(month);
    if (day) params.push(day);

    return {
      params: { slug: params }
    };
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string[];

  if (!slug || slug.length < 1 || slug.length > 3) {
    return { notFound: true };
  }

  const [year, month, day] = slug;

  let posts: PostMeta[] = [];
  let archiveType: 'year' | 'month' | 'day';

  if (day) {
    // /2025/01/01
    posts = getPostsByYearMonthDay(year, month, day);
    archiveType = 'day';
  } else if (month) {
    // /2025/01
    posts = getPostsByYearMonth(year, month);
    archiveType = 'month';
  } else {
    // /2025
    posts = getPostsByYear(year);
    archiveType = 'year';
  }

  return {
    props: {
      posts,
      archiveType,
      year,
      month: month || null,
      day: day || null,
    },
  };
};
