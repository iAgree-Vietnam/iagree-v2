"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./PartnerConnectionSection.module.css";

import { Reveal } from "react-awesome-reveal";
import { keyframes } from "@emotion/react";

const customAnimation = keyframes`
    from {
        opacity: 0;
        transform: translate3d(0, 100px, 0);
    }
    to {
        opacity: 1;
        transform: translate3d(0, 0, 0);
    }
`;

// Sample data for the stacking cards
const partnerSteps = [
  {
    id: 1,
    number: "01",
    title: "Đăng ký tài khoản",
    description:
      "Chỉ với vài bước để hoàn tất <br/> đăng ký tài khoản trên iAgree.",
    image: "/assets/img/how-it-work/bg_1.png",
  },
  {
    id: 2,
    number: "02",
    title: "Đăng tải công việc",
    description: "Mô tả yêu cầu công việc <br/> để tìm kiếm Đối tác phù hợp.",
    image: "/assets/img/how-it-work/bg_9.png",
  },
  {
    id: 3,
    number: "03",
    title: "Kết nối với Đối tác <br/> phù hợp",
    description: "Chủ động mời cộng tác chỉ với <br/> một cú click.",
    image: "/assets/img/how-it-work/bg_10_1.png",
  },
  {
    id: 4,
    number: "04",
    title: "Thống nhất công việc",
    description:
      "Thống nhất công việc sau khi <br/> thỏa thuận rõ ràng với nhau.",
    image: "/assets/img/how-it-work/bg_4.png",
  },
  {
    id: 5,
    number: "05",
    title: "Thanh toán <br/>và uỷ quyền",
    description:
      "Thanh toán 100% số tiền và ủy quyền <br/> cho iAgree tạm giữ cho đến khi<br/> hoàn tất công việc",
    image: "/assets/img/how-it-work/bg_5.png",
  },
  {
    id: 6,
    number: "06",
    title: "Theo dõi tiến độ",
    description:
      "Cập nhật và phản hồi trong <br/> quá trình thực hiện công việc.",
    image: "/assets/img/how-it-work/bg_6.png",
  },
  {
    id: 7,
    number: "07",
    title: "Nghiệm thu",
    description:
      "Kiểm tra sản phẩm, xác nhận <br/> kết quả trước khi giải ngân.",
    image: "/assets/img/how-it-work/bg_7.png",
  },
  {
    id: 8,
    number: "08",
    title: "Hoàn thành <br/>và đánh giá",
    description: "Giải ngân an toàn cho cả hai bên <br/> khi dự án kết thúc.",
    image: "/assets/img/how-it-work/bg_8.png",
  },
];

const PartnerConnectionSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      const windowHeight = window.innerHeight;
      const newActiveIndex = partnerSteps.findIndex((_, index) => {
        const cardTop = cardRefs.current[index]?.offsetTop;
        const cardHeight = cardRefs.current[index]?.offsetHeight;
        if (cardTop && cardHeight) {
          return offset >= cardTop - windowHeight * 0.1;
        }
        return false;
      });
      if (newActiveIndex !== -1) {
        setActiveIndex(newActiveIndex);
      }
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Set initial state
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Reveal keyframes={customAnimation} triggerOnce>
      <section id="partner-connection" className={styles.sectionContainer}>
        <div className={styles.contentWrapper}>
          <div className={styles.mainTitle}>CÁCH ĐỂ KẾT NỐI VỚI ĐỐI TÁC</div>

          <div className={styles.introContainer}>
            <div className={styles.introLeft}>
              {isMobile ? "Hình thức 1" : "----------Hình thức 1"}
            </div>
            <div className={styles.introRight}>
              Đăng công việc để tìm <br />
              ứng viên phù hợp
            </div>
          </div>

          <div className={styles.stackingContainer}>
            <div className={styles.cardsList}>
              {partnerSteps?.map((step, index) => (
                <div
                  key={step.id}
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  className={styles.stackingCard}
                >
                  <div className={styles.cardContent}>
                    {/* Left column - Number and Title */}
                    <div className={styles.cardLeft}>
                      <div className={styles.cardNumber}>{step.number}</div>
                      {/* RENDER TITLE WITH dangerouslySetInnerHTML */}
                      <div
                        className={styles.cardTitle}
                        dangerouslySetInnerHTML={{ __html: step.title }}
                      />
                    </div>

                    {/* Middle column - Description */}
                    <div className={styles.cardMiddle}>
                      {/* RENDER DESCRIPTION WITH dangerouslySetInnerHTML */}
                      <div
                        className={styles.cardDescription}
                        dangerouslySetInnerHTML={{ __html: step.description }}
                      />
                    </div>

                    {/* Right column - Image */}
                    <div className={styles.cardRight}>
                      <img
                        src={step.image}
                        alt={step.title}
                        className={styles.cardImage}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  );
};

export default PartnerConnectionSection;
