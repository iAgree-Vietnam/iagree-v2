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
import { signIn } from "next-auth/react";

import ValidatorUtils from "@/src/utils/ValidatorUtils";
import TermOfUseRouteUtils from "@/src/data/term-of-use/utils/TermOfUseRouteUtils";
import PrivacyPolicyRouteUtils from "@/src/data/privacy-policy/utils/PrivacyPolicyRouteUtils";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import useCompanyRegister from "../hooks/useCompanyRegister";

type FormValues = {
  name: string;
  tax_code: string;
  phone?: string;
  name_rep: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  acceptCondition: boolean;
};

const CompanyRegisterForm: React.FC = ({ }) => {
  const [form] = Form.useForm<FormValues>();
  const companyRegisterMutation = useCompanyRegister();
  const selectedMutation = companyRegisterMutation;

  const [useGeneratePassword, setUseGeneratePassword] = useState<{
    generate: boolean;
  }>({ generate: false });

  const generatePassword = () => {
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const numberChars = "0123456789";
    const specialChars = "!@#$%^&*()_+{}[]:;<>,.?~-";

    const pwd: string[] = [
      uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)],
      lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)],
      numberChars[Math.floor(Math.random() * numberChars.length)],
      specialChars[Math.floor(Math.random() * specialChars.length)],
    ];
    const all = uppercaseChars + lowercaseChars + numberChars + specialChars;
    while (pwd.length < 12)
      pwd.push(all[Math.floor(Math.random() * all.length)]);
    for (let i = pwd.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pwd[i], pwd[j]] = [pwd[j], pwd[i]];
    }
    return pwd.join("");
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
    // console.log('Email verification data:', values);
    selectedMutation.mutate(values as any);
  };

  return (
    <Form<FormValues>
      form={form}
      layout="vertical"
      name="companyAuthForm"
      initialValues={{
        name: "",
        tax_code: "",
        phone: "",
        name_rep: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        acceptCondition: false,
      }}
      autoComplete="off"
      onFinishFailed={() => null}
    >
      <Row gutter={[20, 0]}>
        <Col xs={24} lg={24}>
          <Form.Item
            label="Tên doanh nghiệp"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tên doanh nghiệp" },
            ]}
          >
            <Input size="large" placeholder="Tên doanh nghiệp" />
          </Form.Item>
        </Col>

        <Col xs={12} md={12}>
          <Form.Item
            label="Mã số thuế"
            name="tax_code"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mã số thuế"
              },
              {
                pattern: /^[0-9]{10,13}$/,
                message: "Mã số thuế phải gồm từ 10 đến 13 chữ số",
              },
            ]}
          >
            <Input size="large" placeholder="Mã số thuế" maxLength={13} />
          </Form.Item>
        </Col>

        <Col xs={12} md={12}>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            normalize={(v) => v?.trim().replace(/\D/g, "")}

            rules={[
              {
                message: "Vui lòng nhập số điện thoại",
                required: true,
              },
              {
                pattern: /^[0-9]{9,10}$/,
                message: "Số điện thoại phải gồm từ 9 đến 10 chữ số",
              },
            ]}
          >
            <Input inputMode="numeric"
              size="large" placeholder="Số điện thoại" />
          </Form.Item>
        </Col>

        <Col xs={12} md={12}>
          <Form.Item
            label="Người đại diện"
            name="name_rep"
            rules={[
              { required: true, message: "Vui lòng nhập tên người đại diện" },
            ]}
          >
            <Input size="large" placeholder="Người đại diện" />
          </Form.Item>
        </Col>

        <Col xs={12} md={12}>
          <Form.Item
            label="Email doanh nghiệp"
            name="email"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập email của doanh nghiệp",
              },
            ]}
          >
            <Input size="large" placeholder="Nhập email của doanh nghiệp" />
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
              {selectedMutation.isPending ? "Đang đăng ký" : "Đăng ký"}
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

export default CompanyRegisterForm;
