import { useRouter } from "next/router";
import { Tag, Space, Typography } from "antd";
import { useState } from "react";
import { CateServiceResource, CategoryResource, ServiceResource } from "@/src/data/category/models/category.types";
import { toNumber } from "lodash";

interface ServicesChipListProps {
  categories?: CategoryResource[] | null;
  categoryServices?: CateServiceResource[] | null;
  services?: ServiceResource[] | null;
  type?: string;
}

export const ServicesChipList: React.FC<ServicesChipListProps> = ({
  categories,
  categoryServices,
  services,
  type,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const maxVisibleServices = 5;

  const visibleServices = isExpanded
    ? services
    : services?.slice(0, maxVisibleServices);
  const remainingCount = (services?.length ?? 5) - maxVisibleServices;

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleServiceClick = (service: ServiceResource) => {
    // let categoryId: number | undefined;
    // let categoryServiceId: number | undefined;

    // if (categoryServices && categories) {
    //   const parentCateService = categoryServices.find(
    //     (cs) => cs.cateServiceId === service.parentId
    //   );

    //   if (parentCateService) {
    //     categoryServiceId = parentCateService.cateServiceId;
    //     const parentCategory = categories.find(
    //       (c) => c.categoryId === parentCateService.parentId
    //     );
    //     if (parentCategory) {
    //       categoryId = parentCategory.categoryId;
    //     }
    //   }
    // }

    const parentCateService = categoryServices?.find(
      (cs) => toNumber(cs.id) === toNumber(service.parentId)
    );

    // categoryServiceId = parentCateService.cateServiceId;
    const parentCategory = categories?.find(
      (c) => c.categoryId === parentCateService?.parent_id
    );




    const categoryServiceId = parentCateService?.cateServiceId || parentCateService?.id
    const categoryId = parentCategory?.categoryId

    // Tạo queryParams
    const queryParams =
      type === "job"
        ? {
            type,
            job_category_ids: categoryId !== undefined ? [categoryId] : [],
            job_service_category_ids:
              categoryServiceId !== undefined ? [categoryServiceId] : [],
            job_service_ids: [service.serviceId],
          }
        : {
            type,
            partner_category_ids:
              categoryId !== undefined ? [categoryId] : [],
            partner_service_category_ids:
              categoryServiceId !== undefined ? [categoryServiceId] : [],
            partner_service_ids: [service.serviceId],
          };

    // Lưu queryParams vào localStorage
    localStorage.setItem("search_query_params", JSON.stringify(queryParams));

    // Xóa bộ lọc cũ trong localStorage
    localStorage.removeItem("search_job_filters");
    localStorage.removeItem("search_partner_filters");

    // Điều hướng tới trang tìm kiếm với queryParams
    router.push({
      pathname: "/search",
      query: queryParams, // Truyền queryParams vào URL
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "16px",
      }}
    >
      <Typography.Paragraph
        className={"infoTitle"}
        style={{
          minWidth: "50px",
          margin: 0,
          paddingTop: "3px",
          flexShrink: 0,
        }}
      >
        Dịch vụ
      </Typography.Paragraph>

      <Space size={[8, 8]} wrap style={{ flex: 1 }}>
        {visibleServices?.map((service, index) => {
          // let categoryId: number | undefined;
          // let categoryServiceId: number | undefined;

          // if (categoryServices && categories) {
          //   const parentCateService = categoryServices.find(
          //     (cs) => cs.cateServiceId === service.parentId
          //   );

          //   if (parentCateService) {
          //     categoryServiceId = parentCateService.cateServiceId;
          //     const parentCategory = categories.find(
          //       (c) => c.categoryId === parentCateService.parentId
          //     );
          //     if (parentCategory) {
          //       categoryId = parentCategory.categoryId;
          //     }
          //   }
          // }
          const parentCateService = categoryServices?.find(
            (cs) => toNumber(cs.id) === toNumber(service.parentId)
          );

          // categoryServiceId = parentCateService.cateServiceId;
          const parentCategory = categories?.find(
            (c) => c.categoryId === parentCateService?.parent_id
          );

          const categoryServiceId = parentCateService?.cateServiceId
          const categoryId = parentCategory?.categoryId

          return (
            <Tag
              className="skillChip"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #059669",
                borderRadius: "4px",
                padding: "4px 10px",
                fontSize: "14px",
                color: "#059669",
                cursor: "pointer",
              }}
              onClick={() => handleServiceClick(service)}
              key={index}
            >
              {service.name}
            </Tag>
          );
        })}

        {!isExpanded && remainingCount > 0 && (
          <Tag
            className="remainingSkillsChip"
            onClick={handleToggleExpand}
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #d9d9d9",
              borderRadius: "16px",
              padding: "4px 10px",
              fontSize: "14px",
              color: "#666",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#09993E";
              e.currentTarget.style.color = "#FFFFFF";
              e.currentTarget.style.borderColor = "#09993E";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#FFFFFF";
              e.currentTarget.style.color = "#666";
              e.currentTarget.style.borderColor = "#d9d9d9";
            }}
          >
            +{remainingCount}
          </Tag>
        )}

        {isExpanded && (
          <Tag
            className="collapseSkillsChip"
            onClick={handleToggleExpand}
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #d9d9d9",
              borderRadius: "16px",
              padding: "4px 10px",
              fontSize: "14px",
              color: "#666",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#09993E";
              e.currentTarget.style.color = "#FFFFFF";
              e.currentTarget.style.borderColor = "#09993E";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#FFFFFF";
              e.currentTarget.style.color = "#666";
              e.currentTarget.style.borderColor = "#d9d9d9";
            }}
          >
            Thu gọn
          </Tag>
        )}
      </Space>
    </div>
  );
};