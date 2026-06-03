
import { Modal, Button, message } from "antd";
import Constants from "@/src/constants/Constants";

interface BusinessLicenseViewModalStep9Props {
  isVisible: boolean;
  onClose: () => void;
  businessLicenseFile: File | null;
  businessLicenseUrl: string | undefined;
}

function BusinessLicenseViewModalStep9({
  isVisible,
  onClose,
  businessLicenseFile,
  businessLicenseUrl,
}: BusinessLicenseViewModalStep9Props) {
  // Determine the source URL and file name to display
  let fileSource = undefined;
  let fileName = "";

  if (businessLicenseFile) {
    // Case 1: New file uploaded by user
    fileSource = URL.createObjectURL(businessLicenseFile);
    fileName = businessLicenseFile.name;
  } else if (businessLicenseUrl) {
    // Case 2: Existing file from a URL
    fileSource = businessLicenseUrl;

    // Extract file name from URL
    try {
      const parts = businessLicenseUrl.split("/");
      fileName = parts[parts.length - 1];
    } catch (error) {
      fileName = "giay-phep-kinh-doanh.pdf"; // Fallback name
    }
  }

  const hasFile = !!fileSource;

  return (
    <Modal
      title="Giấy phép kinh doanh"
      open={isVisible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
      ]}
      width={800}
    >
      {hasFile ? (
        <div>
          <p>
            <strong>Tên tệp:</strong> {fileName}
          </p>
          <div style={{ marginTop: 16 }}>
            <iframe
              src={fileSource}
              width="100%"
              height="500px"
              style={{ border: "1px solid #d9d9d9" }}
            />
          </div>
        </div>
      ) : (
        <p>Không tìm thấy giấy phép kinh doanh.</p>
      )}
    </Modal>
  );
}

export default BusinessLicenseViewModalStep9;
