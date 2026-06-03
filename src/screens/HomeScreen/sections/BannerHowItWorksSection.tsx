// BannerVideoAnimation.tsx
"use client";
import { Button } from "antd";
import styles from "./BannerHowItWorksSection.module.css";
import Image from "next/image";
import { useRouter } from "next/router";
import AboutUsRouteUtils from "@/src/data/aboutus/utils/AboutUsRouteUtils";

type BannerAboutUsSectionProps = {};

const BannerHowItWorksSection: React.FC<BannerAboutUsSectionProps> = ({}) => {
  const router = useRouter();
  const onRegisterNow = () => {
    router.push(AboutUsRouteUtils.toHowItWorkScreen());
  };

  return (
    <section className={styles.communityImpactSection}>
      {/* Nội dung bên trái */}
      <div className={styles.leftContent}>
        <div className={styles.mainHeading}>Hướng dẫn sử dụng iAgree</div>
        <div className={styles.description}>
          Khám phá cách iAgree giúp bạn đăng việc, nhận việc và hợp tác an toàn
          chỉ trong vài bước đơn giản. Từ{" "}
          <span className={styles.greenText}>
            đăng tải, kết nối, ký hợp đồng
          </span>{" "}
          đến <span className={styles.greenText}>thanh toán</span> – tất cả đều{" "}
          <span className={styles.greenText}>minh bạch và thuận tiện</span> trên
          một nền tảng duy nhất.
        </div>
        <Button
          type="primary"
          size="large"
          className={styles.postJobButton}
          onClick={onRegisterNow}
        >
          Xem hướng dẫn chi tiết
        </Button>
      </div>

      {/* Nội dung bên phải */}
      <div className={styles.rightContent}>
        <video
          src="/assets/img/how-it-work/gif_banner.webm" // Đã thay đổi từ .png sang .gif
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

export default BannerHowItWorksSection;
