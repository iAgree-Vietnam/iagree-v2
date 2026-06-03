import React, { useEffect, useState } from "react";
import {
  Typography,
  Input,
  Form,
  Divider,
  Select,
  Button,
  message, // Đảm bảo import message
} from "antd";
import { PARTNER_REGISTER_FORM } from "../../constants/PartnerRegisterConstants";
import { useRouter } from "next/router";
import {
  AuthService,
  AuthValidateSuccessData,
} from "../../../../data/authen/AuthService";
import { useAppSelector } from "@/src/hooks/store";
import { useDispatch } from "react-redux";
import { updateValidRefCode } from "@/src/store/slices/auth";
import { includes, isEmpty } from "lodash";

const { Option } = Select;

export interface Step11FormValues {
  referralCode?: string;
  referralSource?: string;
  referralOther?: string;
}

interface Step11PageProps {}

export const Step11Page: React.FC<Step11PageProps> = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { query } = router;
  // Lấy ref_code từ URL và ép kiểu string
  const ref_code = query?.ref_code as string;

  // Lấy Form Instance
  const form = Form.useFormInstance();

  // State quản lý việc hiển thị input "Khác..."
  const [showOtherInput, setShowOtherInput] = useState(false);

  // 🔥🔥🔥 DÙNG Form.useWatch để lấy giá trị real-time từ Input Referrer Code 🔥🔥🔥
  const currentReferralCode = Form.useWatch(
    [PARTNER_REGISTER_FORM.FIELD_NAME.STEP11_DATA, "referred_by_code"],
    form // Truyền form instance vào
  );

  // console.log("form", form.getFieldsValue());
  const formValues = form.getFieldsValue();
  useEffect(() => {
    const referral_source_id = formValues?.STEP11_DATA?.referral_source_id;
    if (referral_source_id && includes("5", referral_source_id)) {
      if (includes("5", referral_source_id)) { // "khác"
        setShowOtherInput(true);
      } else {
        setShowOtherInput(false);
      }
    }
  }, [JSON.stringify(formValues?.STEP11_DATA)]);

  const handleReferralSourceChange = (value: string) => {
    setShowOtherInput(value === "5"); // '5' là Option "Khác..."
  };
  const ref = form.getFieldsValue()?.STEP11_DATA?.referred_by_code;
  const showCheckButton = !ref_code; // Chỉ hiển thị nút khi không có code từ URL
  useEffect(() => {
    if (isEmpty(ref)) {
      dispatch(updateValidRefCode({ isValid: true }));
    }
  }, [ref]);
  const [reward, setReward] = useState<Partial<AuthValidateSuccessData>>();
  // Logic kiểm tra Mã giới thiệu
  const handleValidateCode = async () => {
    const codeToValidate = currentReferralCode?.trim();

    if (!codeToValidate) {
      message.warning("Vui lòng nhập mã giới thiệu trước khi kiểm tra.");
      return;
    }

    try {
      // Gọi API với codeToValidate
      const result = await new AuthService().validateAuthCode(codeToValidate);

      if (result.success || result.referrer_name) {
        setReward({
          referrer_name: result?.referrer_name, // Tên người giới thiệu
          reward_amount: result?.reward_amount,
        });
        message.success(`Mã giới thiệu hợp lệ!`);
        dispatch(
          updateValidRefCode({
            isValid: true,
          })
        );
        setShowOtherInput(false);
      } else {
        setReward(undefined);
        message.warning(`Mã giới thiệu không hợp lệ!`);
        form.setFieldsValue({
          [PARTNER_REGISTER_FORM.FIELD_NAME.STEP11_DATA]: {
            referred_by_code: "",
          },
        });
        dispatch(
          updateValidRefCode({
            isValid: false,
          })
        );
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi khi kiểm tra mã. Vui lòng thử lại.");
    }
  };

  return (
    <div style={{ padding: "0 0" }}>
      <div style={{ marginBottom: "15px" }}>
        <Typography.Title
          level={2}
          style={{ margin: 0, color: "#333", marginBottom: "10px" }}
        >
          Bạn biết đến iAgree từ đâu
        </Typography.Title>
        <Typography.Text style={{ fontSize: 16, color: "#09993E" }}>
          Hãy nhập mã giới thiệu để nhận nhiều ưu đãi bạn nhé !
        </Typography.Text>
      </div>

      <Divider style={{ borderColor: "#D4D4D4", margin: "0 0 16px 0" }} />

      {/* Select Kênh bạn biết đến */}
      <Form.Item
        label="Kênh bạn biết đến iAgree"
        name={[
          PARTNER_REGISTER_FORM.FIELD_NAME.STEP11_DATA,
          "referral_source_id",
        ]}
        rules={[{ required: true, message: "Vui lòng chọn kênh!" }]}
        style={{ marginBottom: 8 }}
      >
        <Select
          placeholder="Chọn kênh bạn biết đến iAgree"
          size="large"
          onChange={handleReferralSourceChange}
        >
          <Option value="1">
            Group Facebook (Khu Phố Freelancer, JOBVUI, Freelancer Remote, Học
            và làm Design...)
          </Option>
          <Option value="2">
            Các Page chính của iAgree (Fanpage/Instagram/LinkedIn/TikTok...)
          </Option>
          <Option value="3">KOL/KOC trên TikTok</Option>
          <Option value="4">
            Đối tác từ nền tảng (nhập Referral Code để nhận thêm cơ hội)
          </Option>
          <Option value="5">Khác...</Option>
        </Select>
      </Form.Item>

      {/* Input Khác... */}
      {showOtherInput && (
        <Form.Item
          name={[
            PARTNER_REGISTER_FORM.FIELD_NAME.STEP11_DATA,
            "referral_source_description",
          ]}
          label="Vui lòng ghi rõ"
          rules={[{ required: true, message: "Vui lòng nhập câu trả lời!" }]}
          style={{ marginTop: 8 }}
        >
          <Input placeholder="Nhập câu trả lời của bạn..." size="large" />
        </Form.Item>
      )}

      <Divider style={{ borderColor: "#D4D4D4", margin: "20px 0 12px 0" }} />

      <Typography.Title level={5} style={{ margin: 0 }}>
        Mã giới thiệu{" "}
        <Typography.Text type="secondary" style={{ color: "#8c8c8c" }}>
          (tuỳ chọn)
        </Typography.Text>
      </Typography.Title>

      {/* 🔥🔥🔥 KHU VỰC FIX LAYOUT: Dùng noStyle và Input.Group compact 🔥🔥🔥 */}
      <Form.Item
        // Không dùng 'name' ở đây, chỉ dùng để quản lý spacing
        style={{ marginBottom: 0, marginTop: "8px" }}
      >
        <Input.Group compact style={{ display: "flex" }}>
          <Form.Item
            name={[
              PARTNER_REGISTER_FORM.FIELD_NAME.STEP11_DATA,
              "referred_by_code",
            ]}
            noStyle={true} // 🔥 CHÌA KHÓA FIX LAYOUT: Bỏ style mặc định của Form.Item
            initialValue={ref_code}
            rules={[{ required: false, message: "Vui lòng nhập câu trả lời!" }]}
            // Tính toán chiều rộng để Input và Button vừa vặn
            style={{ width: showCheckButton ? "calc(100% - 100px)" : "100%" }}
          >
            <Input
              onChange={() => {
                dispatch(updateValidRefCode({ isValid: false }));
              }}
              placeholder="Nhập mã giới thiệu của bạn (nếu có)"
              size="large"
              disabled={!!ref_code}
            />
          </Form.Item>

          {/* Button Kiểm tra/Nhập Code */}
          {showCheckButton && (
            <Button
              type="primary"
              size="large"
              style={{ width: "100px" }}
              onClick={handleValidateCode}
            >
              Kiểm tra
            </Button>
          )}
        </Input.Group>
        {reward?.referrer_name && reward?.reward_amount && (
          <Typography.Text style={{ color: "#09993E" }}>
            <br />
            {/* 🎉 Nhập giới thiệu thành công!{" "}
            <strong>{reward?.referrer_name}</strong> đã nhận được{" "}
            <strong>{reward?.reward_amount} cơ hội</strong>. */}
            Mã giới thiệu đã được áp dụng. Bạn và người giới thiệu{" "}
            {reward?.referrer_name} cùng nhận +{reward?.reward_amount} Cơ Hội,
            Cơ Hội sẽ được cộng vào tài khoản khi hai bạn đã cập nhật Căn cước
            Công dân.
          </Typography.Text>
        )}
      </Form.Item>
    </div>
  );
};
