"use client";

import React, { useRef } from "react";
import { AboutSection } from "./components/AboutSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { BannerSection } from "./components/BannerSetion";
import { ProcessSection } from "./components/ProcessSection";
import ServicesSection from "./components/ServicesSection";
import _ from "lodash";
import IntroduceHeader from "./components/IntroduceHeader";
import { FoundingStorySection } from "./components/FoundingStorySection";
import { FandQSection } from "./components/FandQSection";
import { PartnersSection } from "./components/PartnersSection";
import FooterSection from "./components/FooterSection";
import useIntroduce from "./hooks/useIntroduce";
import PartnersPageSection from "./components/PartnersPage";
import FloatingButtonContacts from "@/src/components/FloatingButtonContacts";
import { ConnectsSection } from "./components/ConnectsSection";
import styles from "./IntroduceScreen.module.css";

export function IntroduceScreen(props: any) {
  const headerRef = useRef<HTMLDivElement>(null);

  const introduceOriginalResource = props.data;
  const { data: introduceResource } = useIntroduce({
    initData: introduceOriginalResource,
  });

  return (
    <div>
      <IntroduceHeader ref={headerRef} />
      <BannerSection />
      <AboutSection />
      <FoundingStorySection />
      <FeaturesSection />
      <ServicesSection jobCategories={introduceResource?.categories} />
      <div className={styles.mainContentContainer}>
        <ProcessSection />
        <ConnectsSection />
      </div>
      <PartnersPageSection topPartners={introduceResource?.partnersTop} />
      <div className={styles.mainContentContainer}>
        <PartnersSection />
        <FandQSection />
      </div>
      <FooterSection />

      <FloatingButtonContacts />
    </div>
  );
}
