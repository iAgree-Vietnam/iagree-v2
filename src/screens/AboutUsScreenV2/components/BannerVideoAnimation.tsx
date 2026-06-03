// BannerVideoAnimation.tsx
"use client";
import styles from "./BannerVideoAnimation.module.css";
import Image from "next/image";

export default function BannerVideoAnimation({} = {}) {
  return (
    <section className={styles.communityImpactSection}>
      {/* Nội dung bên trái */}
      <div className={styles.leftContent}>
        <div className={styles.mainHeading}>
          Chúng tôi tiên phong kiến tạo một thị trường dịch vụ{" "}
          <span className={styles.greenText}> toàn diện</span>
          <span className={styles.greenText}>, minh bạch</span> và
          <span className={styles.greenText}> đáng tin cậy</span>
        </div>
      </div>

      {/* Nội dung bên phải */}
      <div className={styles.rightContent}>
        <Image
          src="/assets/img/about-us/banner_about_us_v4.gif"
          alt="Cách iAgree hoạt động"
          className={styles.bannerImage} // Đã thêm className mới
          width={500}
          height={400}
          unoptimized
        />
      </div>
    </section>
  );
}
