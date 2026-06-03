import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";
import { doExtraStyle } from "@/scripts/genAntdCss";
import { StyleProvider, createCache } from "@ant-design/cssinjs";
import Script from "next/script";

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
      {/* <link href="https://fonts.googleapis.com/css2?family=Cabin:ital,wght@0,400..700;1,400..700&subset=vietnamese&display=swap" rel="stylesheet" /> */}
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
      <Script
        id="noscript-fb-pixel"
        dangerouslySetInnerHTML={{
          __html: `
                        <noscript>
                            <img height="1" width="1" style="display:none"
                            src="https://www.facebook.com/tr?id=${process.env.FACEBOOK_META_PIXELS_CODE}&ev=PageView&noscript=1" alt="" />
                        </noscript>
                    `,
        }}
      />
      {/* <!-- End Meta Pixel Code --> */}

      {/* <!-- Google tag (gtag.js) --> */}
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
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
);

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const cache = createCache();
  let fileName = "";
  const originalRenderPage = ctx.renderPage;
  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) =>
        (
          <StyleProvider cache={cache}>
            <App  {...props} />
          </StyleProvider>
        ),
    });

  const initialProps = await Document.getInitialProps(ctx);
  fileName = doExtraStyle({ cache });

  return {
    ...initialProps,
    styles: (
      <>
        {initialProps.styles}
        {fileName && (
          <link
            rel={"preload stylesheet"}
            type={"text/css"}
            crossOrigin={"anonymous"}
            as={"style"}
            href={`/${fileName}`}
          />
        )}
        {fileName && (
          <link
            rel={"preload stylesheet"}
            type={"text/css"}
            crossOrigin={"anonymous"}
            as={"style"}
            href={`/globals.css`}
          />
        )}
      </>
    ),
  };
};

export default MyDocument;
