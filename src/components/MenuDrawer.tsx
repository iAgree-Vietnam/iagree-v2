"use client";

import {
  useCallback,
  useImperativeHandle,
  useState,
  forwardRef,
  useMemo,
} from "react";
import { Button, Drawer, Menu } from "antd";
import Link from "next/link";
import { useMenuDrawer } from "../hooks/useMenuDrawer";
import { FullProfileResource } from "../data/auth/models/types";
import { UseMutationResult } from "@tanstack/react-query";
import AuthRouteUtils from "../data/auth/utils/AuthRouteUtils";
import { useRouter } from "next/router";
import { ButtonHeaderNotification } from "@/src/components/notifications/ButtonHeaderNotification";

import {
  HeartOutlined,
  MenuOutlined,
  MessageOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { find, map, size } from "lodash";

export type MenuDrawerHelperVisible = {
  openDrawer: () => void;
  closeDrawer: () => void;
};

export interface MenuDrawerProps {
  fullProfileResource: Partial<FullProfileResource> | null;
  isActuallyLoggedIn: string | false | 0 | null;
  logoutMutation: UseMutationResult<unknown, unknown, void, unknown>;
  handleClickLogin: () => void;
}

const MenuDrawer = forwardRef((props: MenuDrawerProps, ref) => {
  const { fullProfileResource, isActuallyLoggedIn, handleClickLogin } = props;
  const [open, setOpen] = useState<boolean>(false);

  const openDrawer = useCallback(() => {
    setOpen(true);
  }, []);

  useImperativeHandle(
    ref,
    useCallback(() => ({ openDrawer }), [openDrawer])
  );

  const { menu } = useMenuDrawer({
    fullProfileResource,
    isActuallyLoggedIn,
  });
  const router = useRouter();

  const ListBtn = () => {
    return (
      <div
        style={{
          padding: "8px 24px",
          justifyContent: "center",
          display: "flex",
          gap: "24px",
        }}
        className="!flex !justify-center !px-6 underline"
      >
        <Button
          className={"headerExtraBtn"}
          type={"text"}
          icon={<WalletOutlined style={{ fontSize: "20px" }} />}
          onClick={() => router.push(AuthRouteUtils.toInternalWallet())}
        />
        <Button
          className={"headerExtraBtn"}
          type={"text"}
          icon={<MessageOutlined style={{ fontSize: "20px" }} />}
          onClick={() => router.push(AuthRouteUtils.toChat())}
        />
        <Button
          className={"headerExtraBtn"}
          type={"text"}
          icon={<HeartOutlined style={{ fontSize: "20px" }} />}
          onClick={() => router.push(AuthRouteUtils.toFavorite())}
        />
        <ButtonHeaderNotification />
      </div>
    );
  };
  const { pathname } = useRouter();

  return (
    <Drawer
      title={
        <Link className={"logo"} href={"/"}>
          <img
            alt={"iagree"}
            src={"/assets/img/logo.svg"}
            className={"logoImg"}
          />
        </Link>
      }
      placement={"left"}
      width={"85%"}
      onClose={() => setOpen(false)}
      open={open}
      closeIcon={false}
      className="menuDrawer"
    >
      <div className="">
        <Menu
          className={"menuContainer"}
          theme={"light"}
          mode={"inline"}
          items={menu}
        />
        <ListBtn />

        {!isActuallyLoggedIn && (
          <Link href={"/login"} className="d-block" style={{ padding: "16px" }}>
            <Button
              size={"large"}
              className={"menuDrawerBtn"}
              type={"primary"}
              onClick={handleClickLogin}
            >
              Đăng nhập
            </Button>
          </Link>
        )}
      </div>
    </Drawer>
  );
});

MenuDrawer.displayName = "MenuDrawer";

export default MenuDrawer;
