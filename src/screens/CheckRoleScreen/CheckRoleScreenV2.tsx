import React, { useEffect, useRef } from "react";
import AuthLayout from "../../layouts/AuthLayout";
import Head from "next/head";
import {
  Button,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Space,
  Typography,
} from "antd";
import Link from "next/link";
import ValidatorUtils from "@/src/utils/ValidatorUtils";
import { signIn } from "next-auth/react";
import TermOfUseRouteUtils from "@/src/data/term-of-use/utils/TermOfUseRouteUtils";
import PrivacyPolicyRouteUtils from "@/src/data/privacy-policy/utils/PrivacyPolicyRouteUtils";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import { values } from "lodash";
import { useRouter } from "next/router";
import Constants from "@/src/constants/Constants";
import Cookies from "js-cookie";
import { PartnerRouteUtils } from "@/src/data/partner/utils/PartnerRouteUtils";

function CheckRoleScreen(props: any) {
  const router = useRouter();

  const email = Cookies.get(Constants.KEY_VERIFY_EMAIL);
  const password = Cookies.get(Constants.KEY_PASSWORD);

  const jobDetailRoute = Cookies.get('JOB_DETAIL_PAGE');

  const handleClientButton = () => {
    // signIn("credentials", {
    //   email,
    //   password,
    //   redirect: false,
    // });
    if (jobDetailRoute) {
      Cookies.set(Constants.ROUTE_PRE_LOGIN, jobDetailRoute);
    } else {
      Cookies.set(Constants.ROUTE_PRE_LOGIN, "/");
    }

    router.push("/register");
  };

  const handlePartnerButton = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    Cookies.set(Constants.ROUTE_PRE_LOGIN, PartnerRouteUtils.toPartnerRegisterGetStart());
    router.push('/register');

    // signIn("credentials", {
    //   email,
    //   password,
    //   redirect: false,
    // });
  };

  return (
    <AuthLayout>
      <Head>
        <title>Đăng ký tài khoản</title>
      </Head>

      <div className={"authContentWrapper"}>
        <div className={"authContentContainer"}>
          <h1 className={"authTitle"}>
            Tham gia với tư cách là khách hàng hoặc đối tác
          </h1>

          <Row
            gutter={[24, 0]}
            style={{ display: "flex", justifyContent: "center", marginTop: 20 }}
          >
            <Col xs={24} lg={12}>
              {/* <Form.Item> */}
              <Button
                htmlType={"button"}
                block={true}
                size={"large"}
                onClick={handleClientButton}
              >
                Khách hàng
              </Button>
              {/* </Form.Item> */}
            </Col>
            <Col xs={24} lg={12}>
              {/* <Form.Item> */}
              <Button
                htmlType={"button"}
                block={true}
                size={"large"}
                onClick={handlePartnerButton}
              >
                Đối tác
              </Button>
              {/* </Form.Item> */}
            </Col>
          </Row>

          {/* <Row gutter={[10, 0]} justify={'center'}>
                        <Space size={'small'}>
                            <Typography.Paragraph className={'nm-typo'}>
                                Đã có tài khoản?
                            </Typography.Paragraph>
                            <Link href={'/login'} className={'registerLinkText link'}>
                                Đăng nhập ngay
                            </Link>
                        </Space>
                    </Row> */}
        </div>
      </div>
    </AuthLayout>
  );
}

export default CheckRoleScreen;
