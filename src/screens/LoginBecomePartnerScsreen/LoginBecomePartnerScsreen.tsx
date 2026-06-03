import React, { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Alert,
  Button,
  Checkbox,
  Form,
  Input,
  Row,
  Space,
  Typography,
} from "antd";
import { CheckCircleTwoTone } from "@ant-design/icons";
import Cookies from "js-cookie";

import useLoginV2 from "./hooks/useLoginV2";
import { LoginParams } from "@/src/data/auth/models/types";
import Constants from "@/src/constants/Constants";
import StringUtils from "@/src/utils/StringUtils";
import AuthRouteUtils from "@/src/data/auth/utils/AuthRouteUtils";
import useVerifyOtpResendV2 from "../VerifyOtpScreenV2/hooks/useVerifyOtpResendV2";
import AuthLayoutV2 from "@/src/layouts/AuthLayoutV2";
import FloatingButtonContacts from "@/src/components/FloatingButtonContacts";

function LoginBecomePartnerScsreen() {
  const router = useRouter();

  const loginMutationV2 = useLoginV2();
  const resendOtpV2 = useVerifyOtpResendV2();
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const message = router.query?.message;

  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const callback: string | undefined | null = useMemo(() => {
    const term = router.query?.callback;
    return term && StringUtils.decodeValue(term as string);
  }, [router.query?.callback]);

  useEffect(() => {
    if (callback && callback === Constants.KEY_VERIFY_EMAIL) {
      Cookies.remove(Constants.KEY_VERIFY_EMAIL);
    }
  }, [callback]);

  const handleLogin = async (values: LoginParams) => {
    setUserEmail(values.email); // Store email for resend
    setShowEmailVerification(false); // Reset verification state

    try {
      const result = await loginMutationV2.mutateAsync(values);

      if (result?.status === 401) {
        setShowEmailVerification(true);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleResendOtp = () => {
    if (userEmail) {
      resendOtpV2.mutate(
        { email: userEmail },
        {
          onSuccess: () => {
            Cookies.set(Constants.KEY_VERIFY_EMAIL, userEmail);
            router.replace(AuthRouteUtils.toVerifyOtpV2()).then(() => null);
          },
        }
      );
    }
  };

  if (!mounted) return;

  return (
    <AuthLayoutV2>
      <Head>
        <title>Đăng nhập tài khoản</title>
      </Head>

      <div className={"authContentWrapper"}>
        <div className={"authContentContainer"}>
          <h1 className={"authTitle"}>Đăng nhập tài khoản</h1>
          {callback && callback === Constants.KEY_VERIFY_EMAIL && (
            <Space
              size={"middle"}
              align={"center"}
              className={"successMessageWrapper"}
            >
              <CheckCircleTwoTone
                twoToneColor="#52c41a"
                className={"successIcon"}
              />
              <Typography.Paragraph className={"successMessage"}>
                Xác thực tài khoản thành công.
              </Typography.Paragraph>
            </Space>
          )}

          {showEmailVerification && (
            <Alert
              message={
                <div>
                  Tài khoản chưa được xác thực.{" "}
                  <Button
                    type="link"
                    onClick={handleResendOtp}
                    loading={resendOtpV2.isPending}
                    style={{ padding: 0 }}
                  >
                    Xác thực email để đăng nhập
                  </Button>
                </div>
              }
              type="warning"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}

          {message === "please_login_again" && (
            <Alert
              message="Vui lòng đăng nhập lại"
              description="Quá trình đăng nhập tự động không thành công. Vui lòng nhập lại thông tin đăng nhập."
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
              closable
            />
          )}

          <Form
            layout={"vertical"}
            name={"authLoginForm"}
            initialValues={
              {
                email: "",
                password: "",
              } as LoginParams
            }
            onFinish={handleLogin}
            onFinishFailed={() => null}
            autoComplete={"on"}
          >
            <Form.Item
              label={"Email"}
              name={"email"}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập email đã đăng ký để đăng nhập",
                },
                { type: "email", message: "Vui lòng nhập email hợp lệ" },
              ]}
            >
              <Input
                size={"large"}
                placeholder={"Nhập email đã đăng ký để đăng nhập"}
                autoComplete={"email"}
              />
            </Form.Item>

            <Form.Item
              label={"Mật khẩu"}
              name={"password"}
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
            >
              <Input.Password
                size={"large"}
                placeholder={"Nhập mật khẩu"}
                autoComplete={"current-password"}
              />
            </Form.Item>

            <Form.Item name={"remember"} valuePropName={"checked"}>
              <Row justify={"space-between"}>
                <Checkbox name={"remember"}>Lưu mật khẩu</Checkbox>

                <Link
                  href={AuthRouteUtils.toForgotPassword()}
                  className={"forgotPasswordLinkText link"}
                >
                  Quên mật khẩu?
                </Link>
              </Row>
            </Form.Item>

            <Form.Item>
              <Button
                type={"primary"}
                htmlType={"submit"}
                block={true}
                size={"large"}
              >
                Đăng nhập
              </Button>
            </Form.Item>

            <Row gutter={[10, 0]} justify={"center"}>
              <Space size={"small"}>
                <Typography.Paragraph className={"nm-typo"}>
                  Chưa có tài khoản?
                </Typography.Paragraph>
                <Link
                  href={AuthRouteUtils.toRegisterBecomePartner()}
                  className="registerLinkText link"
                  onClick={(e) => {
                    e.preventDefault();
                    router.replace(AuthRouteUtils.toRegisterBecomePartner());
                  }}
                >
                  Tạo tài khoản ngay
                </Link>
              </Space>
            </Row>
          </Form>
        </div>
      </div>

      <FloatingButtonContacts />
    </AuthLayoutV2>
  );
}

export default LoginBecomePartnerScsreen;
