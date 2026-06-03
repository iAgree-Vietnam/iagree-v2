// BreakthroughPaymentSolutionSection_2.tsx
"use client";


import styles from "./BreakthroughPaymentSolutionSection_2.module.css";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import { useRouter } from "next/router";
import { useAccountContext } from "@/src/contexts/AccountContext";
import AuthRouteUtils from "@/src/data/auth/utils/AuthRouteUtils";

const BreakthroughPaymentSolutionSection_2 = () => {
  const router = useRouter();
  const accountContext = useAccountContext();
  const fullProfileResource = accountContext.auth;

  const isLoggedIn = accountContext.isLoggedIn;
  const isValidUser =
    fullProfileResource &&
    fullProfileResource.userId &&
    fullProfileResource?.fullName;
  const isActuallyLoggedIn = isLoggedIn && isValidUser;

  const handleRegister = () => {
    if (!isActuallyLoggedIn) {
      router.push(AuthRouteUtils.toCheckRole());
      return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainBox}>
        {/* Khối hình ảnh ở bên trái */}
        <div className={styles.rightContent}>
          <div className={styles.imageBox}>
            <div className={styles.greenBackground}></div>
            <img
              src="/assets/img/how-it-work/break_throught_img_2.png" // Cập nhật đường dẫn hình ảnh thực tế
              alt="Payment process illustration"
              className={styles.paymentImage}
            />
          </div>
        </div>
        {/* Khối nội dung ở bên phải */}
        <div className={styles.leftContent}>
          <div className={styles.paymentSecurity}>
            <div className={styles.lockIcon}>
              <IconSvgLocal name="IC_PEOPLE" className={styles.svg} />
            </div>
            <div className={styles.paymentTitle}>Tìm kiếm nhanh chóng</div>
          </div>
          <div className={styles.description}>
            iAgree cung cấp danh sách Đối tác, chuyên gia và tài năng đa dạng
            trong nhiều lĩnh vực, với thông tin đầy đủ, minh bạch và dễ so sánh.
          </div>
          <div className={styles.description}>
            Công cụ gợi ý thông minh giúp bạn nhanh chóng tìm ra những Đối tác
            phù hợp nhất, tiết kiệm tối đa thời gian và công sức.{" "}
          </div>
          <button
            className={styles.registerButton}
            onClick={handleRegister}
            style={{ visibility: isActuallyLoggedIn ? "hidden" : "visible" }}
          >
            Đăng ký miễn phí
          </button>{" "}
        </div>
      </div>
    </div>
  );
};

export default BreakthroughPaymentSolutionSection_2;
