import React, { useEffect } from "react";
import { Form, Input, Typography, Row, Col, Select } from "antd";
import AppIDUpload from "@/src/screens/ProfileScreen/components/AppIDUpload";
import { PARTNER_REGISTER_FORM } from "../../constants/PartnerRegisterConstants";
import { PartnerSelectBoxResource } from "@/src/data/partner/models/partner.types";
import { useAccountContext } from "@/src/contexts/AccountContext";

const { Title, Paragraph } = Typography;
interface Step10PageProps {
  selectBoxResource?: PartnerSelectBoxResource;
  isInitialRender: boolean;
  onInit: () => void;
}

const formatBankAccountName = (value: string) => {
  if (!value) return "";
  const cleanValue = value.replace(/[^a-zA-Z\s]/g, "");

  const nonAccentValue = cleanValue
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return nonAccentValue.toUpperCase();
};

export const Step10Page: React.FC<Step10PageProps> = ({
  selectBoxResource,
  isInitialRender,
  onInit,
}) => {
  const form = Form.useFormInstance();
  // const { auth: userInfo } = useAccountContext();

  const handleAccountNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const formattedValue = formatBankAccountName(value);

    form.setFieldsValue({
      [PARTNER_REGISTER_FORM.FIELD_NAME.STEP10_DATA]: {
        ...form.getFieldValue(PARTNER_REGISTER_FORM.FIELD_NAME.STEP10_DATA),
        bankAccountName: formattedValue,
      },
    });
  };

  // useEffect(() => {
  //   if (isInitialRender) {
  //     form.setFieldsValue({
  //       [PARTNER_REGISTER_FORM.FIELD_NAME.STEP10_DATA]: {
  //         bankId: null,
  //         accountNumber: null,
  //         bankAccountName: null,
  //         qrCode: null,
  //       },
  //     });
  //     onInit();
  //   }
  // }, [isInitialRender, userInfo, form, onInit]);

  return (
    <div style={{ padding: "0 0" }}>
      <div style={{ marginBottom: "15px" }}>
        <Title
          level={2}
          style={{ margin: 0, color: "#333", marginBottom: "10px" }}
        >
          Thiết lập thanh toán
        </Title>
        <Paragraph style={{ color: "#09993E" }}>
          Vui lòng cung cấp thông tin tài khoản nhận thanh toán của bạn để có
          thể giao dịch trên iAgree.
        </Paragraph>
      </div>

      <div
        style={{
          paddingLeft: 16,
          paddingRight: 16,
          paddingBottom: 8,
          paddingTop: 8,
          border: "1px solid #D4D4D4",
          borderRadius: "6px",
        }}
      >
        <Row gutter={[20, 20]}>
          <Col xs={24} lg={12}>
            <Form.Item
              label={"Ngân hàng"}
              name={[PARTNER_REGISTER_FORM.FIELD_NAME.STEP10_DATA, "bankId"]}
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn ngân hàng",
                },
              ]}
            >
              <Select
                options={selectBoxResource?.banks?.map((bankItem) => ({
                  value: bankItem.bankId,
                  label: `${bankItem.name} - (${bankItem.bankCode})`,
                }))}
                placeholder={"Chọn ngân hàng"}
                size={"large"}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </Form.Item>
          </Col>

          <Col xs={24} lg={12}>
            <Form.Item
              label={"Số tài khoản"}
              name={[
                PARTNER_REGISTER_FORM.FIELD_NAME.STEP10_DATA,
                "accountNumber",
              ]}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số tài khoản nhận",
                },
                {
                  pattern: /^[0-9]*$/,
                  message: "Số tài khoản chỉ được chứa ký tự số!",
                },
              ]}
            >
              <Input
                size={"large"}
                placeholder={"Nhập số tài khoản"}
                type="number"
              />
            </Form.Item>
          </Col>

          <Col xs={24} lg={12}>
            <Form.Item
              label={"Tên tài khoản"}
              name={[
                PARTNER_REGISTER_FORM.FIELD_NAME.STEP10_DATA,
                "bankAccountName",
              ]}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên tài khoản",
                },
              ]}
            >
              <Input
                size={"large"}
                placeholder={"Nhập tên tài khoản"}
                onChange={handleAccountNameChange}
              />
            </Form.Item>
          </Col>

          {/* <Col xs={24} lg={12}>
            <Title level={5}>
              Hình QR mã tài khoản nhận thanh toán{" "}
              <span
                style={{
                  color: "#8c8c8c",
                  fontSize: "14px",
                  fontWeight: "400",
                }}
              >
                (tuỳ chọn)
              </span>
            </Title>
            <Form.Item
              name={[PARTNER_REGISTER_FORM.FIELD_NAME.STEP10_DATA, "qrCode"]}
            >
              <AppIDUpload />
            </Form.Item>
          </Col> */}
        </Row>
      </div>
    </div>
  );
};
