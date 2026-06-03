// HowItsWorkScreen.tsx
"use client";


import _ from "lodash";
import styles from "./HowItWorkScreen.module.css";
import Header from "@/src/components/Header";
import BannerCarouselSection from "./components/BannerCarouselSection";
import GuideToFindingPartnersSection from "./components/GuideToFindingPartnersSection";
import GuideToFindingPartnersSection_2 from "./components/GuideToFindingPartnersSection_2";
import GuideToFindingPartnersSection_3 from "./components/GuideToFindingPartnersSection_3";
import SendDirectInvitationSection from "./components/SendDirectInvitationSection";
import ServicesAtIAgreeSection from "./components/ServicesAtIAgreeSection";
import { PartnersSection } from "./components/PartnersSection";
import Footer from "@/src/components/Footer";
import PartnerConnectionSection from "./components/PartnerConnectionSection";
import PartnerConnectionSection2 from "./components/PartnerConnectionSection2";
import Head from "next/head";
import { Breadcrumb } from "antd";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import BreakthroughPaymentSolutionSection from "./components/BreakthroughPaymentSolutionSection";
import BreakthroughPaymentSolutionSection_2 from "./components/BreakthroughPaymentSolutionSection_2";
import BreakthroughPaymentSolutionSection_3 from "./components/BreakthroughPaymentSolutionSection_3";
import useIntroduce from "../BecomeAPartnerScreen/hooks/useIntroduce";
import FloatingButtonContacts from "@/src/components/FloatingButtonContacts";
import FooterV2 from "@/src/components/footer-v2/FooterV2";
import GuideToCreateProjectSection from "./components/GuideToCreateProjectSection";

export function HowItWorkScreen(props: any) {
  const introduceOriginalResource = props.data;
  const { data: introduceResource } = useIntroduce({
    initData: introduceOriginalResource,
  });

  return (
    <div>
     

      <Header />
      {/* Áp dụng container cho các section chính */}
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
                { title: "Hướng dẫn sử dụng iAgree" },
              ]}
            />
          </div>
        </section>
        {/* <div className={styles.sectionTitle}>HƯỚNG DẪN ĐĂNG TẢI CÔNG VIỆC</div> */}
        <GuideToCreateProjectSection />
        {/* <GuideToFindingPartnersSection />
        <GuideToFindingPartnersSection_2 />
        <GuideToFindingPartnersSection_3 /> */}
        {/* <GuideToFindingPartnersSection_4 /> */}
        <SendDirectInvitationSection />
        <PartnerConnectionSection />
        <PartnerConnectionSection2 />
        <ServicesAtIAgreeSection jobCategories={introduceResource.categories} />
        <div className={styles.sectionTitle}>
          GIẢI PHÁP TOÀN DIỆN DÀNH CHO KHÁCH HÀNG
        </div>
        <BreakthroughPaymentSolutionSection />
        <BreakthroughPaymentSolutionSection_2 />
        <BreakthroughPaymentSolutionSection_3 />
        <PartnersSection />
      </div>
      <FooterV2 />

      <FloatingButtonContacts />
    </div>
  );
}
