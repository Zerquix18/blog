import Link from 'next/link';
import { PostMeta } from '../lib/posts';

interface ArchivePageProps {
  posts: PostMeta[];
  archiveType: 'year' | 'month' | 'day' | 'tag';
  year: string;
  month?: string;
  day?: string;
  tag?: string;
}

export default function ArchivePage({ posts, archiveType, year, month, day, tag }: ArchivePageProps) {
  const getArchiveTitle = () => {
    switch (archiveType) {
      case 'year':
        return `Posts from ${year}`;
      case 'month':
        const monthName = new Date(parseInt(year), parseInt(month!) - 1).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
        return `Posts from ${monthName}`;
      case 'day':
        const dayDate = new Date(parseInt(year), parseInt(month!) - 1, parseInt(day!)).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        return `Posts from ${dayDate}`;
      case 'tag':
        return `Posts tagged with "${tag}"`;
    }
  };

  const getBreadcrumbs = () => {
    if (archiveType === 'tag') {
      return [
        { href: '/tags', label: 'Tags' },
        { href: `/tags/${encodeURIComponent(tag!)}`, label: `#${tag}` }
      ];
    }

    const breadcrumbs = [
      { href: '/archive', label: 'Archive' },
      { href: `/archive/${year}`, label: year }
    ];

    if (month) {
      breadcrumbs.push({
        href: `/archive/${year}/${month}`,
        label: new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', { month: 'long' })
      });
    }

    if (day) {
      breadcrumbs.push({
        href: `/archive/${year}/${month}/${day}`,
        label: day
      });
    }

    return breadcrumbs;
  };

  if (posts.length === 0) {
    return (
      <div className="archive-page">
        <nav className="breadcrumbs">
          {getBreadcrumbs().map((crumb, index) => (
            <span key={crumb.href}>
              {index > 0 && ' > '}
              <Link href={crumb.href}>{crumb.label}</Link>
            </span>
          ))}
        </nav>
        <h1>{getArchiveTitle()}</h1>
        <p>No posts found for this period.</p>
      </div>
    );
  }

  return (
    <div className="archive-page">
      <nav className="breadcrumbs">
        {getBreadcrumbs().map((crumb, index) => (
          <span key={crumb.href}>
            {index > 0 && ' > '}
            <Link href={crumb.href}>{crumb.label}</Link>
          </span>
        ))}
      </nav>

      <h1>{getArchiveTitle()}</h1>
      <p className="archive-count">{posts.length} post{posts.length !== 1 ? 's' : ''} found</p>

      <div className="posts-list">
        {posts.map((post) => (
          <article key={post.slug} className="post-preview">
            <h2>
              <Link href={`/posts/${post.slug}`}>
                {post.title}
              </Link>
            </h2>
            <p className="post-date">
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
              {post.readingTime && ` • ${post.readingTime} min read`}
            </p>
            {post.description && (
              <p className="post-description">{post.description}</p>
            )}
            {Array.isArray(post.tags) && post.tags.length > 0 && (
              <div className="post-tags">
                {post.tags.map((tag) => (
                  <span key={tag} className="tag">#{tag}</span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
