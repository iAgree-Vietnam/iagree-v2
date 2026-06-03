import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Typography,
  Input,
  Divider,
  Form,
  Row,
  Col,
  Upload,
  Avatar,
  message,
  Space,
  Grid,
} from "antd";
import { FormInstance } from "antd/es/form/Form";
import { PARTNER_REGISTER_FORM } from "../../constants/PartnerRegisterConstants";
import { useAccountContext } from "@/src/contexts/AccountContext";
import {
  PlusOutlined,
  CloseCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { ImageCropper } from "@/src/components/modals/CropImageModal";
import Constants from "@/src/constants/Constants";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

interface Step1V2PageProps {
  form: FormInstance;
}

export const Step1V2Page: React.FC<Step1V2PageProps> = ({ form }) => {
  const [showCropper, setShowCropper] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState<string>('');

  const MAX_TITLE_LENGTH = 120;
  const MAX_DISPLAYNAME_LENGTH = 100;
  const screens = useBreakpoint();

  const { auth: userInfo } = useAccountContext();

  const avatarValue = Form.useWatch(
    [PARTNER_REGISTER_FORM.FIELD_NAME.STEP1_V2_DATA, "avatar"],
    form
  );

  const defaultAvatarUrl = userInfo?.avatarUrl;

  const isNewAvatarUploaded = useMemo(() => {
    return avatarValue && avatarValue.length > 0;
  }, [avatarValue]);

  const avatarUrl = useMemo(() => {
    if (isNewAvatarUploaded) {
      const file = avatarValue?.[0];
      if (file?.url) {
        return file.url;
      }
      if (file instanceof File) {
        return URL.createObjectURL(file);
      }
    }
    return defaultAvatarUrl || null;
  }, [isNewAvatarUploaded, avatarValue, defaultAvatarUrl]);

  const professionalRoleRules = [
    { required: true, message: "Vui lòng nhập ngành nghề của bạn." },
    { max: 120, message: "Chức danh không được vượt quá 120 ký tự." },
  ];

  const displayNameRules = [
    { required: true, message: "Vui lòng nhập tên hiển thị của bạn." },
    {
      max: MAX_DISPLAYNAME_LENGTH,
      message: "Tên hiển thị không được vượt quá 100 ký tự.",
    },
  ];

  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("Bạn chỉ có thể tải lên file JPG/PNG!");
      return Upload.LIST_IGNORE;
    }
    const maxFileSize = Constants.MAX_FILE_SIZE;
    const isLtMaxSize = file.size <= maxFileSize;
    if (!isLtMaxSize) {
      message.error(`Ảnh phải nhỏ hơn ${maxFileSize / 1024 / 1024}MB!`);
      return Upload.LIST_IGNORE;
    }

    const imageUrl = URL.createObjectURL(file);
    setTempImageUrl(imageUrl);
    setShowCropper(true);
    
    return false;

    // form.setFieldValue(
    //   [PARTNER_REGISTER_FORM.FIELD_NAME.STEP1_V2_DATA, "defaultAvatar"],
    //   null
    // );
    // return isJpgOrPng && isLt10M;
  };

  const handleCropConfirm = (croppedImageFile: File) => {
    // Set the cropped image to form
    form.setFieldValue(
      [PARTNER_REGISTER_FORM.FIELD_NAME.STEP1_V2_DATA, "avatar"],
      [croppedImageFile]
    );
    form.setFieldValue(
      [PARTNER_REGISTER_FORM.FIELD_NAME.STEP1_V2_DATA, "defaultAvatar"],
      null
    );
    setShowCropper(false);
    setTempImageUrl('');
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    if (tempImageUrl) {
      URL.revokeObjectURL(tempImageUrl);
      setTempImageUrl('');
    }
  };

  const normFile = (e: any) => {
    // Tránh lỗi khi `e` không tồn tại
    if (!e || !e.fileList) {
      return [];
    }

    // Lấy file mới nhất từ fileList
    const latestFile = e.fileList.slice(-1)[0];

    // Nếu file có, trả về đối tượng gốc (File)
    if (latestFile && latestFile.originFileObj) {
      return [latestFile.originFileObj];
    }

    // Trả về file đã có (ví dụ: file đã tải lên trước đó có url)
    if (latestFile) {
      return [latestFile];
    }

    return [];
  };

  const handleRemoveAvatar = () => {
    form.setFieldValue(
      [PARTNER_REGISTER_FORM.FIELD_NAME.STEP1_V2_DATA, "avatar"],
      null
    );
    form.setFieldValue(
      [PARTNER_REGISTER_FORM.FIELD_NAME.STEP1_V2_DATA, "defaultAvatar"],
      defaultAvatarUrl
    );
  };

  const professionalRoleStyle = {
    marginTop: screens.lg ? 0 : 24,
  };

  return (
    <div style={{ padding: "0 0", overflowX: "hidden" }}>
      <div style={{ marginBottom: "15px" }}>
        <Title
          level={2}
          style={{ margin: 0, color: "#333", marginBottom: "10px" }}
        >
          Chào mừng bạn đến với cộng đồng Đối tác của iAgree. Hãy bắt đầu xây
          dựng hồ sơ của bạn!
        </Title>
        <Text style={{ color: "#09993E" }}>
          Đầu tiên, hãy điền một vài thông tin cơ bản dưới đây.
        </Text>
      </div>

      <Divider style={{ borderColor: "#D4D4D4", margin: "0 0 12px 0" }} />

      <Row gutter={24} style={{ marginBottom: "15px" }} align="middle">
        <Col xs={24} lg={12}>
          <Typography.Title level={5} style={{ marginBottom: 5 }}>
            Ảnh đại diện <span style={{ color: "red" }}>*</span>
          </Typography.Title>
          <ImageCropper
            visible={showCropper}
            imageUrl={tempImageUrl}
            onCancel={handleCropCancel}
            onConfirm={handleCropConfirm}
          />
          <Space>
            <Form.Item
              name={[
                PARTNER_REGISTER_FORM.FIELD_NAME.STEP1_V2_DATA,
                "defaultAvatar",
              ]}
              initialValue={defaultAvatarUrl}
              hidden
            >
              <Input />
            </Form.Item>

            <Form.Item
              name={[PARTNER_REGISTER_FORM.FIELD_NAME.STEP1_V2_DATA, "avatar"]}
              rules={[
                {
                  required: !avatarUrl,
                  message: "Vui lòng tải lên ảnh đại diện của bạn.",
                },
              ]}
              valuePropName="fileList"
              getValueFromEvent={normFile}
              style={{ marginBottom: 0 }}
            >
              <Upload
                name="avatar"
                listType="picture-card"
                showUploadList={false}
                beforeUpload={beforeUpload}
                style={{
                  width: 120,
                  height: 120,
                  padding: 0,
                  borderRadius: "100%",
                  overflow: "hidden",
                }}
              >
                <div className="avatar-container">
                  {avatarUrl ? (
                    <>
                      <Avatar
                        size={120}
                        src={avatarUrl}
                        style={{ borderRadius: "100%" }}
                      />
                      <div
                        className="avatar-overlay"
                        onClick={(e) => {
                          if (isNewAvatarUploaded) {
                            e.stopPropagation();
                            handleRemoveAvatar();
                          }
                        }}
                      >
                        {isNewAvatarUploaded ? (
                          <CloseCircleOutlined />
                        ) : (
                          <UploadOutlined />
                        )}
                      </div>
                    </>
                  ) : (
                    <div
                      style={{
                        padding: "8px 0",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Tải lên</div>
                    </div>
                  )}
                </div>
              </Upload>
            </Form.Item>
          </Space>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col xs={24} lg={12}>
          <Typography.Title level={5} style={{ marginBottom: 5 }}>
            Tên hiển thị <span style={{ color: "red" }}>*</span>
          </Typography.Title>
          <Form.Item
            name={[
              PARTNER_REGISTER_FORM.FIELD_NAME.STEP1_V2_DATA,
              "displayName",
            ]}
            rules={displayNameRules}
            initialValue={userInfo?.fullName}
          >
            <Input
              placeholder="Nguyễn Văn A"
              maxLength={MAX_DISPLAYNAME_LENGTH}
            />
          </Form.Item>
          <Text
            type="secondary"
            style={{
              fontSize: "12px",
              marginTop: "-10px",
              display: "block",
            }}
          >
            Lưu ý: Tên hiển thị sẽ không thể thay đổi sau lần đăng ký này.
          </Text>
        </Col>

        <Col xs={24} lg={12} style={professionalRoleStyle}>
          <Typography.Title level={5} style={{ marginBottom: 5 }}>
            Ngành nghề <span style={{ color: "red" }}>*</span>
          </Typography.Title>
          <Form.Item
            name={[
              PARTNER_REGISTER_FORM.FIELD_NAME.STEP1_V2_DATA,
              "professionalRole",
            ]}
            rules={professionalRoleRules}
          >
            <Input
              placeholder="Ví dụ: Luật sư, Thiết kế đồ họa, Kỹ sư phần mềm..."
              maxLength={MAX_TITLE_LENGTH}
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};
