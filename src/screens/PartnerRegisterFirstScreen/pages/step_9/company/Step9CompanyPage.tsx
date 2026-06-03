import React, { useMemo, useState, useEffect } from "react";
import {
  Form,
  Input,
  Typography,
  Button,
  Row,
  Col,
  Upload,
  Divider,
  FormInstance,
} from "antd";
import { EyeOutlined, UploadOutlined } from "@ant-design/icons";
import AppIDUpload from "@/src/screens/ProfileScreen/components/AppIDUpload";
import { PARTNER_REGISTER_FORM } from "../../../constants/PartnerRegisterConstants";
import { UploadFile } from "antd/lib/upload/interface";
import { useAccountContext } from "@/src/contexts/AccountContext";
import BusinessLicenseViewModalStep9 from "../sections/BusinessLicenseViewModalStep9";
import { toNumber } from "lodash";

const { Title, Paragraph } = Typography;

interface Step9CompanyPageProps {
  form: FormInstance;
  isInitialRender: boolean;
  onInit: () => void;
}

// Helper function to get the file name from a URL
const getFileNameFromUrl = (url: string) => {
  try {
    const parts = url.split("/");
    return parts[parts.length - 1];
  } catch (error) {
    return "giay-phep-kinh-doanh.pdf"; // Fallback name
  }
};

