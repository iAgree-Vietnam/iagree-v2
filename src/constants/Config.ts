import { Metadata, MetadataRoute } from "next";

export class ConstantConfig {
  /* =========================
   * ENV / this.BASE_URL URL
   * ========================= */
  public static readonly BASE_URL: string =
    process.env.FRONTEND_BASE_URL || "https://iagree.vn";

  /* =========================
   * BRAND / COMPANY
   * ========================= */
  public static readonly DEFAULT_AUTHOR = "iAgree";
  public static readonly COMPANY_NAME = "Công ty Cổ phần A&D TECH";

  public static readonly DEFAULT_TITLE =
    "iAgree – Nền tảng kết nối Freelancer & Doanh nghiệp";

  public static readonly DEFAULT_DESCRIPTION =
    "iAgree là nền tảng kết nối freelancer với doanh nghiệp, hỗ trợ đăng công việc, tìm ứng viên, quản lý hợp đồng, thanh toán và biểu mẫu pháp lý minh bạch, an toàn.";

  public static readonly DEFAULT_KEYWORDS =
    "iAgree, freelancer, việc làm freelance, đăng công việc, tuyển freelancer, tìm ứng viên, hợp đồng freelance, thanh toán freelance, biểu mẫu pháp lý";

  /* =========================
   * ASSETS
   * ========================= */
  public static readonly DEFAULT_LOGO = "/assets/img/logo.png";

  public static readonly DEFAULT_OG_IMAGE = [
    {
      url: "/assets/img/logo.png",
      width: 1200,
      height: 630,
      type: "image/png",
    },
  ];

  public static readonly DEFAULT_OG = {
    "og:title": ConstantConfig.DEFAULT_TITLE,
    "og:description": ConstantConfig.DEFAULT_DESCRIPTION,
    "og:image": ConstantConfig.DEFAULT_OG_IMAGE[0].url,
    "og:url": ConstantConfig.BASE_URL,
    "og:type": "website",
  };

  /* =========================
   * LEGAL / CONTACT
   * ========================= */
  public static readonly BUSINESS_REGISTRATION =
    "0317786329 cấp ngày 13/04/2023 tại Sở Kế Hoạch & Đầu Tư TP.HCM";

  public static readonly CONTACT_EMAIL = "support@iagree.vn";
  public static readonly CONTACT_PHONES = ["02873030313", "1900638313"];

  public static readonly ADDRESS_LIST = [
    {
      title: "TRỤ SỞ CHÍNH",
      address:
        "Lầu 7, số 520 Cách Mạng Tháng Tám, Phường Nhiêu Lộc, TP. Hồ Chí Minh, Việt Nam",
    },
  ];

  /* =========================
   * SOCIAL (DÙNG CHUNG)
   * ========================= */
  public static readonly SOCIAL_LINKS = {
    facebook: "https://www.facebook.com/iagreevietnam.official",
    instagram: "https://www.instagram.com/iagree.vn/",
    tiktok: "https://www.tiktok.com/@iagreevietnam",
    linkedin: "https://www.linkedin.com/company/iagreevietnam/",
    website: ConstantConfig.BASE_URL,
  };

  /* =========================
   * AUDIENCE (DÙNG CHUNG)
   * ========================= */
  public static readonly DEFAULT_AUDIENCE = [
    { "@type": "Audience", audienceType: "Freelancer" },
    { "@type": "Audience", audienceType: "Doanh nghiệp" },
  ];

  /* =========================
   * SERVICES (DÙNG CHUNG)
   * ========================= */
  public static readonly DEFAULT_SERVICES = [
    "Kết nối freelancer và doanh nghiệp",
    "Đăng công việc",
    "Tìm kiếm ứng viên",
    "Quản lý hợp đồng",
    "Thanh toán freelance",
    "Biểu mẫu pháp lý",
  ];

