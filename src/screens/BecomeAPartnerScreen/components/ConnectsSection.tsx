"use client";


import styles from "./ConnectsSection.module.css";
import { Typography, Row, Col } from "antd";
import { IconSvgLocal } from "@/src/components/icon-svg-local";

type StatIconNameV2 =
  | "IC_HOW_TO_USE"
  | "IC_MORE_CHANCE"
  | "IC_QUESTION_V1"
  | "IC_REFUND_POLICY"
  | "IC_TAKE_A_CHANCE"
  | "IC_TRACK_AND_MANAGE";

const sliderData = [
  {
    title: "1. Cơ Hội là gì ?",
    image: "/assets/img/introduce/bg_connects.jpg",
    content: (
      <>
        <div>
          Đơn vị dùng để ứng tuyển công việc, tăng hiển thị hồ sơ và thể hiện
          bạn sẵn sàng làm việc.
        </div>
        <div>
          Có thể tích lũy, mua hoặc nhận miễn phí. Cơ Hội được cộng dồn hàng
          tháng, hết hạn sau 12 tháng.
        </div>
      </>
    ),
  },
  {
    title: "2. Cách sử dụng",
    image: "/assets/img/introduce/bg_connects.jpg",
    content: (
      <div>
        Ứng tuyển công việc: Mỗi công việc yêu cầu số Cơ Hội khác nhau (hiển thị
        trong tin đăng).
      </div>
    ),
  },
  {
    title: "3. Nhận Cơ Hội miễn phí hàng tháng",
    image: "/assets/img/introduce/bg_connects.jpg",
    content: (
      <ul className={styles.bulletList}>
        <li>Tài khoản Basic: 10 Cơ Hội / tháng</li>
        <li>Tài khoản Plus: 50 Cơ Hội / tháng (cần nâng cấp tài khoản)</li>
        <li>Tài khoản Pro: 100 Cơ Hội / tháng (cần nâng cấp tài khoản)</li>
      </ul>
    ),
  },
  {
    title: "4. Cách nhận thêm Cơ Hội",
    image: "/assets/img/introduce/bg_connects.jpg",
    content: (
      <ul className={styles.bulletList}>
        <li>Hoàn thiện hồ sơ khi mới gia nhập nền tảng.</li>
        <li>
          Đạt được 1 trong 3 điều sau:
          <div className={styles.subList}>
            <span>+ Hoàn tất 3 công việc đầu tiên.</span>
            <br />
            <span>+ Duy trì tỷ lệ phản hồi trên 90%.</span>
            <br />
            <span>+ Nhận đánh giá 5* từ Khách hàng.</span>
          </div>
        </li>
        <li>Hoàn thành các chương trình đào tạo chính thức từ iAgree.</li>
      </ul>
    ),
  },
  {
    title: "5. Chính sách hoàn trả",
    image: "/assets/img/introduce/bg_connects.jpg",
    content: (
      <>
        <div>
          <span className={styles.strongText}>Được hoàn:</span> Công việc bị
          Khách hàng hủy trước khi có bất kỳ Đối tác nào được thuê, hoặc bị gỡ
          do vi phạm chính sách.
        </div>
        <div>
          <span className={styles.strongText}>Không hoàn:</span> Khách hàng
          không lựa chọn bạn, tin đăng công việc hết hạn, Đối tác tự hủy đề
          xuất.
        </div>
      </>
    ),
  },
  {
    title: "6. Theo dõi & Quản lý",
    image: "/assets/img/introduce/bg_connects.jpg",
    content: (
      <>
        <div>
          Partner có thể kiểm tra số dư Cơ Hội và lịch sử giao dịch tại trang
          “Tài khoản của tôi”.
        </div>
        <div>
          Cơ Hội chưa sử dụng sẽ được chuyển sang tháng tiếp theo và có thời hạn
          tối đa 12 tháng.
        </div>
        <div>
          iAgree cung cấp báo cáo lịch sử sử dụng theo mốc 7, 30 và 90 ngày.
        </div>
      </>
    ),
  },
];

const iconNames: StatIconNameV2[] = [
  "IC_QUESTION_V1",
  "IC_HOW_TO_USE",
  "IC_TAKE_A_CHANCE",
  "IC_MORE_CHANCE",
  "IC_REFUND_POLICY",
  "IC_TRACK_AND_MANAGE",
];

const connectsFeatures = sliderData.map((item, index) => ({
  title: item.title,
  description: item.content,
  icon: iconNames[index],
}));

export const ConnectsSection = () => {
  return (
    <section id="connects-section" className={styles.sectionContainer}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.mainTitle}>
            {" "}
            Hiểu thế nào về <span className={styles.greenText}>CƠ HỘI?</span>
          </div>
        </div>
        <Row gutter={[24, 24]} className={styles.gridContainer}>
          {connectsFeatures.map((feature, index) => (
            <Col key={index} xs={24} md={12} xl={24}>
              <div className={styles.card}>
                <div className={styles.headerContentWrapper}>
                  <div className={styles.iconWrapper}>
                    <IconSvgLocal
                      name={feature.icon}
                      className={styles.statIcon}
                    />
                  </div>
                  <div className={styles.cardTitle}>{feature.title}</div>
                </div>
                <div className={styles.cardDescription}>
                  {feature.description}
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};
