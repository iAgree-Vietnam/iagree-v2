"use client";

import React, { useState } from "react";
import {
  UsergroupAddOutlined,
  DollarCircleOutlined,
  SolutionOutlined,
  FileTextOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import styles from "./BenefitsPartnerSection.module.css";

const BenefitsPartnerSection: React.FC = () => {
  const [hoveredBenefit, setHoveredBenefit] = useState<number | null>(null);

  const benefitsData = [
    {
      icon: <UsergroupAddOutlined />,
      title: "Là những Đối tác đầu tiên",
      description:
        "Với vai trò là những Đối tác tiên phong trên nền tảng iAgree, bạn sẽ có cơ hội tiếp cận sớm với các dự án chất lượng cao và xây dựng thương hiệu cá nhân bền vững trước khi thị trường trở nên cạnh tranh hơn.",
    },
    {
      icon: <DollarCircleOutlined />,
      title: "Miễn phí Phí nền tảng",
      description:
        "Tận hưởng ưu đãi miễn phí hoàn toàn phí nền tảng cho 03 giao dịch đầu tiên của bạn trong tháng. Đây là cơ hội tuyệt vời để bạn tối đa hóa lợi nhuận và trải nghiệm dịch vụ của iAgree mà không phải lo lắng về chi phí.",
    },
    {
      icon: <SolutionOutlined />,
      title: "Ưu tiên gửi thông tin công việc",
      description:
        "Hệ thống thông minh của iAgree sẽ ưu tiên gửi đến bạn những tin đăng công việc phù hợp nhất với kinh nghiệm, kỹ năng và lĩnh vực chuyên môn của bạn. Điều này giúp bạn tiết kiệm thời gian tìm kiếm và tập trung vào các dự án tiềm năng.",
    },
    {
      icon: <FileTextOutlined />,
      title: "Hỗ trợ tạo dựng hồ sơ",
      description:
        "iAgree sẽ đồng hành cùng bạn trong việc xây dựng một hồ sơ chuyên nghiệp và ấn tượng. Từ việc tối ưu hóa nội dung đến thiết kế trực quan, chúng tôi đảm bảo hồ sơ của bạn sẽ nổi bật và thu hút sự chú ý của Khách hàng tiềm năng.",
    },
  ];

  // Define the click handler function
  const handleGiftCardClick = () => {};

  return (
    <section id="benefits-section" className={styles.benefitsSection}>
      <div className={styles.container}>
        {/* Background Image and Overlay */}
        {/* <div className={styles.backgroundImage} />
        <div className={styles.blackOverlay} /> */}

        <div className={styles.mainTitle}>
          Quyền lợi{" "}
          <span className={styles.greenText}>Đối tác sáng lập tại iAgree</span>
        </div>
        <div className={styles.benefitsGrid}>
          {benefitsData.map((benefit, index) => (
            <div
              key={index}
              className={`${styles.benefitCard} ${
                hoveredBenefit === index ? styles.hovered : ""
              }`}
              onMouseEnter={() => setHoveredBenefit(index)}
              onMouseLeave={() => setHoveredBenefit(null)}
            >
              <div className={styles.iconContainer}>{benefit.icon}</div>
              <div className={styles.cardTitle}>{benefit.title}</div>
              <div className={styles.descriptionWrapper}>
                <div className={styles.cardDescription}>
                  {benefit.description}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.giftCard} onClick={handleGiftCardClick}>
          <div className={styles.giftContent}>
            <div className={styles.giftIconWrapper}>
              <GiftOutlined className={styles.giftIcon} />
            </div>
            <div className={styles.giftText}>
              Tặng ngay <span className={styles.giftAmount}>20 Cơ Hội </span>{" "}
              khi đăng ký trở thành Đối tác
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsPartnerSection;
