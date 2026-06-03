import { Button, Input, Popover, Space, Typography } from "antd";
import { CloseOutlined } from "@ant-design/icons";

const { Text } = Typography;

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
        fontSize: 16,
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
  showAll,
  setShowAll,
  emptyText = "Không có dữ liệu",
  disabled = false,
  containerStyle = {},
  usePopover = false,
  popoverVisible,
  setPopoverVisible,
  popoverSearchValue,
  onPopoverSearchChange,
  enableShowMoreToggle = true,
  placeholderText = "Tìm kiếm",
  popoverPlaceholderText,
  onClearAll,
  showClearButtonOutside = false,
  showSearchInput = true,
  showClearAllButton = true,
}: {
  data: T[];
  idKey: keyof T;
  checkedIds: number[] | undefined;
  onChange: (id: number) => void;
  showAll: boolean;
  setShowAll: React.Dispatch<React.SetStateAction<boolean>>;
  emptyText?: React.ReactNode;
  disabled?: boolean;
  containerStyle?: React.CSSProperties;
  usePopover?: boolean;
  popoverVisible?: boolean;
  setPopoverVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  popoverSearchValue?: string;
  onPopoverSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  enableShowMoreToggle?: boolean;
  placeholderText?: string;
  popoverPlaceholderText?: string;
  onClearAll?: () => void;
  showClearButtonOutside?: boolean;
  showSearchInput?: boolean;
  showClearAllButton?: boolean;
}) => {
  const limit = 10;

  const filteredData =
    showSearchInput && popoverSearchValue
      ? data.filter((item) =>
          (item.name as string)
            .toLowerCase()
            .includes((popoverSearchValue || "").toLowerCase())
        )
      : data;

  const displayList =
    usePopover || showAll ? filteredData : filteredData?.slice(0, limit);

  const content = (
    <div
      style={{
        maxHeight: usePopover ? 300 : "none",
        overflowY: usePopover ? "auto" : "visible",
        minWidth: 200,
        minHeight: usePopover ? 300 : "none",
      }}
    >
      {usePopover && showSearchInput && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 12,
            gap: 8,
          }}
        >
          <Input
            placeholder={placeholderText}
            allowClear
            value={popoverSearchValue}
            onChange={onPopoverSearchChange}
            size="small"
            onClick={(e) => e.stopPropagation()}
            style={{ flex: 1 }}
          />
          {showClearAllButton &&
            onClearAll &&
            checkedIds !== undefined &&
            checkedIds.length > 0 &&
            renderClearIcon(onClearAll)}
        </div>
      )}
      {displayList?.length && checkedIds !== undefined ? (
        <Space direction="vertical" size="small" style={{ width: "100%" }}>
          {displayList?.map((item) => {
            const checked = checkedIds?.includes(item[idKey] as number);
            return (
              <label
                key={item[idKey] as string | number}
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: disabled ? "not-allowed" : "pointer",
                  userSelect: "none",
                  gap: 8,
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!disabled) {
                    onChange(item[idKey] as number);
                  }
                }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={disabled}
                  style={{
                    opacity: 0,
                    position: "absolute",
                    width: 0,
                    height: 0,
                    margin: 0,
                    padding: 0,
                    borderRadius: 20,
                  }}
                />
                {/* Custom box */}
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
                  {/* Icon check khi checked */}
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
                <span style={{ flexGrow: 1, userSelect: "none" }}>
                  {item.name}
                </span>
              </label>
            );
          })}
        </Space>
      ) : (
        <Text type="secondary">{emptyText}</Text>
      )}

      {filteredData?.length > limit && enableShowMoreToggle && (
        <div style={{ marginTop: 8, textAlign: "right" }}>
          <Button
            type="link"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setShowAll((prev) => !prev);
            }}
            style={{ padding: 0 }}
          >
            {showAll ? "Thu gọn" : "Xem thêm"}
          </Button>
        </div>
      )}
    </div>
  );

  if (usePopover) {
    const inputValue =
      checkedIds !== undefined && checkedIds.length > 0
        ? `Đang chọn (${checkedIds.length})`
        : "";

    return (
      <Popover
        open={popoverVisible}
        onOpenChange={(newVisible) => {
          setPopoverVisible && setPopoverVisible(newVisible);
          if (!newVisible && onPopoverSearchChange) {
            onPopoverSearchChange({
              target: { value: "" },
            } as React.ChangeEvent<HTMLInputElement>);
          }
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
          <Input
            placeholder={popoverPlaceholderText}
            allowClear
            value={inputValue}
            onChange={(e) => {
              if (checkedIds !== undefined && checkedIds.length === 0) {
                onPopoverSearchChange && onPopoverSearchChange(e);
              }
            }}
            disabled={disabled || data.length === 0}
            size="small"
            style={{
              flex: 1,
              cursor: disabled || data.length === 0 ? "not-allowed" : "pointer",
            }}
            readOnly={true}
            onClick={(e) => {
              if (!disabled && data.length > 0 && setPopoverVisible) {
                setPopoverVisible(!popoverVisible);
              }
              e.stopPropagation();
            }}
          />
          {/* Nút clear BÊN NGOÀI Input chính của Popover - only if showClearAllButton is true */}
          {showClearAllButton &&
            checkedIds !== undefined &&
            checkedIds.length > 0 &&
            onClearAll &&
            renderClearIcon(onClearAll)}
        </div>
      </Popover>
    );
  }

  return (
    <div style={containerStyle}>
      {showSearchInput && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 12,
            gap: 8,
          }}
        >
          <Input
            placeholder={placeholderText}
            allowClear
            value={popoverSearchValue}
            onChange={onPopoverSearchChange}
            style={{ flex: 1 }}
            size="small"
            onClick={(e) => e.stopPropagation()}
          />
          {/* Nút clear BÊN NGOÀI Input của Lĩnh vực - only if showClearAllButton is true */}
          {showClearAllButton &&
            showClearButtonOutside &&
            onClearAll &&
            checkedIds !== undefined &&
            checkedIds.length > 0 &&
            renderClearIcon(onClearAll)}
        </div>
      )}
      {content}
    </div>
  );
};
