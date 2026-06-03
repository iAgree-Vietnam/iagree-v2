import { Typography } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";

const { Title } = Typography;

export const renderSectionTitle = <T extends { [key: string]: any }>(
  data: T[],
  title: React.ReactNode,
  expanded: boolean,
  toggle: () => void,
  clearBtn: React.ReactNode | null,
  baseColor: string,
  showTotalAndDot?: boolean | true
) => {
  const displayCount = data.length > 0 ? ` (${data.length})` : "";

  return (
    <div
      style={{
        userSelect: "none",
        cursor: "pointer",
        marginBottom: 8,
      }}
      onClick={toggle}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <Title level={5} style={{ margin: 0, lineHeight: 1, flex: 1 }}>
          {title} {displayCount}
          {showTotalAndDot ?? (
            <span
              style={{
                display: "inline-block",
                width: 7,
                height: 7,
                borderRadius: "50%",
                marginLeft: 3,
                background: baseColor,
              }}
            />
          )}
        </Title>
        <CaretDownOutlined
          style={{
            height: 12,
            width: 12,
            transition: "transform 0.3s",
            transform: expanded ? "rotate(0deg)" : "rotate(180deg)",
          }}
        />
      </div>

      {clearBtn && <div style={{ marginTop: 4 }}>{clearBtn}</div>}
    </div>
  );
};
