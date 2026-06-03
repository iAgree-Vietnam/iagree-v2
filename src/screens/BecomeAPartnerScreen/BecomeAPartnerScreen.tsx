"use client";


import Head from "next/head";
import dynamic from "next/dynamic";
import { Breadcrumb } from "antd";

import { IconSvgLocal } from "@/src/components/icon-svg-local";
import useIntroduce from "./hooks/useIntroduce";
import Header from "@/src/components/Header";
import FooterV2 from "@/src/components/footer-v2/FooterV2";
// 🟢 XÓA IMPORT LODASH KHÔNG CẦN THIẾT

// Định nghĩa Loading Component mặc định cho các Dynamic Imports
const DefaultLoading = () => null;

// --- DYNAMIC IMPORTS ---

// ❗ Lazy load toàn bộ section nặng
// 🟢 DI CHUYỂN CSS SLIDER VÀO CÁC COMPONENT NẾU CHỈ DÙNG BÊN TRONG CHÚNG
const BannerCarouselSection = dynamic(
  () => import("./components/BannerCarouselSection"),
  {
    loading: DefaultLoading,
    ssr: false,
  }
);

const FeaturesSection = dynamic(
  () => import("./components/FeaturesSection").then((m) => m.FeaturesSection),
  {
    loading: DefaultLoading,
    ssr: false,
  }
);

const ProcessSection = dynamic(
  () => import("./components/ProcessSection").then((m) => m.ProcessSection),
  {
    loading: DefaultLoading,
    ssr: false,
  }
);

const ConnectsSection = dynamic(
  () => import("./components/ConnectsSection").then((m) => m.ConnectsSection),
  {
    loading: DefaultLoading,
    ssr: false,
  }
);

const FandQSection = dynamic(
  () => import("./components/FandQSection").then((m) => m.FandQSection),
  {
    loading: DefaultLoading,
    ssr: false,
  }
);

const PartnersSection = dynamic(
  () => import("./components/PartnersSection").then((m) => m.PartnersSection),
  {
    loading: DefaultLoading,
    ssr: false,
  }
);

const TeamSection = dynamic(() => import("./components/TeamSection"), {
  loading: DefaultLoading,
  ssr: false,
});

const FloatingButtonContacts = dynamic(
  () => import("@/src/components/FloatingButtonContacts"),
  {
    loading: DefaultLoading,
    ssr: false,
  }
);

import styles from "./BecomeAPartnerScreen.module.css";
import RegisterPartnerSection from "./components/RegisterPartnerSection";

// 🟢 TẠO INTERFACE RÕ RÀNG HƠN CHO PROPS
interface BecomeAPartnerScreenProps {
  data: any; // Thay thế 'any' bằng kiểu dữ liệu cụ thể nếu có
}

export function BecomeAPartnerScreen(props: BecomeAPartnerScreenProps) {
  const introduceOriginalResource = props.data;

  const { data: introduceResource } = useIntroduce({
    initData: introduceOriginalResource,
  });

  const topPartners = introduceResource?.partnersTop || [];

  return (
    <div>
      {/* <Head>
        <title>Trở thành Đối tác</title>
      </Head> */}

      <Header />

      <div className={styles.mainContentContainer}>
        <BannerCarouselSection />

        <section className={"breadcrumbContainer"}>
          <div className="contentWrapper">
            <Breadcrumb
              items={[
                {
                  title: (
                    <>
                      <IconSvgLocal name={"IC_HOME"} />
                      <span>Trang chủ</span>
                    </>
                  ),
                  href: "/",
                },
                { title: "Trở thành Đối tác" },
              ]}
            />
          </div>
        </section>

        {/* Các section dưới lazy-load */}
        <FeaturesSection />
        <RegisterPartnerSection />
        <ProcessSection />
        <ConnectsSection />
        <TeamSection topPartners={topPartners} />
        <PartnersSection />
        <FandQSection />
      </div>

      <FooterV2 />
      <FloatingButtonContacts />
    </div>
  );
}
