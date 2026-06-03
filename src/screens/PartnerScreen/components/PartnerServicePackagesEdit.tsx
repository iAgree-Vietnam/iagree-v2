
import {
  Input,
  Button,
  Row,
  Col,
  Select,
  Tag,
  Form,
  message,
  Space,
  Typography,
} from "antd";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { IconSvgLocal } from "@/src/components/icon-svg-local";

const { Option } = Select;

interface ServicePackage {
  serviceName: string;
  servicePackage: string;
  priceFrom: string;
  priceTo: string;
  benefits: string[];
}

interface FormData {
  services: ServicePackage[];
}

export default function PartnerServicePackagesEdit() {
  const [form] = Form.useForm();

  const servicePackages = [
    { value: "basic", label: "Cơ bản" },
    { value: "advanced", label: "Nâng cao" },
    { value: "premium", label: "Cao cấp" },
  ];

  const benefitOptions = [
    "Có File gốc",
    "Có hoá đơn đỏ",
    "Bảo hành 1 năm",
    "Hỗ trợ 24/7",
    "Tư vấn miễn phí",
    "Giao hàng tận nơi",
  ];

  const formatNumber = (value: any) => {
    if (!value) return "";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleNumberInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string[]
  ) => {
    const value = e.target.value.replace(/[^\d]/g, "");
    const formattedValue = formatNumber(value);
    form.setFieldValue(field, formattedValue);
  };

  const onFinish = (values: FormData) => {
    message.success("Tất cả dịch vụ đã được lưu thành công!");
  };

  const onFinishFailed = (errorInfo: any) => {
  };

  const validatePrice = (_: any, value: string) => {
    if (!value || !value.trim()) {
      return Promise.reject(new Error("Vui lòng nhập giá"));
    }
    return Promise.resolve();
  };

  const PackageSelector: React.FC<{
    value?: string;
    onChange?: (value: string) => void;
  }> = ({ value, onChange }) => (
    <div
      style={{
        display: "flex",
        gap: "1px",
        backgroundColor: "rgba(239, 240, 243, 1)",
        borderRadius: "10px",
        padding: "4px",
      }}
    >
      {servicePackages.map((pkg) => (
        <Button
          key={pkg.value}
          type="text"
          style={{
            flex: 1,
            height: "45px",
            borderRadius: "10px",
            fontSize: "14px",
            backgroundColor: value === pkg.value ? "#fff" : "transparent",
            border: "none",
            fontWeight: "500",
            boxShadow:
              value === pkg.value ? "0 2px 4px rgba(0,0,0,0.1)" : "none",
            color: value === pkg.value ? "#000" : "#666",
          }}
          onClick={() => onChange?.(pkg.value)}
        >
          {pkg.label}
        </Button>
      ))}
    </div>
  );

  const BenefitsSelector: React.FC<{
    value?: string[];
    onChange?: (value: string[]) => void;
  }> = ({ value = [], onChange }) => (
    <div
      style={{
        minHeight: "50px",
        border: "1px solid #d9d9d9",
        borderRadius: "8px",
        padding: "8px 12px",
        backgroundColor: "#fff",
      }}
    >
      {/* Selected benefits */}
      {value.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          {value.map((benefit) => (
            <Tag
              key={benefit}
              closable
              onClose={() => {
                const newBenefits = value.filter((b) => b !== benefit);
                onChange?.(newBenefits);
              }}
              style={{
                backgroundColor: "#f0f0f0",
                border: "none",
                borderRadius: "16px",
                padding: "4px 12px",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
              closeIcon={<CloseOutlined style={{ fontSize: "12px" }} />}
            >
              {benefit}
            </Tag>
          ))}
        </div>
      )}

      {/* Dropdown for adding benefits */}
      <Select
        mode="multiple"
        placeholder="Chọn thêm quyền lợi..."
        value={[]}
        onChange={(newValues: string[]) => {
          const combinedBenefits = value.concat(newValues);
          const uniqueBenefits = Array.from(new Set(combinedBenefits));
          onChange?.(uniqueBenefits);
        }}
        style={{
          width: "100%",
        }}
        dropdownStyle={{
          borderRadius: "8px",
        }}
        variant={"borderless"}
        suffixIcon={null}
      >
        {benefitOptions.map((option) => (
          <Option key={option} value={option} disabled={value.includes(option)}>
            {option}
          </Option>
        ))}
      </Select>
    </div>
  );

  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        initialValues={{
          services: [],
        }}
        requiredMark={false}
      >
        <Form.List name="services">
          {(fields, { add, remove }) => (
            <>
              {fields.length === 0 && (
                <div style={{ marginBottom: "24px" }}>
                  <Col
                    className="parnterProjectsEmptyContainer"
                    style={{ textAlign: "center", padding: "0 0" }}
                  >
                    <Space
                      direction="vertical"
                      size={"middle"}
                      align={"center"}
                    >
                      <div className={"iconWrapper"}>
                        <IconSvgLocal
                          name={"IC_ADD_PROJECT"}
                          fill={"transparent"}
                          width={25}
                          height={28}
                        />
                      </div>
                    </Space>
                    <Typography.Text
                      type="secondary"
                      style={{ fontSize: "14px", display: "block" }}
                    >
                      Hãy cung cấp các gói dịch vụ của bạn
                    </Typography.Text>
                  </Col>
                </div>
              )}

              {fields.length > 0 &&
                fields.map((field, index) => (
                  <div
                    key={field.key}
                    style={{
                      maxWidth: "100%",
                      margin: "0",
                      borderRadius: "10px",
                      border: "1px solid #D4D4D4",
                      padding: "20px",
                      paddingBottom: "4px",
                      position: "relative",
                      marginBottom: "24px",
                    }}
                  >
                    {/* Nút xóa service (chỉ hiển thị khi có nhiều hơn 1 service) */}
                    {fields.length > 0 && (
                      <Button
                        type="text"
                        className="deleteBtn"
                        icon={<CloseOutlined />}
                        onClick={() => remove(field.name)}
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          zIndex: 1,
                          border: "none",
                          background: "transparent",
                          color: "#000",
                          fontSize: "15px",
                          width: "24px",
                          height: "24px",
                          padding: "16px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            "rgba(188, 187, 187, 0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                        }}
                      />
                    )}

                    {/* Tên dịch vụ */}
                    <Form.Item
                      label={"Tên dịch vụ"}
                      name={[field.name, "serviceName"]}
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập tên dịch vụ",
                        },
                        {
                          whitespace: true,
                          message: "Tên dịch vụ không được để trống",
                        },
                      ]}
                      style={{ marginBottom: "20px" }}
                    >
                      <Input placeholder="Tên dịch vụ" />
                    </Form.Item>

                    {/* Gói dịch vụ */}
                    <Form.Item
                      label={"Gói dịch vụ"}
                      name={[field.name, "servicePackage"]}
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn gói dịch vụ",
                        },
                      ]}
                      style={{ marginBottom: "20px" }}
                    >
                      <PackageSelector />
                    </Form.Item>

                    {/* Khoảng giá */}
                    <Row gutter={20}>
                      <Col span={12}>
                        <Form.Item
                          label={"Từ"}
                          name={[field.name, "priceFrom"]}
                          rules={[{ required: true, validator: validatePrice }]}
                          style={{ marginBottom: "20px" }}
                        >
                          <Input
                            placeholder="1,000,000"
                            onChange={(e) =>
                              handleNumberInput(e, ["services", "priceFrom"])
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label={"Đến"}
                          name={[field.name, "priceTo"]}
                          rules={[{ required: true, validator: validatePrice }]}
                          style={{ marginBottom: "20px" }}
                        >
                          <Input
                            placeholder="20,000,000"
                            onChange={(e) =>
                              handleNumberInput(e, ["services", "priceTo"])
                            }
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    {/* Quyền lợi dịch vụ */}
                    <Form.Item
                      label={"Quyền lợi dịch vụ"}
                      name={[field.name, "benefits"]}
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn ít nhất 1 quyền lợi dịch vụ",
                        },
                      ]}
                      style={{ marginBottom: "20px" }}
                    >
                      <BenefitsSelector />
                    </Form.Item>
                  </div>
                ))}

              {/* Nút thêm dịch vụ */}
              <div
                style={{
                  marginTop: "24px",
                  marginBottom: "24px",
                  textAlign: "left",
                }}
              >
                <Button
                  icon={<PlusOutlined />}
                  onClick={() =>
                    add({
                      serviceName: "",
                      servicePackage: "advanced",
                      priceFrom: "",
                      priceTo: "",
                      benefits: [],
                    })
                  }
                >
                  Thêm dịch vụ
                </Button>
              </div>
            </>
          )}
        </Form.List>
      </Form>
    </div>
  );
}
