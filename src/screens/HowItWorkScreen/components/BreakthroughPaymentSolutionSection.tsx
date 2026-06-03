// BreakthroughPaymentSolutionSection.tsx
"use client";


import styles from "./BreakthroughPaymentSolutionSection.module.css";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import { useRouter } from "next/router";
import { useAccountContext } from "@/src/contexts/AccountContext";
import AuthRouteUtils from "@/src/data/auth/utils/AuthRouteUtils";

const BreakthroughPaymentSolutionSection = () => {
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
              <IconSvgLocal name="IC_MONEY" className={styles.svg} />
            </div>
            <div className={styles.paymentTitle}>An tâm thanh toán</div>
          </div>
          <div className={styles.description}>
            Khác biệt với các nền tảng khác, iAgree áp dụng cơ chế thanh toán ủy
            quyền, giữ tiền an toàn và chỉ giải ngân khi công việc được nghiệm
            thu đúng cam kết.
          </div>
          <div className={styles.description}>
            Khách hàng hoàn toàn yên tâm, không lo rủi ro mất tiền ngay cả khi
            Đối tác ngừng hợp đồng, chậm tiến độ hoặc phát sinh tranh chấp.
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
              src="/assets/img/how-it-work/break_throught_img_1.png"
              alt="Payment process illustration"
              className={styles.paymentImage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreakthroughPaymentSolutionSection;
