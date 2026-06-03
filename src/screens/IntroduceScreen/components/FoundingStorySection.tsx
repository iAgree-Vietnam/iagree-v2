
import Image from "next/image";
import styles from "./FoundingStorySection.module.css";

export function FoundingStorySection() {
  return (
    <section
      id="founding-story-section"
      className={styles.foundingStorySection}
    >
      <div className={styles.backgroundImage} />
      <div className={styles.blackOverlay} />

      <div className={styles.contentContainer}>
        <div className={styles.imageWrapper}>
          <Image
            src="/assets/img/introduce/ceo_img.png"
            alt="Daniel Nguyễn - Nhà sáng lập iAgree"
            width={400}
            height={500}
            className={styles.founderImage}
          />
        </div>
        <div className={styles.textWrapper}>
          <div className={styles.mainTitle}>
            CÂU CHUYỆN <span className={styles.greenText}>SÁNG LẬP</span>
          </div>

          <div className={styles.storyText}>
            Thị trường lao động tự do (freelancer) và cung cấp dịch vụ chuyên
            nghiệp tại Việt Nam đã phát triển mạnh mẽ, nhưng vẫn còn nhiều rào
            cản.
            <span className={styles.greenText}>
              {" "}
              Không ít freelancer và các cá nhân/tổ chức cung cấp dịch vụ dù làm
              việc hết mình vẫn có thể mất trắng thu nhập chỉ vì không có hợp
              đồng ràng buộc pháp lý hoặc có hợp đồng nhưng quy định lỏng lẻo.
            </span>{" "}
            Ở chiều ngược lại,{" "}
            <span className={styles.greenText}>
              Khách hàng cũng gặp rủi ro khi không thể xác thực năng lực Đối
              tác, không có đơn vị trung gian quản lý, giám sát thực hiện giao
              dịch
            </span>{" "}
            dẫn đến những công việc, dự án dở dang, thiếu minh bạch và tranh
            chấp khó giải quyết.
          </div>
          <div className={styles.storyText}>
            Tôi đã chứng kiến nhiều câu chuyện đáng tiếc: cá nhân/tổ chức cung
            cấp dịch vụ hoàn thành xong dự án nhưng không nhận được thanh toán;
            hay Khách hàng bỏ ra khoản phí lớn nhưng sản phẩm không đạt yêu cầu,
            không biết nhờ ai bảo vệ quyền lợi. Những vấn đề này không chỉ làm
            mất niềm tin mà còn kìm hãm sự phát triển của thị trường.
          </div>

          <div className={styles.storyText}>
            <span className={styles.greenText}>
              iAgree ra đời để xóa bỏ những rào cản đó - trở thành nền tảng kết
              nối dịch vụ toàn diện, giúp cá nhân/tổ chức cung cấp dịch vụ và
              Khách hàng làm việc an toàn - chuyên nghiệp - hiệu quả hơn bao giờ
              hết.
            </span>{" "}
            Với hệ thống hợp đồng điện tử, công cụ quản lý minh bạch và quy
            trình thanh toán uỷ quyền hợp pháp, iAgree mang đến một chuẩn mực
            mới cho thị trường lao động tại Việt Nam.
          </div>
          <div className={styles.signatureWrapper}>
            <Image
              src="/assets/img/introduce/signature_ceo.png"
              alt="Daniel Nguyễn - Nhà sáng lập iAgree"
              width={250}
              height={80}
            />
            <div className={styles.signatureSubtext}>
              {" "}
              Luật sư Nguyễn Đức Anh (Daniel)
            </div>
            <div className={styles.signatureSubtext}>
              Nhà sáng lập | Chủ tịch HĐQT Công ty A&D TECH{" "}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
