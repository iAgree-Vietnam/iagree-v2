// BannerVideoAnimation.tsx
"use client";
import { Button } from "antd";
import styles from "./BannerAboutUsSection.module.css";
import Image from "next/image";
import { useRouter } from "next/router";
import AboutUsRouteUtils from "@/src/data/aboutus/utils/AboutUsRouteUtils";

type BannerAboutUsSectionProps = {
  homeInitResource: any;
};

const BannerAboutUsSection: React.FC<BannerAboutUsSectionProps> = ({
  homeInitResource,
}) => {
  const router = useRouter();
  const onRegisterNow = () => {
    router.push(AboutUsRouteUtils.toScreen());
  };

  return (
    <section className={styles.communityImpactSection}>
      {/* Nội dung bên trái */}
      <div className={styles.leftContent}>
        <div className={styles.mainHeading}>
          {homeInitResource.aboutUs?.name || "Về chúng tôi"}
        </div>
        <div className={styles.description}>
          iAgree là
          <span className={styles.greenText}>
            {" "}
            nền tảng kết nối dịch vụ toàn diện,{" "}
          </span>
          giúp Khách hàng và Đối tác hợp tác{" "}
          <span className={styles.greenText}>
            an toàn – minh bạch – hiệu quả.
          </span>{" "}
          <br />
          Với hợp đồng điện tử, công cụ quản lý tiến độ và cơ chế thanh toán ủy
          quyền, iAgree mang đến chuẩn mực mới cho thị trường lao động và cung
          cấp dịch vụ tại Việt Nam.
        </div>
        <Button
          type="primary"
          size="large"
          className={styles.postJobButton}
          onClick={onRegisterNow}
        >
          Tìm hiểu thêm
        </Button>
      </div>

      {/* Nội dung bên phải */}
      <div className={styles.rightContent}>
        <video
          src="/assets/img/about-us/banner_about_us_v4.webm"
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

export default BannerAboutUsSection;
