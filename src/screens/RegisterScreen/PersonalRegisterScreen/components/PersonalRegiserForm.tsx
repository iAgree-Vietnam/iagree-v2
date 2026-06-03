import React, { useEffect, useState } from "react";
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
import { signIn } from "@/lib/shim/next-auth-react";
import ValidatorUtils from "@/src/utils/ValidatorUtils";
import TermOfUseRouteUtils from "@/src/data/term-of-use/utils/TermOfUseRouteUtils";
import PrivacyPolicyRouteUtils from "@/src/data/privacy-policy/utils/PrivacyPolicyRouteUtils";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import useRegisterOtp from "../hooks/useRegisterOtp";

type FormValues = {
  name: string;
  email: string;
  phone?: string;
  password: string;
  passwordConfirmation: string;
  acceptCondition: boolean;
};

const PersonalRegisterForm: React.FC = ({ }) => {
  const [form] = Form.useForm<FormValues>();

  const personalRegisterMutation = useRegisterOtp();

  const selectedMutation = personalRegisterMutation;

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
    // Có thể logging nếu cần
    selectedMutation.mutate(values as any);
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
            normalize={(v) => v?.trim().replace(/\D/g, "")}

            rules={[
              {
                required: true,
                pattern: /^[0-9]{10}$/,
                message: "Số điện thoại không hợp lệ",
              },
            ]}
          >
            <Input
              size="large"
              placeholder="Nhập số điện thoại"
              inputMode="numeric"
            />
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
              disabled={selectedMutation.isPending}
              onClick={handleRegister}
            >
              {selectedMutation.isPending
                ? "Đang đăng ký"
                : "Đăng ký"}
            </Button>
          </Form.Item>
        </Col>
      </Row>
      <Divider>Hoặc đăng ký bằng</Divider>
      <Row justify="center">
        <Button
          type="text"
          htmlType="button"
          size="large"
          icon={<IconSvgLocal name="IC_GOOGLE" width={40} height={40} />}
          className="btnHasImageIcon"
          onClick={() => signIn("google")}
        />
      </Row>
      <Row gutter={[10, 0]} justify="center">
        <Space size="small">
          <Typography.Paragraph className="nm-typo">
            Đã có tài khoản?
          </Typography.Paragraph>
          <Link href="/login" className="registerLinkText link">
            Đăng nhập ngay
          </Link>
        </Space>
      </Row>
    </Form>
  );
};

export default PersonalRegisterForm;
