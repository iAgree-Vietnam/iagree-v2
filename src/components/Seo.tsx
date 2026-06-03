import Head from "next/head";

import { ConstantConfig } from "../constants/Config";
// import { ConstantConfig } from "../constants/Config";

type SeoProps = {
  title?: string;
  description?: string;
  canonicalPath?: string;
  ogImage?: string;
  noIndex?: boolean;

  /** JSON-LD object hoặc array of objects */
  jsonLd?: any;
  /** id của script để tránh trùng */
  jsonLdId?: string;
};

export default function Seo({
  title,
  description,
  canonicalPath = "/",
  ogImage,
  noIndex = false,
  jsonLd,
  jsonLdId = "jsonld",
}: SeoProps) {
  const BASE = ConstantConfig.BASE_URL;

  const finalTitle = title
    ? `${title} - ${ConstantConfig.DEFAULT_AUTHOR}`
    : ConstantConfig.DEFAULT_TITLE;

  const finalDescription = description || ConstantConfig.DEFAULT_DESCRIPTION;

  const canonicalUrl = BASE + (canonicalPath === "/" ? "" : canonicalPath);

  const finalOgImage = "https://iagree.vn/assets/img/logo.png";

  return (
    <>
      <Head>
        <title>{finalTitle}</title>
        <meta name="description" content={finalDescription} />
        <link rel="canonical" href={canonicalUrl} />

        {noIndex && <meta name="robots" content="noindex,nofollow" />}

        <meta property="og:type" content="website" />
        <meta property="og:title" content={finalTitle} />
        <meta property="og:description" content={finalDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content={ConstantConfig.DEFAULT_AUTHOR} />
        <meta property="og:image" content={finalOgImage} />
        <meta property="og:locale" content="vi_VN" />
        <meta property="og:image:secure_url" content={finalOgImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </Head>

      {/* JSON-LD: render ngoài Head cũng OK, nhưng đặt trong Head là chuẩn nhất */}
      {jsonLd && (
        <Head>
          <script
            id={jsonLdId}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(jsonLd),
            }}
          />
        </Head>
      )}
    </>
  );
}
