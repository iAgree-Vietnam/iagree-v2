import React, { useMemo } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Breadcrumb, Typography, Button, Row, Space } from "antd";

import RootLayout from "@/src/layouts/RootLayout";
import {
  // CitizenIdStatus,
  PackageItem,
  PricingResource,
} from "@/src/data/pricing/models/pricing.types";
import PriceUtils from "@/src/utils/PriceUtils";
import PricingRouteUtils from "@/src/data/pricing/utils/PricingRouteUtils";
import { useAccountContext } from "@/src/contexts/AccountContext";
import Cookies from "js-cookie";
import Constants from "@/src/constants/Constants";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import PricingItem from "./PricingItem";
// import PrivacyPolicyRouteUtils from "@/src/data/privacy-policy/utils/PrivacyPolicyRouteUtils";
// import { ButtonWithIcon } from "@/src/components/button";
import { useBreakpoint } from "@/src/hooks/useBreakpoint";
import { PartnerPackages } from "./PartnerPackages";
import ConnectsPackagesDisplay from "./ConnectsPackagesDisplay";

function PricingScreen(props: any) {
  const router = useRouter();
  const { isDesktop } = useBreakpoint();
  const { auth: userInfo, isLoggedIn } = useAccountContext();

  const pricingData = props.data as PricingResource;
  // const statusCode = props.statusCode as CitizenIdStatus["status"]["code"];

  const isPartner = useMemo(() => {
    return userInfo?.partner?.status === Constants.PARTNER.DA_DUYET;
  }, [userInfo]);

  const userPackageData = pricingData.users.services.map((item) => ({
    name: item.name,
    key: item.serviceKeyName,
    ...item?.packages?.reduce(
      (prev, current) => ({
        ...prev,
        [current?.pivot?.packageId]: {
          checked: true,
          servicePackages: item.servicePackages.find(
            (sP) => sP.packageId === current.pivot?.packageId
          ),
          serviceKeyName: item.serviceKeyName,
        },
      }),
      {}
    ),
  }));

  userPackageData.push({
    name: "",
    key: Constants.BUY_USER_PACKAGE_KEY_NAME,
    ...pricingData.users.allPackages.reduce(
      (pre, item) => ({
        ...pre,
        [item.packageId]: { buy: item.packageId, checked: true },
      }),
      {}
    ),
  });

  // const handleClickUserPackage = (item: PackageItem, index: number) => {
  //   if (item.price > 0 && index > currentUserServiceIndex) {
  //     if (!isLoggedIn) {
  //       Cookies.set(
  //         Constants.ROUTE_PRE_LOGIN,
  //         PricingRouteUtils.toPaymentUpgradeAccountUrl(item)
  //       );
  //       router.push("/login");
  //     } else {
  //       router.push(PricingRouteUtils.toPaymentUpgradeAccountUrl(item));
  //     }
  //   }
  // };

  const eSignPackageData: any[] = pricingData.signatures.services.map(
    (item) => ({
      name: item.name,
      key: item.serviceKeyName,
      ...item?.packages?.reduce(
        (prev, current) => ({
          ...prev,
          servicePackages: item.servicePackages.find(
            (sP) => sP.packageId === current.pivot?.packageId
          ),
        }),
        {}
      ),
    })
  );

  const eSignComboPackage: PackageItem[] = [];
  const listOfPartnerAccountUpgradePackages: PackageItem[] = [
    {
      packageId: 1,
      name: "Gói Pro",
      packageKeyName: "pro",
      description: "Giảm 10% cho mọi Dịch vụ bạn cung cấp",
      price: 199_000,
      unit: "1 tháng",
    },
  ];

  const staterPackage = pricingData.signatures.allPackages.find(
    (item) =>
      item.packageKeyName ===
      Constants.E_SIGNATURE_PACKAGE.E_SIGNATURE_BY_STARTER
  );
  if (staterPackage) eSignComboPackage.push(staterPackage);
  const smartPackage = pricingData.signatures.allPackages.find(
    (item) =>
      item.packageKeyName === Constants.E_SIGNATURE_PACKAGE.E_SIGNATURE_BY_SMART
  );
  if (smartPackage) eSignComboPackage.push(smartPackage);
  const proPackage = pricingData.signatures.allPackages.find(
    (item) =>
      item.packageKeyName === Constants.E_SIGNATURE_PACKAGE.E_SIGNATURE_BY_PRO
  );
  if (proPackage) eSignComboPackage.push(proPackage);

  const eSignByOncePackage = pricingData.signatures.allPackages.find(
    (item) =>
      item.packageKeyName === Constants.E_SIGNATURE_PACKAGE.E_SIGNATURE_BY_ONCE
  );

  // @ts-ignore
  // const eSignPackage =
  //   userInfo?.userPackages?.findLast(
  //     (item) =>
  //       item.type === Constants.PAYMENT.TYPE_TEXT.E_SIGNATURE &&
  //       item.keyName !== Constants.E_SIGNATURE_PACKAGE.E_SIGNATURE_BY_ONCE
  //   ) || PricingParseUtils.getESignatureDefault();

  // const currentESignServiceIndex = eSignComboPackage.findIndex(
  //   (item) => item.name === eSignPackage?.name
  // );

  const handleClickESignPackage = (item: PackageItem, index: number) => {
    // if (index > currentESignServiceIndex)
    if (!isLoggedIn) {
      Cookies.set(
        Constants.ROUTE_PRE_LOGIN,
        PricingRouteUtils.toPaymentESignatureUrl(item)
      );
      router.push("/login");
    } else {
      router.push(PricingRouteUtils.toPaymentESignatureUrl(item));
    }
  };

  // Overlay mờ cho badge Elite/Pro
  const getPackageOverlay = () => {
    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(43, 44, 44, 0.3)",
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

  // const featureSlickSettings = {
  //   arrows: false,
  //   centerMode: !isDesktop ? true : false,
  //   dots: true,
  //   infinite: true,
  //   speed: 500,
  //   slidesToShow: 1,
  //   slidesToScroll: 1,
  // };

  // const FeatureListWrapper = !isDesktop ? Slider : Row;

  return (
    <RootLayout>
      <Head>
        <title>Gói dịch vụ</title>
        <link
          rel={"stylesheet"}
          type={"text/css"}
          charSet={"UTF-8"}
          href={
            "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
          }
        />
        <link
          rel={"stylesheet"}
          type={"text/css"}
          href={
            "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
          }
        />
      </Head>

      <section className={"pageHeaderWrapper"}>
        <div className="contentWrapper">
          <div className={"pageHeaderContainer serviceHeaderContainer"}>
            <h1 className={"pageHeaderTitle nm-typo"}>Gói dịch vụ</h1>
          </div>
        </div>
      </section>

      <section className={"breadcrumbContainer"}>
        <div className="contentWrapper">
          <Breadcrumb
            items={[
              {
                title: (
                  <>
                    <IconSvgLocal name={"IC_HOME"} />
                    <span>Trang chủ</span>
                  </>
                ),
                href: "/",
              },
              { title: "Gói dịch vụ" },
            ]}
          />
        </div>
      </section>

      {/* {statusCode !== Constants.CITIZEN_ID_STATUS.SIGNED && (
        <section className={"sectionContainer"}>
          <div className="contentWrapper">
            <div className="sectionContentContainer">
              {[
                Constants.CITIZEN_ID_STATUS.NOT_LOGIN,
                Constants.CITIZEN_ID_STATUS.NOT_VERIFY,
              ].includes(statusCode) && (
                <Row
                  justify={"space-between"}
                  align={"middle"}
                  className={"serviceBanner"}
                >
                  <Typography.Title className={"nm-typo"} level={4}>
                    Xác thực tài khoản ngay để được tặng 01 lượt ký miễn phí!
                  </Typography.Title>
                  <Button
                    onClick={() =>
                      router.push(PrivacyPolicyRouteUtils.toMySignSupport())
                    }
                    block={!isDesktop}
                    style={{ marginTop: !isDesktop ? "16px" : 0 }}
                  >
                    Xem hướng dẫn xác thực
                  </Button>
                </Row>
              )}
              {statusCode === Constants.CITIZEN_ID_STATUS.NOT_SIGNED && (
                <Space size={"middle"} className={"serviceBanner d-flex"}>
                  <CheckCircleFilled
                    style={{ color: "#09993E", fontSize: "20px" }}
                  />
                  <Typography.Title className={"nm-typo"} level={4}>
                    Bạn đã nhận được 01 lượt ký miễn phí khi xác thực tài khoản
                    bằng MySignID
                  </Typography.Title>
                </Space>
              )}
            </div>
          </div>
        </section>
      )} */}

      {isPartner && (
        <section className={"pricingContainer"} style={{ maxWidth: "1395px" }}>
          {listOfPartnerAccountUpgradePackages?.length > 0 && (
            <section className={"sectionContainer"}>
              <PartnerPackages />
            </section>
          )}
        </section>
      )}

      {isPartner && (
        <section className={"pricingContainer"} style={{ maxWidth: "1395px" }}>
          {listOfPartnerAccountUpgradePackages?.length > 0 && (
            <section className={"sectionContainer"}>
              <ConnectsPackagesDisplay connectsData={pricingData.connects} />
            </section>
          )}
        </section>
      )}

      <section className={"pricingContainer"} style={{ maxWidth: "1395px" }}>
        {eSignByOncePackage && (
          <section className={"sectionContainer"}>
            <Typography.Title className={"sectionTitle"} level={3}>
              Giá dịch vụ ký số lẻ
            </Typography.Title>
            <div className="contentWrapper">
              <div className="sectionContentContainer">
                <div
                  style={{
                    borderRadius: "10px",
                    border: "1px solid #D4D4D4",
                    padding: !isDesktop ? "20px 16px" : "18px 40px",
                  }}
                >
                  <Typography.Title
                    className={"show-mb-block"}
                    style={{ display: "none", marginBottom: "10px" }}
                    level={4}
                  >
                    Giá lượt ký lẻ
                  </Typography.Title>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: !isDesktop ? 0 : "100px",
                    }}
                  >
                    <Typography.Title className={"nm-typo hidden-mb"} level={4}>
                      Giá lượt ký lẻ
                    </Typography.Title>
                    <Typography.Title
                      className={"nm-typo"}
                      level={2}
                      style={{
                        color: "#09993E",
                        marginTop: 0,
                        fontSize: !isDesktop ? "22px" : "30px",
                      }}
                    >
                      {PriceUtils.format(eSignByOncePackage.price)}
                      <span
                        style={{
                          fontSize: !isDesktop ? "12px" : "14px",
                          color: "#74767E",
                          marginLeft: !isDesktop ? "0" : "12px",
                        }}
                      >
                        đồng / lượt ký
                      </span>
                    </Typography.Title>
                    {/* <ButtonWithIcon
                      icon={
                        <IconSvgLocal
                          name={"IC_ARROW_RIGHT"}
                          width={26}
                          height={9}
                        />
                      }
                      iconPosition={"end"}
                      onClick={() =>
                        handleClickESignPackage(
                          eSignByOncePackage,
                          eSignComboPackage.length
                        )
                      }
                    >
                      Đăng ký ngay
                    </ButtonWithIcon> */}

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
                  </div>
                </div>
                {getPackageOverlay()}
              </div>
            </div>
          </section>
        )}

        {eSignComboPackage?.length > 0 && (
          <section className={"sectionContainer"}>
            <div className="contentWrapper">
              <Typography.Title className={"sectionTitle"} level={3}>
                Bảng giá dịch vụ ký số theo gói
              </Typography.Title>

              <div
                className="sectionContentContainer"
                style={{
                  position: "relative",
                  minHeight: "274px",
                  marginTop: "60px",
                }}
              >
                <div
                  className={"criteriaContainer"}
                  style={{ backgroundColor: "#E6F5EC" }}
                >
                  <Typography.Title
                    className={"criteriaTitle nm-typo"}
                    level={5}
                  >
                    Gói Combo
                  </Typography.Title>
                </div>
                <div className={"criteriaContainer"}>
                  <Typography.Title
                    className={"criteriaTitle nm-typo"}
                    level={5}
                  >
                    Giá bán gói (VNĐ)
                  </Typography.Title>
                </div>
                <div
                  className={"criteriaContainer"}
                  style={{ backgroundColor: "#F7F7F7" }}
                >
                  <Typography.Title
                    className={"criteriaTitle nm-typo"}
                    level={5}
                  >
                    Lượt ký số
                  </Typography.Title>
                </div>
                <div className={"packageList"}>
                  {eSignComboPackage.map((item, index) => (
                    <PricingItem
                      key={item.packageId}
                      data={item}
                      eSignPackageData={eSignPackageData}
                      onRegister={() => handleClickESignPackage(item, index)}
                      // hideRegister={index <= currentESignServiceIndex}
                      hideRegister={false}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </section>
    </RootLayout>
  );
}

export default PricingScreen;
