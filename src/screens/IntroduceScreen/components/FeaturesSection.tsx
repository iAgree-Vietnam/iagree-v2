"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./FeaturesSection.module.css";
import { DownOutlined } from "@ant-design/icons";
import useIsMobile from "../../HomeScreen/hooks/useIsMobile";

// Utility function for safely parsing HTML strings
const renderHTMLString = (htmlString: string, className: string) => {
  const parts = htmlString.split(/<span class='greenText'>(.*?)<\/span>/);
  const elements = parts.map((part, index) => {
    if (index % 2 === 1) {
      return (
        <span key={index} className={className}>
          {part}
        </span>
      );
    }
    return part;
  });
  return elements;
};

export function FeaturesSection() {
  const isMobileL = useIsMobile(444);
  const isMobileM = useIsMobile(366);
  const featuresData = [
    {
      icon: "/assets/img/introduce/feature_1.svg",
      title: "Xây dựng thương hiệu cá nhân",
      description:
        "Dễ dàng cập nhật dự án, hiển thị đánh giá từ Khách hàng - tạo sự tin tưởng và giúp Khách hàng lựa chọn <span class='greenText'>nhanh chóng.</span>",
      image: "/assets/img/introduce/cover_feature_image_1.png",
      imageDescription:
        "''Xây dựng một hồ sơ cá nhân <span class='greenText'>chuyên nghiệp và thu hút</span> trên iAgree. Bạn có thể tự do giới thiệu các dự án đã hoàn thành, những kỹ năng nổi bật và những nhận xét tích cực từ Khách hàng, từ đó tạo ra <span class='greenText'>lợi thế cạnh tranh vượt trội</span>.''",
    },
    {
      icon: "/assets/img/introduce/feature_2.svg",
      title: "Khám phá cơ hội việc làm phong phú",
      description:
        "Kết nối hàng trăm dự án thuộc nhiều <span class='greenText'>lĩnh vực</span> khác nhau, mở rộng nhiều lựa chọn <span class='greenText'>phù hợp</span> với bạn.",
      image: "/assets/img/introduce/cover_feature_image_6.png",
      imageDescription:
        "''Tiếp cận một kho tàng công việc <span class='greenText'>đa dạng</span>, từ những dự án ngắn hạn cho đến các hợp đồng dài hạn, được cập nhật liên tục để phù hợp với mọi <span class='greenText'>lĩnh vực, chuyên môn và định hướng</span> của bạn.''",
    },
    {
      icon: "/assets/img/introduce/feature_3.svg",
      title: "Tăng trưởng thu nhập ổn định",
      description:
        "Cam kết chi trả <span class='greenText'>minh bạch</span>, giúp bạn an tâm xây dựng sự nghiệp <span class='greenText'>lâu dài</span>.",
      image: "/assets/img/introduce/cover_feature_image_7_1.png",
      imageDescription:
        "''Với cơ chế thanh toán <span class='greenText'>an toàn và minh bạch</span>, iAgree đảm bảo bạn luôn nhận được <span class='greenText'>thù lao xứng đáng và kịp thời</span> sau khi hoàn thành công việc, giúp bạn yên tâm phát triển sự nghiệp lâu dài mà không lo lắng về tài chính.''",
    },
    {
      icon: "/assets/img/introduce/feature_4.svg",
      title: "Thanh toán minh bạch & an toàn tuyệt đối",
      description:
        "Hệ thống tạm giữ <span class='greenText'>uỷ quyền thanh toán</span> đến khi công việc được hoàn thành giúp <span class='greenText'>bảo vệ quyền lợi</span> cho cả Đối tác và Khách hàng.",
      image: "/assets/img/introduce/cover_feature_image_8_3.png",
      imageDescription:
        "''Hệ thống <span class='greenText'>thanh toán ủy quyền của iAgree</span> là giải pháp tối ưu để <span class='greenText'>bảo vệ quyền lợi</span> của cả Khách hàng và Đối Tác. Khách hàng chỉ cần chuyển tiền vào hệ thống và iAgree sẽ tạm giữ, đảm bảo Đối Tác sẽ nhận được thù lao khi công việc hoàn tất.''",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeMobileIndex, setActiveMobileIndex] = useState(-1);
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 992);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      resetTimeoutRef.current = setTimeout(() => {
        setActiveIndex(0);
      }, 1000);
    }
    return () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, [isMobile]);

  const handleMouseEnter = (index: number) => {
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
    }
    if (index !== activeIndex) {
      setIsFading(true);
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }
      fadeTimeoutRef.current = setTimeout(() => {
        setActiveIndex(index);
        setIsFading(false);
      }, 200);
    }
  };

  const handleMouseLeave = () => {
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
    }
    resetTimeoutRef.current = setTimeout(() => {
      setActiveIndex(0);
    }, 30000);
  };

  const handleMobileClick = (index: number) => {
    setActiveMobileIndex(activeMobileIndex === index ? -1 : index);
  };

  return (
    <section id="features-section" className={styles.featuresSection}>
      <div className={styles.featuresContainer}>
        <div className={styles.featuresHeader}>
          <div className={styles.featuresTitle}>
            Giải pháp toàn diện dành cho{" "}
            {isMobileL ? isMobileM ? null : <br /> : null}{" "}
            <span className={styles.highlightTitle}>Đối tác</span>
          </div>
        </div>

        {isMobile ? (
          <div className={styles.featuresMobileWrapper}>
            {featuresData.map((feature, index) => (
              <div
                key={index}
                className={`${styles.unifiedFeatureCardMobile} ${
                  activeMobileIndex === index ? styles.activeCardMobile : ""
                }`}
                onClick={() => handleMobileClick(index)}
              >
                <div className={styles.featureHeaderMobile}>
                  <div className={styles.featureIconWrapper}>
                    <Image
                      src={feature.icon}
                      alt={feature.title}
                      width={24}
                      height={24}
                      className={styles.featureIcon}
                    />
                  </div>
                  <div className={styles.featureContentWrapper}>
                    <h3 className={styles.featureCardTitle}>{feature.title}</h3>
                    <div className={styles.featureDescription}>
                      {renderHTMLString(feature.description, styles.greenText)}
                    </div>
                  </div>
                  <div className={styles.expandIcon}>
                    <DownOutlined
                      className={`${
                        activeMobileIndex === index ? styles.rotated : ""
                      }`}
                    />
                  </div>
                </div>
                {activeMobileIndex === index && (
                  <div className={styles.mobileDetailsContainer}>
                    <div className={styles.mobileImageWrapper}>
                      <Image
                        src={feature.image}
                        alt={feature.title}
                        width={500}
                        height={500}
                        className={styles.featureBackgroundImageMobile}
                      />
                    </div>
                    <div className={styles.mobileQuoteBox}>
                      {renderHTMLString(
                        feature.imageDescription,
                        styles.greenText
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.featuresGridWrapper}>
            {/* Features List */}
            <div className={styles.featuresListContainer}>
              {featuresData.map((feature, index) => (
                <div
                  key={index}
                  className={`${styles.unifiedFeatureCard} ${
                    index === activeIndex ? styles.activeCard : ""
                  }`}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className={styles.featureIconWrapper}>
                    <Image
                      src={feature.icon}
                      alt={feature.title}
                      width={24}
                      height={24}
                      className={styles.featureIcon}
                    />
                  </div>
                  <div className={styles.featureContentWrapper}>
                    <div className={styles.featureCardTitle}>
                      {feature.title}
                    </div>
                    <div className={styles.featureDescription}>
                      {renderHTMLString(feature.description, styles.greenText)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Feature Image & Quote */}
            <div className={styles.featuresImageWrapper}>
              <div
                className={`${styles.featuresImageBox} ${
                  isFading ? styles.fading : ""
                }`}
              >
                <Image
                  src={featuresData[activeIndex].image}
                  alt={featuresData[activeIndex].title}
                  width={500}
                  height={500}
                  className={styles.featureBackgroundImage}
                />
              </div>
              <div
                className={`${styles.featuresQuoteBox} ${
                  isFading ? styles.fading : ""
                }`}
              >
                {renderHTMLString(
                  featuresData[activeIndex].imageDescription,
                  styles.greenText
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
