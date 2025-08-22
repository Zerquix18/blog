import Head from 'next/head';
import Link from 'next/link';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  title?: string;
}

export default function Layout({ children, title }: Props) {
  return (
    <div className="container">
      <Head>
        <title>{title ? `${title} | Blog` : 'Blog'}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header>
        <h1>
          <Link href="/">My Blog</Link>
        </h1>
      </header>
      <main>{children}</main>
    </div>
  );
}
