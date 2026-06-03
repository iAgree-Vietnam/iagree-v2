import { Button, Input, Popover, Space, Typography } from "antd";
import { CaretDownOutlined, CloseOutlined } from "@ant-design/icons";
import { includes, isEmpty, size, toString } from "lodash";
import { Step2V2ScreenFilterState } from "../pages/step_2_v2/Step2_V2_Page";
import { useMemo } from "react";

const { Text } = Typography;

export const SECTION_DOT_COLORS = {
  category: "#09993E",
  serviceCategory: "#a7330cff",
  skill: "#2980B9",
  serviceDetail: "#FF9800",
};

export const renderSectionTitle = (title: string, maximum?: string) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      marginBottom: "0",
    }}
  >
    <div style={{ display: "flex", alignItems: "center" }}>
      <Typography.Text
        style={{
          margin: 0,
          color: "#09993E",
          fontSize: "15px",
          fontWeight: "600",
        }}
      >
        {title}
      </Typography.Text>

      {maximum && (
        <Typography.Text style={{ margin: 0, color: "#555", fontSize: "11px" }}>
          &nbsp;&nbsp;{maximum}
        </Typography.Text>
      )}
    </div>
  </div>
);

export const renderClearIcon = (onClear: (() => void) | undefined) => {
  if (!onClear) return null;
  return (
    <CloseOutlined
      onClick={(e) => {
        e.stopPropagation();
        onClear();
      }}
      style={{
        color: "red",
        fontSize: "12px",
        cursor: "pointer",
        transition: "color 0.3s",
      }}
      title="Bỏ chọn tất cả"
    />
  );
};

export const renderCheckableTags = <T extends { [key: string]: any }>({
  data,
  idKey,
  checkedIds,
  onChange,
  emptyText = "Không có dữ liệu",
  disabled = false,
  containerStyle = {},
  usePopover = false,
  popoverVisible,
  setPopoverVisible,
  onClearAll,
  itemCounts = {},
}: {
  data: T[];
  idKey: keyof T;
  checkedIds: number[];
  onChange: (id: number) => void;
  emptyText?: React.ReactNode;
  disabled?: boolean;
  containerStyle?: React.CSSProperties;
  usePopover?: boolean;
  popoverVisible?: boolean;
  setPopoverVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  onClearAll?: () => void;
  itemCounts?: { [key: number]: number };
}) => {
  const displayList = data;

  const content = (
    <div
      style={{
        maxHeight: usePopover ? 300 : "none",
        overflowY: usePopover ? "auto" : "visible",
        minWidth: 200,
        minHeight: usePopover ? 300 : "none",
      }}
    >
      {usePopover && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 12,
            gap: 8,
          }}
        >
          <Text style={{ flex: 1, fontWeight: "bold", color: "#000" }}>
            {checkedIds.length > 0
              ? `Đã chọn (${checkedIds.length})`
              : "Chọn mục"}
          </Text>
          {onClearAll && checkedIds.length > 0 && renderClearIcon(onClearAll)}
        </div>
      )}

      {displayList.length ? (
        <Space direction="vertical" size="small" style={{ width: "100%" }}>
          {displayList.map((item) => {
            const checked = checkedIds.includes(item[idKey] as number);
            const itemId = item[idKey] as number;
            const count = itemCounts[itemId] || 0;

            return (
              <label
                key={item[idKey] as string | number}
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: disabled ? "not-allowed" : "pointer",
                  userSelect: "none",
                  gap: 8,
                  opacity: disabled ? 0.5 : 1,
                }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={disabled}
                  onChange={() => {
                    if (!disabled) {
                      onChange(item[idKey] as number);
                    }
                  }}
                  style={{
                    opacity: 0,
                    position: "absolute",
                    width: 0,
                    height: 0,
                    margin: 0,
                    padding: 0,
                  }}
                />
                <span
                  aria-hidden="true"
                  style={{
                    display: "inline-flex",
                    width: 20,
                    height: 20,
                    borderRadius: 2,
                    border: checked ? "none" : "1px solid black",
                    backgroundColor: checked ? "#09993E" : "transparent",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "background-color 0.2s, border 0.2s",
                  }}
                >
                  {checked && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </span>
                <span
                  style={{ flexGrow: 1, userSelect: "none", color: "#000" }}
                >
                  {item.name}
                </span>
                {/* Hiển thị số lượng Dịch vụ đã chọn */}
                {count > 0 && (
                  <Typography.Text
                    style={{
                      color: "#888",
                      marginLeft: "8px",
                      fontWeight: checked ? "400" : "normal",
                      fontSize: "13px",
                    }}
                  >
                    ({count})
                  </Typography.Text>
                )}
              </label>
            );
          })}
        </Space>
      ) : (
        <Text type="secondary">{emptyText}</Text>
      )}
    </div>
  );

  if (usePopover) {
    return (
      <Popover
        open={popoverVisible}
        onOpenChange={(newVisible) => {
          setPopoverVisible && setPopoverVisible(newVisible);
        }}
        placement="bottomLeft"
        trigger="click"
        content={content}
        destroyTooltipOnHide
        overlayInnerStyle={{ padding: 12 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 12,
            gap: 8,
          }}
        >
          <Button
            onClick={(e) => {
              if (!disabled && data.length > 0 && setPopoverVisible) {
                setPopoverVisible(!popoverVisible);
              }
              e.stopPropagation();
            }}
            disabled={disabled || data.length === 0}
            style={{ flex: 1 }}
          >
            {checkedIds.length > 0
              ? `Đã chọn (${checkedIds.length})`
              : "Chọn mục"}
            <CaretDownOutlined />
          </Button>
        </div>
      </Popover>
    );
  }

  return <div style={containerStyle}>{content}</div>;
};

