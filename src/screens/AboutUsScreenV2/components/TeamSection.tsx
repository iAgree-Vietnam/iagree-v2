"use client";

import React, { useState } from "react";
import { Image } from "antd";

import styles from "./TeamSection.module.css";
import { PartnerResourceV2 } from "@/src/data/partner/models/partner.types";
import Images from "@/src/constants/Images";
import TeamModal from "./TeamModal";

type TeamSectionProps = {
  topPartners: PartnerResourceV2[];
};

const dataMock = [
  {
    name: "Nguyễn Minh Nhân Phạm",
    title: "Marketing",
    user_id: 147,
    description:
      "Nhân viết nội dung rất sáng tạo và biết cách chốt thông điệp. Mình chỉ đưa outline mà bạn triển khai thành bài hoàn chỉnh luôn. Làm việc chuyên nghiệp, phản hồi nhanh, chỉnh sửa cũng rất thoải mái.",
    rating: 5,
    work: "Strategic Digital Campaign Launch - Dec 10, 2025",
  },
  {
    name: "Nguyễn Phạm Thuỳ Dương",
    user_id: 400,
    title: "HR Staff / Customers Service",
    description:
      "Dương làm việc rất nhẹ nhàng nhưng cực kỳ hiệu quả. Bạn xử lý tình huống nhanh, giao tiếp rõ ràng và hỗ trợ khách rất tận tâm. Mình cảm giác như có một HR in-house luôn đồng hành vậy. Làm việc với Dương rất yên tâm!",
    rating: 5,
    work: "Enhanced Customer/Employee Experience Protocol - Jan 22, 2026",
  },
  {
    name: "Nguyễn Thị Mỹ Linh",
    title: "Legal",
    user_id: 70,
    description: `
Linh làm việc rất kỹ lưỡng và cực kỳ cẩn thận. Mình gửi yêu cầu khá gấp nhưng bạn vẫn xử lý nhanh, giải thích rõ ràng và giúp mình yên tâm với từng tài liệu. Highly recommend mọi người nhé!
 `,
    rating: 5,
    work: "Complex Legal Transaction Advisory - Nov 18, 2025",
  },
  {
    name: "Huỳnh Thị Đào",
    title: "Legal",
    user_id: 399,
    description: `
    Đào làm việc cực kỳ chỉn chu và có trách nhiệm. Hồ sơ pháp lý bên công ty của tôi có hơi phức tạp nhưng Đào làm hỗ trợ rất nhiệt tình và rất đầy đủ. Mình đặc biệt yên tâm vì Đào luôn kiểm tra kỹ từng chi tiết và chủ động đề xuất hướng xử lý tối ưu. Một chuyên viên pháp lý đáng tin cậy! `,
    rating: 5,
    work: "Complex Legal Transaction Advisory - Nov 18, 2025",
  },
  {
    name: "Daniel Nguyen",
    user_id: 166,
    title:
      "Business Administration | Managing Partner | Head of Legal, Compliance, Corporate Affairs | Law Lecturer",
    description:
      "Daniel có chuyên môn cực cao và cách tiếp cận vấn đề rất chiến lược. Daniel tư vấn rõ ràng, phân tích rủi ro đầy đủ và đề xuất giải pháp thực tế. Mình thật sự ấn tượng với sự chuyên nghiệp và độ sâu kiến thức của Daniel.",
    rating: 5,
    work: "Cross-Departmental Project Management - Oct 25, 2025",
  },
  {
    name: "Huy Nguyen",
    user_id: 104,
    title: "Pháp lý & Quản trị kinh doanh",
    description:
      "Huy làm việc có tâm và rất kỹ lưỡng. Bạn không chỉ xử lý hồ sơ chuẩn chỉnh mà còn chia sẻ thêm những lưu ý quan trọng để doanh nghiệp mình vận hành an toàn hơn. Một cộng tác viên pháp lý rất đáng tin cậy.",
    rating: 5,
    work: "Developed Enterprise Risk Management Framework - Feb 01, 2026",
  },
  {
    name: "Cao Đình Trung",
    user_id: 438,
    title: "Kỹ sư phần mềm",
    description:
      "Trung support cực nhanh và hiểu vấn đề ngay từ đầu. Tư duy logic tốt, code sạch sẽ, giải quyết bài toán kỹ thuật rất ổn. Bạn làm chủ động, không phải nhắc nhiều. Rất ấn tượng!",
    rating: 5,
    work: "Backend Module Development & Deployment - Dec 05, 2025",
  },
  {
    name: "Nguyễn Nhật Hào",
    user_id: 361,
    title: "Marketing Full Stack",
    description:
      "Hào đúng kiểu làm marketing đa năng thật sự. Từ content, ads đến tối ưu hệ thống bạn đều xử lý nhanh và đúng trọng tâm. Hào làm việc chủ động, báo cáo rõ ràng và mang lại kết quả thấy được ngay. Rất hài lòng!",
    rating: 5,
    work: "Integrated Marketing Campaign Lead & Analysis - Jan 15, 2026",
  },
  {
    name: "Nguyễn Bảo Ngọc",
    user_id: 395,
    title: "Luật sư",
    description:
      "Ngọc là luật sư có chuyên môn vững và phong cách làm việc cực kỳ rõ ràng. Bạn đọc hồ sơ nhanh, tư vấn chuẩn và giải thích dễ hiểu. Mình cảm nhận được sự tận tâm và trách nhiệm ở từng chi tiết Ngọc làm.",
    rating: 5,
    work: "Successful Complex Litigation Case - Nov 20, 2025",
  },
];

