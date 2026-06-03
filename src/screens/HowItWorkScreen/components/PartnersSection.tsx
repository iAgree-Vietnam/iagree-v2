
import Image from "next/image";
import styles from "./PartnersSection.module.css";
import useIsMobile from "../../HomeScreen/hooks/useIsMobile";

const partners = [
  { src: "/assets/img/partners/partner-1.png", alt: "Viettel CA" },
  { src: "/assets/img/partners/partner-2.png", alt: "Appota" },
  { src: "/assets/img/partners/partner-3.png", alt: "AAA" },
  { src: "/assets/img/partners/partner-4.png", alt: "BUFF" },
  { src: "/assets/img/partners/partner-5.png", alt: "Momo" },
  { src: "/assets/img/partners/partner-6.png", alt: "Zalo" },
  { src: "/assets/img/partners/partner-7.png", alt: "Viettel" },
  { src: "/assets/img/partners/partner-8.png", alt: "ZaloPay" },
  { src: "/assets/img/partners/partner-9.png", alt: "VNPAY" },
  { src: "/assets/img/partners/partner-10.png", alt: "Vietcombank" },
  { src: "/assets/img/partners/partner-11.png", alt: "247Express" },
  { src: "/assets/img/partners/partner-12.png", alt: "Misa" },
];

export function PartnersSection() {
  const isMobileAndTablet = useIsMobile(768);

  return (
    <section id="partners-section-v2" className={styles.partnersSection}>
      <div className={styles.partnersTitle}>
        <span className={styles.greenText}>ĐỐI TÁC ĐỒNG HÀNH CÙNG  </span>
        <img
          alt={"IAGREE logo"}
          src={"/assets/img/logo.svg"}
          className={styles.logo}
        />
      </div>

      <div className={styles.partnersContainer}>
        {/* Nếu là mobile/tablet nhỏ thì chạy marquee, ngược lại dùng grid */}
        {isMobileAndTablet ? (
          <div className={styles.marquee}>
            <div className={styles.marqueeContent}>
              {partners.concat(partners).map((partner, index) => (
                <div key={index} className={styles.partnerLogoWrapper}>
                  <Image
                    src={partner.src}
                    alt={partner.alt}
                    width={120}
                    height={60}
                    style={{
                      objectFit: partner.alt === "Misa" ? "cover" : "contain",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.partnersGrid}>
            {partners.map((partner, index) => (
              <div key={index} className={styles.partnerLogoWrapper}>
                <Image
                  src={partner.src}
                  alt={partner.alt}
                  width={150}
                  height={80}
                  style={{
                    objectFit: partner.alt === "Misa" ? "cover" : "contain",
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
