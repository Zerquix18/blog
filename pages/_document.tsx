import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    const setThemeScript = `(() => {
      try {
        const stored = localStorage.getItem('theme');
        if (stored === 'light' || stored === 'dark') {
          document.documentElement.setAttribute('data-theme', stored);
        } else {
          document.documentElement.removeAttribute('data-theme');
        }
      } catch {}
    })();`;

    return (
      <Html>
        <Head>
          <meta name="color-scheme" content="light dark" />
          <script dangerouslySetInnerHTML={{ __html: setThemeScript }} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

