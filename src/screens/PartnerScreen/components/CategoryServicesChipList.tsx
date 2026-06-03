import { useRouter } from "next/router";
import { Tag, Space, Typography } from "antd";
import { useState } from "react";
import {
  CategoryResource,
  CateServiceResource,
} from "@/src/data/category/models/category.types";
import { RawCateServiceResource } from "@/src/data/category/models/category.raw";
import { toNumber } from "lodash";

interface CategoryServicesChipListProps {
  categories?: CategoryResource[] | null;
  categoryServices?: CateServiceResource[] | null;
  type: string;
}

export const CategoryServicesChipList: React.FC<
  CategoryServicesChipListProps
> = ({ categories, categoryServices, type }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const maxVisibleCategoryServices = 5;

  const visibleCategoryServices = isExpanded
    ? categoryServices
    : categoryServices?.slice(0, maxVisibleCategoryServices);

  const remainingCount =
    (categoryServices?.length ?? 5) - maxVisibleCategoryServices;

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleServiceClick = (cateService: CateServiceResource) => {
    const foundCategory = categories?.find(
      (category) =>
        toNumber(category?.id) == toNumber(cateService.parent_id || 0)
    );

    const categoryId = foundCategory?.id;

    const queryParams =
      type === "job"
        ? {
            type,
            job_category_ids: categoryId !== undefined ? [categoryId] : [],
            job_service_category_ids: [cateService.id],
          }
        : {
            type,
            partner_category_ids: categoryId !== undefined ? [categoryId] : [],
            partner_service_category_ids: [cateService.id],
          };

    // Lưu queryParams vào localStorage
    localStorage.setItem("search_query_params", JSON.stringify(queryParams));

    // Xóa bộ lọc cũ trong localStorage trước khi chuyển trang
    localStorage.removeItem("search_job_filters");
    localStorage.removeItem("search_partner_filters");

    // Điều hướng tới trang mới với queryParams
    router.push({
      pathname: "/search", // Trang bạn muốn chuyển đến
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
        Danh mục dịch vụ
      </Typography.Paragraph>

      <Space size={[8, 8]} wrap style={{ flex: 1 }}>
        {visibleCategoryServices?.map((cateService, index) => {
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
              onClick={() => handleServiceClick(cateService)}
              key={index}
            >
              {cateService.name}
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
