
import { Checkbox, Form } from "antd";
import PrivacyPolicyRouteUtils from "@/src/data/privacy-policy/utils/PrivacyPolicyRouteUtils";
import TermOfUseRouteUtils from "@/src/data/term-of-use/utils/TermOfUseRouteUtils";
import Link from "next/link";

interface JobTermsAndConditionsProps {
  onAcceptConditionChange: (accepted: boolean) => void;
}

const JobTermsAndConditions: React.FC<JobTermsAndConditionsProps> = ({
  onAcceptConditionChange,
}) => {
  const handleAcceptConditionChange = (e: any) => {
    const checked = e.target.checked;
    onAcceptConditionChange(checked);
  };

  return (
    <Form.Item
      name="acceptCondition"
      valuePropName="checked"
      rules={[
        {
          validator: (_, value) =>
            value
              ? Promise.resolve()
              : Promise.reject(
                  new Error(
                    "Bạn phải chấp nhận Điều khoản dịch vụ và Chính sách thanh toán để tiếp tục."
                  )
                ),
        },
      ]}
    >
      <Checkbox name={"acceptCondition"} onChange={handleAcceptConditionChange}>
        Tôi đã đọc và đồng ý với{" "}
        <Link
          target={"_blank"}
          href={TermOfUseRouteUtils.toScreen()}
          className={"termAndConditionLinkText link"}
        >
          Điều khoản dịch vụ
        </Link>{" "}
        và{" "}
        <Link
          target={"_blank"}
          href={PrivacyPolicyRouteUtils.toPaymentPolicyScreen()}
          className={"termAndConditionLinkText link"}
        >
          Chính sách thanh toán
        </Link>{" "}
        của iAgree
      </Checkbox>
    </Form.Item>
  );
};

export default JobTermsAndConditions;
