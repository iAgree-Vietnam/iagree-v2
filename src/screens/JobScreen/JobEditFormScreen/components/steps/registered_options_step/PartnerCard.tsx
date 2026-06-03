
import { Card, Typography, Tag, Rate, Button, Space, Row, Divider } from "antd";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import { ButtonWithIcon } from "@/src/components/button";

const { Text } = Typography;

interface PartnerCardProps {
  partner: {
    id: string;
    name: string;
    avatar: string;
    expertise: string;
    title?: string;
    rating?: number;
    field?: string;
  };
}

const PartnerCard: React.FC<PartnerCardProps> = ({ partner }) => {
  const skills = partner.expertise
    ? partner.expertise.split(",").map((s) => s.trim())
    : [];

  const fields = partner.field
    ? partner.field.split(",").map((f) => f.trim())
    : [];

  const displayTitle =
    partner.title || (skills.length > 0 ? skills[0] : "Chuyên gia");

  return (
    <Card
      hoverable
      style={{
        borderRadius: "8px",
        overflow: "hidden",
        width: "100%",
        marginBottom: "16px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.09)",
      }}
      bodyStyle={{ padding: 0 }}
    >
      {/* Phần hình ảnh và Overlay (chiếm khoảng 2/3 chiều cao) */}
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingBottom: "90.00%",
          backgroundColor: "#f0f2f5",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <img
          alt={partner.name}
          src={partner.avatar}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = `https://api.dicebear.com/7.x/miniavs/svg?seed=${partner.id}`;
          }}
        />
        {/* Lớp Overlay hiển thị tên và chức danh */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.6) 5%, rgba(0,0,0,0) 100%)",
            color: "white",
            paddingInline: "16px",
            paddingTop: "16px",
            paddingBottom: "8px",
            textAlign: "left",
          }}
        >
          <Text
            strong
            style={{ color: "white", display: "block", fontSize: "1.2em" }}
          >
            {partner.name}
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.9em" }}>
            {displayTitle}
          </Text>
        </div>
      </div>

      {/* Phần nội dung còn lại (chiếm khoảng 1/3 chiều cao) */}
      <div
        style={{
          paddingTop: "8px",
          paddingBottom: "12px",
          paddingInline: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {/* Đánh giá (Sao vàng) */}
        {partner.rating !== undefined && (
          <Space size={4}>
            <Rate
              allowHalf
              disabled
              defaultValue={partner.rating}
              style={{ fontSize: 13, color: "#FFC107" }}
            />
            <Text type="secondary" style={{ fontSize: "0.9em" }}>
              ({partner.rating.toFixed(1)})
            </Text>
          </Space>
        )}

        {/* Lĩnh vực dưới dạng Tag */}
        <div>
          <Text strong>Lĩnh vực: </Text>
          {fields.map((field, index) => (
            <Tag key={index} style={{ marginBottom: "2px" }}>
              {field}
            </Tag>
          ))}
        </div>

        {/* --- Đường nét đứt phân cách --- */}
        {(fields.length > 0 || skills.length > 0) && (
          <Divider
            style={{ margin: "2px 0", borderTop: "1px dashed #e0e0e0" }}
          />
        )}

        {/* Danh sách kỹ năng dưới dạng Tag */}
        <div>
          <Text strong>Kỹ năng: </Text>
          {skills.map((skill, index) => (
            <Tag key={index} style={{ marginBottom: "4px" }}>
              {skill}
            </Tag>
          ))}
        </div>

        <Row
          className={"partnerItemBottom"}
          justify={"center"}
          style={{ marginTop: 10 }}
        >
          <ButtonWithIcon
            icon={
              <IconSvgLocal name={"IC_ARROW_RIGHT"} width={26} height={9} />
            }
            iconPosition={"end"}
          >
            Xem hồ sơ
          </ButtonWithIcon>
        </Row>
      </div>
    </Card>
  );
};

export default PartnerCard;
