
import { Form, Checkbox } from "antd";
import Link from "next/link";
import PrivacyPolicyRouteUtils from "@/src/data/privacy-policy/utils/PrivacyPolicyRouteUtils";
import TermOfUseRouteUtils from "@/src/data/term-of-use/utils/TermOfUseRouteUtils";

interface PartnerTermsAndConditionsProps {
  stepIndex: number;
}

export function PartnerTermsAndConditions({
  stepIndex,
}: PartnerTermsAndConditionsProps) {
  return (
    <div className={"formGroupContainer"}>
      <div className={"formGroupContentContainer"}>
        <Form.Item
          name={"acceptCondition"}
          valuePropName="checked"
          rules={
            stepIndex === 3
              ? [
                  {
                    validator: async (_, checked) => {
                      if (!checked) {
                        return Promise.reject(
                          new Error(
                            "Bạn cần đồng ý với điều khoản dịch vụ và chính sách bảo mật của iAgree"
                          )
                        );
                      }
                    },
                  },
                ]
              : []
          }
        >
          <Checkbox name={"acceptCondition"}>
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
              href={PrivacyPolicyRouteUtils.toScreen()}
              className={"termAndConditionLinkText link"}
            >
              Chính sách bảo mật
            </Link>{" "}
            của iAgree
          </Checkbox>
        </Form.Item>
      </div>
    </div>
  );
}