const TeamSection: React.FC<TeamSectionProps> = ({ topPartners }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPartner, setSelectedPartner] =
    useState<PartnerResourceV2 | null>(null);

  const handlePartnerClick = (partner: PartnerResourceV2) => {
    setSelectedPartner(partner);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedPartner(null);
  };

  const limitedPartners = topPartners.slice(0, 8);
  return (
    <>
      <section id="partners-section-v1" className={styles.teamSection}>
        <div className={styles.container}>
          {/* Background Image and Overlay are removed */}
          {/* <div className={styles.backgroundImage} /> */}
          {/* <div className={styles.blackOverlay} /> */}

          <div className={styles.sectionTitle}>
            <span className={styles.textGreen}>Khách hàng nói gì</span> về Đối
            tác trên iAgree ?
          </div>
          <div className={styles.teamGrid}>
            {limitedPartners?.map((member, index) => {
              const dataDemo = dataMock?.find(
                (idx) => idx?.user_id == member?.userId
              );
              return (
                <div
                  key={index * index}
                  // Inline style cho partnerCard - Bộ màu Blue/Gold Modern
                  style={{
                    border: "1px solid #E3E6E8",
                    borderRadius: "16px",
                    padding: "25px",
                    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
                    backgroundColor: "#FFFFFF",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: "300px",
                    transition:
                      "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                    cursor: "pointer",
                    height: "-webkit-fill-available",
                  }}
                  // Giả lập effect hover
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow =
                      "0 12px 25px rgba(0, 0, 0, 0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 20px rgba(0, 0, 0, 0.08)";
                  }}
                >
                  {/* PHẦN THÔNG TIN ĐỐI TÁC (ĐƯỢC ĐẨY LÊN TRÊN) */}
                  <div
                    className={styles.partnerInfo}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      marginBottom: "20px", // Đẩy xuống khỏi review
                      paddingBottom: "20px",
                      borderBottom: "1px solid #EEEEEE", // Dùng borderBottom để tách khỏi review
                      textAlign: "center",
                    }}
                  >
                    {/* ROW 1: AVATAR */}
                    <div
                      className={styles.partnerImage}
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        overflow: "hidden",
                        marginBottom: "15px",
                        border: "3px solid #09993E", // Màu xanh lá mới
                        boxShadow: "0 0 0 4px #ECF5FF",
                      }}
                    >
                      <Image
                        src={member.user.avatarUrl || "/placeholder.svg"}
                        fallback={Images.ACCOUNT_DEFAULT}
                        preview={false}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>

                    {/* ROW 2: TÊN & VỊ TRÍ */}
                    <div className={styles.partnerInfo}>
                      <div
                        className={styles.partnerName}
                        style={{
                          fontWeight: "700",
                          fontSize: "19px",
                          color: "#09993E", // Màu xanh lá mới
                          marginBottom: "4px",
                        }}
                      >
                        {member.user.fullName}
                      </div>
                      <div
                        className={styles.partnerPosition}
                        style={{
                          fontSize: "14px",
                          color: "#8A8A8A",
                        }}
                      >
                        {member.position}
                      </div>
                    </div>
                  </div>

                  {/* Phần Review/Feedback (ĐẨY XUỐNG DƯỚI) */}
                  <div style={{ flexGrow: 1 }}>
                    {" "}
                    {/* Bỏ marginBottom vì nó nằm dưới cùng */}
                    <p
                      style={{
                        fontSize: "16px",
                        lineHeight: "1.7",
                        color: "#4A4A4A",
                        fontStyle: "italic",
                        marginBottom: "12px",
                      }}
                    >
                      {dataDemo?.description}
                    </p>
                    {/* Rating Stars */}
                    <div
                      style={{
                        color: "#FFC107",
                        fontSize: "20px",
                        marginBottom: "10px",
                      }}
                    >
                      {"★".repeat(dataDemo?.rating || 5)}
                    </div>
                    <div style={{ fontSize: "13px", color: "#7B7B7B" }}>
                      <strong style={{ color: "#333" }}>Work:</strong>{" "}
                      {dataDemo?.work}
                    </div>
                    {/* <div style={{ fontSize: "13px", color: "#7B7B7B" }}>
                      {dataDemo?.}
                    </div> */}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partner Modal */}
      <TeamModal
        isVisible={isModalVisible}
        onClose={handleModalClose}
        partner={selectedPartner}
      />
    </>
  );
};

export default TeamSection;
