"use client";

import { useState } from "react";
import { Button, Input, Select, Typography } from "antd";
import styles from "./ConnectsPackage.module.css";
import PriceUtils from "@/src/utils/PriceUtils";
import { useRouter } from "next/router";
import { PackageItem, PricingItem } from "@/src/data/pricing/models/pricing.types";
import PricingRouteUtils from "@/src/data/pricing/utils/PricingRouteUtils";
import { useAccountContext } from "@/src/contexts/AccountContext";

interface ConnectPackagesDisplayProps {
  connectsData?: PricingItem;
}

const ConnectsPackagesDisplay = ({ connectsData }: ConnectPackagesDisplayProps) => {
  const router = useRouter();
  const { auth: userInfo } = useAccountContext();
  
  const [selectedPackage, setSelectedPackage] = useState<
    PackageItem | undefined
  >(undefined);
  const [promoCode, setPromoCode] = useState("");
  const currentConnects = userInfo?.partner?.opportunity_wallet?.current_balance || 0;

  const expirationDate = new Date();
  expirationDate.setFullYear(expirationDate.getFullYear() + 1);

  const handlePurchase = () => {
    if (selectedPackage) {
      router.push(PricingRouteUtils.toPaymentConnectsUrl(selectedPackage));
    }
  };

  const handleSelectChange = (value: number) => {
    const pkg = connectsData?.allPackages?.find(
      (item) => item.packageId === value
    );
    setSelectedPackage(pkg);
  };

  const handleApplyPromo = () => {
  };

  const getAmountForPackage = (packageId: number): number => {
    if (!connectsData?.services) return 0;

    for (const service of connectsData.services) {
      const servicePackage = service.servicePackages.find(sp => sp.packageId === packageId);
      if (servicePackage) {
        return servicePackage.amount || 0;
      }
    }

    return 0;
  };

  const selectOptions = connectsData?.allPackages?.map((pkg) => {
    const amount = getAmountForPackage(pkg.packageId);

    return {
      value: pkg.packageId,
      label: `${amount} Cơ Hội với ${PriceUtils.displayVND(pkg.price)}`,
    }
  }) || [];

  const selectedAmount = selectedPackage ? getAmountForPackage(selectedPackage.packageId) : 0;

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <Typography.Title className={"sectionTitle"} level={3}>
          Mua Cơ Hội
        </Typography.Title>{" "}
        <div className={styles.form}>
          <div className={styles.currentBalance}>
            <span className={styles.sectionLabel}>Số Cơ Hội hiện có</span>
            <div className={styles.balanceDisplay}>
              <div className={styles.balanceNumber}>{currentConnects}</div>
              <span className={styles.balanceText}>Cơ Hội</span>
            </div>
          </div>

          <div className={styles.packageSelection}>
            <span className={styles.sectionLabel}>Chọn gói Cơ Hội</span>
            <Select
              placeholder="Chọn gói phù hợp với bạn"
              onChange={handleSelectChange}
              options={selectOptions}
              className={styles.packageSelect}
              size="large"
            />
          </div>

          {selectedPackage && (
            <div className={styles.packageDetails}>
              <div className={styles.detailCard}>
                <div className={styles.priceSection}>
                  <span className={styles.sectionLabel}>
                    Số tiền bạn cần thanh toán
                  </span>
                  <div className={styles.priceDisplay}>
                    {PriceUtils.displayVND(selectedPackage.price)}{" "}
                    <div className={styles.currency} />
                  </div>
                </div>

                <div className={styles.priceSection}>
                  <span className={styles.sectionLabel}>Số Cơ Hội sẽ nhận được</span>
                  <div className={styles.balanceDisplay}>
                    <div className={styles.balanceNumber}>
                      {selectedAmount}
                    </div>
                    <span className={styles.balanceText}>Cơ Hội</span>
                  </div>
                </div>

                <span className={styles.sectionLabel}>Ngày hết hạn</span>
                <div className={styles.balanceDisplay}>
                  <span className={styles.balanceText}>
                    {expirationDate.toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                  </span>
                </div>
              </div>
            </div>
          )}

          {selectedPackage && (
            <div className={styles.currentBalance} style={{ border: "1px solid #e2e8f0" }}>
              <span className={styles.sectionLabel}>Tổng số Cơ Hội sau khi thanh toán thành công</span>
              <div className={styles.balanceDisplay}>
                <div className={styles.balanceNumber}>
                  {currentConnects + selectedAmount}
                </div>
                <span className={styles.balanceText}>Cơ Hội</span>
              </div>
            </div>
          )}

          <div className={styles.promoSection}>
            <span className={styles.sectionLabel}>Mã khuyến mãi</span>
            <div className={styles.promoInput}>
              <Input
                placeholder="Nhập mã khuyến mãi (nếu có)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className={styles.promoField}
              />
              <Button
                onClick={handleApplyPromo}
                disabled={!promoCode.trim()}
                className={styles.promoButton}
                type="default"
              >
                Áp dụng
              </Button>
            </div>
          </div>

          <div className={styles.purchaseSection}>
            <Button
              className={styles.purchaseButton}
              onClick={handlePurchase}
              disabled={!selectedPackage}
              type="primary"
              size="large"
            >
              {selectedPackage
                ? `Mua ${
                    selectedAmount
                  } Cơ Hội - ${PriceUtils.displayVND(selectedPackage.price)}`
                : "Chọn gói để tiếp tục"}
            </Button>

            <p className={styles.purchaseNote}>
              Gói Cơ Hội sẽ có hiệu lực ngay sau khi thanh toán thành công. Cơ
              hội không sử dụng sẽ được chuyển sang tháng tiếp theo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectsPackagesDisplay;
