import React from "react";
import Head from "next/head";
import { Button, Row, Col, Form, Input, Space, Typography } from "antd";
import { CheckCircleTwoTone } from "@ant-design/icons";

import useVerifyOtpV2 from "./hooks/useVerifyOtpV2";
import { VerifyEmailResendParams } from "@/src/data/auth/models/types";
import { InputOTP } from "antd-input-otp";
import useVerifyOtpResendV2 from "./hooks/useVerifyOtpResendV2";
import AuthLayoutV2 from "@/src/layouts/AuthLayoutV2";
import { useAccountContext } from "@/src/contexts/AccountContext";

function VerifyOtpResendScreenV2(props: any) {
  const { data: email } = props;

  const { mutate, isPending } = useVerifyOtpV2();

  const resendOtp = useVerifyOtpResendV2();
  const { refreshAccount } = useAccountContext();

  return (
    <AuthLayoutV2>
      <Head>
        <title>Xác thực tài khoản</title>
      </Head>

      <div className={"authContentWrapper"}>
        <div className={"authContentContainer"}>
          <h1 className={"authTitle"}>Xác thực tài khoản</h1>
          <Typography.Paragraph className={"authDesc"}>
            Xác thực tài khoản để hoàn tất quá trình đăng ký
          </Typography.Paragraph>
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
              Hãy kiểm tra email của bạn. Sau đó nhập mã OTP trong hộp thư để
              xác thực tài khoản.
            </Typography.Paragraph>
          </Space>
          <Form
            layout={"vertical"}
            name={"resetPasswordForm"}
            // onFinish={mutate}
            onFinish={(value) => {
              const confirmationCode = value.confirmation_code.join("");
              mutate({ ...value, confirmation_code: confirmationCode });
              refreshAccount();
            }}
            onFinishFailed={() => null}
            autoComplete={"off"}
          >
            <Form.Item
              // label={'OTP'}
              name={"confirmation_code"}
              rules={[
                { required: true, message: "Vui lòng nhập OTP" },
                {
                  validator: (_, value) => {
                    if (!value || value.length !== 6) {
                      return Promise.reject(new Error("OTP phải gồm 6 chữ số"));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <InputOTP autoFocus inputType="numeric" length={6} />
            </Form.Item>
            <Row
              gutter={[20, 0]}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Col xs={20} lg={8}>
                <Form.Item noStyle>
                  <Button block htmlType="submit" type="primary">
                    Xác nhận
                  </Button>
                </Form.Item>
              </Col>
              <Col xs={20} lg={8}>
                <Form.Item noStyle>
                  <Button block htmlType="reset">
                    Xóa
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>

          <Form
            initialValues={
              {
                email: email,
              } as VerifyEmailResendParams
            }
            onFinish={resendOtp.mutate}
            onFinishFailed={() => null}
            autoComplete={"off"}
            style={{ marginTop: 10, textAlign: "center" }}
          >
            <Form.Item
              label={"Email"}
              name={"email"}
              style={{ display: "none" }}
            >
              <Input size={"large"} placeholder={"name@company.com"} disabled />
            </Form.Item>
            <Typography.Paragraph
              className={"successMessage d-inline-block m-auto"}
            >
              Bạn không nhận được OTP xác thực?
            </Typography.Paragraph>
            <Button
              className={"d-inline-block resend-verify-email"}
              type={"link"}
              htmlType={"submit"}
              size={"large"}
              disabled={isPending}
            >
              Gửi lại
            </Button>
          </Form>
        </div>
      </div>
    </AuthLayoutV2>
  );
}

export default VerifyOtpResendScreenV2;
