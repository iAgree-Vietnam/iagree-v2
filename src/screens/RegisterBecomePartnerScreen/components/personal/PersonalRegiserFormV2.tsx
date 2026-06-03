import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Row,
  Space,
  Typography,
} from "antd";
import Link from "next/link";
import ValidatorUtils from "@/src/utils/ValidatorUtils";
import TermOfUseRouteUtils from "@/src/data/term-of-use/utils/TermOfUseRouteUtils";
import PrivacyPolicyRouteUtils from "@/src/data/privacy-policy/utils/PrivacyPolicyRouteUtils";
import usePersonalRegisterV2 from "../../hooks/usePersonalRegisterV2";
import useVerifyOtpResendV2 from "@/src/screens/VerifyOtpScreenV2/hooks/useVerifyOtpResendV2";
import { RegisterParams } from "@/src/data/auth/models/types";
import AuthRouteUtils from "@/src/data/auth/utils/AuthRouteUtils";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import Constants from "@/src/constants/Constants";

type PersonalRegisterFormV2Props = {};

type FormValues = {
  name: string;
  email: string;
  phone?: string;
  password: string;
  passwordConfirmation: string;
  acceptCondition: boolean;
};

const PersonalRegisterFormV2: React.FC<PersonalRegisterFormV2Props> = () => {
  const router = useRouter();
  const [form] = Form.useForm<FormValues>();

  const personalRegisterMutationV2 = usePersonalRegisterV2();
  const resendOtpV2 = useVerifyOtpResendV2();
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const [useGeneratePassword, setUseGeneratePassword] = useState<{
    generate: boolean;
  }>({ generate: false });

  const generatePassword = () => {
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const numberChars = "0123456789";
    const specialChars = "!@#$%^&*()_+{}[]:;<>,.?~-";

    const password: string[] = [
      uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)],
      lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)],
      numberChars[Math.floor(Math.random() * numberChars.length)],
      specialChars[Math.floor(Math.random() * specialChars.length)],
    ];

    const allChars =
      uppercaseChars + lowercaseChars + numberChars + specialChars;
    while (password.length < 12) {
      password.push(allChars[Math.floor(Math.random() * allChars.length)]);
    }

    for (let i = password.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [password[i], password[j]] = [password[j], password[i]];
    }
    return password.join("");
  };

  useEffect(() => {
    if (useGeneratePassword.generate) {
      const generated = generatePassword();
      form.setFieldsValue({
        password: generated,
        passwordConfirmation: generated,
      });
    } else {
      form.setFieldsValue({ password: "", passwordConfirmation: "" });
    }
  }, [useGeneratePassword, form]);

  const handleRegister = async () => {
    const values = await form.validateFields();
    setUserEmail(values.email);
    setShowEmailVerification(false);
    setShowLogin(false);

    try {
      const result = await personalRegisterMutationV2.mutateAsync(
        values as unknown as RegisterParams
      );

      if (
        result?.message ===
        "Tài khoản Email của bạn đã được đăng ký thành công nhưng chưa được xác thực."
      ) {
        setShowLogin(false);
        setShowEmailVerification(true);
      }

      if (
        result?.message ===
        "Tài khoản Email của bạn đã được đăng ký thành công và xác thực. Vui lòng thực hiện đăng nhập."
      ) {
        setShowEmailVerification(false);
        setShowLogin(true);
      }
    } catch (err: any) {
      const apiMsg = err?.response?.data?.message;

      if (
        apiMsg ===
        "Tài khoản Email của bạn đã được đăng ký thành công nhưng chưa được xác thực."
      ) {
        setShowLogin(false);
        setShowEmailVerification(true);
      }

      if (
        apiMsg ===
        "Tài khoản Email của bạn đã được đăng ký thành công và xác thực. Vui lòng thực hiện đăng nhập."
      ) {
        setShowEmailVerification(false);
        setShowLogin(true);
      }
    }
  };

  const handleResendOtp = async () => {
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

  const handleLogin = () => {
    router.replace(AuthRouteUtils.toLoginBecomePartner());
  };

  return (
    <Form<FormValues>
      className="!w-full"
      form={form}
      layout="vertical"
      name="authForm"
      initialValues={{
        name: "",
        email: "",
        phone: "",
        password: "",
        passwordConfirmation: "",
        acceptCondition: false,
      }}
      onFinish={() => null}
      onFinishFailed={() => null}
      autoComplete="off"
    >
      {showEmailVerification && (
        <Alert
          message={
            <div>
              Tài khoản email đã tồn tại và chưa được xác thực.{" "}
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

      {showLogin && (
        <Alert
          message={
            <div>
              Tài khoản email đã tồn tại và đã được xác thực.{" "}
              <Button
                type="link"
                onClick={handleLogin}
                loading={resendOtpV2.isPending}
                style={{ padding: 0 }}
              >
                Đăng nhập ngay
              </Button>
            </div>
          }
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Row gutter={[20, 0]}>
        <Col xs={24} lg={24}>
          <Form.Item
            label="Họ và tên"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input size="large" placeholder="Nhập họ và tên" />
          </Form.Item>
        </Col>

        <Col xs={24} lg={24}>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              {
                transform: (v) => v?.trim(),
                pattern: /^[0-9]{10}$/,
                message: "Số điện thoại không hợp lệ",
              },
              { required: true, message: "Vui lòng nhập số điện thoại" }
            ]}
          >
            <Input size="large" placeholder="Nhập số điện thoại" />
          </Form.Item>
        </Col>

        <Col xs={24} lg={24}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập email" }]}
          >
            <Input size="large" placeholder="Nhập email" />
          </Form.Item>
        </Col>

        <Col xs={24} lg={12}>
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu" },
              { validator: ValidatorUtils.passwordValidator },
            ]}
          >
            <Input.Password size="large" placeholder="Nhập mật khẩu" />
          </Form.Item>

          <Checkbox
            checked={useGeneratePassword.generate}
            onChange={(e) =>
              setUseGeneratePassword({ generate: e.target.checked })
            }
          >
            Đề xuất mật khẩu
          </Checkbox>
        </Col>

        <Col xs={24} lg={12}>
          <Form.Item
            label="Xác nhận mật khẩu"
            name="passwordConfirmation"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập lại mật khẩu để xác nhận",
              },
              { validator: ValidatorUtils.passwordValidator },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value)
                    return Promise.resolve();
                  return Promise.reject(
                    new Error("Mật khẩu bạn nhập đang không khớp")
                  );
                },
              }),
            ]}
          >
            <Input.Password size="large" placeholder="Nhập mật khẩu xác nhận" />
          </Form.Item>
        </Col>
      </Row>

      <Row justify="center">
        <Form.Item
          name="acceptCondition"
          valuePropName="checked"
          rules={[
            {
              validator: async (_, checked) => {
                if (!checked) {
                  return Promise.reject(
                    new Error(
                      "Bạn cần đồng ý với điều khoản dịch vụ và chính sách bảo mật của iAgree"
                    )
                  );
                }
              },
            },
          ]}
        >
          <Checkbox name="acceptCondition">
            Tôi đã đọc và đồng ý với{" "}
            <Link
              target="_blank"
              href={TermOfUseRouteUtils.toScreen()}
              className="termAndConditionLinkText link"
            >
              Điều khoản dịch vụ
            </Link>{" "}
            và{" "}
            <Link
              target="_blank"
              href={PrivacyPolicyRouteUtils.toScreen()}
              className="termAndConditionLinkText link"
            >
              Chính sách bảo mật
            </Link>{" "}
            của iAgree
          </Checkbox>
        </Form.Item>
      </Row>

      <Row
        gutter={[20, 0]}
        style={{ display: "flex", justifyContent: "center" }}
      >
        <Col xs={24} lg={12}>
          <Form.Item>
            <Button
              type="primary"
              htmlType="button"
              block
              size="large"
              disabled={personalRegisterMutationV2.isPending}
              onClick={handleRegister}
            >
              {personalRegisterMutationV2.isPending
                ? "Đang đăng ký"
                : "Đăng ký"}
            </Button>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[10, 0]} justify="center">
        <Space size="small">
          <Typography.Paragraph className="nm-typo">
            Đã có tài khoản?
          </Typography.Paragraph>
          <Link
            href={AuthRouteUtils.toLoginBecomePartner()}
            className="registerLinkText link"
            onClick={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            Đăng nhập ngay
          </Link>
        </Space>
      </Row>
    </Form>
  );
};

export default PersonalRegisterFormV2;
