// src/components/TeamModal.tsx

"use client";


import { Modal, Image, Typography, Divider, Tag } from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  StarFilled,
  IdcardOutlined,
} from "@ant-design/icons";
import styles from "./TeamModal.module.css";
import { PartnerResourceV2 } from "@/src/data/partner/models/partner.types";
import Images from "@/src/constants/Images";
import NumberUtils from "@/src/utils/NumberUtils";

// Import component TagList mới
import TagList from "./TagList";

const { Title, Text, Paragraph } = Typography;

interface TeamModalProps {
  isVisible: boolean;
  onClose: () => void;
  partner: PartnerResourceV2 | null;
}

const TeamModal: React.FC<TeamModalProps> = ({
  isVisible,
  onClose,
  partner,
}) => {
  if (!partner) {
    return null;
  }

  // Helper function to render star rating
  const renderRating = (rate: number, totalReview: number) => {
    return (
      <div className={styles.rating}>
        <StarFilled style={{ fontSize: "18px", color: "#09993E" }} />
        <span style={{ color: "#000" }}>
          {NumberUtils.display(rate)}
          <span> ({totalReview} đánh giá)</span>
        </span>
      </div>
    );
  };

  const renderSection = (title: string, content: React.ReactNode) => {
    if (!content) return null;
    return (
      <div className={styles.modalSection}>
        <Title level={4} className={styles.sectionTitle}>
          {title}
        </Title>
        {content}
      </div>
    );
  };

  return (
    <Modal
      title={null}
      visible={isVisible}
      onCancel={onClose}
      footer={null}
      centered
      width={1400}
      className={styles.partnerModal}
    >
      <div className={styles.modalHeader}>
        <div className={styles.modalAvatar}>
          <Image
            src={partner?.user?.avatarUrl || "/placeholder.svg"}
            fallback={Images.ACCOUNT_DEFAULT}
            preview={false}
          />
        </div>
        <div className={styles.headerInfo}>
          <div className={styles.nameAndRating}>
            <Title level={2} className={styles.partnerName}>
              {partner.username}
            </Title>
            {renderRating(partner.rate, partner.totalReview)}
          </div>

          <Text className={styles.partnerPosition}>
            <UserOutlined /> {partner.position || "Chuyên gia"}
          </Text>
        </div>
      </div>

      <div className={styles.modalBody}>
        {renderSection(
          "Mô tả",
          <Paragraph className={styles.descriptionText}>
            <div
              dangerouslySetInnerHTML={{
                __html: partner.description ?? "Chưa có mô tả",
              }}
            />
          </Paragraph>
        )}

        {/* {renderSection(
          "Thông tin liên hệ",
          <>
            {partner.user.phoneNumber && (
              <div className={styles.contactItem}>
                <PhoneOutlined /> <Text>{partner.user.phoneNumber}</Text>
              </div>
            )}
            {partner.user.email && (
              <div className={styles.contactItem}>
                <MailOutlined /> <Text>{partner.user.email}</Text>
              </div>
            )}
            {partner.locations && partner.locations.length > 0 && (
              <div className={styles.contactItem}>
                <EnvironmentOutlined /> <Text>{partner.locations[0].name}</Text>
              </div>
            )}
          </>
        )} */}

        {/* Sử dụng component TagList thay vì gọi hàm trực tiếp */}
        <TagList title="Kỹ năng" items={partner.skills} />
        <TagList title="Danh mục dịch vụ" items={partner.categoryServices} />
        <TagList title="Dịch vụ" items={partner.services} />
      </div>
    </Modal>
  );
};

export default TeamModal;
