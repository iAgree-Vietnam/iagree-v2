
import { Typography, Input, Divider, Form } from "antd";
import { PARTNER_REGISTER_FORM } from "../../constants/PartnerRegisterConstants";
import Constants from "@/src/constants/Constants";

const { Title, Text } = Typography;
const { TextArea } = Input;

const maxLength = Constants.TEXT_MAX_LENGTH;

export const Step7Page: React.FC = () => {
  const form = Form.useFormInstance();
  const selfIntroduction = Form.useWatch(
    [PARTNER_REGISTER_FORM.FIELD_NAME.STEP7_DATA, "selfIntroduction"],
    form
  );

  const currentLength = selfIntroduction ? selfIntroduction.length : 0;

  return (
    <div style={{ padding: "0 0" }}>
      <div style={{ marginBottom: "15px" }}>
        <Title
          level={2}
          style={{ margin: 0, color: "#333", marginBottom: "10px" }}
        >
          Một đoạn giới thiệu ấn tượng để Khách hàng hiểu rõ bạn hơn!
        </Title>
        <Text style={{ color: "#09993E" }}>
          Hãy chia sẻ ngắn gọn bạn là ai, bạn giỏi điều gì và bạn có thể giúp gì
          cho Khách hàng. Đừng ngại thể hiện điểm mạnh, phong cách làm việc hoặc
          thành tựu nổi bật của bạn.
        </Text>
      </div>
      <Divider style={{ borderColor: "#D4D4D4", margin: "0 0 12px 0" }} />

      <Typography.Title level={5} style={{ marginBottom: 5 }}>
        Mô tả giới thiệu <span style={{ color: "red" }}>*</span>
      </Typography.Title>

      <Form.Item
        name={[PARTNER_REGISTER_FORM.FIELD_NAME.STEP7_DATA, "selfIntroduction"]}
        rules={[
          {
            required: true,
            message: "Vui lòng nhập mô tả giới thiệu bản thân.",
          },
          {
            max: maxLength,
            message: `Mô tả không được vượt quá ${maxLength} ký tự.`,
          },
        ]}
      >
        <TextArea
          placeholder="Ví dụ: Tôi là chuyên gia với 10 năm kinh nghiệm trong lĩnh vực thiết kế đồ họa. Tôi có khả năng biến ý tưởng của bạn thành những sản phẩm trực quan ấn tượng và hiệu quả."
          maxLength={maxLength}
          autoSize={{ minRows: 4, maxRows: 8 }}
        />
      </Form.Item>

      <div style={{ textAlign: "right", marginTop: "-12px" }}>
        <Text
          type="secondary"
          style={{
            color: currentLength > maxLength ? "red" : undefined,
          }}
        >
          ({`${currentLength} / ${maxLength}`})
        </Text>
      </div>
    </div>
  );
};
