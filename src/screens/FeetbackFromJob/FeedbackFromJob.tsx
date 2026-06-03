import React, { useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Typography,
  Radio,
  message,
  Breadcrumb,
  Checkbox,
  Steps, // Dùng Steps để chia bước
  Space, // Dùng Space để căn chỉnh
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { RcFile } from "antd/es/upload";
import RootLayout from "@/src/layouts/RootLayout";
import Head from "next/head";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import { useAccountContext } from "@/src/contexts/AccountContext";

// --- 1. INTERFACE CHO DỮ LIỆU FORM ---
interface FeedbackFormValues {
  email: string;
  // Mục 2
  ux_jobSearch?: string;
  ux_applicationProcess?: string;
  ux_fastSubmit?: string;
  // Mục 3
  execution_tools?: string;
  execution_clientCommunication?: string;
  execution_support?: string;
  // Mục 4
  acceptance_submission?: string;
  acceptance_clientFeedback?: string;
  // Mục 5
  payment_safety?: string;
  payment_speed?: string;
  // Mục 6, 7, 8
  biggestObstacle?: string;
  bestSatisfaction?: string;
  otherSuggestions?: string;
  // Mục 9
  agreeFeedback?: boolean;
}

// --- 2. COMPONENT CON CHO ĐÁNH GIÁ (GIỮ LẠI TỪ BẢN CŨ) ---
interface RatingGroupProps {
  name: keyof FeedbackFormValues;
  label: string;
  rules?: any[];
  options: { value: string; label: string }[];
}

const ratingOptions = [
  { value: "1", label: "Rất không hài lòng" },
  { value: "2", label: "Không hài lòng" },
  { value: "3", label: "Bình thường" },
  { value: "4", label: "Hài lòng" },
  { value: "5", label: "Rất hài lòng" },
];

const RatingGroup: React.FC<RatingGroupProps> = ({
  name,
  label,
  rules,
  options = [],
}) => (
  <Form.Item label={label} name={name as string} rules={rules}>
    <Radio.Group style={{ width: "100%" }}>
      <Row gutter={[10, 10]} justify="space-between" style={{ width: "100%" }}>
        {options.map((opt) => (
          <Col key={opt.value}>
            <Radio value={opt.value}>{opt.label}</Radio>
          </Col>
        ))}
      </Row>
    </Radio.Group>
  </Form.Item>
);

// --- 3. COMPONENT CHÍNH DÙNG STEPS ---
export function FeedbackFormScreen() {
  const router = useRouter();
  const pageTitle = "Tiếp nhận phản ánh sau jobs";
  const { auth: fullProfileResource } = useAccountContext();

  const [currentStep, setCurrentStep] = useState(0); // State quản lý bước hiện tại
  const [form] = Form.useForm<FeedbackFormValues>();

  const handleNext = async () => {
    try {
      // Validate chỉ các trường trong bước hiện tại
      const fieldsToValidate = steps[currentStep].requiredFields;
      await form.validateFields(fieldsToValidate);
      setCurrentStep(currentStep + 1);
    } catch (errorInfo) {
      message.error(
        "Oops! Vui lòng điền đủ thông tin bắt buộc trước khi qua bước tiếp theo."
      );
    }
  };

  const handleFormSubmit = async (values: FeedbackFormValues) => {
    message.success("Feedback của bạn đã được gửi. Cảm ơn bạn rất nhiều!");
    // router.push("/thank-you");
  };

  // Định nghĩa các bước của Form
  const steps = [
    {
      title: "Giai đoạn 1: Khởi đầu (Mục 1 & 2)",
      description: "Thông tin cá nhân & Trải nghiệm ứng tuyển",
      content: (
        <>
          <Typography.Title level={5}>
            1. Email đăng ký iAgree *
          </Typography.Title>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input
              defaultValue={fullProfileResource?.email || ""}
              size="large"
              placeholder="Nhập email của bạn"
            />
          </Form.Item>

          <Typography.Title level={5} style={{ marginTop: "20px" }}>
            2. Giao diện và trải nghiệm ứng tuyển *
          </Typography.Title>
          <RatingGroup
            label="Dễ dàng tìm công việc phù hợp"
            name="ux_jobSearch"
            rules={[{ required: true, message: "Vui lòng đánh giá!" }]}
            options={ratingOptions}
          />
          <RatingGroup
            label="Quy trình ứng tuyển rõ ràng, dễ hiểu"
            name="ux_applicationProcess"
            rules={[{ required: true, message: "Vui lòng đánh giá!" }]}
            options={ratingOptions}
          />
          <RatingGroup
            label="Gửi đề xuất/ứng tuyển nhanh chóng"
            name="ux_fastSubmit"
            rules={[{ required: true, message: "Vui lòng đánh giá!" }]}
            options={ratingOptions}
          />
        </>
      ),
      requiredFields: [
        "email",
        "ux_jobSearch",
        "ux_applicationProcess",
        "ux_fastSubmit",
      ] as (keyof FeedbackFormValues)[],
    },
    {
      title: "Giai đoạn 2: Công việc (Mục 3 & 4)",
      description: "Thực hiện & Nghiệm thu dự án",
      content: (
        <>
          <Typography.Title level={5}>
            3. Giai đoạn thực hiện công việc *
          </Typography.Title>
          <RatingGroup
            label="Công cụ quản lý công việc hữu ích"
            name="execution_tools"
            rules={[{ required: true, message: "Vui lòng đánh giá!" }]}
            options={ratingOptions}
          />
          <RatingGroup
            label="Trao đổi với khách hàng thuận tiện"
            name="execution_clientCommunication"
            rules={[{ required: true, message: "Vui lòng đánh giá!" }]}
            options={ratingOptions}
          />
          <RatingGroup
            label="Hỗ trợ từ iAgree khi có vấn đề phát sinh"
            name="execution_support"
            rules={[{ required: true, message: "Vui lòng đánh giá!" }]}
            options={ratingOptions}
          />

          <Typography.Title level={5} style={{ marginTop: "20px" }}>
            4. Giai đoạn nghiệm thu *
          </Typography.Title>
          <RatingGroup
            label="Thao tác gửi nghiệm thu dễ dàng"
            name="acceptance_submission"
            rules={[{ required: true, message: "Vui lòng đánh giá!" }]}
            options={ratingOptions}
          />
          <RatingGroup
            label="Phản hồi của khách hàng rõ ràng, minh bạch"
            name="acceptance_clientFeedback"
            rules={[{ required: true, message: "Vui lòng đánh giá!" }]}
            options={ratingOptions}
          />
        </>
      ),
      requiredFields: [
        "execution_tools",
        "execution_clientCommunication",
        "execution_support",
        "acceptance_submission",
        "acceptance_clientFeedback",
      ] as (keyof FeedbackFormValues)[],
    },
    {
      title: "Giai đoạn 3: Kết thúc & Góp ý (Mục 5 - 9)",
      description: "Thanh toán & Đề xuất cải tiến",
      content: (
        <>
          <Typography.Title level={5}>5. Thanh toán *</Typography.Title>
          <RatingGroup
            label="Quy trình thanh toán an toàn và minh bạch"
            name="payment_safety"
            rules={[{ required: true, message: "Vui lòng đánh giá!" }]}
            options={ratingOptions}
          />
          <RatingGroup
            label="Thời gian nhận tiền nhanh chóng"
            name="payment_speed"
            rules={[{ required: true, message: "Vui lòng đánh giá!" }]}
            options={ratingOptions}
          />

          <Typography.Title level={5} style={{ marginTop: "20px" }}>
            6. Bạn gặp khó khăn/vướng mắc lớn nhất ở bước nào trong quy trình? *
          </Typography.Title>
          <Form.Item
            name="biggestObstacle"
            rules={[{ required: true, message: "Vui lòng điền câu trả lời!" }]}
          >
            <Input.TextArea rows={3} placeholder="Enter your answer" />
          </Form.Item>

          <Typography.Title level={5}>
            7. Điều bạn hài lòng nhất khi làm việc qua iAgree là gì? *
          </Typography.Title>
          <Form.Item
            name="bestSatisfaction"
            rules={[{ required: true, message: "Vui lòng điền câu trả lời!" }]}
          >
            <Input.TextArea rows={3} placeholder="Enter your answer" />
          </Form.Item>

          <Typography.Title level={5}>
            8. Bạn có góp ý nào khác để iAgree cải thiện hệ thống, giao diện
            không? *
          </Typography.Title>
          <Form.Item
            name="otherSuggestions"
            rules={[{ required: true, message: "Vui lòng điền câu trả lời!" }]}
          >
            <Input.TextArea rows={3} placeholder="Enter your answer" />
          </Form.Item>

          <Typography.Title level={5} style={{ marginTop: "20px" }}>
            9. Tôi đồng ý chia sẻ feedback... 🍹 *
          </Typography.Title>
          <Form.Item
            name="agreeFeedback"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(new Error("Vui lòng đồng ý điều khoản!")),
              },
            ]}
          >
            <Checkbox>**Tôi đồng ý**</Checkbox>
          </Form.Item>
        </>
      ),
      requiredFields: [
        "payment_safety",
        "payment_speed",
        "biggestObstacle",
        "bestSatisfaction",
        "otherSuggestions",
        "agreeFeedback",
      ] as (keyof FeedbackFormValues)[],
    },
  ];

  return (
    <RootLayout>
      <Head>
        <title>{`${pageTitle}`}</title>
      </Head>
      <section className={"breadcrumbContainer"}>
        <div className="contentWrapper">
          <Breadcrumb
            items={[
              {
                title: (
                  <>
                    <IconSvgLocal name={"IC_HOME"} />
                    <span>Trang chủ</span>
                  </>
                ),
                href: "/",
              },
              { title: pageTitle },
            ]}
          />
        </div>
      </section>

      <section className={"sectionContainer"}>
        <div className={"jobFormSectionContainer"}>
          <div className="contentWrapper">
            <Typography.Title level={2}>
              ✨ Feedback Form - Next Level
            </Typography.Title>
            <Typography.Paragraph>
              Chúng ta sẽ điền form qua 3 bước (Steps) để trải nghiệm điền thông
              tin nhanh và gọn hơn!
            </Typography.Paragraph>

            <Steps
              current={currentStep}
              items={steps as any}
              style={{ marginBottom: 30 }}
              type="navigation"
            />

            <Form
              form={form}
              name="steppedFeedbackForm"
              onFinish={handleFormSubmit}
              layout="vertical"
              initialValues={{
                agreeFeedback: false,
                ux_jobSearch: "4",
                execution_tools: "4",
                payment_safety: "4",
                email: fullProfileResource?.email
              }}
            >
              <div
                style={{
                  padding: "20px",
                  border: "1px solid #f0f0f0",
                  borderRadius: 8,
                  minHeight: 400,
                }}
              >
                {steps[currentStep].content}
              </div>

              <Space style={{ marginTop: 24, float: "right" }}>
                {currentStep > 0 && (
                  <Button onClick={() => setCurrentStep(currentStep - 1)}>
                    Quay lại
                  </Button>
                )}
                {currentStep < steps.length - 1 && (
                  <Button type="primary" onClick={handleNext}>
                    Tiếp tục
                  </Button>
                )}
                {currentStep === steps.length - 1 && (
                  <Button type="primary" htmlType="submit">
                    Gửi Feedback (Submit)
                  </Button>
                )}
              </Space>
            </Form>
          </div>
        </div>
      </section>
    </RootLayout>
  );
}

declare global {
  interface Window {
    grecaptcha: {
      execute: (
        siteKey: string,
        options: { action: string }
      ) => Promise<string>;
    };
  }
}