export const Step9CompanyPage: React.FC<Step9CompanyPageProps> = ({
  form,
  isInitialRender,
  onInit,
}) => {
  const { auth: userInfo } = useAccountContext();
  const [isBusinessLicenseModalVisible, setIsBusinessLicenseModalVisible] =
    useState(false);

  useEffect(() => {
    if (isInitialRender) {
      // Create a mutable object for initial form values
      const initialValues: any = {
        taxCode: userInfo?.taxCode,
        nameRep: userInfo?.nameRep,
        cardNumber: userInfo?.cardNumber,
        frontCard: userInfo?.frontCard,
        backCard: userInfo?.backCard,
      };

      // If businessLicense exists, format it as an array of UploadFile objects
      if (userInfo?.businessLicense) {
        const fileName = getFileNameFromUrl(userInfo?.businessLicense);
        initialValues.businessLicense = [
          {
            uid: "-1",
            name: fileName,
            status: "done",
            url: userInfo?.businessLicense,
            // We set originFileObj to undefined to clearly indicate it's not a local file
            originFileObj: undefined,
          } as UploadFile,
        ];
      }

      form.setFieldsValue({
        [PARTNER_REGISTER_FORM.FIELD_NAME.STEP9_COMPANY_DATA]: initialValues,
      });
      onInit();
    }
  }, [isInitialRender, userInfo, form, onInit]);

  const formBusinessLicense = Form.useWatch(
    [PARTNER_REGISTER_FORM.FIELD_NAME.STEP9_COMPANY_DATA, "businessLicense"],
    form
  );

  const businessLicenseData = useMemo(() => {
    if (Array.isArray(formBusinessLicense) && formBusinessLicense.length > 0) {
      const fileItem = formBusinessLicense[0];

      // Case 1: A new file has been uploaded (it's a File object)
      if (fileItem.originFileObj instanceof File) {
        return { file: fileItem.originFileObj, url: null, name: fileItem.name };
      }

      // Case 2: The value is an existing file URL from the initial form state
      if (typeof fileItem.url === "string") {
        return { file: null, url: fileItem.url, name: fileItem.name };
      }
    }

    // Default state when no file is present
    return {
      file: null,
      url: null,
      name: "Nhấn để tải lên giấy phép kinh doanh",
    };
  }, [formBusinessLicense]);

  const {
    file: businessLicenseFile,
    url: businessLicenseUrl,
    name: displayedFileName,
  } = businessLicenseData;
  const hasBusinessLicense = !!businessLicenseFile || !!businessLicenseUrl;
  const { auth: fullProfileResource } = useAccountContext();
  useEffect(() => {
    if (userInfo?.citizenId) {
      form.setFieldsValue({
        [PARTNER_REGISTER_FORM.FIELD_NAME.STEP9_PERSONAL_DATA]: {
          cardNumber: userInfo.citizenId,
        },
      });
    }
  }, [userInfo, form]);

  return (
    <div style={{ padding: "0 0" }}>
      <div style={{ marginBottom: "15px" }}>
        <Title
          level={2}
          style={{ margin: 0, color: "#333", marginBottom: "10px" }}
        >
          Xác minh thông tin doanh nghiệp
        </Title>
        <Paragraph style={{ color: "#09993E" }}>
          Để đảm bảo tính bảo mật và tin cậy cho cộng đồng iAgree, vui lòng xác
          minh thông tin doanh nghiệp và người đại diện theo pháp luật.
        </Paragraph>
      </div>

      <div
        style={{
          paddingInline: 20,
          paddingBottom: 12,
          paddingTop: 12,
          border: "1px solid #D4D4D4",
          borderRadius: "6px",
        }}
      >
        <Row gutter={[20, 20]}>
          {/* Mã số thuế và Giấy phép kinh doanh */}
          <Col xs={24} lg={12}>
            <Title level={5}>
              Mã số thuế doanh nghiệp
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
              {/* <span style={{ color: "red" }}>*</span> */}
            </Title>
            <Form.Item
              name={[
                PARTNER_REGISTER_FORM.FIELD_NAME.STEP9_COMPANY_DATA,
                "taxCode",
              ]}
              rules={[
                // {
                //   required: true,
                //   message: "Vui lòng nhập mã số thuế doanh nghiệp",
                // },
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
                placeholder={"Nhập mã số thuế doanh nghiệp"}
                type="number"
              />
            </Form.Item>
          </Col>

          <Col xs={24} lg={12}>
            <Title level={5}>
              Giấy phép kinh doanh
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
              {/* <span style={{ color: "red" }}>*</span> */}
            </Title>
            <Form.Item
              name={[
                PARTNER_REGISTER_FORM.FIELD_NAME.STEP9_COMPANY_DATA,
                "businessLicense",
              ]}
              // rules={[
              //   {
              //     required: true,
              //     message: "Vui lòng tải lên giấy phép kinh doanh",
              //   },
              // ]}
              valuePropName="fileList"
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) {
                  return e;
                }
                return e?.fileList || [];
              }}
            >
              <Upload
                accept={[".pdf"].join(",")}
                maxCount={1}
                multiple={false}
                beforeUpload={() => false}
              >
                <div
                  style={{
                    border: "1px dashed #d9d9d9",
                    borderRadius: "6px",
                    padding: "8px",
                    marginTop: "0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography.Paragraph
                    type={"secondary"}
                    style={{ margin: 0 }}
                  >
                    {displayedFileName}
                  </Typography.Paragraph>

                  <Button size={"small"} icon={<UploadOutlined />}>
                    Tải lên giấy phép
                  </Button>
                </div>
              </Upload>
            </Form.Item>
            {hasBusinessLicense && (
              <div style={{ marginBottom: 8, marginTop: 10 }}>
                <Button
                  type="link"
                  icon={<EyeOutlined />}
                  onClick={() => setIsBusinessLicenseModalVisible(true)}
                  style={{ marginLeft: 8 }}
                >
                  Xem file
                </Button>
              </div>
            )}
          </Col>

          <Col xs={24} lg={24}>
            <Divider />
            <Title level={4}>Thông tin người đại diện theo pháp luật</Title>
          </Col>

          <Col xs={24} lg={12}>
            <Title level={5}>
              Người đại diện
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
              {/* <span style={{ color: "red" }}>*</span> */}
            </Title>
            <Form.Item
              name={[
                PARTNER_REGISTER_FORM.FIELD_NAME.STEP9_COMPANY_DATA,
                "nameRep",
              ]}
              // rules={[
              //   { required: true, message: "Vui lòng nhập tên người đại diện" },
              // ]}
            >
              <Input size={"large"} placeholder={"Người đại diện"} />
            </Form.Item>

            {/* <Title level={5}>
              Hình CCCD/CMND mặt trước <span style={{ color: "red" }}>*</span>
              <Typography.Text
                type="secondary"
                style={{
                  color: "#8c8c8c",
                  marginLeft: 3,
                  fontSize: 13,
                }}
              >
              </Typography.Text>{" "}
            </Title>
            <Form.Item
              name={[
                PARTNER_REGISTER_FORM.FIELD_NAME.STEP9_COMPANY_DATA,
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
            </Form.Item> */}
          </Col>

          <Col xs={24} lg={12}>
            <Title level={5}>
              Số CCCD/CMND <span style={{ color: "red" }}>*</span>
              <Typography.Text
                type="secondary"
                style={{
                  color: "#8c8c8c",
                  marginLeft: 3,
                  fontSize: 13,
                }}
              >
              </Typography.Text>{" "}
            </Title>
            <Form.Item
              name={[
                PARTNER_REGISTER_FORM.FIELD_NAME.STEP9_COMPANY_DATA,
                "cardNumber",
              ]}
              rules={[
                // {
                //   required: true,
                //   message: "Vui lòng nhập số CCCD/CMND",
                // },
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
                defaultValue={
                  toNumber(fullProfileResource?.citizenId) ||
                  formBusinessLicense?.["STEP9_PERSONAL_DATA"]?.cardNumber ||
                  undefined
                }
                size={"large"}
                placeholder={"Nhập số CCCD/CMND"}
                type="number"
              />
            </Form.Item>

            {/* <Title level={5}>
              Hình CCCD/CMND mặt sau <span style={{ color: "red" }}>*</span>
              <Typography.Text
                type="secondary"
                style={{
                  color: "#8c8c8c",
                  marginLeft: 3,
                  fontSize: 13,
                }}
              >
              </Typography.Text>{" "}
            </Title>
            <Form.Item
              name={[
                PARTNER_REGISTER_FORM.FIELD_NAME.STEP9_COMPANY_DATA,
                "backCard",
              ]}
             
            >
              <AppIDUpload />
            </Form.Item> */}
          </Col>

          {/* <Col xs={24} lg={12}>
            <Title level={5}>
              Hình chân dung cầm CCCD/CMND
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
                PARTNER_REGISTER_FORM.FIELD_NAME.STEP9_COMPANY_DATA,
                "portraitCard",
              ]}
              // rules={[
              //   {
              //     required: true,
              //     message: "Vui lòng chọn hình chân dung cầm CCCD/CMND",
              //   },
              // ]}
            >
              <AppIDUpload />
            </Form.Item>
          </Col> */}
        </Row>
      </div>

      <BusinessLicenseViewModalStep9
        isVisible={isBusinessLicenseModalVisible}
        onClose={() => setIsBusinessLicenseModalVisible(false)}
        businessLicenseFile={businessLicenseFile}
        businessLicenseUrl={businessLicenseUrl}
      />
    </div>
  );
};
