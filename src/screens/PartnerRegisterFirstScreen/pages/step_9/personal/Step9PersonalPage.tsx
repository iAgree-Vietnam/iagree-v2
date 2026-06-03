import React, { useEffect } from "react";
import { Form, Input, Typography, Row, Col, FormInstance } from "antd";
import AppIDUpload from "@/src/screens/ProfileScreen/components/AppIDUpload";
import { PARTNER_REGISTER_FORM } from "../../../constants/PartnerRegisterConstants";
import { useAccountContext } from "@/src/contexts/AccountContext";
import { isEmpty } from "lodash";

const { Title, Paragraph } = Typography;

interface Step9PageProps {
  form: FormInstance;
  isInitialRender: boolean;
  onInit: () => void;
}

export const Step9PersonalPage: React.FC<Step9PageProps> = ({
  form,
  isInitialRender,
  onInit,
}) => {
  const { auth: userInfo } = useAccountContext();
  const step9Data = localStorage.getItem("cardNumber");
  const cardNumber = Form.useWatch(
    PARTNER_REGISTER_FORM.FIELD_NAME.STEP9_PERSONAL_DATA,
    form
  );

  useEffect(() => {
    if (isInitialRender) {
      form.setFieldsValue({
        [PARTNER_REGISTER_FORM.FIELD_NAME.STEP9_PERSONAL_DATA]: {
          cardNumber: userInfo?.cardNumber,
          taxCode: userInfo?.taxCode,
          frontCard: userInfo?.frontCard,
          backCard: userInfo?.backCard,
        },
      });
      onInit();
    }
    // return () => {
    //   localStorage.removeItem("cardNumber");
    // };
  }, [isInitialRender, userInfo, form, onInit]);
  useEffect(() => {
    if (step9Data || userInfo?.citizenId) {
      form.setFieldsValue({
        [PARTNER_REGISTER_FORM.FIELD_NAME.STEP9_PERSONAL_DATA]: {
          cardNumber: step9Data || userInfo?.citizenId,
        },
      });
    }
    // return () => {
    //   localStorage.removeItem("cardNumber");
    // };
  }, [userInfo, form, cardNumber]);

  return (
    <div style={{ padding: "0 0" }}>
      <div style={{ marginBottom: "15px" }}>
        <Title
          level={2}
          style={{ margin: 0, color: "#333", marginBottom: "10px" }}
        >
          Xác minh thông tin cá nhân
        </Title>
        <Paragraph style={{ color: "#09993E" }}>
          Để đảm bảo tính bảo mật và tin cậy cho cộng đồng iAgree, vui lòng xác
          minh danh tính của bạn bằng cách cung cấp thông tin dưới đây.
        </Paragraph>
      </div>

      <div
        style={{
          marginBottom: 12,
          borderRadius: 8,
          paddingInline: 20,
          paddingBottom: 12,
          paddingTop: 12,
          border: "1px solid #D4D4D4",
        }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Title level={5}>
              Số CCCD/CMND <span style={{ color: "red" }}>*</span>
              <span
                style={{
                  color: "#8c8c8c",
                  fontSize: "14px",
                  fontWeight: "400",
                }}
              >
                {/* (tuỳ chọn) */}
              </span>
            </Title>
            <Form.Item
              name={[
                PARTNER_REGISTER_FORM.FIELD_NAME.STEP9_PERSONAL_DATA,
                "cardNumber",
              ]}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số CCCD/CMND",
                },
                {
                  min: 10,
                  message:
                    "Số CCCD/CMND phải có ít nhất 10 - 12 kí tự, chỉ chứa ký tự số",
                },
                {
                  max: 12,
                  message:
                    "Số CCCD/CMND phải có ít nhất 10 - 12 kí tự, chỉ chứa ký tự số",
                },
                {
                  pattern: /^[0-9]*$/,
                  message: "Số CCCD/CMND chỉ được chứa ký tự số!",
                },
              ]}
            >
              <Input
                onChange={(e) => {
                  localStorage.setItem("cardNumber", e.target.value.toString());
                }}
                size={"large"}
                placeholder={"Nhập số CCCD/CMND"}
              />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Title level={5}>
              Mã số thuế cá nhân{" "}
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
              name={[
                PARTNER_REGISTER_FORM.FIELD_NAME.STEP9_PERSONAL_DATA,
                "taxCode",
              ]}
              rules={[
                {
                  min: 10,
                  message: "Mã số thuế phải có ít nhất 10 - 13 chữ số",
                },
                {
                  max: 13,
                  message: "Mã số thuế phải có ít nhất 10 - 13 chữ số",
                },
                {
                  pattern: /^[0-9]*$/,
                  message: "Mã số thuế chỉ được chứa ký tự số!",
                },
              ]}
            >
              <Input
                size={"large"}
                placeholder={"Nhập mã số thuế cá nhân"}
                type="number"
              />
            </Form.Item>
          </Col>
          {/* <Col xs={24} lg={12}>
            <Title level={5}>
              Hình CCCD/CMND mặt trước <span style={{ color: "red" }}>*</span>
              <span
                style={{
                  color: "#8c8c8c",
                  fontSize: "14px",
                  fontWeight: "400",
                }}
              >
              </span>
            </Title>
            <Form.Item
              name={[
                PARTNER_REGISTER_FORM.FIELD_NAME.STEP9_PERSONAL_DATA,
                "frontCard",
              ]}
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn hình CCCD/CMND mặt trước",
                },
              ]}
            >
              <AppIDUpload />
            </Form.Item>
          </Col> */}
          {/* <Col xs={24} lg={12}>
            <Title level={5}>
              Hình CCCD/CMND mặt sau <span style={{ color: "red" }}>*</span>
              <span
                style={{
                  color: "#8c8c8c",
                  fontSize: "14px",
                  fontWeight: "400",
                }}
              >
              </span>
            </Title>
            <Form.Item
              name={[
                PARTNER_REGISTER_FORM.FIELD_NAME.STEP9_PERSONAL_DATA,
                "backCard",
              ]}
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn hình CCCD/CMND mặt sau",
                },
              ]}
            >
              <AppIDUpload />
            </Form.Item>
          </Col> */}
          {/* <Col xs={24} lg={12}>
            <Title level={5}>
              Hình chân dung cầm CCCD/CMND{" "}
              <Typography.Text
                type="secondary"
                style={{
                  color: "#8c8c8c",
                  marginLeft: 3,
                  fontSize: 13,
                }}
              >
                (tuỳ chọn)
              </Typography.Text>{" "}
            </Title>
            <Form.Item
              name={[
                PARTNER_REGISTER_FORM.FIELD_NAME.STEP9_PERSONAL_DATA,
                "portraitCard",
              ]}
              rules={[
                {
                  required: false,
                  message: "Vui lòng chọn hình chân dung cầm CCCD/CMND",
                },
              ]}
            >
              <AppIDUpload />
            </Form.Item>
          </Col> */}
        </Row>
      </div>
    </div>
  );
};
