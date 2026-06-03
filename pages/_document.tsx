import Document, { Html, Head, Main, NextScript } from "next/document";

// Simplified _document - removed @ant-design/cssinjs StyleProvider
// which was causing SSR 500 errors on Vercel

export default function MyDocument() {
  return (
    <Html lang="vi">
      <Head>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
