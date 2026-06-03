
import { Button, Image, Typography, Upload } from "antd";
const { Dragger } = Upload;

import { CloseOutlined } from "@ant-design/icons";
import { IconSvgLocal } from "@/src/components/icon-svg-local";

interface AppIDUploadProps {
  onChange?: (file: string | null) => void;
  value?: string | null;
  disabled?: boolean;
}

function AppIDUpload({ onChange, value, disabled }: AppIDUploadProps) {
  return value ? (
    <div className={"idUploadPreviewContainer"}>
      <Image
        src={value}
        alt={"CCCD/CMND"}
        preview={false}
        width={"100%"}
        className={"idUploadPreviewImg"}
      />
      <Button
        onClick={() => {
          onChange?.(null);
        }}
        icon={<CloseOutlined />}
        shape={"circle"}
        size={"small"}
        type={"primary"}
        className={"idUploadPreviewCloseBtn"}
        disabled={disabled}
      />
    </div>
  ) : (
    <Dragger
      multiple={false}
      maxCount={1}
      accept={"image/*"}
      beforeUpload={(file) => {
        const reader = new FileReader();
        reader.onload = () => onChange?.(reader.result as string);
        reader.readAsDataURL(file);
        return false;
      }}
      showUploadList={false}
      className={"idUploadDragger"}
      disabled={disabled}
    >
      <>
        <IconSvgLocal
          name={"IC_IMAGE_UPLOAD"}
          width={59}
          height={59}
          fill={"none"}
        />
        <Typography.Paragraph className={"idUploadDraggerDescription nm-typo"}>
          Kéo & thả tệp vào đây hoặc chọn tệp
        </Typography.Paragraph>
      </>
    </Dragger>
  );
}

export default AppIDUpload;
