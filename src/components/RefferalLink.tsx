
import { Input, Typography, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface ReferralLinkProps {
  code: string;
  title?: string;
}

export const ReferralLink: React.FC<ReferralLinkProps> = ({ code, title }) => {
  // const officialCode = `https://iagree.vn/partner-register-v2?ref_code=${code}`;
  const officialCode = `${code}`;
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(officialCode);
      message.success("Copy thành công!");
    } catch {
      message.error("Không thể copy, vui lòng thử lại!");
    }
  };

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
      {title && (
        <Text style={{ fontSize: 13, color: "#555", marginBottom: 6 }}>
          {title}
        </Text>
      )}
      {/* // /partner-register-get-start */}
      <Input
        value={officialCode} //IAG-83B31002B8651
        // readOnly
        disabled
        size="large"
        style={{
          width: "100%",
          fontSize: 16,
          fontWeight: 500,
          cursor: "default",
          userSelect: "all",
        }}
        suffix={
          <CopyOutlined
            onClick={handleCopy}
            style={{
              fontSize: 18,
              color: "#1677ff",
              cursor: "pointer",
            }}
          />
        }
      />
    </div>
  );
};