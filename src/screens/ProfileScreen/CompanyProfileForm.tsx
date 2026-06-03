import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Form,
  Image,
  Row,
  Col,
  Space,
  Typography,
  Upload,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

import { FullProfileResource } from "@/src/data/auth/models/types";
import Constants from "@/src/constants/Constants";
import Images from "@/src/constants/Images";
import Link from "next/link";
import PrivacyPolicyRouteUtils from "@/src/data/privacy-policy/utils/PrivacyPolicyRouteUtils";
import { useBreakpoint } from "@/src/hooks/useBreakpoint";
import AppIDUpload from "./components/AppIDUpload";
import { ImageCropper } from "@/src/components/modals/CropImageModal";
import { split, toNumber } from "lodash";

export type CompanyProfileFormData = Omit<
  FullProfileResource,
  "bithday" | "sex"
> & {
  avatarFile?: File | null;
  frontCardFile?: File | null;
  backCardFile?: File | null;
  businessLicenseFile?: File | null;
  documentsFile?: File[] | null;
};

interface CompanyProfileFormProps {
  formData: CompanyProfileFormData;
  isSubmitting: boolean;
  onSubmit: (formData: CompanyProfileFormData) => Promise<void>;
}

export function CompanyProfileForm({
  formData,
  onSubmit,
  isSubmitting,
}: CompanyProfileFormProps) {
  const { isDesktop } = useBreakpoint();
  const [form] = Form.useForm<CompanyProfileFormData>();
  const { setFieldValue } = form;

  const avatarUrl = Form.useWatch("avatarUrl", form);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [frontCardFile, setFrontCardFile] = useState<File | null>(null);
  const [backCardFile, setBackCardFile] = useState<File | null>(null);
  const [businessLicenseFile, setBusinessLicenseFile] = useState<File | null>(
    null
  );
  const [documentsFile, setDocumentsFile] = useState<File[] | null>(null);

  // Image cropper states
  const [showCropper, setShowCropper] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState<string>("");

  // State to manage marginTop
  // const [_, setMarginTop] = useState<string>("0");

  const updateMarginTop = () => {
    if (typeof window !== "undefined") {
      // setMarginTop(window.innerWidth < 768 ? "20px" : "0");
    }
  };

  useEffect(() => {
    updateMarginTop();

    window.addEventListener("resize", updateMarginTop);

    return () => {
      window.removeEventListener("resize", updateMarginTop);
    };
  }, []);

  // Handle avatar file selection and show cropper
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];

      // Validate file type
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        message.error("Bạn chỉ có thể tải lên file JPG/PNG!");
        return;
      }

      // Validate file size (10MB limit)
      const maxFileSize = Constants.MAX_FILE_SIZE;
      if (file.size > maxFileSize) {
        message.error(
          `Ảnh không được vượt quá ${maxFileSize / 1024 / 1024}MB!`
        );
        return;
      }

      // Show cropper with selected image
      const imageUrl = URL.createObjectURL(file);
      setTempImageUrl(imageUrl);
      setShowCropper(true);
    }
  };

  const handleBeforeUpload = (file: File) => {
    const maxFileSize = Constants.MAX_FILE_SIZE;
    if (file.size > maxFileSize) {
      message.error(
        `Kích thước tệp ${file.name} không được vượt quá ${
          maxFileSize / 1024 / 1024
        }MB!`
      );

      return Upload.LIST_IGNORE; // <- this hides it from UI entirely
    }
    return false; // block auto upload
  };

  // Handle crop confirm
  const handleCropConfirm = (croppedImageFile: File) => {
    setAvatarFile(croppedImageFile);
    setFieldValue("avatarUrl", URL.createObjectURL(croppedImageFile));
    setShowCropper(false);

    // Clean up temp URL
    if (tempImageUrl) {
      URL.revokeObjectURL(tempImageUrl);
      setTempImageUrl("");
    }
  };

  // Handle crop cancel
  const handleCropCancel = () => {
    setShowCropper(false);

    // Clean up temp URL
    if (tempImageUrl) {
      URL.revokeObjectURL(tempImageUrl);
      setTempImageUrl("");
    }
  };

  // Handle remove avatar
  const handleRemoveAvatar = async () => {
    const defaultAccountBlob = await fetch(Images.ACCOUNT_DEFAULT).then((res) =>
      res.blob()
    );
    setFieldValue("avatarUrl", URL.createObjectURL(defaultAccountBlob));
    //@ts-ignore
    setAvatarFile(defaultAccountBlob);
  };

  const isVerifyId =
    toNumber(formData?.partner?.is_citizen_id_verified) ===
    Constants.PARTNER.IS_CITIZEN_ID_VERIFIED;

  return (
    <>
      <Form
        layout={"vertical"}
        name={"profileForm"}
        form={form}
        initialValues={{
          avatarUrl: formData?.avatarUrl || "",
          fullName: formData?.fullName || "",
          phoneNumber: formData?.phoneNumber || "",
          email: formData?.email || "",
          type: formData?.type,
          taxCode: formData?.taxCode || "",
          nameRep: formData?.nameRep || "",
          citizenId: formData?.citizenId || "",
          cardNumber: formData?.cardNumber || "",
          frontCard: formData?.frontCard || "",
          backCard: formData?.backCard || "",
          businessLicense: formData?.businessLicense || "",
          documents: formData?.documents || "",
        }}
        onFinish={async (form) => {

          await onSubmit({
            ...form,
            avatarFile,
            frontCardFile,
            backCardFile,
            businessLicenseFile,
            documentsFile: documentsFile ? [...documentsFile] : null,
          });
          setAvatarFile(null);
        }}
        autoComplete={"off"}
      >
        <Row gutter={[20, 0]}>
          <Col xs={24} lg={12}>
            <Form.Item label={"Ảnh đại diện"} name={"avatarUrl"}>
              <Space className={"upload-wrapper"} size={"large"}>
                <Image
                  className="avatar"
                  preview={false}
                  src={avatarUrl}
                  alt="Avatar"
                  onLoad={() => {
                    URL.revokeObjectURL(avatarUrl);
                  }}
                  fallback={Images.ACCOUNT_DEFAULT}
                />
                <Space size={10}>
                  <Button size={"small"}>
                    <label htmlFor="input-avatar">Tải ảnh đại diện</label>
                  </Button>
                  <Button
                    type={"primary"}
                    size={"small"}
                    onClick={handleRemoveAvatar}
                  >
                    Xóa
                  </Button>
                </Space>
              </Space>
            </Form.Item>

            <Form.Item style={{ display: "none" }}>
              <div>
                <input
                  id="input-avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFileChange}
                />
              </div>
            </Form.Item>
          </Col>

          {formData?.partner?.username && (
            <Col xs={24} lg={12}>
              <Form.Item label={"Tên hiển thị"} name={"username"}>
                <Input size={"large"} placeholder={"Chưa cập nhật"} disabled />
              </Form.Item>
            </Col>
          )}
        </Row>
        <Form.Item style={{ display: "none" }}>
          <div>
            <input
              id="input-avatar"
              type="file"
              accept="image/*"
              onChange={handleAvatarFileChange}
            />
          </div>
        </Form.Item>
        <Row gutter={[20, 0]}>
          <Col xs={24} lg={12}>
            <Form.Item
              label={"Tên doanh nghiệp"}
              name={"fullName"}
              rules={[
                { required: true, message: "Vui lòng nhập tên doanh nghiệp" },
                {
                  type: "string",
                  message: "Vui lòng nhập tên doanh nghiệp hợp lệ",
                },
              ]}
            >
              <Input
                size={"large"}
                placeholder={"Nhập tên doanh nghiệp"}
                disabled
              />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              label={"Người đại diện theo pháp luật / ủy quyền"}
              name={"nameRep"}
              rules={[
                { required: true, message: "Vui lòng nhập tên doanh nghiệp" },
                {
                  type: "string",
                  message: "Vui lòng nhập tên doanh nghiệp hợp lệ",
                },
              ]}
            >
              <Input size={"large"} placeholder={"Nhập họ và tên"} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[20, 0]}>
          <Col xs={24} lg={12}>
            <Form.Item
              label={"Số điện thoại doanh nghiệp"}
              name={"phoneNumber"}
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại" },
                {
                  type: "string",
                  min: 10,
                  pattern: /^\d+$/,
                  message: "Vui lòng nhập số điện thoại hợp lệ",
                },
              ]}
            >
              <Input size={"large"} placeholder={"Nhập số điện thoại"} />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              label={"Email doanh nghiệp"}
              name={"email"}
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Vui lòng nhập email hợp lệ" },
              ]}
            >
              <Input size={"large"} placeholder={"name@company.com"} disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[20, 0]}>
          <Col xs={24} lg={24}>
            <Form.Item
              label={"Mã số thuế doanh nghiệp"}
              name={"taxCode"}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mã số thuế doanh nghiệp",
                },
              ]}
            >
              <Input
                size={"large"}
                placeholder={"Nhập mã số thuế doanh nghiệp"}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[20, 0]}>
          <Col xs={24} lg={24}>
            <Form.Item
              label={"Giấy chứng nhận đăng ký doanh nghiệp"}
              name={"businessLicense"}
              rules={[
                {
                  required: true,
                  message:
                    "Vui lòng tải lên giấy chứng nhận đăng ký doanh nghiệp",
                },
              ]}
            >
              {formData?.businessLicense &&
                typeof formData?.businessLicense === "string" && (
                  <div style={{ marginBottom: 8 }}>
                    <Typography.Text strong>Tệp đã tải lên: </Typography.Text>
                    <a
                      href={formData?.businessLicense}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                    >
                      {split(formData?.businessLicense, "/").pop()}
                    </a>
                  </div>
                )}
              <Upload
                accept={[".pdf"].join(",")}
                maxCount={1}
                multiple={false}
                className={"uploadFullWidth"}
                beforeUpload={handleBeforeUpload}
                onChange={(file) => {
                  if (file?.fileList.length > 0) {
                    setBusinessLicenseFile(
                      file?.fileList?.[0]?.originFileObj as File
                    );
                  }
                }}
              >
                <Row
                  className={"uploadDropzoneContainer"}
                  justify={"space-between"}
                  align={"middle"}
                  style={{
                    border: "1px solid #d9d9d9",
                    borderRadius: "6px",
                    padding: "8px",
                    marginTop: "10px",
                  }}
                >
                  <Typography.Paragraph
                    type={"secondary"}
                    className={"nm-typo"}
                  >
                    Tải lên giấy chứng nhận đăng ký doanh nghiệp
                  </Typography.Paragraph>

                  <Button size={"small"} icon={<UploadOutlined />}>
                    Tải lên
                  </Button>
                </Row>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[20, 0]}>
          <Col xs={24} lg={24}>
            <Form.Item
              label={"Số CCCD của người đại diện"}
              name={"citizenId"}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số CCCD của người đại diện",
                },
                { min: 9, message: "Số CCCD cần ít nhất từ 9 - 12 kí tự" },
                { max: 12, message: "Số CCCD cần ít nhất từ 9 - 12 kí tự" },
              ]}
            >
              <Input
                size={"large"}
                placeholder={"Nhập số CCCD của người đại diện"}
                disabled={isVerifyId}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[20, 0]}>
          {/* <Col xs={24} lg={12}>
            <Form.Item
              label={"Hình CCCD/CMND mặt trước"}
              name={"frontCard"}
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn hình CCCD/CMND mặt trước",
                },
              ]}
            >
              <AppIDUpload
                onChange={(file: File | null) => setFrontCardFile(file)}
                value={frontCardFile}
                disabled={isVerifyId}
              />
            </Form.Item>
          </Col> */}

          {/* <Col xs={24} lg={12}>
            <Form.Item
              label={"Hình CCCD/CMND mặt sau"}
              name={"backCard"}
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn hình CCCD/CMND mặt sau",
                },
              ]}
            >
              <AppIDUpload
                onChange={(file: File | null) => setBackCardFile(file)}
                value={backCardFile}
                disabled={isVerifyId}
              />
            </Form.Item>
          </Col> */}
        </Row>
        <Row gutter={[20, 0]}>
          <Col xs={24} lg={24}>
            <Form.Item label={"Văn bản khác (Nếu có)"} name={"documents"}>
              {Array.isArray(formData?.documents) &&
                formData?.documents?.length > 0 && (
                  <div style={{ marginBottom: 8 }}>
                    <Typography.Text strong>Tệp đã tải lên: </Typography.Text>
                    <ul style={{ paddingLeft: 16 }}>
                      {formData?.documents?.map((docUrl: string, idx: number) => (
                        <li key={idx}>
                          <a
                            href={docUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                          >
                            {docUrl?.split("/").pop()}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              {formData?.documents && typeof formData?.documents === "string" && (
                <div style={{ marginBottom: 8 }}>
                  <Typography.Text strong>Tệp đã tải lên: </Typography.Text>
                  <a
                    href={formData?.documents}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                  >
                    {formData?.documents.split("/").pop()}
                  </a>
                </div>
              )}
              <span>
                Ví dụ: Giấy ủy quyền của người đại diện theo ủy quyền, v.v
              </span>
              <Upload
                accept={[".pdf"].join(",")}
                maxCount={5}
                multiple={true}
                className={"uploadFullWidth"}
                beforeUpload={handleBeforeUpload}
                onChange={(file) => {
                  if (file.fileList.length > 0) {
                    setDocumentsFile(
                      file?.fileList?.map((f) => f.originFileObj as File)
                    );
                  } else {
                    setDocumentsFile(null);
                  }
                }}
              >
                <Row
                  className={"uploadDropzoneContainer"}
                  justify={"space-between"}
                  align={"middle"}
                  style={{
                    border: "1px solid #d9d9d9",
                    borderRadius: "6px",
                    padding: "8px",
                    marginTop: "10px",
                  }}
                >
                  <Typography.Paragraph
                    type={"secondary"}
                    className={"nm-typo"}
                  >
                    Nội dung giấy tờ
                  </Typography.Paragraph>

                  <Button size={"small"} icon={<UploadOutlined />}>
                    Tải tệp
                  </Button>
                </Row>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
        {/* <Row gutter={[20, 0]}>
          <Col xs={24}>
            <Form.Item
              label={"MySignID"}
              name={"cardNumber"}
              rules={[
                // { required: true, message: "Vui lòng nhập MySignID" },
                { min: 9, message: "Vui lòng nhập MySignID hợp lệ" },
                { max: 12, message: "Vui lòng nhập MySignID hợp lệ" },
              ]}
            >
              <Input
                size={"large"}
                placeholder={"Nhập MySignID đã được xác thực"}
              />
            </Form.Item>
            <Space
              direction={"vertical"}
              className={"mySignSupport d-flex"}
              size={10}
            >
              <Space
                size={"small"}
                direction={!isDesktop ? "vertical" : "horizontal"}
              >
                <Typography.Paragraph className={"nm-typo"}>
                  Chưa có tài khoản Nhập MySignID?
                </Typography.Paragraph>
                <Link
                  href={PrivacyPolicyRouteUtils.toMySignSupport()}
                  className={"registerLinkText link"}
                >
                  Xem hướng dẫn tạo tài khoản MySignID
                </Link>
              </Space>
              <Typography.Paragraph className={"nm-typo"}>
                Đăng ký MySignID ngay hôm nay để nhận ngay một lần ký số miễn
                phí - Bắt đầu giao dịch nhanh chóng, an toàn và tiện lợi!
              </Typography.Paragraph>
            </Space>
          </Col>
        </Row> */}
        <Row style={{ paddingTop: "20px" }}>
          <Col xs={24} lg={5}>
            <Button
              type={"default"}
              htmlType={"submit"}
              block={true}
              size={"middle"}
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              {isSubmitting ? "Đang lưu thông tin" : "Lưu thông tin"}
            </Button>
          </Col>
        </Row>
      </Form>

      {/* Image Cropper Modal */}
      <ImageCropper
        visible={showCropper}
        imageUrl={tempImageUrl}
        onCancel={handleCropCancel}
        onConfirm={handleCropConfirm}
      />
    </>
  );
}
