import React, { useCallback, useState } from "react";
import { Form, FormInstance } from "antd";
import TermAndConditionsModal from "../modals/TermAndConditionsModal";
import TermForPartnerModal from "../modals/TermForPartnerModal";

interface JobTermsAndConditionsV2Props {
  form: FormInstance;
}

type FieldName = "accept_terms" | "accept_terms_for_partner";

type TermsRowProps = {
  checked: boolean;
  onOpenModal: () => void;
  onToggleOff: () => void;
  text: React.ReactNode;
};

function TermsRow({ checked, onOpenModal, onToggleOff, text }: TermsRowProps) {
  const handleClick = () => {
    if (checked) onToggleOff();
    else onOpenModal();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 8,
        cursor: "pointer",
        userSelect: "none",
        padding: "8px 0",
      }}
    >
      {/* ✅ Custom checkbox */}
      <span
        aria-hidden="true"
        style={{
          height: 20,
          width: 20,
          minWidth: 20,
          borderRadius: 6,
          border: "2px solid #09993E",
          backgroundColor: checked ? "#09993E" : "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background-color 150ms ease, border-color 150ms ease",
        }}
      >
        {/* ✅ Tick trắng – opacity 0 / 1 */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          style={{
            opacity: checked ? 1 : 0,
            transition: "opacity 150ms ease",
          }}
        >
          <path
            d="M20 6L9 17l-5-5"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      {/* Text */}
      <div
        style={{
          fontSize: 14,
          lineHeight: "20px",
        }}
      >
        {text}
      </div>
    </div>
  );
}


const PartnerTermsAndConditions: React.FC<JobTermsAndConditionsV2Props> = ({
  form,
}) => {
  const [isModalTermsVisible, setIsModalTermsVisible] = useState(false);
  const [isModalTermsForPartnerVisible, setIsModalTermsForPartnerVisible] =
    useState(false);

  // ✅ reactive values
  const acceptTerms = Form.useWatch("accept_terms", form) || false;
  const acceptTermsForPartner =
    Form.useWatch("accept_terms_for_partner", form) || false;

  const setChecked = useCallback(
    (fieldName: FieldName, value: boolean) => {
      form.setFieldValue(fieldName, value);
    },
    [form]
  );

  const openTermsModal = () => setIsModalTermsVisible(true);
  const openPartnerModal = () => setIsModalTermsForPartnerVisible(true);

  const closeTermsModal = () => setIsModalTermsVisible(false);
  const closePartnerModal = () => setIsModalTermsForPartnerVisible(false);

  const handleAcceptTerms = () => {
    setChecked("accept_terms", true);
    closeTermsModal();
  };

  const handleAcceptTermsForPartner = () => {
    setChecked("accept_terms_for_partner", true);
    closePartnerModal();
  };

  return (
    <>
      {/* ===== TERMS 1 ===== */}
      <Form.Item
        name="accept_terms"
        valuePropName="checked"
        rules={[{ required: true, message: "Bạn phải đồng ý với điều khoản" }]}
        style={{ marginBottom: 8 }}
      >
        <TermsRow
          checked={acceptTerms}
          onOpenModal={openTermsModal}
          onToggleOff={() => setChecked("accept_terms", false)}
          text={
            <>
              Tôi đồng ý với{" "}
              <span style={{
                color:"#09993E",
              }} className="underline underline-offset-2">
                Điều khoản sử dụng dịch vụ
              </span>
            </>
          }
        />
      </Form.Item>

      {/* ===== TERMS 2 ===== */}
      <Form.Item
        name="accept_terms_for_partner"
        valuePropName="checked"
        rules={[{ required: true, message: "Bạn phải đồng ý với điều khoản" }]}
        style={{ marginBottom: 0 }}
      >
        <TermsRow
          checked={acceptTermsForPartner}
          onOpenModal={openPartnerModal}
          onToggleOff={() => setChecked("accept_terms_for_partner", false)}
          text={
            <>
              Tôi đồng ý với{" "}
              <span style={{
                color:"#09993E",
              }}  className="underline underline-offset-2">
                Quy tắc ứng xử &amp; Điều khoản dành cho Đối Tác
              </span>
            </>
          }
        />
      </Form.Item>

      <TermAndConditionsModal
        visible={isModalTermsVisible}
        onClose={closeTermsModal}
        onAccept={handleAcceptTerms}
      />

      <TermForPartnerModal
        visible={isModalTermsForPartnerVisible}
        onClose={closePartnerModal}
        onAccept={handleAcceptTermsForPartner}
      />
    </>
  );
};

export default PartnerTermsAndConditions;
