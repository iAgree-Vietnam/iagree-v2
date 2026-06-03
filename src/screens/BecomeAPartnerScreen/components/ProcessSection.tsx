"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import styles from "./ProcessSection.module.css";
import { DownOutlined } from "@ant-design/icons";

const processSteps = [
  {
    number: 1,
    text: "Khởi tạo hồ sơ",
    title: "Hồ sơ Đối tác chuyên nghiệp",
    description:
      "Đăng ký tài khoản và xây dựng hồ sơ cá nhân, kinh nghiệm làm việc và các dự án đã thực hiện để tạo sự khác biệt.",
    image: "/assets/img/become-partner/bg_1_1.png",
  },
  {
    number: 2,
    text: "Tìm kiếm công việc phù hợp",
    title: "Sử dụng Cơ Hội để ứng tuyển công việc phù hợp với bạn",
    description:
      "Đối Tác có thể tìm kiếm công việc phù hợp theo lĩnh vực, kỹ năng của mình. Sử dụng Cơ Hội để gửi đề xuất công việc cho Khách hàng, trao đổi với Khách hàng để thống nhất phạm vi công việc.",
    image: "/assets/img/become-partner/bg_2_1.png",
  },
  {
    number: 3,
    text: "Xác nhận công việc",
    title:
      "Xác nhận công việc bằng Điều kiện & Điều khoản bắt đầu công việc (''T&C'') an toàn và tuân thủ theo quy định pháp luật",
    description:
      "Sau khi thống nhất, T&C sẽ được khởi tạo với đầy đủ điều kiện và điều khoản. Việc các bên bấm xác nhận được lưu trữ dưới dạng dữ liệu điện tử, có giá trị pháp lý tương đương với hợp đồng đã ký và được iAgree bảo lưu theo quy định của Luật Giao dịch điện tử hiện hành.",
    image: "/assets/img/become-partner/bg_3_1.png",
  },
  {
    number: 4,
    text: "Thực hiện công việc",
    title: "Hỗ trợ làm việc từ iAgree",
    description:
      "Tận dụng các công cụ và tài nguyên của iAgree để quản lý tiến độ, giao tiếp hiệu quả với Khách hàng và đảm bảo công việc hoàn thành đúng hạn.",
    image: "/assets/img/become-partner/bg_4_1.png",
  },
  {
    number: 5,
    text: "Bàn giao và nghiệm thu",
    title: "Quy trình nghiệm thu chặt chẽ",
    description:
      "Khách hàng sẽ nghiệm thu sản phẩm/dịch vụ của bạn thông qua nền tảng. Quá trình này giúp xác nhận chất lượng công việc và là bước cuối cùng trước khi thanh toán.",
    image: "/assets/img/become-partner/bg_5_1.png",
  },
  {
    number: 6,
    text: "Hoàn thành, nhận thanh toán",
    title: "Thanh toán an toàn tuyệt đối",
    description:
      "Sau khi nghiệm thu thành công, iAgree sẽ giải ngân cho Đối Tác số tiền đã được tạm giữ theo lịch thanh toán định kỳ của iAgree, Đối Tác có thể yêu cầu iAgree giải ngân sớm hơn theo nhu cầu một cách nhanh chóng và an toàn.",
    image: "/assets/img/become-partner/bg_6_1.png",
  },
];

const containerBgColors = [
  "#00994f",
  "#00994f",
  "#00994f",
  "#00994f",
  "#00994f",
  "#00994f",
];

const titleContainerColors = [
  "#FFFFFF",
  "#FFFFFF",
  "#FFFFFF",
  "#FFFFFF",
  "#FFFFFF",
  "#FFFFFF",
];

const textColors = [
  "#FFFFFF",
  "#FFFFFF",
  "#FFFFFF",
  "#FFFFFF",
  "#FFFFFF",
  "#FFFFFF",
];

