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
      <section id="partners-section" className={styles.teamSection}>
        <div className={styles.container}>
          {/* Background Image and Overlay */}
          {/* <div className={styles.backgroundImage} /> */}
          {/* <div className={styles.blackOverlay} /> */}

          <h2 className={styles.sectionTitle}>
            <span className={styles.textGreen}>
              {" "}
              Đối Tác sáng lập tại iAgree
            </span>
          </h2>
          <div className={styles.teamGrid}>
            {limitedPartners.map((member, index) => (
              <div
                key={index}
                className={styles.partnerCard}
                onClick={() => handlePartnerClick(member)}
              >
                <div className={styles.partnerImage}>
                  <Image
                    src={member.user?.avatarUrl || "/placeholder.svg"}
                    fallback={Images.ACCOUNT_DEFAULT}
                    preview={false}
                  />
                </div>
                <div className={styles.partnerInfo}>
                  <div className={styles.partnerName}>
                    {member.user.fullName}
                  </div>
                  <div className={styles.partnerPosition}>
                    {member.position}
                  </div>
                </div>
              </div>
            ))}
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