  /* =========================
   * MENUS (TÙY ROUTE)
   * ========================= */
  public static readonly MAIN_MENU = [
    {
      href: "/gioi-thieu",
      label: "Giới thiệu",
      key: "about",
      group: 1,
      index: 1,
    },
    { href: "/jobs", label: "Công việc", key: "jobs", group: 0, index: 1 },
    {
      href: "/freelancers",
      label: "Freelancer",
      key: "freelancers",
      group: 0,
      index: 2,
    },
    {
      href: "/templates",
      label: "Biểu mẫu",
      key: "templates",
      group: 2,
      index: 1,
    },
    { href: "/phap-ly", label: "Pháp lý", key: "legal", group: 2, index: 2 },
    { href: "/lien-he", label: "Liên hệ", key: "contact", group: 1, index: 0 },
  ];

  public static readonly ABOUT_MENU = [
    { href: "/", label: "Trang Chủ", key: "home", group: 0, index: 0 },
    ...ConstantConfig.MAIN_MENU,
  ].sort((a, b) =>
    a.group === b.group ? a.index - b.index : a.group - b.group
  );

  /* =========================
   * META BUILDER
   * ========================= */
  public static MetaBuilder() {
    const meta: NonNullable<Metadata> = this.DEFAULT_METADATA();

    const result = {
      setTitle: (title: string = "") => {
        if (title) {
          meta.title = `${title} - ${ConstantConfig.DEFAULT_AUTHOR}`;
          // @ts-ignore
          meta.openGraph.title = `${title} - ${ConstantConfig.DEFAULT_AUTHOR}`;
        }
        return result;
      },
      setDescription: (description: string = "") => {
        if (description) {
          meta.description = description;
          // @ts-ignore
          meta.openGraph.description = description;
        }
        return result;
      },
      setRobots: (robots: Record<string, any>) => {
        meta.robots = robots;
        return result;
      },
      setUrl: (path: string = "") => {
        // @ts-ignore
        meta.openGraph.url = `${this.BASE_URL}${path}`;
        return result;
      },
      setOgImage: (
        data: { width: number; height: number; url: string; type: string }[]
      ) => {
        // @ts-ignore
        meta.openGraph.images = data;
        return result;
      },
      setAuthor: (author: string = "") => {
        if (author) {
          meta.authors = [{ name: author }];
          meta.creator = author;
          meta.publisher = author;
        }
        return result;
      },
      setSiteName: (siteName: string = "") => {
        // @ts-ignore
        meta.openGraph.siteName = siteName;
        return result;
      },
      setKeywords: (keywords: string = "") => {
        if (keywords) meta.keywords = keywords;
        return result;
      },
      setCanonical: (canonical: string = "") => {
        if (canonical) meta.alternates = { ...meta.alternates, canonical };
        return result;
      },
      build: () => meta,
    };

    return result;
  }

