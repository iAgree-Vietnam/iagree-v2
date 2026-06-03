import styles from "./BannerSection.module.css";
import Image from "next/image";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import Constants from "@/src/constants/Constants";
import { PartnerRouteUtils } from "@/src/data/partner/utils/PartnerRouteUtils";
import AuthRouteUtils from "@/src/data/auth/utils/AuthRouteUtils";
import ReactPlayer from "react-player";
import { useLogout } from "@/src/hooks/query/useLogout";

export function BannerSection() {
  const router = useRouter();
  const videoUrl = "/assets/img/introduce/Test 1.mp4";

  const { mutateAsync: mutateAsyncLogout } = useLogout();

  const onRegisterNow = async () => {
    try {
      await mutateAsyncLogout();
    } catch (_) {}

    Cookies.set(
      Constants.ROUTE_PRE_LOGIN,
      PartnerRouteUtils.toPartnerRegisterGetStart()
    );

    router.push(AuthRouteUtils.toRegisterBecomePartner());
  };

  return (
    <section id="banner-section" className={styles.heroWrapper}>
      <div className={styles.videoBackground}>
        <ReactPlayer
          src={videoUrl}
          loop={true}
          playing={true}
          muted={true}
          width="100%"
          height="100%"
          controls={false}
          className={styles.backgroundPlayer}
        />
        <div className={styles.videoOverlay} />
      </div>

      <div className={styles.heroSection}>
        <Image
          alt={"iagree"}
          src={"/assets/img/logo_white.svg"}
          width={250}
          height={120}
          style={{
            objectFit: "contain",
          }}
        />
        <div className={styles.heroTitle}>
          NỀN TẢNG KẾT NỐI <br />
          <span className={styles.textGreen}>DỊCH VỤ TOÀN DIỆN</span>
        </div>
        <div className={styles.heroSubtitle}>
          Kết nối với hàng nghìn Khách hàng trong đa dạng lĩnh vực. Trở thành
          Đối tác iAgree ngay hôm nay.
        </div>
        <button className={styles.heroButton} onClick={onRegisterNow}>
          ĐĂNG KÝ NGAY
        </button>
      </div>
    </section>
  );
}
