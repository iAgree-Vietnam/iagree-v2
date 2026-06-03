import React, { useState } from "react";
import { Checkbox, Form, FormInstance } from "antd";
import PrivacyPolicyRouteUtils from "@/src/data/privacy-policy/utils/PrivacyPolicyRouteUtils";
import TermOfUseRouteUtils from "@/src/data/term-of-use/utils/TermOfUseRouteUtils";
import Link from "next/link";
import TermAndConditionsModal from "./modals/TermAndConditionsModal";
interface JobTermsAndConditionsV2Props {
  form: FormInstance;
  // onAcceptConditionChange: (accepted: boolean) => void;
}

const JobTermsAndConditionsV2: React.FC<JobTermsAndConditionsV2Props> = ({
  form,
  // onAcceptConditionChange,
}) => {
  const baseUrl = process.env.BASE_URL;
  const [isModalVisible, setIsModalVisible] = useState(false);
  // const [isAccepted, setIsAccepted] = useState(false);

  const handleCheckboxClick = (e: any) => {
  if (e.target.checked) {
    setIsModalVisible(true);
    // prevent immediate check until modal is accepted
    form.setFieldValue("accept_condition", false);
  } else {
    form.setFieldValue("accept_condition", false);
  }
};

  const handleModalAccept = () => {
    // setIsAccepted(true);
    // onAcceptConditionChange(true);
    form.setFieldValue("accept_condition", true);
    setIsModalVisible(false);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Form.Item
        name="accept_condition"
        valuePropName="checked"
        rules={[
          { required: true, message: "Bạn phải đồng ý với điều khoản" }
        ]}
      >
        {/* <div onClick={handleCheckboxClick} style={{ cursor: "pointer" }}> */}
          <Checkbox
            checked={form.getFieldValue("accept_condition") || false}
            onChange={handleCheckboxClick}
          >
            Tôi đồng ý với {' '}
            <a 
              // href={`${baseUrl}/policy/serviceProvideContract.html`} 
              // target="_blank"
              style={{ color: '#69b1ff' }}
            >Điều khoản sử dụng, Chính sách đăng công việc</a> 
            {' '} và sẵn sàng trả phí theo thỏa thuận với Đối tác
          </Checkbox>
        {/* </div> */}
      </Form.Item>

      <TermAndConditionsModal
        visible={isModalVisible}
        onClose={handleModalClose}
        onAccept={handleModalAccept}
      />
    </>
  );
};

export default JobTermsAndConditionsV2;