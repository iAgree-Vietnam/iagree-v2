import { IconSvgLocal } from "@/src/components/icon-svg-local"
import PriceUtils from "@/src/utils/PriceUtils"
import { Button, Col } from "antd"
import { Check, Clock } from "lucide-react"
import styles from "./PricingItemForPartner.module.css"
import proStyles from "./PricingItemForPartnerPro.module.css"
import eliteStyles from "./PricingItemForPartnerElite.module.css"

interface PartnerPackageDetails {
  price: number
  originalPrice?: number
  duration: string
  description: string
  features: {
    name: string
    valueStart: string
    valueMiddle?: string | null
    valueEnd?: string | null
    included: boolean | string
    enable?: boolean | null
  }[]
  discount?: string
}

export const PricingItemForPartner = ({
  data,
  onRegister,
  hideRegister,
}: {
  data: PartnerPackageDetails & { name: string; label: string }
  onRegister: () => void
  hideRegister: boolean
}) => {
  const getPackageIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case "elite":
        return <IconSvgLocal name={"IC_ELITE_PARTNER"} height={16} width={16} />
      case "pro":
        return <IconSvgLocal name={"IC_PRO_PARTNER"} height={16} width={16} />
      case "basic":
        return null
      default:
        return null
    }
  }
  const labelLower = data.label.toLowerCase()

  const labelStyle = labelLower === "pro" ? proStyles : labelLower === "elite" ? eliteStyles : styles

  // Overlay mờ cho badge Elite/Pro
  const getPackageOverlay = (label: string) => {
    const lower = label.toLowerCase()
    if (lower === "elite" || lower === "pro") {
      return (
        <div className={labelStyle.pricingOverlay}>
          {/* <div className={labelStyle.pricingOverlayText}>
            Gói nâng cấp tài khoản sắp ra mắt
          </div> */}
        </div>
      )
    }
    return null
  }

  return (
    <Col className={labelStyle.pricingItemCol}>
      {data.discount && <div className={labelStyle.pricingDiscountLabel}>{data.discount}</div>}

      <div className={labelStyle.pricingLabelTypePackge}>
        {getPackageIcon(data.label)}
        {data.label}
      </div>

      <div className={labelStyle.pricingTitle}>{data.name}</div>

      <div className={labelStyle.pricingPriceWrapper}>
        <div className={labelStyle.pricingPriceMain}>
          {data.price === 0 || data.price === 0.0 ? "Miễn phí" : PriceUtils.format(data.price)}
        </div>
        {data.originalPrice && (
          <div className={labelStyle.pricingOriginalPrice}>
            {data.originalPrice === 0 || data.originalPrice === 0.0
              ? "Miễn phí"
              : PriceUtils.format(data.originalPrice)}
          </div>
        )}
        {(data.price > 0.0 || data.price > 0) && (
          <div className={labelStyle.pricingDuration}>
            <Clock size={14} />
            {data.duration}
          </div>
        )}
      </div>

      <div className={labelStyle.pricingDescription}>{data.description}</div>

      <div className={labelStyle.pricingFeaturesWrapper} style={{ padding: 10 }}>
        <div className={labelStyle.pricingFeaturesTitle}>Ưu đãi:</div>
        <div className={labelStyle.pricingFeaturesList}>
          {data.features.map((feature, index) => (
            <div key={index} className={labelStyle.pricingFeatureItem}>
              <div
                className={`${labelStyle.pricingFeatureIcon} ${
                  typeof feature.included === "boolean" && feature.included
                    ? labelStyle.included
                    : labelStyle.notIncluded
                }`}
              >
                <Check
                  color={
                    typeof feature.included === "boolean" && feature.included
                      ? "#FFFFFF"
                      : feature.enable !== null && feature.enable
                        ? "#9CA3AF"
                        : "#9CA3AF"
                  }
                  style={{ padding: "0.15rem" }}
                />
              </div>
              <div>
                <span
                  className={`${labelStyle.pricingFeatureText} ${
                    typeof feature.included === "boolean" && feature.included
                      ? labelStyle.included
                      : labelStyle.notIncluded
                  } ${labelStyle.pricingFeatureName}`}
                >
                  {feature.name}
                </span>
                <span
                  className={`${labelStyle.pricingFeatureText} ${
                    typeof feature.included === "boolean" && feature.included
                      ? labelStyle.included
                      : labelStyle.notIncluded
                  } ${labelStyle.pricingFeatureValue}`}
                >
                  {feature.valueStart}
                  <span className={labelStyle.pricingFeatureValueMiddle}>{feature.valueMiddle}</span>
                  <span className={labelStyle.pricingFeatureValueEnd}>{feature.valueEnd}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {!hideRegister && (
        <Button
          // THÊM: Vô hiệu hóa nút và thêm class cho trạng thái "Sắp ra mắt"
          disabled={true}
          className={`${labelStyle.pricingButton} ${labelStyle.comingSoonButton}`}
        >
          Chức năng sắp ra mắt
        </Button>
      )}

      {/* Overlay mờ */}
      {getPackageOverlay(data.label)}
    </Col>
  )
}
