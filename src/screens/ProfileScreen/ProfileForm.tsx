import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Form,
  Radio,
  Image,
  Row,
  Col,
  Space,
  Typography,
  message,
} from "antd";
import moment from "moment";

import { FullProfileResource } from "@/src/data/auth/models/types";
import Constants from "@/src/constants/Constants";
import datetimeUtils from "@/src/utils/DatetimeUtils";
import Images from "@/src/constants/Images";
import AppDatePicker from "@/src/components/date/DatePicker";
import Link from "next/link";
import PrivacyPolicyRouteUtils from "@/src/data/privacy-policy/utils/PrivacyPolicyRouteUtils";
import { useBreakpoint } from "@/src/hooks/useBreakpoint";
import AppIDUpload from "./components/AppIDUpload";
import { ImageCropper } from "@/src/components/modals/CropImageModal";
import { toNumber } from "lodash";

export type ProfileFormData = Omit<FullProfileResource, "bithday" | "sex"> & {
  avatarFile?: File | null;
  sex: string | number;
  bithday: string | null;
  frontCardFile?: File | null;
  backCardFile?: File | null;
};

interface ProfileFormProps {
  formData: ProfileFormData;
  isSubmitting: boolean;
  onSubmit: (formData: ProfileFormData) => Promise<void>;
}

const genders = [
  { label: "Nam", value: Constants.GENDER.MEN },
  { label: "Nữ", value: Constants.GENDER.WOMEN },
  { label: "Khác", value: Constants.GENDER.OTHER },
];

export function ProfileForm({
  formData,
  onSubmit,
  isSubmitting,
}: ProfileFormProps) {
  const { isDesktop } = useBreakpoint();
  const [form] = Form.useForm<ProfileFormData>();
  const { setFieldValue } = form;

  const avatarUrl = Form.useWatch("avatarUrl", form);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [frontCardFile, setFrontCardFile] = useState<File | null>(null);
  const [backCardFile, setBackCardFile] = useState<File | null>(null);

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

      // Validate file size
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
          sex: formData?.sex?.toString() || "",
          bithday: formData?.bithday ? moment(formData?.bithday) : null,
          phoneNumber: formData?.phoneNumber || "",
          email: formData?.email || "",
          citizenId: formData?.citizenId || "",
          type: formData?.type,
          taxCode: formData?.taxCode,
          cardNumber: formData?.cardNumber,
          frontCard: formData?.frontCard,
          backCard: formData?.backCard,
          username: formData?.partner?.username,
        }}
        onFinish={async (form) => {
          await onSubmit({
            ...form,
            avatarFile,
            frontCardFile,
            backCardFile,
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

          {formData.partner?.username && (
            <Col xs={24} lg={12}>
              <Form.Item label={"Tên hiển thị"} name={"username"}>
                <Input size={"large"} placeholder={"Chưa cập nhật"} disabled />
              </Form.Item>
            </Col>
          )}
        </Row>

        <Row gutter={[20, 0]}>
          <Col xs={24} lg={12}>
            <Form.Item
              label={"Họ và tên"}
              name={"fullName"}
              rules={[
                { required: true, message: "Vui lòng nhập họ tên" },
                { type: "string", message: "Vui lòng nhập họ tên hợp lệ" },
              ]}
            >
              <Input size={"large"} placeholder={"Nhập họ và tên"} disabled />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              label={"Email"}
              name={"email"}
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Vui lòng nhập email hợp lệ" },
              ]}
            >
              <Input size={"large"} placeholder={"name@company.com"} disabled />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item label={"Mã số thuế"} name={"taxCode"}>
              <Input size={"large"} placeholder={"Nhập mã số thuế cá nhân"} />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              label={"Số điện thoại"}
              name={"phoneNumber"}
              rules={[
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
            <Form.Item label={"Giới tính"} name={"sex"}>
              <Radio.Group>
                {genders.map((gender) => (
                  <Radio key={gender.value} value={gender.value.toString()}>
                    {gender.label}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              label={"Ngày sinh"}
              name={"bithday"}
              rules={[
                { type: "date", message: "Vui lòng nhập ngày sinh hợp lệ" },
              ]}
            >
              <AppDatePicker
                size={"large"}
                format={datetimeUtils.LOCAL_DATE}
                placeholder={"Nhập ngày sinh của bạn"}
                disabledDate={(current) => {
                  // Can not select days after today and today
                  return current && current > moment().endOf("day");
                }}
                className={"full-width"}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[20, 0]}>
          <Col xs={24} lg={24}>
            <Form.Item
              label={"Số CCCD"}
              name={"citizenId"}
              rules={[
                { required: true, message: "Vui lòng nhập Số CCCD" },
                { min: 9, message: "Số CCCD cần ít nhất từ 9 - 12 kí tự" },
                { max: 12, message: "Số CCCD cần ít nhất từ 9 - 12 kí tự" },
              ]}
            >
              <Input
                size={"large"}
                placeholder={"Nhập Số CCCD"}
                disabled={isVerifyId}
              />
            </Form.Item>
          </Col>
        </Row>
        {/* <Row gutter={[20, 0]}>
          <Col xs={24} lg={12}>
            <Form.Item
              label={"Hình mặt trước"}
              name={"frontCard"}
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn hình mặt trước",
                },
              ]}
            >
              <AppIDUpload
                onChange={(file: File | null) => setFrontCardFile(file)}
                value={frontCardFile}
                disabled={isVerifyId}
              />
            </Form.Item>
          </Col>

          <Col xs={24} lg={12}>
            <Form.Item
              label={"Hình mặt sau"}
              name={"backCard"}
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn hình mặt sau",
                },
              ]}
            >
              <AppIDUpload
                onChange={(file: File | null) => setBackCardFile(file)}
                value={backCardFile}
                disabled={isVerifyId}
              />
            </Form.Item>
          </Col>
        </Row> */}
        {/* <Row gutter={[20, 0]}>
          <Col xs={24}>
            <Form.Item
              label={"MySignID"}
              name={"cardNumber"}
              rules={[
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
