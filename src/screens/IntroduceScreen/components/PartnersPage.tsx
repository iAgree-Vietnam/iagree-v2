
import styles from "./PartnerPage.module.css";
import { PartnerResourceV2 } from "@/src/data/partner/models/partner.types";
import BenefitsPartnerSection from "./BenefitsPartnerSection";
import TeamSection from "./TeamSection";

type PartnersPageSectionProps = {
  topPartners: PartnerResourceV2[];
};

const PartnersPageSection: React.FC<PartnersPageSectionProps> = ({
  topPartners,
}) => {
  return (
    <div className={styles.partnerPageContainer}>
      <div className={styles.backgroundImage} />
      <div className={styles.blackOverlay} />

      <BenefitsPartnerSection />
      <TeamSection topPartners={topPartners} />
    </div>
  );
};

export default PartnersPageSection;
