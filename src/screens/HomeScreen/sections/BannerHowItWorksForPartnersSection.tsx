// BannerVideoAnimation.tsx
"use client";
import { Button } from "antd";
import styles from "./BannerHowItWorksForPartnersSection.module.css";
import Image from "next/image";
import { useRouter } from "next/router";
import { PartnerRouteUtils } from "@/src/data/partner/utils/PartnerRouteUtils";

type BannerHowItWorksForPartnersSectionProps = {};

const BannerHowItWorksForPartnersSection: React.FC<
  BannerHowItWorksForPartnersSectionProps
> = ({}) => {
  const router = useRouter();
  const onDetail = () => {
    router.push(PartnerRouteUtils.toHowItWorksForPartners());
  };

  return (
    <section className={styles.communityImpactSection}>
      {/* Nội dung bên trái */}
      <div className={styles.leftContent}>
        <div className={styles.mainHeading}>Cẩm nang Đối tác</div>
        <div className={styles.description}>
          Khám phá cách trở thành{" "}
          <span className={styles.greenText}>Đối tác chuyên nghiệp</span> cùng
          iAgree – nơi bạn dễ dàng tìm kiếm{" "}
          <span className={styles.greenText}>dự án phù hợp</span>,{" "}
          <span className={styles.greenText}>quản lý công việc</span> và nhận{" "}
          <span className={styles.greenText}>thanh toán minh bạch</span>.
          <br />
          Từ xây dựng hồ sơ, chào giá, ký hợp đồng đến hoàn thiện dự án – tất cả
          được iAgree hỗ trợ trọn vẹn trên một nền tảng duy nhất, giúp bạn tự
          tin phát triển sự nghiệp Freelancer{" "}
          <span className={styles.greenText}>an toàn và bền vững</span>.
        </div>
        <Button
          type="primary"
          size="large"
          className={styles.postJobButton}
          onClick={onDetail}
        >
          Xem chi tiết
        </Button>
      </div>

      {/* Nội dung bên phải */}
      <div className={styles.rightContent}>
        <video
          src="/assets/img/how-it-works-for-partners/how_it_works_for_partners.webm" // Đã thay đổi từ .png sang .gif
          // alt="Cách iAgree hoạt động"
          className={styles.bannerImage} // Đã thêm className mới
          width={500}
          height={400}
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
    </section>
  );
};

export default BannerHowItWorksForPartnersSection;