  /* =========================
   * JSON-LD DEFAULT (DÙNG CHUNG CHO HOMEPAGE / LAYOUT)
   * ========================= */
  public static DEFAULT_JSONLD() {
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": `${this.BASE_URL}/#organization`,
          name: this.COMPANY_NAME,
          brand: { "@type": "Brand", name: this.DEFAULT_AUTHOR },
          url: this.BASE_URL,
          logo: {
            "@type": "ImageObject",
            url: `${this.BASE_URL}${this.DEFAULT_LOGO}`,
          },
          description: this.DEFAULT_DESCRIPTION,
          sameAs: [
            this.SOCIAL_LINKS.facebook,
            this.SOCIAL_LINKS.instagram,
            this.SOCIAL_LINKS.tiktok,
            this.SOCIAL_LINKS.linkedin,
            this.SOCIAL_LINKS.website,
          ],
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer support",
            telephone: this.CONTACT_PHONES,
            email: this.CONTACT_EMAIL,
          },
          address: {
            "@type": "PostalAddress",
            streetAddress: "Lầu 7, số 520 Cách Mạng Tháng Tám",
            addressLocality: "Phường Nhiêu Lộc",
            addressRegion: "TP. Hồ Chí Minh",
            addressCountry: "VN",
          },
          identifier: {
            "@type": "PropertyValue",
            propertyID: "BusinessRegistration",
            value: "0317786329",
          },
          knowsAbout: [
            "Freelancer",
            "Việc làm freelance",
            "Tuyển dụng",
            "Kết nối doanh nghiệp và freelancer",
            "Thanh toán freelance",
            "Hợp đồng và pháp lý freelance",
            "Biểu mẫu công việc",
          ],
        },

        {
          "@type": "WebSite",
          "@id": `${this.BASE_URL}/#website`,
          url: this.BASE_URL,
          name: this.DEFAULT_AUTHOR,
          description: this.DEFAULT_DESCRIPTION,
          publisher: { "@id": `${this.BASE_URL}/#organization` },
          inLanguage: "vi",
          potentialAction: {
            "@type": "SearchAction",
            target: `${this.BASE_URL}/jobs?keyword={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        },

        {
          "@type": "WebPage",
          "@id": `${this.BASE_URL}/#homepage`,
          url: this.BASE_URL,
          name: this.DEFAULT_TITLE,
          description: this.DEFAULT_DESCRIPTION,
          isPartOf: { "@id": `${this.BASE_URL}/#website` },
          about: { "@id": `${this.BASE_URL}/#organization` },
          inLanguage: "vi",
          audience: this.DEFAULT_AUDIENCE,
        },

        {
          "@type": "Service",
          "@id": `${this.BASE_URL}/#services`,
          provider: { "@id": `${this.BASE_URL}/#organization` },
          serviceType: this.DEFAULT_SERVICES,
          areaServed: { "@type": "Country", name: "Việt Nam" },
        },

        {
          "@type": "BreadcrumbList",
          "@id": `${this.BASE_URL}/#breadcrumb`,
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Trang chủ",
              item: this.BASE_URL,
            },
          ],
        },
      ],
    };
  }

  /* =========================
   * DEFAULT METADATA (DÙNG CHUNG)
   * ========================= */
  public static DEFAULT_METADATA(): Metadata {
    return {
      title: this.DEFAULT_TITLE,
      metadataBase: new URL(this.BASE_URL),
      applicationName: this.DEFAULT_AUTHOR,

      description: this.DEFAULT_DESCRIPTION,
      keywords: this.DEFAULT_KEYWORDS,

      authors: [{ name: this.DEFAULT_AUTHOR }],
      creator: this.COMPANY_NAME,
      publisher: this.COMPANY_NAME,

      referrer: "strict-origin-when-cross-origin",

      robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true },
      },

      alternates: { canonical: this.BASE_URL },

      openGraph: {
        type: "website",
        title: this.DEFAULT_TITLE,
        description: this.DEFAULT_DESCRIPTION,
        url: this.BASE_URL,
        siteName: this.DEFAULT_AUTHOR,
        locale: "vi_VN",
        images: [
          {
            url: `${this.BASE_URL}${this.DEFAULT_OG_IMAGE[0].url}`,
            width: 1200,
            height: 630,
            type: "image/jpeg",
          },
        ],
      },

      icons: [
        { url: "/favicon.ico", sizes: "16x16", type: "image/x-icon" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],

      verification: {
        google: "GOOGLE_SITE_VERIFICATION_CODE",
        // other: { "facebook-domain-verification": "FB_DOMAIN_VERIFY_CODE" },
      },

      other: {
        "organization:name": this.COMPANY_NAME,
        "organization:brand": this.DEFAULT_AUTHOR,
        "organization:website": this.BASE_URL,
        "organization:logo": `${this.BASE_URL}${this.DEFAULT_LOGO}`,

        "organization:business_registration": this.BUSINESS_REGISTRATION,

        "organization:email": this.CONTACT_EMAIL,
        "organization:phone": this.CONTACT_PHONES.join(" | "),
        "organization:address": this.ADDRESS_LIST[0].address,

        "organization:facebook": this.SOCIAL_LINKS.facebook,
        "organization:instagram": this.SOCIAL_LINKS.instagram,
        "organization:tiktok": this.SOCIAL_LINKS.tiktok,
        "organization:linkedin": this.SOCIAL_LINKS.linkedin,
        "organization:website_canonical": this.SOCIAL_LINKS.website,

        "og:site_name": this.DEFAULT_AUTHOR,
        "og:facebook": this.SOCIAL_LINKS.facebook,
        "og:instagram": this.SOCIAL_LINKS.instagram,
        "og:see_also": [
          this.SOCIAL_LINKS.facebook,
          this.SOCIAL_LINKS.instagram,
          this.SOCIAL_LINKS.tiktok,
          this.SOCIAL_LINKS.linkedin,
          this.SOCIAL_LINKS.website,
        ],

        // Lưu ý: cái này là Pixel ID, không phải fb app id. Nếu muốn fb:app_id đúng nghĩa thì tạo env riêng.
        "fb:app_id": process.env.FACEBOOK_META_PIXELS_CODE || "",
      },

      formatDetection: {
        telephone: true,
        address: true,
        email: true,
        date: true,
        url: true,
      },

      assets: "/assets",
    };
  }

  /* =========================
   * DEFAULT SITEMAP (STATIC)
   * ========================= */
  public static DEFAULT_SITEMAP(): MetadataRoute.Sitemap {
    return [
      {
        url: `${this.BASE_URL}/`,
        changeFrequency: "daily",
        priority: 1,
        lastModified: new Date(),
      },
      {
        url: `${this.BASE_URL}/gioi-thieu`,
        changeFrequency: "monthly",
        priority: 0.8,
        lastModified: new Date(),
      },
      {
        url: `${this.BASE_URL}/jobs`,
        changeFrequency: "daily",
        priority: 0.9,
        lastModified: new Date(),
      },
      {
        url: `${this.BASE_URL}/freelancers`,
        changeFrequency: "daily",
        priority: 0.85,
        lastModified: new Date(),
      },
      {
        url: `${this.BASE_URL}/templates`,
        changeFrequency: "weekly",
        priority: 0.7,
        lastModified: new Date(),
      },
      {
        url: `${this.BASE_URL}/phap-ly`,
        changeFrequency: "yearly",
        priority: 0.5,
        lastModified: new Date(),
      },
      {
        url: `${this.BASE_URL}/lien-he`,
        changeFrequency: "yearly",
        priority: 0.4,
        lastModified: new Date(),
      },

      {
        url: `${this.BASE_URL}/phap-ly/dieu-khoan`,
        changeFrequency: "yearly",
        priority: 0.3,
        lastModified: new Date(),
      },
      {
        url: `${this.BASE_URL}/phap-ly/chinh-sach-bao-mat`,
        changeFrequency: "yearly",
        priority: 0.3,
        lastModified: new Date(),
      },
    ];
  }

  public static Delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public static ABOUT_JSONLD() {
    const KEYWORDS = [
      "iAgree",
      "nền tảng kết nối dịch vụ",
      "freelance",
      "dịch vụ doanh nghiệp",
      "đối tác",
      "tuyển dụng",
      "việc làm",
      "công nghệ",
      "pháp lý",
      "giải pháp vận hành",
    ];
  
    const BRAND = {
      "@type": "Brand",
      "@id": `${this.BASE_URL}/#brand`,
      name: this.DEFAULT_AUTHOR,
      logo: {
        "@type": "ImageObject",
        "@id": `${this.BASE_URL}/#logo`,
        url: `${this.BASE_URL}${this.DEFAULT_LOGO}`, // ví dụ /assets/img/logo.svg
      },
      slogan: "Nền tảng kết nối dịch vụ toàn diện",
    };
  
    const ORG = {
      "@type": "Organization",
      "@id": `${this.BASE_URL}/#organization`,
      name: this.COMPANY_NAME,
      url: this.BASE_URL,
      brand: { "@id": `${this.BASE_URL}/#brand` },
  
      logo: { "@id": `${this.BASE_URL}/#logo` },
      image: [
        `${this.BASE_URL}/assets/img/og/cover-1200x630.jpg`, // nên có ảnh OG chuẩn
        `${this.BASE_URL}${this.DEFAULT_LOGO}`,
      ],
  
      description: this.DEFAULT_DESCRIPTION,
      sameAs: [
        this.SOCIAL_LINKS.facebook,
        this.SOCIAL_LINKS.instagram,
        this.SOCIAL_LINKS.tiktok,
        this.SOCIAL_LINKS.linkedin,
        this.SOCIAL_LINKS.website,
      ].filter(Boolean),
  
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer support",
          telephone: this.CONTACT_PHONES,
          email: this.CONTACT_EMAIL,
          availableLanguage: ["vi", "en"],
        },
      ],
  
      areaServed: "VN",
      knowsAbout: KEYWORDS,
  
      // Optional (fill nếu có)
      // foundingDate: "2023-01-01",
      // founder: { "@type": "Person", name: "..." },
      // address: {
      //   "@type": "PostalAddress",
      //   streetAddress: "...",
      //   addressLocality: "Ho Chi Minh City",
      //   addressRegion: "HCM",
      //   addressCountry: "VN",
      // },
    };
  
    const WEBSITE = {
      "@type": "WebSite",
      "@id": `${this.BASE_URL}/#website`,
      url: this.BASE_URL,
      name: this.DEFAULT_AUTHOR,
      description: this.DEFAULT_DESCRIPTION,
      publisher: { "@id": `${this.BASE_URL}/#organization` },
      inLanguage: "vi",
  
      // Nếu site có search, bật cái này (đúng chuẩn Google)
      potentialAction: {
        "@type": "SearchAction",
        target: `${this.BASE_URL}/search?search={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    };
  
    const ABOUT_PAGE = {
      "@type": "AboutPage",
      "@id": `${this.BASE_URL}/ve-chung-toi#webpage`,
      url: `${this.BASE_URL}/ve-chung-toi`,
      name: `Về chúng tôi - ${this.DEFAULT_AUTHOR}`,
      description:
        "Tìm hiểu về iAgree: sứ mệnh, câu chuyện sáng lập và giải pháp dành cho Khách hàng & Đối tác.",
      isPartOf: { "@id": `${this.BASE_URL}/#website` },
      about: { "@id": `${this.BASE_URL}/#organization` },
      inLanguage: "vi",
  
      // keyword dạng schema (đặt ở Page thì hợp lý hơn)
      keywords: KEYWORDS.join(", "),
  
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: `${this.BASE_URL}/assets/img/og/about-1200x630.jpg`,
      },
      breadcrumb: { "@id": `${this.BASE_URL}/ve-chung-toi#breadcrumb` },
    };
  
    const BREADCRUMB = {
      "@type": "BreadcrumbList",
      "@id": `${this.BASE_URL}/ve-chung-toi#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Trang chủ", item: this.BASE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Về chúng tôi",
          item: `${this.BASE_URL}/ve-chung-toi`,
        },
      ],
    };
  
    // Mô tả “sản phẩm/nền tảng” cho Google hiểu rõ iAgree làm gì
    const WEB_APP = {
      "@type": "WebApplication",
      "@id": `${this.BASE_URL}/#webapp`,
      name: this.DEFAULT_AUTHOR,
      url: this.BASE_URL,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      publisher: { "@id": `${this.BASE_URL}/#organization` },
      description: this.DEFAULT_DESCRIPTION,
      keywords: KEYWORDS.join(", "),
    };
  
    // Mô tả dịch vụ chính (optional nhưng rất ngon)
    const SERVICE = {
      "@type": "Service",
      "@id": `${this.BASE_URL}/#service`,
      name: "Kết nối dịch vụ & đối tác",
      provider: { "@id": `${this.BASE_URL}/#organization` },
      areaServed: "VN",
      serviceType: ["Freelance", "Doanh nghiệp", "Tuyển dụng", "Dịch vụ"],
      description:
        "Nền tảng giúp kết nối dịch vụ, đối tác và cơ hội công việc, hỗ trợ doanh nghiệp vận hành hiệu quả.",
    };
  
    return {
      "@context": "https://schema.org",
      "@graph":  [BRAND, ORG, WEBSITE, ABOUT_PAGE, BREADCRUMB, WEB_APP, SERVICE],
    };
  }
}