export function ProcessSection() {
  const processStepRefs = useRef<Array<HTMLDivElement | null>>([]);
  const detailsRef = useRef<HTMLDivElement>(null);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  const [hoveredIndex, setHoveredIndex] = useState<number>(0);
  const [arrowPosition, setArrowPosition] = useState("0px");
  const [isTablet, setIsTablet] = useState(false);

  const updateArrowPosition = (itemElement: HTMLDivElement | null) => {
    if (detailsRef.current && itemElement) {
      const detailsRect = detailsRef.current.getBoundingClientRect();
      const itemRect = itemElement.getBoundingClientRect();
      const newArrowPosition =
        itemRect.left + itemRect.width / 2 - detailsRect.left;
      setArrowPosition(`${newArrowPosition}px`);
    }
  };

  const handleMouseEnter = (
    event: React.MouseEvent<HTMLDivElement>,
    index: number
  ) => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    setHoveredIndex(index);
    updateArrowPosition(event.currentTarget);
  };

  const handleMouseLeave = () => {
    timeoutId.current = setTimeout(() => {
      setHoveredIndex(0);
      const firstStepElement = processStepRefs.current[0];
      if (firstStepElement) {
        updateArrowPosition(firstStepElement);
      }
    }, 30000);
  };

  const handleMobileClick = (index: number) => {
    setHoveredIndex(hoveredIndex === index ? -1 : index);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsTablet(window.innerWidth <= 1092);
      const firstStepElement = processStepRefs.current[0];
      if (firstStepElement && !isTablet) {
        updateArrowPosition(firstStepElement);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, [isTablet]);

  useEffect(() => {
    const setInitialPosition = () => {
      const firstStepElement = processStepRefs.current[0];
      if (firstStepElement) {
        updateArrowPosition(firstStepElement);
      }
    };
    setTimeout(setInitialPosition, 0);
  }, []);

  const activeStep =
    hoveredIndex !== -1 ? processSteps[hoveredIndex] : processSteps[0];

  const activeContainerBgColor =
    hoveredIndex !== -1
      ? containerBgColors[hoveredIndex]
      : containerBgColors[0];

  const activeTitleColor =
    hoveredIndex !== -1
      ? titleContainerColors[hoveredIndex]
      : titleContainerColors[0];

  const activeDescriptionColor =
    hoveredIndex !== -1 ? textColors[hoveredIndex] : textColors[0];

  const activeArrowColor =
    hoveredIndex !== -1
      ? containerBgColors[hoveredIndex]
      : containerBgColors[0];

  return (
    <section id="process-section" className={styles.processSection}>
      <div className={styles.container}>
        <div className={styles.sectionTitle}>
          Quy trình làm việc
          <br />
          <span className={styles.sectionTitleSpan}>trên nền tảng{" "}</span>iAgree
        </div>
        {isTablet ? (
          <div className={styles.processStepsMobile}>
            {processSteps.map((step, index) => (
              <div
                key={index}
                className={`${styles.processStepCardMobile} ${
                  hoveredIndex === index ? styles.activeCardMobile : ""
                }`}
                onClick={() => handleMobileClick(index)}
              >
                <div className={styles.stepHeaderMobile}>
                  <div className={styles.stepNumberWrapper}>
                    <span className={styles.stepNumber}>{step.number}</span>
                  </div>
                  <div className={styles.mobileTextWrapper}>
                    <div className={styles.stepText}>{step.text}</div>
                  </div>
                  <div className={styles.expandIcon}>
                    <DownOutlined
                      className={`${
                        hoveredIndex === index ? styles.rotated : ""
                      }`}
                    />
                  </div>
                </div>
                {hoveredIndex === index && (
                  <div
                    className={styles.mobileDetailsContainer}
                    style={{ backgroundColor: activeContainerBgColor }}
                  >
                    <div className={styles.processDetailsContentMobile}>
                      <div className={styles.processDetailsTextMobile}>
                        <h3
                          className={styles.detailsTitle}
                          style={{ color: activeTitleColor }}
                        >
                          {activeStep.title}
                        </h3>
                        <div
                          className={styles.detailsDescription}
                          style={{ color: activeDescriptionColor }}
                        >
                          {activeStep.description}
                        </div>
                      </div>
                      <div className={styles.processDetailsImageMobile}>
                        <Image
                          src={activeStep.image}
                          alt={activeStep.title}
                          width={600}
                          height={400}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className={styles.processStepsGrid}>
              {processSteps.map((step, index) => (
                <div
                  key={index}
                  ref={(el) => {
                    processStepRefs.current[index] = el;
                  }}
                  className={`${styles.processStepCard} ${
                    hoveredIndex === index ? styles.activeCard : ""
                  }`}
                  onMouseEnter={(e) => handleMouseEnter(e, index)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className={styles.stepNumberWrapper}>
                    <span className={styles.stepNumber}>{step.number}</span>
                  </div>
                  <div className={styles.stepText}>{step.text}</div>
                </div>
              ))}
            </div>
            <div
              ref={detailsRef}
              className={styles.processDetailsContainer}
              style={{ backgroundColor: activeContainerBgColor }}
            >
              <div
                className={styles.detailsArrow}
                style={{
                  left: arrowPosition,
                  borderBottomColor: activeArrowColor,
                }}
              />
              <div className={styles.processDetailsContent}>
                <div className={styles.processDetailsText}>
                  <h3
                    className={styles.detailsTitle}
                    style={{ color: activeTitleColor }}
                  >
                    {activeStep.title}
                  </h3>
                  <div
                    className={styles.detailsDescription}
                    style={{ color: activeDescriptionColor }}
                  >
                    {activeStep.description}
                  </div>
                </div>
                <div className={styles.processDetailsImage}>
                  <Image
                    src={activeStep.image}
                    alt={activeStep.title}
                    width={580}
                    height={400}
                    style={{ borderRadius: 16 }}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
