import Head from 'next/head';
import Link from 'next/link';
import Script from 'next/script';
import { ReactNode } from 'react';
import { SITE_TITLE, SITE_DESCRIPTION } from '../constants';
import ThemeToggle from './theme-toggle';
import { GA_TRACKING_ID } from '../lib/gtag';
import XIcon from './icons/XIcon';
import LinkedInIcon from './icons/LinkedInIcon';

interface Props {
  children: ReactNode;
  title?: string;
}

export default function Layout({ children, title }: Props) {
  return (
    <div className="container">
      <Head>
        <title>{title ? `${title} - ${SITE_TITLE}` : SITE_TITLE}</title>
        <meta name="description" content={title ? `${title} - Personal blog about web development and technology` : SITE_DESCRIPTION} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="alternate" type="application/rss+xml" title={`RSS Feed for ${SITE_TITLE}`} href="/rss.xml" />
        <link rel="alternate" type="application/atom+xml" title={`Atom Feed for ${SITE_TITLE}`} href="/atom.xml" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />

      </Head>
      {GA_TRACKING_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
            strategy="afterInteractive"
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
          >
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}');
            `}
          </Script>
        </>
      )}
      <header>
        <h1>
          <Link href="/">{SITE_TITLE}</Link>
        </h1>
        <nav className="site-nav">
          <Link href="/">Home</Link>
          <Link href="/archive">Archive</Link>
          <Link href="/tags">Tags</Link>
          <a href="https://twitter.com/zerquix18" target="_blank" rel="noopener noreferrer" title="Twitter" aria-label="Twitter">
            <XIcon />
          </a>
          <a href="https://linkedin.com/in/zerquix18" target="_blank" rel="noopener noreferrer" title="LinkedIn" aria-label="LinkedIn">
            <LinkedInIcon />
          </a>
          <ThemeToggle />
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
