import Document, { Html, Head, Main, NextScript, DocumentContext } from "next/document";

// Safe SSR wrapper for antd CSS-in-JS
let StyleProvider: any = ({ children }: any) => children
let createCache: any = () => ({})
try {
  const cssinjs = require("@ant-design/cssinjs");
  StyleProvider = cssinjs.StyleProvider;
  createCache = cssinjs.createCache;
} catch { /* graceful degradation */ }

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

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const cache = createCache();
  const originalRenderPage = ctx.renderPage;
  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App: any) => (props: any) => (
        <StyleProvider cache={cache}>
          <App {...props} />
        </StyleProvider>
      ),
    });
  return await Document.getInitialProps(ctx);
};