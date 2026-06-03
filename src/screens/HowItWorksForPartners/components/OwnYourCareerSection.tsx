"use client";

import React, { useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./OwnYourCareerSection.module.css";
import useIsMobile from "../../HomeScreen/hooks/useIsMobile";
import PricingRouteUtils from "@/src/data/pricing/utils/PricingRouteUtils";
import JobRouteUtils from "@/src/data/job/utils/JobRouteUtils";
import PrivacyPolicyRouteUtils from "@/src/data/privacy-policy/utils/PrivacyPolicyRouteUtils";

export function OwnYourCareerSection() {
  const isTablet = useIsMobile(992);
  const router = useRouter();

  const normalizeSettingItem = useCallback((s?: string) => {
    if (!s) return "";
    const regex = new RegExp(["&nbsp;", "<p>", "</p>", "<br>"].join("|"), "gi");
    return s.replace(regex, "");
  }, []);

  const handleBuyOpportunity = () => {
    router.push(PricingRouteUtils.toScreen());
  };

  const handleFindJob = () => {
    router.push(JobRouteUtils.toJobsSearchScreen({}));
  };

  const handleContactSupport = () => {
    window.open("https://zalo.me/2918045479899063226", "_blank");
  };

  const cards = [
    {
      image: "/assets/img/how-it-works-for-partners/own/own_bg_1.png",
      title: "Gia tăng cơ hội ứng tuyển",
      buttonText: "Mua Cơ Hội ngay",
      onClick: handleBuyOpportunity,
    },
    {
      image: "/assets/img/how-it-works-for-partners/own/own_bg_2.png",
      title: "Phát triển sự nghiệp của bạn",
      buttonText: "Tìm công việc ngay",
      onClick: handleFindJob,
    },
    {
      image: "/assets/img/how-it-works-for-partners/own/own_bg_3.png",
      title: "Bạn cần trợ giúp?",
      buttonText: "Liên hệ hỗ trợ",
      onClick: handleContactSupport,
    },
  ];

  return (
    <section className={styles.learnSection}>
      <div className={styles.container}>
        <div className={styles.sectionTitle}>
          Làm chủ sự nghiệp của bạn ngay hôm nay!
        </div>

        <div className={styles.cardsWrapper}>
          {cards.map((card, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.imageWrapper}>
                <Image
                  src={card.image}
                  alt={card.title}
                  width={isTablet ? 1000 : 400}
                  height={250}
                  className={styles.image}
                />
              </div>
              <div className={styles.cardContent}>
                <div className={styles.cardTitle}>{card.title}</div>
                <button className={styles.ctaButton} onClick={card.onClick}>
                  {card.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
