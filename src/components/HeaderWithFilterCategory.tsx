"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Col,
  Menu,
  Row,
  Space,
  type MenuProps,
  Image,
  Tooltip,
  message,
  Typography,
  Popover,
} from "antd";
import Link from "next/link";
import Cookies from "js-cookie";
import {
  HeartOutlined,
  MenuOutlined,
  MessageOutlined,
  WalletOutlined,
  AccountBookOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";

import { useAccountContext } from "@/src/contexts/AccountContext";
import { PartnerRouteUtils } from "@/src/data/partner/utils/PartnerRouteUtils";
import Images from "@/src/constants/Images";
import { useLogout } from "@/src/hooks/query/useLogout";
import Constants from "@/src/constants/Constants";
import AuthRouteUtils from "@/src/data/auth/utils/AuthRouteUtils";
import { ButtonHeaderNotification } from "@/src/components/notifications/ButtonHeaderNotification";
import MenuDrawer, { type MenuDrawerHelperVisible } from "./MenuDrawer";
import { IconSvgLocal } from "./icon-svg-local";
import UserMenuDrawer from "./UserMenuDrawer";
import { useBreakpoint } from "../hooks/useBreakpoint";
import { useHeaderMenu } from "../hooks/useHeaderMenu";
import { useDetectDeviceV2 } from "../hooks/useDetectDevice";
import { compact, toString } from "lodash";
import SearchFilterHeader from "../screens/SearchScreen/components/SearchFilterHeader";
// import { ReferralCode } from "./RefferalCode";

const HeaderWithFilterCategory = () => {
  const router = useRouter();
  const { isDesktop, isBigDesktop } = useBreakpoint();

  const accountContext = useAccountContext();
  const fullProfileResource = accountContext.auth;

  const isLoggedIn = accountContext.isLoggedIn;
  const isValidUser =
    fullProfileResource &&
    fullProfileResource.userId &&
    fullProfileResource?.fullName;
  const isActuallyLoggedIn = isLoggedIn && isValidUser || false;

  const { headerMenu } = useHeaderMenu({
    isActuallyLoggedIn,
    fullProfileResource,
  });

  const profileTitle =
    fullProfileResource?.accountType === "PERSONAL"
      ? "Thông tin cá nhân"
      : "Thông tin doanh nghiệp";

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const isMobile = useDetectDeviceV2().isMobile;

  const logoutMutation = useLogout({
    onSuccess: () => {
      setIsLoggingOut(false);
      userMenuDrawerRef.current?.closeDrawer();
      document.cookie.split(";").forEach(function (c) {
        document.cookie =
          c.trim().split("=")[0] +
          "=;expires=" +
          new Date().toUTCString() +
          ";path=/";
      });

      // Clear localStorage
      localStorage.clear();

      // Clear sessionStorage (optional)
      sessionStorage.clear();
      router.push("/");
      message.success("Đăng xuất tài khoản thành công").then(() => null);
    },
    onError: () => {
      setIsLoggingOut(false);
    },
  });

  const isPartner = useMemo(() => {
    return fullProfileResource?.partner?.status === Constants.PARTNER.DA_DUYET;
  }, [fullProfileResource]);

  const handleLogout = () => {
    setIsLoggingOut(true);
    logoutMutation.mutate();
  };

  const userMenu: MenuProps["items"] = useMemo(() => {
    return compact([
      {
        key: AuthRouteUtils.toProfile(),
        label: <Link href={AuthRouteUtils.toProfile()}>{profileTitle}</Link>,
        icon: <IconSvgLocal name={"IC_USER"} />,
      },
      isMobile && {
        key: AuthRouteUtils.toInternalWallet(),
        label: <Link href={AuthRouteUtils.toInternalWallet()}>Quản lý tài chính</Link>,
        icon: <WalletOutlined style={{ fontSize: "16px" }} />,
      },
      {
        key: AuthRouteUtils.toTransaction(),
        label: (
          <Link href={AuthRouteUtils.toTransaction()}>Quản lý giao dịch</Link>
        ),
        icon: <IconSvgLocal name={"IC_DIAMOND"} />,
      },
      // {
      //   key: AuthRouteUtils.toSubScription(),
      //   label: (
      //     <Link href={AuthRouteUtils.toSubScription()}>
      //       Gói dịch vụ của tôi
      //     </Link>
      //   ),
      //   icon: <IconSvgLocal name={"IC_WALLET"} />,
      // },
      isPartner && {
        key: AuthRouteUtils.toManageChance(),
        label: (
          <Link href={AuthRouteUtils.toManageChance()}>Quản lý Cơ Hội</Link>
        ),
        icon: <AccountBookOutlined style={{ fontSize: "16px" }} />,
      },
      isMobile && {
        key: AuthRouteUtils.toFavorite(),
        label: <Link href={AuthRouteUtils.toFavorite()}>Yêu thích</Link>,
        icon: <HeartOutlined style={{ fontSize: "16px" }} />,
      },
      // {
      //   key: AuthRouteUtils.toNotification(),
      //   label: <Link href={AuthRouteUtils.toNotification()}>Thông báo</Link>,
      //   icon: <IconSvgLocal name={"IC_NOTIFICATION"} />,
      // },
      // {
      //   key: AuthRouteUtils.toFavorite(),
      //   label: <Link href={AuthRouteUtils.toFavorite()}>Yêu thích</Link>,
      //   icon: <HeartOutlined style={{ fontSize: "16px" }} />,
      // },
      {
        key: AuthRouteUtils.toChangePassword(),
        label: (
          <Link href={AuthRouteUtils.toChangePassword()}>Đổi mật khẩu</Link>
        ),
        icon: <IconSvgLocal name={"IC_PADLOCK"} />,
      },
      {
        key: "logout",
        label: isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất",
        icon: <IconSvgLocal name={"IC_LOG_OUT"} fill={"#E14141"} />,
        onClick: handleLogout,
        disabled: isLoggingOut,
      },
    ]);
  }, [isLoggingOut, isMobile]);

  const handleClickLogin = () => {
    // Cookies.set(Constants.ROUTE_PRE_LOGIN, router.asPath);
    if (!accountContext.isLoggedIn) {
      if (!AuthRouteUtils.isAuthPath(router.pathname)) {
        Cookies.set(Constants.ROUTE_PRE_LOGIN, router.asPath);
      }
      router.push("/login");
      return null;
    }
  };

  // const handleBecomePartnerClick = () => {
  //   if (!isActuallyLoggedIn) {
  //     // Set the redirect path to partner registration
  //     Cookies.set(
  //       Constants.ROUTE_PRE_LOGIN,
  //       PartnerRouteUtils.toPartnerRegisterGetStart()
  //     );

  //     router.push("/login");
  //   } else {
  //     router.push(PartnerRouteUtils.toPartnerRegisterGetStart());
  //   }
  // };

  const handleBecomePartnerClick = () => {
    router.push(PartnerRouteUtils.toBecomeAPartnerScreen());
  };

  const isRejectPartner = useMemo(
    () => fullProfileResource?.partner?.status === Constants.PARTNER.TU_CHOI,
    [fullProfileResource]
  );

  const isRegistered = useMemo(
    () => Boolean(fullProfileResource?.partner),
    [fullProfileResource]
  );

  useEffect(() => {
    if (isActuallyLoggedIn && typeof window !== "undefined") {
      const redirectUrl = localStorage.getItem("redirectAfterLogin");
      if (redirectUrl) {
        localStorage.removeItem("redirectAfterLogin");
        router.push(redirectUrl);
      }
    }
  }, [isActuallyLoggedIn, router]);

  const menuDrawerRef = useRef<MenuDrawerHelperVisible>(null);
  const userMenuDrawerRef = useRef<MenuDrawerHelperVisible>(null);

  return (
    <>
      <header
        style={{
          paddingTop: "8px",
        }}
        className={"headerWrapper"}
      >
        <Row className={"headerContainer"} wrap={false} align={"middle"}>
          <Col flex={"120px"}>
            <Link className={"logo"} href={"/"}>
              <img
                alt={"iagree"}
                src={"/assets/img/logo.svg"}
                className={"logoImg"}
              />
            </Link>
          </Col>

          <Col flex={1}>
            <Menu
              className={"menuContainer"}
              theme={"light"}
              mode={"horizontal"}
              items={headerMenu}
              style={{ marginLeft: 20, marginTop: 5, justifyContent: "left" }}
            />
          </Col>

          <Col>
            <Row justify={"end"}>
              <Space size={10} className={"headerExtraContainer"}>
                {(!isActuallyLoggedIn || !isRegistered || isRejectPartner) && (
                  <Tooltip
                    placement="bottom"
                    title={"Trở thành Đối tác"}
                    overlayClassName={isBigDesktop ? "hide" : ""}
                  >
                    <Button
                      size={"large"}
                      className={"headerExtraBtn"}
                      icon={
                        <IconSvgLocal
                          name={"IC_GROUP_USER"}
                          className={"connectIcon"}
                        />
                      }
                      onClick={handleBecomePartnerClick}
                    >
                      {isBigDesktop && "Trở thành Đối tác"}
                    </Button>
                  </Tooltip>
                )}
                {isActuallyLoggedIn && fullProfileResource ? (
                  <>
                    <>
                      {!isMobile && (
                        <Popover
                          // content={
                          //   <div
                          //     style={{
                          //       background: "#f6ffed",
                          //       border: "1px solid #b7eb8f",
                          //       borderRadius: "8px",
                          //       padding: "16px",
                          //       textAlign: "center",
                          //       cursor: "pointer",
                          //     }}
                          //   >
                          //     <div className="text-title-card">
                          //       Số dư khả dụng
                          //     </div>
                          //     <div className="text-value-card-green">
                          //       {PriceUtils.format(5000000)} iA
                          //     </div>
                          //   </div>
                          // }
                          trigger="focus"
                        >
                          <Button
                            className={"headerExtraBtn"}
                            type={"text"}
                            icon={
                              <WalletOutlined style={{ fontSize: "20px" }} />
                            }
                            onClick={() =>
                              router.push(AuthRouteUtils.toInternalWallet())
                            }
                          />
                        </Popover>
                      )}
                      <Button
                        className={"headerExtraBtn"}
                        type={"text"}
                        icon={<MessageOutlined style={{ fontSize: "20px" }} />}
                        // onClick={() => router.push(AuthRouteUtils.toChat())}
                      />
                      {!isMobile && (
                        <Button
                          className={"headerExtraBtn"}
                          type={"text"}
                          icon={<HeartOutlined style={{ fontSize: "20px" }} />}
                          onClick={() =>
                            router.push(AuthRouteUtils.toFavorite())
                          }
                        />
                      )}
                      <ButtonHeaderNotification />
                    </>

                    {isDesktop && (
                      <Popover
                        placement={"bottomRight"}
                        trigger={"click"}
                        content={
                          <Space
                            direction={"vertical"}
                            className={"d-flex"}
                            size={20}
                            style={{ padding: "24px 12px 12px 12px" }}
                          >
                            <Row gutter={16}>
                              <Col flex={"72px"}>
                                <Image
                                  preview={false}
                                  src={fullProfileResource?.avatarUrl}
                                  fallback={Images.ACCOUNT_DEFAULT}
                                  alt={"avatar"}
                                  className={"imgRounded"}
                                  width={56}
                                  height={56}
                                  style={{
                                    objectFit: "cover",
                                  }}
                                />
                              </Col>
                              <Col flex={"none"}>
                                <Typography.Title
                                  level={4}
                                  style={{ marginBottom: "4px" }}
                                >
                                  {fullProfileResource?.fullName}
                                </Typography.Title>
                                <Typography.Paragraph
                                  className={"nm-typo"}
                                  style={{ color: "#74767E" }}
                                >
                                  {fullProfileResource.email}
                                </Typography.Paragraph>
                              </Col>
                            </Row>
                            <Menu
                              className={"profileHeaderMenu"}
                              items={userMenu}
                            />
                            {/* {isPartner && (
                              <ReferralCode
                                code={toString(
                                  fullProfileResource?.referral_code
                                )}
                                title="Mã giới thiệu"
                              />
                            )} */}
                          </Space>
                        }
                        arrow={false}
                        overlayClassName={"headerPopover"}
                      >
                        <Button
                          size={"middle"}
                          type={"text"}
                          className={"headerExtraBtn btnUser"}
                          icon={
                            <Image
                              preview={false}
                              src={fullProfileResource?.avatarUrl}
                              fallback={Images.ACCOUNT_DEFAULT}
                              alt={"avatar"}
                              className={"imgRounded"}
                              width={38}
                              height={38}
                              style={{
                                objectFit: "cover",
                              }}
                            />
                          }
                          style={{ marginLeft: "10px" }}
                        />
                      </Popover>
                    )}
                  </>
                ) : (
                  isDesktop && (
                    <>
                      <Link href={AuthRouteUtils.toCheckRole()}>
                        <Button
                          size={"large"}
                          className={"headerExtraBtn"}
                          type={"default"}
                          onClick={handleClickLogin}
                        >
                          Đăng ký
                        </Button>
                      </Link>

                      <Link href={"/login"}>
                        <Button
                          size={"large"}
                          className={"headerExtraBtn"}
                          type={"primary"}
                          onClick={handleClickLogin}
                        >
                          Đăng nhập
                        </Button>
                      </Link>
                    </>
                  )
                )}
                {!isDesktop && isActuallyLoggedIn && fullProfileResource && (
                  <Button
                    size={"middle"}
                    type={"text"}
                    className={"headerExtraBtn btnUser"}
                    onClick={() => userMenuDrawerRef.current?.openDrawer()}
                    icon={
                      <Image
                        preview={false}
                        src={fullProfileResource?.avatarUrl}
                        fallback={Images.ACCOUNT_DEFAULT}
                        alt={"avatar"}
                        className={"imgRounded"}
                        width={38}
                        height={38}
                        style={{
                          objectFit: "cover",
                        }}
                      />
                    }
                  />
                )}
                {!isDesktop && (
                  <Button
                    className={"headerExtraBtn"}
                    type={"text"}
                    icon={<MenuOutlined style={{ fontSize: "20px" }} />}
                    onClick={() => menuDrawerRef.current?.openDrawer()}
                  />
                )}
              </Space>
            </Row>
          </Col>
        </Row>
        <SearchFilterHeader />
      </header>

      <MenuDrawer
        ref={menuDrawerRef}
        fullProfileResource={fullProfileResource}
        isActuallyLoggedIn={isActuallyLoggedIn}
        logoutMutation={logoutMutation}
        handleClickLogin={handleClickLogin}
      />

      <UserMenuDrawer
        ref={userMenuDrawerRef}
        fullProfileResource={fullProfileResource}
        logoutMutation={logoutMutation}
        userMenu={userMenu}
        handleClickLogin={handleClickLogin}
      />
    </>
  );
};

export default HeaderWithFilterCategory;
