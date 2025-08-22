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
        <title>It's Luis's Blog</title>
        <meta name="description" content={title ? `${title} - Personal blog about web development and technology` : 'Personal blog about web development, programming, and technology'} />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header>
        <h1>
          <Link href="/">It's Luis's Blog</Link>
        </h1>
      </header>
      <main>{children}</main>
    </div>
  );
}
