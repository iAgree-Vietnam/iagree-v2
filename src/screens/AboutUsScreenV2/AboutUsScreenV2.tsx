// AboutUsScreenV2.tsx
"use client";


import _ from "lodash";
import styles from "./AboutUsScreenV2.module.css";
import Head from "next/head";
import BannerVideoAnimation from "./components/BannerVideoAnimation";
import { FoundingStorySection } from "./components/FoundingStorySection";
import RootLayout from "@/src/layouts/RootLayout";
import { Breadcrumb } from "antd";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import { FeaturesSection } from "./components/FeaturesSection";
import BreakthroughPaymentSolutionSection from "./components/BreakthroughPaymentSolutionSection";
import { FandQSection } from "./components/FandQSection";
import { PartnersSection } from "./components/PartnersSection";
import BreakthroughPaymentSolutionSection_2 from "./components/BreakthroughPaymentSolutionSection_2";
import BreakthroughPaymentSolutionSection_3 from "./components/BreakthroughPaymentSolutionSection_3";
import TeamSection from "./components/TeamSection";
import useIntroduce from "../BecomeAPartnerScreen/hooks/useIntroduce";
import useIsMobile from "../HomeScreen/hooks/useIsMobile";
import clsx from "clsx";

export function AboutUsScreenV2(props: any) {
  const isMobileL = useIsMobile(444);
  const isMobileM = useIsMobile(366);
  const introduceOriginalResource = props.data;
  // const { data: introduceResource } = useIntroduce({
  //   initData: introduceOriginalResource,
  // });
  const introduceResource = props.data;

  return (
    <RootLayout>
      

      {/* Áp dụng container cho các section chính */}
      <div className={styles.mainContentContainer}>
        <BannerVideoAnimation />
        <section className={"breadcrumbContainer aboutUsBreadcrumbContainer"}>
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
                { title: "Về chúng tôi" },
              ]}
            />
          </div>
        </section>
        <FoundingStorySection />
        <div className={styles.sectionTitle}>
          Giải pháp toàn diện dành cho{" "}
          {isMobileL ? isMobileM ? null : <br /> : null}{" "}
          <span className={styles.greenText}> Khách hàng</span>
        </div>
        <BreakthroughPaymentSolutionSection />
        <BreakthroughPaymentSolutionSection_2 />
        <BreakthroughPaymentSolutionSection_3 />
        {/* <section className={"sectionContainer feedbackWrapper"}>
          <div className={"contentWrapper"}>
            <div className={"feedbackContentContainer"}>
              <div
                className={styles.sectionTitle}
                style={{ marginTop: "5rem" }}
              >
                Phản hồi từ <span className={styles.greenText}>Khách hàng</span>
              </div>
              <ClientsFeedBackSection />
            </div>
          </div>
        </section> */}
        <FeaturesSection />

        {/* <section className={"sectionContainer feedbackWrapper"}>
          <div className={"contentWrapper"}>
            <div className={"feedbackContentContainer"}>
              <div
                className={styles.sectionTitle}
                style={{ marginTop: "3rem" }}
              >
                Trải nghiệm từ <span className={styles.greenText}>Đối tác</span>
              </div>
              <PartnersFeedBackSection />
            </div>
          </div>
        </section> */}

        <TeamSection topPartners={introduceResource.partnersTop} />

        <div className={clsx(styles.sectionTitle,"flex justify-center gap-2")}>
          <span className={clsx(styles.greenText, "mx-0")}>Đối tác đồng hành</span> cùng{" "}
          <img
            alt={"IAGREE logo"}
            src={"/assets/img/logo.svg"}
            className={styles.logo}
          />
        </div>
        <PartnersSection />
        <FandQSection />
      </div>
    </RootLayout>
  );
}
