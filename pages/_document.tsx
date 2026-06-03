import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";
import { StyleProvider, createCache } from "@ant-design/cssinjs";
import Script from "next/script";

// NOTE: doExtraStyle removed — it tries to write antd.min.css to filesystem
// which fails on Vercel serverless (read-only). StyleProvider handles SSR inline.

const MyDocument = () => (
  <Html lang="en">
    <Head>
      <meta name="robots" content="noindex, nofollow" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      {/* <!-- Meta Pixel Code --> */}
      <Script
        id="fb-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
                    !function(f,b,e,v,n,t,s)
                    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                    n.queue=[];t=b.createElement(e);t.async=!0;
                    t.src=v;s=b.getElementsByTagName(e)[0];
                    s.parentNode.insertBefore(t,s)}(window, document,'script',
                    'https://connect.facebook.net/en_US/fbevents.js');
                    fbq('init', '${process.env.FACEBOOK_META_PIXELS_CODE}');
                    fbq('track', 'PageView');
                `,
        }}
      />
      {/* <!-- Google tag (gtag.js) --> */}
      {process.env.GOOGLE_ANALYTICS_ID && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS_ID}`}
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());
                      gtag('config', '${process.env.GOOGLE_ANALYTICS_ID}');
                  `}
          </Script>
        </>
      )}
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
);

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const cache = createCache();
  const originalRenderPage = ctx.renderPage;
  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => (
        <StyleProvider cache={cache}>
          <App {...props} />
        </StyleProvider>
      ),
    });

  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    styles: <>{initialProps.styles}</>,
  };
};

export default MyDocument;
