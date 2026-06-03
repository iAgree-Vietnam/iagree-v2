import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { signIn, useSession } from "@/lib/shim/next-auth-react";
import {
  Alert,
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  Row,
  Space,
  Typography,
} from "antd";
import { CheckCircleTwoTone } from "@ant-design/icons";
import Cookies from "js-cookie";

import AuthLayout from "@/src/layouts/AuthLayout";
import useLogin from "./hooks/useLogin";
import { LoginParams } from "@/src/data/auth/models/types";
import Constants from "@/src/constants/Constants";
import StringUtils from "@/src/utils/StringUtils";
import AuthRouteUtils from "@/src/data/auth/utils/AuthRouteUtils";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import useVerifyOtpResendV2 from "../VerifyOtpScreenV2/hooks/useVerifyOtpResendV2";

function LoginScreen(props: any) {
  const router = useRouter();
  const { data: session, status } = useSession();

  const loginMutation = useLogin();

  const resendOtp = useVerifyOtpResendV2();
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const message = router.query?.message;

  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && status === "unauthenticated") {
      // Clear any remaining invalid tokens
      const clearInvalidTokens = async () => {
        try {
          // Clear localStorage/sessionStorage if any
          if (typeof window !== "undefined") {
            localStorage.removeItem("next-auth.session-token");
            sessionStorage.removeItem("next-auth.session-token");
          }
        } catch (error) {
          console.error("Error clearing tokens:", error);
        }
      };

      clearInvalidTokens();
    }
  }, [mounted, status]);


  // useEffect(() => {
  //     if (mounted && status === 'loading') return;

  //     if (status === 'authenticated' && session?.jwt) {
  //         // User is authenticated, redirect away from login page
  //         router.push(Constants.ROUTE_PRE_LOGIN);
  //     }
  // }, [mounted, status, session, router]);

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
      const result = await loginMutation.mutateAsync(values);

      if (result?.status === 401) {
        setShowEmailVerification(true);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleResendOtp = async () => {
    // if (userEmail) {
    //     resendOtp.mutate(
    //         { email: userEmail },
    //         {
    //             onSuccess: () => {
    //                 router.push('/verify-otp');
    //             },
    //         }
    //     );
    // }
    if (!userEmail) return;

    try {
      await resendOtp.mutateAsync({ email: userEmail });

      router.push("/verify-otp");
    } catch (error) {
      console.error("resend otp failed:", error);
    }
  };

  if (!mounted) return;

  return (
    <AuthLayout>
      <Head>
        <title>Đăng nhập tài khoản</title>
      </Head>

      <div className={"authContentWrapper"}>
        <div className={"authContentContainer"}>
          <h1 className={"authTitle"}>Đăng nhập</h1>
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
                    loading={resendOtp.isPending}
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
              label={"Email đăng nhập"}
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

            <Form.Item>
              <Row gutter={[10, 0]} justify={"center"}>
                <Space size={"small"}>
                  <Typography.Paragraph className={"nm-typo"}>
                    Chưa có tài khoản?
                  </Typography.Paragraph>
                  <Link
                    href={AuthRouteUtils.toCheckRole()}
                    className={"registerLinkText link"}
                  >
                    Tạo tài khoản ngay
                  </Link>
                </Space>
              </Row>
            </Form.Item>

            <Divider>Hoặc đăng nhập với</Divider>

            <Row justify={"center"}>
              <Button
                type={"text"}
                htmlType={"button"}
                size={"large"}
                icon={
                  <IconSvgLocal name={"IC_GOOGLE"} width={40} height={40} />
                }
                className={"btnHasImageIcon"}
                onClick={() => signIn("google")}
              />
            </Row>
          </Form>
        </div>
      </div>
    </AuthLayout>
  );
}

export default LoginScreen;