/**
 * Renders clickable tags with hover effect.
 * (Dùng cho Lĩnh vực)
 */
export const renderClickableTags = ({
  data,
  idKey,
  selectedId,
  onClick,
  emptyText,
  hoverColor = SECTION_DOT_COLORS.category,
  itemCounts = {},
  disabledIds = [],
  isAllServicesSelected,
  filters,
}: {
  data: { [key: string]: any }[];
  idKey: string;
  selectedId: number | null;
  onClick: (id: number) => void;
  emptyText: string;
  hoverColor?: string;
  itemCounts?: { [key: number]: number };
  disabledIds?: number[];
  isAllServicesSelected?: boolean;
  filters: Step2V2ScreenFilterState;
}) => {
  const itemsToRender = data;
  const cate = filters?.selectedServiceCategoriesByCategoryId;
  const cateIds = useMemo(() => {
    return cate?  Object.keys(cate) : []
  }, [cate]);

  return (
    <div style={{ overflowY: "auto", flexGrow: 1 }}>
      {itemsToRender.length === 0 ? (
        <Typography.Text type="secondary">{emptyText}</Typography.Text>
      ) : (
        itemsToRender.map((item) => {
          const itemId = item[idKey] as number;
          const isActive = selectedId === itemId;
          const isDisabled = disabledIds.includes(itemId);

          const count = itemCounts[itemId];
          const isEmptyServices = !(
            size(cate?.[item.categoryId]?.[0]?.services) > 0
          );
     
          const selectedAndEmpty =
            !!isEmptyServices && includes(cateIds, toString(item?.categoryId));
          // const activeSelectedAndEmpty = selectedAndEmpty && isActive;
          // const inactiveSelectedAndEmpty = selectedAndEmpty && !isActive;

          return (
            <div
              key={String(itemId)}
              onClick={() => {
                if (!isDisabled) {
                  onClick(itemId);
                }
              }}
              style={{
                marginBottom: "8px",
                padding: "4px 8px",
                borderRadius: "4px",
                cursor: isDisabled ? "not-allowed" : "pointer",
                backgroundColor: isActive ? hoverColor : "transparent",
                color: isActive ? "#fff" : "#000",
                transition:
                  "background-color 0.2s ease-in-out, color 0.2s ease-in-out, border 0.2s ease-in-out, opacity 0.2s ease-in-out",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: isActive
                  ? `1px solid ${hoverColor}`
                  : "1px solid transparent",
                opacity: isDisabled ? 0.3 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isActive && !isDisabled) {
                  e.currentTarget.style.backgroundColor = `${hoverColor}22`;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive && !isDisabled) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.border = "1px solid transparent";
                }
              }}
            >
              <Typography.Text
                style={{
                  color: isActive ? "#fff" : "#000",
                }}
              >
                <span
                  style={{
                    marginRight: 4,
                    marginTop: 4,
                    color: "red",
                    opacity: selectedAndEmpty ? 100 : 0,
                  }}
                  role="img"
                  aria-label="exclamation-circle"
                  className="anticon anticon-exclamation-circle"
                >
                  <svg
                    viewBox="64 64 896 896"
                    focusable="false"
                    data-icon="exclamation-circle"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                    <path d="M464 688a48 48 0 1096 0 48 48 0 10-96 0zm24-112h48c4.4 0 8-3.6 8-8V296c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8z"></path>
                  </svg>
                </span>
                {`${item.name}`}
              </Typography.Text>
              {count > 0 && (
                <Typography.Text
                  style={{
                    color: (isActive ? "#fff" : "#888"),
                    marginLeft: "8px",
                    fontWeight: "400",
                    fontSize: "13px",
                  }}
                >
                  ({count})
                </Typography.Text>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};
