"use client";


import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./UserGuideForPartnersSection.module.css";
import { PartnerRouteUtils } from "@/src/data/partner/utils/PartnerRouteUtils";
import useIsMobile from "../../HomeScreen/hooks/useIsMobile";

export function UserGuideForPartnersSection() {
  const isTablet = useIsMobile(829);
  const isMobileL = useIsMobile(768);
  const router = useRouter();
  const handleScrollToSection = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    id: string
  ) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const rect = element.getBoundingClientRect();
      const headerHeight = 50;
      const offsetPosition = window.pageYOffset + rect.top - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // 🧩 4 phương thức tương ứng 4 nút
  const handleCreateProfile = (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    router.push(PartnerRouteUtils.toProfileUrl());
  };

  const handleLearnAboutOpportunity = (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    handleScrollToSection(e, "connects-section");
  };

  const handlePartnerGuide = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    handleScrollToSection(e, "work-process");
  };

  const handleWalletGuide = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    handleScrollToSection(e, "earning-management");
  };

  const steps = [
    {
      imgSquare: "/assets/img/how-it-works-for-partners/squares/sq_bg_1.png",
      imgRectangle:
        "/assets/img/how-it-works-for-partners/rectangles/rtg_bg_1.png",
      title: "Khởi tạo hồ sơ Đối Tác dễ dàng",
      description:
        "Một hồ sơ rõ ràng, chuyên nghiệp sẽ giúp bạn nổi bật giữa hàng trăm ứng viên và tăng cơ hội được khách hàng lựa chọn. Hãy dành thời gian xây dựng hồ sơ thật chỉn chu để khởi đầu thuận lợi.",
      buttonText: "Khởi tạo hồ sơ",
      onClick: handleCreateProfile,
    },
    {
      imgSquare: "/assets/img/how-it-works-for-partners/squares/sq_bg_2.png",
      imgRectangle:
        "/assets/img/how-it-works-for-partners/rectangles/rtg_bg_2.png",
      title: "Mua Cơ Hội & Ứng tuyển công việc",
      description:
        " Cơ Hội là “vé thông hành” để bạn tiếp cận những dự án chất lượng. Lựa chọn công việc phù hợp với thế mạnh, sử dụng Cơ Hội một cách thông minh để tối ưu khả năng trúng tuyển.",
      buttonText: "Tìm hiểu về Cơ Hội",
      onClick: handleLearnAboutOpportunity,
    },
    {
      imgSquare: "/assets/img/how-it-works-for-partners/squares/sq_bg_3.png",
      imgRectangle:
        "/assets/img/how-it-works-for-partners/rectangles/rtg_bg_3.png",
      title: "Tìm kiếm công việc – Ứng tuyển – Đàm phán – Thực hiện – Quản lý",
      description:
        "Từ bước tìm kiếm đến chốt hợp đồng, mọi quy trình đều được tích hợp trên iAgree. Bạn có thể dễ dàng theo dõi tiến độ, trao đổi với khách hàng và quản lý toàn bộ dự án trong một nền tảng duy nhất.",
      buttonText: "Hướng dẫn sử dụng cho Đối tác",
      onClick: handlePartnerGuide,
    },
    {
      imgSquare: "/assets/img/how-it-works-for-partners/squares/sq_bg_4.png",
      imgRectangle:
        "/assets/img/how-it-works-for-partners/rectangles/rtg_bg_4.png",
      title: "Nhận thù lao & Quản lý dòng tiền",
      description:
        "Mọi khoản thanh toán đều được thực hiện qua cơ chế ủy quyền, đảm bảo quyền lợi của bạn. Hệ thống quản lý tài chính giúp theo dõi thu nhập, rút tiền nhanh chóng và minh bạch trong từng giao dịch.",
      buttonText: "Hướng dẫn sử dụng Trang quản lý tài chính",
      onClick: handleWalletGuide,
    },
  ];

  return (
    <section id="user-guide-for-partners" className={styles.userGuideSection}>
      <div className={styles.container}>
        <div className={styles.title}>
          Cẩm nang sử dụng iAgree dành cho{" "}
          {isTablet ? isMobileL ? null : <br /> : null}
          <span className={styles.greenText}>Đối tác</span>
        </div>

        <div className={styles.stepsWrapper}>
          {steps.map((step, index) => (
            <div key={index} className={styles.stepCard}>
              <div className={styles.imageWrapper}>
                {!isMobileL ? (
                  <Image
                    src={step.imgSquare}
                    alt={step.title}
                    width={180}
                    height={180}
                    className={styles.image}
                  />
                ) : (
                  <Image
                    src={step.imgRectangle}
                    alt={step.title}
                    width={1000}
                    height={180}
                    className={styles.image}
                  />
                )}
              </div>

              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>{step.title}</div>
                <p className={styles.stepDescription}>{step.description}</p>

                {step.buttonText && (
                  <button
                    className={styles.ctaButton}
                    onClick={(e) => step.onClick(e)}
                  >
                    {step.buttonText}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
