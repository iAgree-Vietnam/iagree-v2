"use client";


import _ from "lodash";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import Header from "@/src/components/Header";
import Head from "next/head";
import { Breadcrumb } from "antd";
import FloatingButtonContacts from "@/src/components/FloatingButtonContacts";
import styles from "./HowItWorksForPartners.module.css";
import FooterV2 from "@/src/components/footer-v2/FooterV2";
import { FeaturesSection } from "./components/FeaturesSection";
import { ConnectsSection } from "./components/ConnectsSection";
import { UserGuideForPartnersSection } from "./components/UserGuideForPartnersSection";
import WorkProcessSection from "./components/WorkProcessSection";
import EarningsManagementSection from "./components/EarningsManagementSection";
import { OwnYourCareerSection } from "./components/OwnYourCareerSection";
import PartnerApplySection from "./components/PartnerApplySection";

export function HowItWorksForPartnersScreen() {
  return (
    <div>
      <Head>
        <title>Cẩm nang Đối tác</title>
        <link
          rel={"stylesheet"}
          type={"text/css"}
          charSet={"UTF-8"}
          href={
            "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
          }
        />
        <link
          rel={"stylesheet"}
          type={"text/css"}
          href={
            "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
          }
        />
      </Head>
      <Header />
      <div className={styles.mainContentContainer}>
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
                { title: "Cẩm nang Đối tác" },
              ]}
            />
          </div>
        </section>
        <FeaturesSection />
        <UserGuideForPartnersSection />
        <ConnectsSection />
        <EarningsManagementSection />
        <PartnerApplySection />
        <WorkProcessSection />
        <OwnYourCareerSection />
      </div>
      <FooterV2 />
      <FloatingButtonContacts />
    </div>
  );
}
