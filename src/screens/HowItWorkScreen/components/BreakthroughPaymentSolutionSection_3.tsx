// BreakthroughPaymentSolutionSection.tsx
"use client";


import styles from "./BreakthroughPaymentSolutionSection_3.module.css";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import { useRouter } from "next/router";
import { useAccountContext } from "@/src/contexts/AccountContext";
import AuthRouteUtils from "@/src/data/auth/utils/AuthRouteUtils";

const BreakthroughPaymentSolutionSection_3 = () => {
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
        <div className={styles.leftContent}>
          <div className={styles.paymentSecurity}>
            <div className={styles.lockIcon}>
              <IconSvgLocal name="IC_TIMER" className={styles.svg} />
            </div>
            <div className={styles.paymentTitle}>Tiết kiệm thời gian</div>
          </div>
          <div className={styles.description}>
            iAgree đơn giản hóa toàn bộ bước kết nối, thống nhất công việc và
            thanh toán, giúp bạn hợp tác nhanh chóng và thuận tiện.
          </div>
          <button
            className={styles.registerButton}
            onClick={handleRegister}
            style={{ visibility: isActuallyLoggedIn ? "hidden" : "visible" }}
          >
            Đăng ký miễn phí
          </button>{" "}
        </div>
        <div className={styles.rightContent}>
          <div className={styles.imageBox}>
            <div className={styles.greenBackground}></div>
            <img
              src="/assets/img/how-it-work/break_throught_img_3.png"
              alt="Payment process illustration"
              className={styles.paymentImage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreakthroughPaymentSolutionSection_3;
