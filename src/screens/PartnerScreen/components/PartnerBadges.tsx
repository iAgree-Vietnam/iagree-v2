import type React from "react"
import partnerBadgeProStyles from "./PartnerBadgesPro.module.css"
import partnerBadgeEliteStyles from "./PartnerBadgesElite.module.css"
import { IconSvgLocal } from "@/src/components/icon-svg-local"

interface PartnerBadgesV3Props {
  tier: string
}

const PartnerBadges: React.FC<PartnerBadgesV3Props> = ({ tier }) => {
  if (!tier || (tier !== "PRO" && tier !== "ELITE")) {
    return null
  }

  return (
    <div>
      <div className={tier === "PRO" ? partnerBadgeProStyles.badgesWrapper : partnerBadgeEliteStyles.badgesWrapper}>
        {tier === "PRO" && (
          <div className={partnerBadgeProStyles.badgeRow}>
            <div className={partnerBadgeProStyles.badgeWithText}>
              <div className={`${partnerBadgeProStyles.badgeWrap} ${partnerBadgeProStyles.badgePro}`}>
                <div className={`${partnerBadgeProStyles.proShimmer3} ${partnerBadgeProStyles.shimmerLayer}`}></div>
                <IconSvgLocal name={"IC_PRO_PARTNER"} height={18} width={18} />
                <div className={partnerBadgeProStyles.badgeLabel}>Pro-Partner</div>
              </div>
            </div>
          </div>
        )}

        {tier === "ELITE" && (
          <div className={partnerBadgeEliteStyles.badgeRow}>
            <div className={partnerBadgeEliteStyles.badgeWithText}>
              <div className={`${partnerBadgeEliteStyles.badgeWrap} ${partnerBadgeEliteStyles.badgeElite}`}>
                <div className={`${partnerBadgeEliteStyles.proShimmer3} ${partnerBadgeEliteStyles.shimmerLayer}`}></div>
                <IconSvgLocal name={"IC_ELITE_PARTNER"} height={18} width={18} />
                <div className={partnerBadgeEliteStyles.badgeLabel}>Elite-Partner</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PartnerBadges
