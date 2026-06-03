import React, {
  useCallback,
  useState,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { Button, Typography, Popover, Space } from "antd";
import { JobSelectboxResource } from "@/src/data/job/models/job.types";
import useJobAddSelectbox from "../../JobScreen/JobFormScreen/hooks/useJobAddSelectbox";
import { useRouter } from "next/router";
import AuthRouteUtils from "@/src/data/auth/utils/AuthRouteUtils";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const SearchFilterHeader = () => {
  const selectboxQuery = useJobAddSelectbox();
  const selectboxResource = selectboxQuery.data as
    | JobSelectboxResource
    | undefined;
  const router = useRouter();

  const categoryListRef = useRef<HTMLDivElement>(null);
  const [popoverVisible, setPopoverVisible] = useState<number | null>(null);

  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const handleCategoryClick = useCallback(
    (categoryName: string) => {
      router.push(AuthRouteUtils.toCategoryDetail(categoryName));
      setPopoverVisible(null);
    },
    [router]
  );

  const handleServiceCategoryClick = useCallback(
    (categoryName: string, serviceCategoryName: string) => {
      router.push(
        AuthRouteUtils.toServiceCategory(categoryName, serviceCategoryName)
      );
      setPopoverVisible(null);
    },
    [router]
  );

  const handleServiceClick = useCallback(
    (categoryName: string, serviceCategoryName: string, serviceId: number) => {
      router.push(
        AuthRouteUtils.toService(categoryName, serviceCategoryName, [serviceId])
      );
      setPopoverVisible(null);
    },
    [router]
  );

  const checkOverflow = useCallback(() => {
    const container = categoryListRef.current;
    if (container) {
      const { scrollWidth, clientWidth, scrollLeft } = container;
      const isOverflowing = scrollWidth > clientWidth;

      setShowLeftArrow(isOverflowing && scrollLeft > 0);

      setShowRightArrow(
        isOverflowing && Math.ceil(scrollLeft) + clientWidth < scrollWidth
      );
    }
  }, []);

  useEffect(() => {
    checkOverflow();

    const container = categoryListRef.current;
    if (container) {
      container.addEventListener("scroll", checkOverflow);
      window.addEventListener("resize", checkOverflow);

      const observer = new ResizeObserver(checkOverflow);
      observer.observe(container);

      Array.from(container.children).forEach((child) =>
        observer.observe(child)
      );

      return () => {
        container.removeEventListener("scroll", checkOverflow);
        window.removeEventListener("resize", checkOverflow);
        observer.disconnect();
      };
    }
  }, [selectboxResource?.categories, checkOverflow]);

  const scrollAmount = 150;

  const scrollLeft = useCallback(() => {
    if (categoryListRef.current) {
      categoryListRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  }, []);

  const scrollRight = useCallback(() => {
    if (categoryListRef.current) {
      categoryListRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  }, []);

  const scrollShadowStyle = useMemo(() => {
    let shadow = "";
    if (showLeftArrow) {
      shadow += "inset 10px 0 8px -8px rgba(0, 0, 0, 0.3)";
    }
    if (showRightArrow) {
      shadow +=
        (shadow ? ", " : "") + "inset -10px 0 8px -8px rgba(0, 0, 0, 0.3)";
    }
    return shadow;
  }, [showLeftArrow, showRightArrow]);

  const renderCategoryPopoverContent = useCallback(
    (categoryId: number) => {
      if (!selectboxResource || !selectboxResource.categories) {
        return <Text type="secondary">Đang tải danh mục...</Text>;
      }

      const selectedCategory = selectboxResource.categories.find(
        (cat) => cat.categoryId === categoryId
      );

      if (!selectedCategory || !selectedCategory.childrens) {
        return <Text type="secondary">Không có danh mục dịch vụ nào.</Text>;
      }

      const serviceCategoriesToDisplay = selectedCategory.childrens.slice(
        0,
        12
      );

      return (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
          }}
        >
          {serviceCategoriesToDisplay.map((serviceCategory) => (
            <div key={serviceCategory.cateServiceId}>
              <Title level={5} style={{ margin: "0 0 8px 0" }}>
                <Button
                  type="link"
                  onClick={() =>
                    handleServiceCategoryClick(
                      selectedCategory.name,
                      serviceCategory.name
                    )
                  }
                  style={{
                    padding: 0,
                    fontWeight: "bold",
                    color: "inherit",
                    height: "auto",
                  }}
                >
                  {serviceCategory.name}
                </Button>
              </Title>
              <Space direction="vertical" size={4} style={{ width: "100%" }}>
                {serviceCategory.childrens &&
                  serviceCategory.childrens.slice(0, 5).map((service) => (
                    <Button
                      key={service.serviceId}
                      type="link"
                      onClick={() =>
                        handleServiceClick(
                          selectedCategory.name,
                          serviceCategory.name,
                          service.serviceId
                        )
                      }
                      style={{
                        padding: 0,
                        fontWeight: "normal",
                        color: "inherit",
                        height: "auto",
                        textAlign: "left",
                      }}
                    >
                      {service.name}
                    </Button>
                  ))}
              </Space>
            </div>
          ))}
        </div>
      );
    },
    [
      selectboxResource?.categories,
      handleServiceCategoryClick,
      handleServiceClick,
    ]
  );

  return (
    <div
      className="search-filter-header"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "8px 12px",
      }}
    >
      {/* Left Scroll Button */}
      <Button
        type="text"
        shape="circle"
        icon={<LeftOutlined style={{ fontSize: "12px" }} />}
        onClick={scrollLeft}
        style={{
          minWidth: "24px",
          width: "24px",
          height: "24px",
          padding: 0,
          borderColor: "#d9d9d9",
          boxShadow: "0 1px 0 rgba(0, 0, 0, 0.045)",
          color: "#000",
          flexShrink: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          visibility: showLeftArrow ? "visible" : "hidden",
          overflowY: "hidden",
        }}
      />

      {/* Categories List Container with dynamic shadow */}
      <div
        ref={categoryListRef}
        style={{
          flexGrow: 1,
          display: "flex",
          overflowX: "hidden",
          whiteSpace: "nowrap",
          alignItems: "center",
          gap: "8px",
          position: "relative",

          boxShadow: scrollShadowStyle,
          transition: "box-shadow 0.3s ease-in-out",
        }}
      >
        {selectboxResource?.categories.map((category) => (
          <Popover
            key={category.categoryId}
            content={renderCategoryPopoverContent(category.categoryId)}
            trigger="hover"
            placement="bottomLeft"
            open={popoverVisible === category.categoryId}
            onOpenChange={(visible) => {
              setPopoverVisible(visible ? category.categoryId : null);
            }}
            mouseEnterDelay={0.1}
            mouseLeaveDelay={0.2}
            overlayStyle={{
              width: "100vw",
              maxWidth: "none",
              left: "0",
            }}
            getPopupContainer={(trigger) => document.body}
          >
            <Button
              type="link"
              onClick={() => handleCategoryClick(category.name)}
              style={{
                flexShrink: 0,
                paddingInline: "auto",
                color:
                  popoverVisible === category.categoryId
                    ? "#09993E"
                    : "inherit",
                fontWeight:
                  popoverVisible === category.categoryId ? "bold" : "normal",
              }}
            >
              {category.name}
            </Button>
          </Popover>
        ))}
      </div>

      {/* Right Scroll Button */}
      <Button
        type="text"
        shape="circle"
        icon={<RightOutlined style={{ fontSize: "12px" }} />}
        onClick={scrollRight}
        style={{
          minWidth: "24px",
          width: "24px",
          height: "24px",
          padding: 0,
          borderColor: "#d9d9d9",
          boxShadow: "0 1px 0 rgba(0, 0, 0, 0.045)",
          color: "#000",
          flexShrink: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          visibility: showRightArrow ? "visible" : "hidden",
        }}
      />
    </div>
  );
};

export default SearchFilterHeader;
