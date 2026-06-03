import React, { useCallback, useImperativeHandle, useState } from "react";
import { Button, Col, Modal, Row, Typography } from "antd";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import { withThemeRevert } from "@/theme";
import { useRouter } from "next/router";
import { PartnerRouteUtils } from "@/src/data/partner/utils/PartnerRouteUtils";
import Cookies from "js-cookie";
import Constants from "@/src/constants/Constants";
import { useLogout } from "@/src/hooks/query/useLogout";
import Link from "next/link";
import { useAccountContext } from "@/src/contexts/AccountContext";

const PartnerRegisterSuccessModal = React.forwardRef((_, ref) => {
  const router = useRouter();
  const isSigningUpBecomePartner = Cookies.get(
    Constants.IS_REGISTER_BECOME_PARTNER
  );
  const [isOpen, setOpen] = useState<boolean>(false);

  const open = useCallback(() => setOpen(true), []);
  const { mutate: mutateLogout } = useLogout({
    onSuccess: () => {
      router.replace("/index.html").then(() => null);
    },
  });
  // const accountContext = useAccountContext();

  const close = useCallback(() => {
    setOpen(false);
    // accountContext.refreshAccount();
    if (isSigningUpBecomePartner && isSigningUpBecomePartner === "true") {
      Cookies.set(Constants.IS_REGISTER_BECOME_PARTNER, "false");
      Cookies.set(Constants.ROUTE_PRE_LOGIN, "/index.html");
      mutateLogout();
    } else {
      router.replace(PartnerRouteUtils.toProfileUrl()).then(() => null);
    }
  }, [router]);

  useImperativeHandle(
    ref,
    useCallback(() => ({ open, close }), [open, close])
  );

  return (
    <Modal
      open={isOpen}
      className={"PartnerRegisterSuccessModalContainer"}
      onCancel={close}
      closeIcon={null}
      footer={null}
      width={"580px"}
    >
      <Row justify={"center"} gutter={[30, 30]}>
        <Col span={24}>
          <Row justify={"center"} style={{ marginBottom: "12px" }}>
            <IconSvgLocal
              name={"IC_CHECK_SUCCESS"}
              fill={"none"}
              width={60}
              height={59}
            />
          </Row>
          <Typography.Paragraph className={"modalTitle"}>
            Đăng ký trở thành Đối tác thành công
          </Typography.Paragraph>
          <Typography.Paragraph className={"modalSubtitle text-center nm-typo"}>
            Hãy bắt đầu tìm kiếm những Công Việc phù hợp ngay hôm nay. <br />{" "}
            iAgree sẽ tiến hành xác thực danh tính tài khoản của bạn, và khi
            hoàn tất, bạn sẽ mở khóa toàn bộ tính năng — bao gồm rút tiền trực
            tiếp từ{" "}
            <Link
              target="_blank"
              // onClick={() => accountContext.refreshAccount()}
              style={{
                color: "#09993E",
              }}
              href="/internal-wallet"
            >
              trang Quản lý tài chính.
            </Link>
          </Typography.Paragraph>
        </Col>

        {withThemeRevert(
          <Button onClick={close} type={"primary"} style={{ width: "120px" }}>
            Đóng
          </Button>
        )}
      </Row>
    </Modal>
  );
});

PartnerRegisterSuccessModal.displayName = "PartnerRegisterSuccessModal";

export default PartnerRegisterSuccessModal;
