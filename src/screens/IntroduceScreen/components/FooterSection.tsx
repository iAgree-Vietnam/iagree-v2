
import Image from "next/image";
import styles from "./FooterSection.module.css";
import Link from "next/link";
import { IconSvgLocal } from "@/src/components/icon-svg-local";

function FooterSection() {
  return (
    <footer
      style={{
        transition: "0.25s",
      }}
      className={styles.footerSection}
    >
      <div className={styles.container}>
        <div className={styles.footerContent}>
          {/* Cột thông tin công ty */}
          <div className={styles.companyInfoColumn}>
            <div className={styles.logoWrapper}>
              <Image
                alt="iagree"
                src="/assets/img/logo.svg"
                width={120}
                height={40}
              />
            </div>
            <div className={styles.companyTitle}>
              Công ty Cổ phần CÔNG NGHỆ A&D
            </div>
            <div className={styles.businessIdTitle}>Đăng ký kinh doanh số:</div>
            <div className={styles.businessId}>
              0317786329 cấp ngày 13/04/2023 tại Sở Kế Hoạch & Đầu Tư TPHCM
            </div>
            <div className={styles.addressTitle}>Địa chỉ trụ sở:</div>
            <div className={styles.address}>
              Lầu 5, số 256 Nguyễn Thị Minh Khai, Phường Xuân Hoà, TP. Hồ Chí
              Minh, Việt Nam
            </div>
            <div className={styles.mailTitle}>Mail liên hệ</div>
            <div className={styles.mail}>support@iagree.vn</div>

            <div className={styles.bctLogoWrapper}>
              <Link
                target="_blank"
                href={"http://online.gov.vn/Website/chi-tiet-132417"}
                className={styles.bctLogoBackground}
              >
                <img
                  style={{ maxWidth: 150 }}
                  alt="Đã đăng ký Bộ Công Thương"
                  title="Đã đăng ký Bộ Công Thương"
                  src={"/assets/img/logoCCDV.png"}
                />
              </Link>
            </div>
          </div>

          {/* Cột Google Maps */}
          {/* <div className={styles.mapColumn}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.485449878111!2d106.68688527473988!3d10.774082459237594!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3b5d3542d1%3A0x8f9fcdf3a4eb088f!2zMjU2IE5ndXnhu4VuIFRo4buLIE1pbmggS2hhaSwgUGjGsOG7nW5nIDYsIFF14bqtbiAzLCBI4buTIENow60gTWluaCwgVmlldG5hbQ!5e0!3m2!1sen!2sus!4v1756458154177!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0, borderRadius: "8px" }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div> */}
        </div>

        {/* Phần dưới cùng */}
        <div className={styles.bottomSection}>
          <div className={styles.socialIcons}>
            <Link href="https://www.facebook.com/iagreevietnam.official">
              <IconSvgLocal
                name="IC_FACEBOOK"
                width={24}
                height={24}
                fill="#000000"
              />
            </Link>
            <Link href="https://www.instagram.com/iagree.vn">
              <IconSvgLocal
                name="IC_INSTAGRAM"
                width={24}
                height={24}
                fill="#000000"
              />
            </Link>
            <Link href="https://www.linkedin.com/company/iagreevietnam">
              <IconSvgLocal
                name="IC_LINKEDIN"
                width={24}
                height={24}
                fill="#000000"
              />
            </Link>
          </div>
          <div className={styles.copyright}>
            © A&D 2025. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

export default FooterSection;
