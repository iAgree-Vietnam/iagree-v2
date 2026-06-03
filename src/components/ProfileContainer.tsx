import React, { useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Row, Col, Menu, Typography, Space, message } from "antd";
import {
  AccountBookOutlined,
  HeartOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { ItemType } from "antd/es/menu/interface";

import { useAccountContext } from "@/src/contexts/AccountContext";
import { useLogout } from "@/src/hooks/query/useLogout";
import AuthRouteUtils from "@/src/data/auth/utils/AuthRouteUtils";
import { IconSvgLocal } from "./icon-svg-local";
import Constants from "../constants/Constants";
import { compact } from "lodash";

interface ProfileContainerProps {
  children: React.ReactNode;
}

export function ProfileContainer({ children }: ProfileContainerProps) {
  const router = useRouter();

  const { auth: userInfo } = useAccountContext();
  const isPartner = useMemo(() => {
    return userInfo?.partner?.status === Constants.PARTNER.DA_DUYET;
  }, [userInfo]);

  const { mutate } = useLogout({
    onSuccess: () => {
      router.push("/");
      message.success("Đăng xuất tài khoản thành công").then(() => null);
    },
  });

  const profileTitle =
    userInfo?.accountType === "PERSONAL"
      ? "Thông tin cá nhân"
      : "Thông tin doanh nghiệp";

  const profileSideMenu: Array<ItemType & { key: string }> = compact([
    {
      key: AuthRouteUtils.toProfile(),
      label: <Link href={AuthRouteUtils.toProfile()}>{profileTitle}</Link>,
      icon: <IconSvgLocal name={"IC_USER"} />,
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
    //     <Link href={AuthRouteUtils.toSubScription()}>Gói dịch vụ của tôi</Link>
    //   ),
    //   icon: <IconSvgLocal name={"IC_WALLET"} />,
    // },
    isPartner && {
      key: AuthRouteUtils.toManageChance(),
      label: <Link href={AuthRouteUtils.toManageChance()}>Quản lý Cơ Hội</Link>,
      icon: <AccountBookOutlined style={{ fontSize: "16px" }} />,
    },

    isPartner && {
      key: AuthRouteUtils.toAnalyst(),
      label: <Link href={AuthRouteUtils.toAnalyst()}>Thống kê giới thiệu</Link>,
      icon: <TeamOutlined />, 
    },
    {
      key: AuthRouteUtils.toNotification(),
      label: <Link href={AuthRouteUtils.toNotification()}>Thông báo</Link>,
      icon: <IconSvgLocal name={"IC_NOTIFICATION"} />,
    },
    {
      key: AuthRouteUtils.toFavorite(),
      label: <Link href={AuthRouteUtils.toFavorite()}>Yêu thích</Link>,
      icon: <HeartOutlined style={{ fontSize: "16px" }} />,
    },
    {
      key: AuthRouteUtils.toChangePassword(),
      label: <Link href={AuthRouteUtils.toChangePassword()}>Đổi mật khẩu</Link>,
      icon: <IconSvgLocal name={"IC_PADLOCK"} />,
    },
    {
      key: "logout",
      label: "Đăng xuất",
      icon: <IconSvgLocal name={"IC_LOG_OUT"} fill={"#E14141"} />,
      onClick: () => mutate(),
    },
  ]);

  const selectedMenu = useMemo(() => {
    if (router.asPath === AuthRouteUtils.toProfile()) {
      return [router.asPath];
    } else {
      const active = profileSideMenu
        .slice(1)
        .find((item) => router.asPath.includes(item.key));
      if (active) return [active.key];
      else return [];
    }
  }, [router]);

  return (
    <section className={"sectionContainer templateSectionContainer profile"}>
      <div className="contentWrapper">
        <Row gutter={[60, 24]} align={"top"}>
          <Col xs={24} lg={6}>
            <div className="sidebar">
              <Space
                align={"start"}
                direction={"vertical"}
                size={"small"}
                className={"d-flex"}
              >
                <Typography className={"greetingText"}>Xin chào</Typography>
                <Typography className={"userFullname"}>
                  {userInfo?.fullName}
                </Typography>
              </Space>
              <Menu
                // activeKey={'all'}
                items={profileSideMenu}
                selectedKeys={selectedMenu}
              />
            </div>
          </Col>
          <Col xs={24} lg={18}>
            <div className={"content"}>{children}</div>
          </Col>
        </Row>
      </div>
    </section>
  );
}
