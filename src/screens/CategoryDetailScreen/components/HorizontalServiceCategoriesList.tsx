import React, { useRef, useState, useEffect } from "react";
import { Typography, Space } from "antd";
import { useRouter } from "next/router";
import AuthRouteUtils from "@/src/data/auth/utils/AuthRouteUtils";

import { RightOutlined, PictureOutlined } from "@ant-design/icons";
import { CateServiceResource } from "@/src/data/category/models/category.types";

export interface HorizontalCategoriesListProps {
  serviceCategories: CateServiceResource[];
  categoryName: string;
}

const { Text } = Typography;

const HorizontalServiceCategoriesList: React.FC<
  HorizontalCategoriesListProps
> = ({ serviceCategories, categoryName }) => {
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const [hoveredItemId, setHoveredItemId] = useState<number | null>(null);

  const handleServiceCategoriesClick = (
    categoryName: string,
    serviceCategoryName: string
  ) => {
    router.push(
      AuthRouteUtils.toServiceCategory(categoryName, serviceCategoryName)
    );
  };

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
    }
  };

  useEffect(() => {
    checkScrollability();
    const currentContainer = scrollContainerRef.current;
    if (currentContainer) {
      currentContainer.addEventListener("scroll", checkScrollability);
      window.addEventListener("resize", checkScrollability);
    }

    return () => {
      if (currentContainer) {
        currentContainer.removeEventListener("scroll", checkScrollability);
        window.removeEventListener("resize", checkScrollability);
      }
    };
  }, [serviceCategories]);

  if (!serviceCategories || serviceCategories.length === 0) {
    return (
      <Text type="secondary" style={{ paddingLeft: "16px" }}>
        Không có danh mục dịch vụ nào để hiển thị.
      </Text>
    );
  }

  const gradientWidth = "40px";
  const activeColor = "#09993E";

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        paddingLeft: "0px",
        paddingRight: "16px",
      }}
    >
      {/* Gradient bên trái */}
      {canScrollLeft && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: gradientWidth,
            height: "100%",
            background:
              "linear-gradient(to right, white 0%, rgba(255,255,255,0) 100%)",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Vùng chứa danh sách cuộn */}
      <div
        ref={scrollContainerRef}
        style={{
          overflowX: "auto",
          whiteSpace: "nowrap",
          paddingBottom: "10px",
          WebkitOverflowScrolling: "touch",
          marginLeft: `-${gradientWidth}`,
          marginRight: `-${gradientWidth}`,
          paddingLeft: gradientWidth,
          paddingRight: gradientWidth,
        }}
        className="custom-horizontal-scrollbar"
      >
        <Space size={[0, 12]} wrap={false}>
          {serviceCategories.map((item) => {
            const isActive = hoveredItemId === item.cateServiceId;

            return (
              <div
                key={item.cateServiceId}
                onClick={() =>
                  handleServiceCategoriesClick(categoryName, item.name)
                }
                onMouseEnter={() => setHoveredItemId(item.cateServiceId)}
                onMouseLeave={() => setHoveredItemId(null)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "auto",
                  padding: "16px 16px",
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  marginRight: "12px",
                  border: `1px solid ${isActive ? activeColor : "#e0e0e0"}`,
                  cursor: "pointer",
                  flexShrink: 0,
                  whiteSpace: "normal",
                  transition: "all 0.3s ease",
                }}
              >
                {/* Icon bên trái */}
                <PictureOutlined
                  style={{
                    fontSize: "25px",
                    color: isActive ? activeColor : "#333",
                    marginRight: "12px",
                    transition: "color 0.3s ease",
                  }}
                />

                {/* Tên danh mục */}
                <Text
                  style={{
                    flexGrow: 1,
                    color: isActive ? activeColor : "#333",
                    fontWeight: "500",
                    marginRight: "12px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontSize: "16px",
                    transition: "color 0.3s ease",
                  }}
                >
                  {item.name}
                </Text>

                {/* Icon mũi tên bên phải */}
                <RightOutlined
                  style={{
                    fontSize: "15px",
                    color: isActive ? activeColor : "#333",
                    transition: "color 0.3s ease",
                  }}
                />
              </div>
            );
          })}
        </Space>
      </div>

      {/* Gradient bên phải */}
      {canScrollRight && (
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: gradientWidth,
            height: "100%",
            background:
              "linear-gradient(to left, white 0%, rgba(255,255,255,0) 100%)",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
};

export default HorizontalServiceCategoriesList;
