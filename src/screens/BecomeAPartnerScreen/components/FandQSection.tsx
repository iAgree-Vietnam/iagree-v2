"use client";

import React, { useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import styles from "./FandQSection.module.css";

const faqData1 = [
  {
    id: 1,
    question: "Tôi cần điều kiện gì để trở thành Đối Tác trên iAgree?",
    answer:
      "Bạn chỉ cần có kỹ năng/dịch vụ muốn cung cấp, thông tin cá nhân hoặc doanh nghiệp rõ ràng và đồng ý với Điều khoản & Điều kiện của iAgree.",
  },
  {
    id: 2,
    question: "Tôi có phải trả phí khi đăng ký tài khoản Đối Tác không?",
    answer:
      "Không. Việc đăng ký tài khoản trên iAgree là hoàn toàn miễn phí. Phí chỉ phát sinh khi bạn có dự án được chấp nhận và thanh toán thành công.",
  },
  {
    id: 3,
    question: "Làm thế nào để tạo hồ sơ Đối Tác ấn tượng?",
    answer: (
      <div>
        Bạn nên:
        <ul className={styles.ulList}>
          <li>Cập nhật đầy đủ thông tin cá nhân/doanh nghiệp.</li>
          <li>Đăng tải mô tả chi tiết về kỹ năng, kinh nghiệm.</li>
          <li>Thêm portfolio, hình ảnh hoặc sản phẩm mẫu.</li>
          <li>Giữ thông tin rõ ràng, chuyên nghiệp để tăng độ tin cậy.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 4,
    question: "Quy trình nhận việc trên iAgree diễn ra như thế nào?",
    answer: (
      <ul className={styles.ulList}>
        <li>Khách hàng đăng dự án hoặc gửi lời mời cho công việc cho bạn.</li>
        <li>Bạn nộp đề xuất/ứng tuyển.</li>
        <li>
          Nếu Khách hàng chọn bạn, hợp đồng sẽ được tạo và Khách hàng thanh toán
          uỷ quyền cho iAgree giữ tiền.
        </li>
        <li>
          Bạn hoàn thành công việc và nhận thanh toán khi Khách hàng phê duyệt.
        </li>
      </ul>
    ),
  },
  {
    id: 5,
    question: "iAgree có uy tín và an toàn không?",
    answer: (
      <div>
        Có. iAgree được xây dựng bởi đội ngũ luật sư, kế toán, giám đốc nhân sự,
        giám đốc kinh doanh cấp cao đã và đang làm việc cho những tập đoàn đa
        quốc gia hàng đầu, hướng đến một nền tảng{" "}
        <span className={styles.greenTextPrimary}>
          {" "}
          kết nối công việc minh bạch và chuyên nghiệp
        </span>
        , với hệ thống hợp đồng giao dịch điện tử và thanh toán uỷ quyền giúp
        đảm bảo quyền lợi của cả Khách hàng và Đối Tác.
      </div>
    ),
  },
];

const faqData2 = [
  {
    id: 6,
    question: "Làm sao tôi yên tâm rằng Khách hàng sẽ thanh toán đúng?",
    answer:
      "Khách hàng bắt buộc phải thanh toán uỷ quyền cho iAgree. Số tiền này chỉ được giải ngân cho Đối Tác sau khi công việc hoàn thành và được nghiệm thu, đảm bảo bạn luôn nhận được thanh toán an toàn.",
  },
  {
    id: 7,
    question: "iAgree có được cơ quan nào chứng nhận hay quản lý không?",
    answer: (
      <div>
        Có. iAgree đã được{" "}
        <span className={styles.greenTextPrimary}>
          Bộ Công Thương cấp phép và xác nhận đăng ký website thương mại điện tử
        </span>
        , đảm bảo hoạt động đúng pháp luật Việt Nam và tuân thủ quy định bảo vệ
        người tiêu dùng.
      </div>
    ),
  },
  {
    id: 8,
    question:
      "Tôi có thể tin tưởng iAgree trong việc giải quyết tranh chấp không?",
    answer: (
      <div>
        Có. iAgree có cơ chế{" "}
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
    id: 9,
    question:
      "Tôi sẽ được thanh toán thù lao cho công việc đã thực hiện như thế nào?",
    answer:
      "Thanh toán được thực hiện thông qua hệ thống của iAgree. Sau khi công việc được nghiệm thu, số tiền sẽ được giải ngân về tài khoản ngân hàng bạn đã đăng ký trên iAgree. Vì vậy, bạn hãy cung cấp thông tin tài khoản ngân hàng chính xác nhất cho iAgree nhé.",
  },
  {
    id: 10,
    question: "Làm thế nào để tăng tỷ lệ trúng job trên iAgree?",
    answer: (
      <ul className={styles.ulList}>
        <li>
          Xây dựng hồ sơ chuyên nghiệp, có dự án mẫu và kinh nghiệm rõ ràng.
        </li>
        <li>
          Viết đề xuất ngắn gọn, tập trung vào nhu cầu thực sự của Khách hàng.
        </li>
        <li>
          Đặt mức giá cạnh tranh, phù hợp với thị trường và giá trị bạn mang
          lại.
        </li>
        <li>
          Hoàn thiện uy tín bằng chứng chỉ, portfolio, hoặc đánh giá từ khách
          hàng trước.
        </li>
        <li className={styles.greenTextPrimary}>
          Sử dụng Cơ Hội một cách thông minh: mua thêm khi cần và ưu tiên ứng
          tuyển cho những công việc thật sự phù hợp với kỹ năng của bạn.
        </li>
      </ul>
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
            Các câu hỏi <span className={styles.greenTextPrimary}>thường gặp</span>
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