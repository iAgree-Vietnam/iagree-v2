import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Typography, Space, Tag, Button } from "antd";
import { CloseOutlined, PictureOutlined } from "@ant-design/icons";
import { ServiceResource } from "@/src/data/category/models/category.types";

interface HorizontalServicesListProps {
  services: ServiceResource[];
  categoryId: number;
  serviceCategoryId: number;
  selectedServiceIds?: number[];
  onServiceIdsChange: (newSelectedIds: number[]) => void;
}

const { Text } = Typography;

const HorizontalServicesList: React.FC<HorizontalServicesListProps> = ({
  services,

  selectedServiceIds,
  onServiceIdsChange,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [hoveredItemId, setHoveredItemId] = useState<number | null>(null);

  const [internalSelectedIds, setInternalSelectedIds] = useState<number[]>(
    selectedServiceIds || []
  );

  useEffect(() => {
    if (
      JSON.stringify(internalSelectedIds) !==
      JSON.stringify(selectedServiceIds || [])
    ) {
      setInternalSelectedIds(selectedServiceIds || []);
    }
  }, [selectedServiceIds]);

  const handleServiceToggle = useCallback(
    (serviceId: number) => {
      const isSelected = internalSelectedIds.includes(serviceId);
      let newSelectedIds: number[];

      if (isSelected) {
        newSelectedIds = internalSelectedIds.filter((id) => id !== serviceId);
      } else {
        newSelectedIds = [...internalSelectedIds, serviceId];
      }
      setInternalSelectedIds(newSelectedIds);
      onServiceIdsChange(newSelectedIds);
    },
    [internalSelectedIds, onServiceIdsChange]
  );

  const handleRemoveSelectedService = useCallback(
    (serviceId: number) => {
      const newSelectedIds = internalSelectedIds.filter(
        (id) => id !== serviceId
      );
      setInternalSelectedIds(newSelectedIds);
      onServiceIdsChange(newSelectedIds);
    },
    [internalSelectedIds, onServiceIdsChange]
  );

  const handleDeselectAll = useCallback(() => {
    setInternalSelectedIds([]);
    onServiceIdsChange([]);
  }, [onServiceIdsChange]);

  const checkScrollability = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;

      setCanScrollLeft(scrollLeft > 1);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    }
  }, []);

  useEffect(() => {
    checkScrollability();
    const currentContainer = scrollContainerRef.current;
    if (currentContainer) {
      currentContainer.addEventListener("scroll", checkScrollability);
      window.addEventListener("resize", checkScrollability);

      const observer = new ResizeObserver(checkScrollability);
      observer.observe(currentContainer);

      return () => {
        currentContainer.removeEventListener("scroll", checkScrollability);
        window.removeEventListener("resize", checkScrollability);
        observer.disconnect();
      };
    }
  }, [services, checkScrollability]);

  const selectedServiceItems = useMemo(() => {
    return services.filter((service) =>
      internalSelectedIds.includes(service.serviceId)
    );
  }, [services, internalSelectedIds]);

  if (!services || services.length === 0) {
    return (
      <Text type="secondary" style={{ paddingLeft: "16px" }}>
        Không có dịch vụ nào để hiển thị.
      </Text>
    );
  }

  const GRADIENT_WIDTH = "40px";
  const ACTIVE_COLOR = "#09993E";
  const SELECTED_TAG_BG_COLOR = "#efeff0";
  const ICON_BG_COLOR = "#f0f0f0";
  const SCROLL_CONTAINER_MARGIN_BOTTOM =
    selectedServiceItems.length === 0 ? "40px" : "0px";

  return (
    <div>
      {/* Main container for the scrollable horizontal list */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          paddingLeft: "0px",
          paddingRight: "16px",
          marginBottom: SCROLL_CONTAINER_MARGIN_BOTTOM,
        }}
      >
        {/* Left gradient for scroll indication */}
        {canScrollLeft && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: GRADIENT_WIDTH,
              height: "100%",
              background:
                "linear-gradient(to right, white 0%, rgba(255,255,255,0) 100%)",
              zIndex: 1,
              pointerEvents: "none",
            }}
          />
        )}

        {/* Scrollable area for service items */}
        <div
          ref={scrollContainerRef}
          style={{
            overflowX: "auto",
            whiteSpace: "nowrap",
            paddingBottom: "10px",
            WebkitOverflowScrolling: "touch",

            marginLeft: `-${GRADIENT_WIDTH}`,
            marginRight: `-${GRADIENT_WIDTH}`,
            paddingLeft: GRADIENT_WIDTH,
            paddingRight: GRADIENT_WIDTH,
          }}
          className="custom-horizontal-scrollbar"
        >
          <Space size={[0, 12]} wrap={false}>
            {services.map((item) => {
              const isSelected = internalSelectedIds.includes(item.serviceId);
              const isActive = hoveredItemId === item.serviceId || isSelected;

              return (
                <div
                  key={item.serviceId}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleServiceToggle(item.serviceId)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleServiceToggle(item.serviceId);
                    }
                  }}
                  onMouseEnter={() => setHoveredItemId(item.serviceId)}
                  onMouseLeave={() => setHoveredItemId(null)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "auto",
                    padding: "8px 16px",
                    backgroundColor: "#fff",
                    borderRadius: "40px",
                    marginRight: "12px",
                    border: `1px solid ${isActive ? ACTIVE_COLOR : "#e0e0e0"}`,
                    cursor: "pointer",
                    flexShrink: 0,
                    whiteSpace: "normal",
                    transition: "all 0.3s ease",
                  }}
                >
                  {/* Icon with dynamic background and color */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "35px",
                      height: "35px",
                      borderRadius: "50%",
                      backgroundColor: isActive ? ACTIVE_COLOR : ICON_BG_COLOR,
                      marginRight: "12px",
                      transition: "background-color 0.3s ease",
                    }}
                  >
                    {/* Consider using a dynamic icon based on service type or a default */}
                    <PictureOutlined
                      style={{
                        fontSize: "20px",
                        color: isActive ? "#fff" : "#333",
                        transition: "color 0.3s ease",
                      }}
                    />
                  </div>

                  {/* Service name text */}
                  <Text
                    style={{
                      flexGrow: 1,
                      color: isActive ? ACTIVE_COLOR : "#333",
                      fontWeight: "500",
                      marginRight: "12px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      fontSize: "14px",
                      transition: "color 0.3s ease",
                    }}
                  >
                    {item.name}
                  </Text>

                  {/* Right icon: Close if selected, null otherwise */}
                  {isSelected ? (
                    <CloseOutlined
                      style={{
                        fontSize: "12px",
                        color: ACTIVE_COLOR,
                        transition: "color 0.3s ease",
                      }}
                    />
                  ) : null}
                </div>
              );
            })}
          </Space>
        </div>

        {/* Right gradient for scroll indication */}
        {canScrollRight && (
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: GRADIENT_WIDTH,
              height: "100%",
              background:
                "linear-gradient(to left, white 0%, rgba(255,255,255,0) 100%)",
              zIndex: 1,
              pointerEvents: "none",
            }}
          />
        )}
      </div>

      {/* Display selected services below the scrollable list */}
      {selectedServiceItems.length > 0 && (
        <div
          style={{
            marginBottom: "30px",
            paddingLeft: "0px",
            paddingRight: "16px",
            marginTop: "16px",
          }}
        >
          <Space size={[8, 8]} wrap>
            <Typography.Text
              style={{
                fontWeight: "600",
                fontSize: "16px",

                margin: "0 0 0 0",
                lineHeight: "22px",
              }}
            >
              Các dịch vụ đã chọn:
            </Typography.Text>
            {selectedServiceItems.map((item) => (
              <Tag
                key={item.serviceId}
                color={SELECTED_TAG_BG_COLOR}
                closable
                onClose={(e) => {
                  e.preventDefault();
                  handleRemoveSelectedService(item.serviceId);
                }}
                style={{
                  borderRadius: "40px",
                  padding: "6px 10px",
                  fontSize: "13px",
                  color: "#000",
                }}
                className="custom-tag-close-icon-color"
              >
                {item.name}
              </Tag>
            ))}
            <Button
              type="link"
              onClick={handleDeselectAll}
              style={{
                padding: 0,
                height: "auto",
                lineHeight: "normal",
                color: "#f50707ff",
              }}
            >
              Bỏ chọn tất cả
            </Button>
          </Space>
        </div>
      )}
    </div>
  );
};

export default HorizontalServicesList;
