
import { Button, Typography } from "antd";
import {
  ESignPackageDataItem,
  PackageItem,
} from "@/src/data/pricing/models/pricing.types";
import PriceUtils from "@/src/utils/PriceUtils";
import { ButtonWithIcon } from "@/src/components/button";
import { IconSvgLocal } from "@/src/components/icon-svg-local";

type PricingItemProps = {
  data: PackageItem;
  eSignPackageData: ESignPackageDataItem[];
  onRegister: () => void;
  hideRegister: boolean;
};

function PricingItem(props: PricingItemProps) {
  const { data, onRegister, eSignPackageData, hideRegister } = props;

  const serviceInfo = eSignPackageData.find(
    (item) => item.key === data.packageKeyName
  );

  const getPackageOverlay = () => {
    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(43, 44, 44, 0.15)",
          /* màu xanh mờ */
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        {/* <div className={labelStyle.pricingOverlayText}>
            Gói nâng cấp tài khoản sắp ra mắt
          </div> */}
      </div>
    );
  };

  return (
    <div className={"pricingItemContainer"}>
      <Typography.Paragraph
        className={"pricingItemName text-center full-width"}
      >
        {data.name}
      </Typography.Paragraph>
      <Typography.Paragraph className={"pricingItemPrice"}>
        {PriceUtils.format(data.price)}
      </Typography.Paragraph>
      <Typography.Paragraph className={"pricingItemUnit"}>
        {serviceInfo?.servicePackages.amount} {data.unit}
      </Typography.Paragraph>
      {!hideRegister && (
        // <ButtonWithIcon
        //     icon={<IconSvgLocal name={'IC_ARROW_RIGHT'} width={26} height={9} />}
        //     iconPosition={'end'}
        //     onClick={onRegister}
        //     style={{ margin: '0 30px' }}
        // >
        //     Đăng ký ngay
        // </ButtonWithIcon>

        <Button
          // THÊM: Vô hiệu hóa nút và thêm class cho trạng thái "Sắp ra mắt"
          disabled={true}
          style={{
            cursor: "not-allowed",
            pointerEvents: "none",
            opacity: 0.7,
            backgroundColor: "#6b7280 !important",
            color: "#d9d9d9 !important",
            boxShadow: "none !important",
          }}
        >
          Chức năng sắp ra mắt
        </Button>
      )}
      {getPackageOverlay()}
    </div>
  );
}

export default PricingItem;
