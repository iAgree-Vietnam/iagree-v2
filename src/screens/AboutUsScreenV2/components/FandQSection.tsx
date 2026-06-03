// FandQSection.tsx
"use client";

import React, { useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import styles from "./FandQSection.module.css";

const faqData1 = [
  {
    id: 1,
    question: "iAgree có uy tín và an toàn không?",
    answer: (
      <div>
        Có. <span className={styles.greenTextPrimary}>iAgree</span> được xây
        dựng bởi đội ngũ luật sư, kế toán, giám đốc nhân sự, giám đốc kinh doanh
        cấp cao đã và đang làm việc cho những tập đoàn đa quốc gia hàng đầu,
        hướng đến một nền tảng{" "}
        <span className={styles.greenTextPrimary}>
          {" "}
          kết nối công việc minh bạch và chuyên nghiệp
        </span>
        , với hệ thống hợp đồng giao dịch điện tử và thanh toán uỷ quyền giúp
        đảm bảo quyền lợi của cả Khách hàng và Đối Tác.
      </div>
    ),
  },
  {
    id: 2,
    question: "iAgree có được cơ quan nào chứng nhận hay quản lý không?",
    answer: (
      <div>
        Có. <span className={styles.greenTextPrimary}>iAgree</span> đã được{" "}
        <span className={styles.greenTextPrimary}>
          Bộ Công Thương cấp phép và xác nhận đăng ký website thương mại điện tử
        </span>
        , đảm bảo hoạt động đúng pháp luật Việt Nam và tuân thủ quy định bảo vệ
        người tiêu dùng.
      </div>
    ),
  },
  {
    id: 3,
    question: "Quy trình làm việc trên iAgree như thế nào?",
    answer: (
      <ul className={styles.ulList}>
        <li>Khách hàng đăng dự án hoặc gửi lời mời cho công việc cho bạn.</li>
        <li>Bạn nộp đề xuất/ứng tuyển.</li>
        <li>
          Nếu Khách hàng chọn bạn, hợp đồng sẽ được tạo và Khách hàng thanh toán
          uỷ quyền cho <span className={styles.greenTextPrimary}>iAgree</span>{" "}
          giữ tiền.
        </li>
        <li>
          Bạn hoàn thành công việc và nhận thanh toán khi Khách hàng phê duyệt.
        </li>
      </ul>
    ),
  },
];

const faqData2 = [
  {
    id: 4,
    question: "Tôi có thể tin tưởng iAgree trong giải quyết tranh chấp không?",
    answer: (
      <div>
        Có. <span className={styles.greenTextPrimary}>iAgree</span> có cơ chế{" "}
        <span className={styles.greenTextPrimary}>
          {" "}
          giải quyết tranh chấp minh bạch
        </span>
        , dựa trên hợp đồng điện tử, lịch sử trao đổi và cam kết từ cả hai bên.
        Điều này giúp bạn được bảo vệ quyền lợi tối đa khi có vấn đề phát sinh
      </div>
    ),
  },
  {
    id: 5,
    question:
      "Khi đăng công việc để tìm Đối tác, tôi có mất chi phí nào không?",
    answer: (
      <div>
        Không. <span className={styles.greenTextPrimary}>iAgree</span> miễn phí
        Phí nền tảng dành cho Khách Hàng khi đăng công việc và kết nối với Đối
        Tác.
      </div>
    ),
  },
  {
    id: 6,
    question:
      "Cơ chế thanh toán ủy quyền cho iAgree là gì và lợi ích của cơ chế này?",
    answer: (
      <div>
        Thanh toán ủy quyền nghĩa là Khách hàng sẽ chuyển toàn bộ chi phí dự án
        cho <span className={styles.greenTextPrimary}>iAgree</span> ngay sau khi
        hợp đồng được xác nhận. Số tiền này sẽ được{" "}
        <span className={styles.greenTextPrimary}>iAgree</span> tạm giữ và chỉ
        giải ngân cho Đối tác sau khi công việc đã được nghiệm thu thành công.
        <br />
        <br />
        Cơ chế này mang lại lợi ích cho cả đôi bên:
        <ul>
          <li>
            <b>Đối với Khách hàng:</b> Đảm bảo chỉ thanh toán khi nhận đúng sản
            phẩm hoặc dịch vụ đã cam kết.
          </li>
          <li>
            <b>Đối với Đối tác:</b> Được bảo vệ quyền lợi, tránh rủi ro bị chậm
            hoặc từ chối thanh toán.
          </li>
        </ul>
      </div>
    ),
  },
];

export function FandQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleToggle = (id: number) => {
    setActiveIndex(activeIndex === id ? null : id);
  };

  return (
    <section id="faq-section" className={styles.faqSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Các câu hỏi{" "}
            <span className={styles.greenTextPrimary}>thường gặp</span>
          </h2>
          <div className={styles.underline}></div>
        </div>

        <div className={styles.accordionTwoColumns}>
          <div className={styles.accordionColumn}>
            {faqData1.map((item) => (
              <div key={item.id} className={styles.accordionItem}>
                <button
                  className={styles.accordionButton}
                  onClick={() => handleToggle(item.id)}
                >
                  <div className={styles.accordionButtonContent}>
                    <span className={styles.buttonText}>{item.question}</span>
                    <DownOutlined
                      className={`${styles.downArrow} ${
                        activeIndex === item.id ? styles.rotated : ""
                      }`}
                    />
                  </div>
                </button>
                <div
                  className={`${styles.answerContent} ${
                    activeIndex === item.id ? styles.active : styles.inActive
                  }`}
                >
                  {item.answer}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.accordionColumn}>
            {faqData2.map((item) => (
              <div key={item.id} className={styles.accordionItem}>
                <button
                  className={styles.accordionButton}
                  onClick={() => handleToggle(item.id)}
                >
                  <div className={styles.accordionButtonContent}>
                    <span className={styles.buttonText}>{item.question}</span>
                    <DownOutlined
                      className={`${styles.downArrow} ${
                        activeIndex === item.id ? styles.rotated : ""
                      }`}
                    />
                  </div>
                </button>
                <div
                  className={`${styles.answerContent} ${
                    activeIndex === item.id ? styles.active : styles.inActive
                  }`}
                >
                  <div>{item.answer}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
