// src/screens/PasswordScreen/ForgotPasswordScreen/index.tsx
import React, { useState } from "react";
import Head from "next/head";
import { Button, Form, Input, Typography, Space, Row } from "antd";
import { CheckCircleTwoTone } from "@ant-design/icons";
import Link from "next/link";

import AuthLayout from "@/src/layouts/AuthLayout";
import useForgotPassword from "./hooks/useForgotPassword";
import { ForgotPasswordParams } from "@/src/data/auth/models/types";
import { useLogout } from "@/src/hooks/query/useLogout";

function ForgotPasswordScreen() {
  const [success, setSuccess] = useState(false);

  const logoutMutation = useLogout();
  const forgotPasswordMutation = useForgotPassword({
    onSuccess: () => {
      setSuccess(true);
      logoutMutation.mutate();
    },
  });

  return (
    <AuthLayout>
      <Head>
        <title>Quên mật khẩu</title>
      </Head>

      <div className="authContentWrapper">
        <div className="authContentContainer">
          <h1 className="authTitle">Quên mật khẩu tài khoản</h1>

          {success && (
            <Space
              size="middle"
              align="center"
              className="successMessageWrapper"
            >
              <CheckCircleTwoTone
                twoToneColor="#52c41a"
                className="successIcon"
              />
              <Typography.Paragraph className="successMessage">
                Hãy kiểm tra email của bạn. Sau đó nhấn vào link trong hộp thư
                để đổi lại mật khẩu.
              </Typography.Paragraph>
            </Space>
          )}

          <Form<ForgotPasswordParams>
            layout="vertical"
            name="forgotPasswordForm"
            initialValues={{ email: "" }}
            onFinish={forgotPasswordMutation.mutate}
            onFinishFailed={() => null}
            autoComplete="off"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Vui lòng nhập email hợp lệ" },
              ]}
            >
              <Input size="large" placeholder="Nhập email" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                disabled={forgotPasswordMutation.isLoading}
                loading={forgotPasswordMutation.isLoading}
              >
                Gửi
              </Button>
            </Form.Item>

            <Row gutter={[10, 0]} justify="center">
              <Space size={4}>
                <Typography.Paragraph className="nm-typo">
                  Quay lại trang
                </Typography.Paragraph>
                <Link href="/login" className="registerLinkText link">
                  đăng nhập
                </Link>
              </Space>
            </Row>
          </Form>
        </div>
      </div>
    </AuthLayout>
  );
}

export default ForgotPasswordScreen;