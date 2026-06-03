
import Image from "next/image";
import styles from "./AboutSection.module.css";

export function AboutSection() {
  return (
    <section id="about-section" className={styles.aboutSection}>
      {/* Background Image */}
      <div className={styles.backgroundImage} />
      {/* Black Overlay */}
      <div className={styles.blackOverlay} />

      <div className={styles.aboutContainer}>
        <div className={styles.aboutGrid}>
          {/* Image */}
          <div className={styles.aboutImageWrapper}>
            <Image
              src="/assets/img/introduce/office_freelance_v1.png"
              alt="Modern Office Workspace"
              className={styles.aboutImage}
              width={700}
              height={550}
              priority
            />
          </div>

          {/* Content */}
          <div className={styles.aboutContent}>
            <h2 className={styles.aboutTitle}>
              NỀN TẢNG <span className={styles.aboutHighlight}>IAGREE</span>
            </h2>

            <div className={styles.aboutTextContainer}>
              <span className={styles.aboutHighlight}>
                iAgree là nền tảng trực tuyến kết nối Đối tác (freelancer,
                chuyên gia, tài năng)
              </span>{" "}
              với Khách hàng trong nhiều lĩnh vực, giúp hai bên dễ dàng hợp tác,
              xác nhận công việc và thực hiện công việc một cách{" "}
              <span className={styles.aboutHighlight}>an toàn, minh bạch</span>.
              <br />
              <br />
              Xuất phát từ nhu cầu về một môi trường làm việc tự do nhưng vẫn có
              <span className={styles.aboutHighlight}>
                {" "}
                ràng buộc pháp lý rõ ràng
              </span>
              , iAgree mang đến{" "}
              <span className={styles.aboutHighlight}>
                giải pháp triệt để cho các vấn đề lừa đảo, tranh chấp
              </span>{" "}
              và thanh toán không đúng cam kết.
              <br />
              <br />
            </div>

            <div className={styles.aboutQuoteBox}>
              <div className={styles.aboutQuoteText}>
                Với iAgree, chúng tôi xây dựng một nền tảng kết nối công việc{" "}
                <span className={styles.aboutHighlight}>
                  nhanh chóng, tiện lợi{" "}
                </span>
                và{" "}
                <span className={styles.aboutHighlight}>
                  tuân thủ pháp luật,{" "}
                </span>
                hướng đến sự hợp tác{" "}
                <span className={styles.aboutHighlight}>
                  uy tín, công bằng{" "}
                </span>
                và <span className={styles.aboutHighlight}>bền vững </span>
                cho tất cả các bên.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
