import React, { useMemo } from "react";
import { Typography, Button, Space } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { CateServiceResource } from "@/src/data/category/models/category.types";
import {
  renderCheckableTags,
  renderSectionTitle,
} from "../../../utils/RenderUtils";
import { CustomCheckbox } from "../../../components/CustomCheckbox";

interface ServiceCategorySectionProps {
  serviceCategoriesAvailable: CateServiceResource[];
  selectedServiceCategoryIds: number[];
  selectedCategoryId: number | null;
  onServiceCategoryToggle: (id: number) => void;
  onSelectAllServiceCategories: (checked: boolean) => void;
  clearAllServiceCategories: () => void;
  serviceCategoryCounts: { [key: number]: number };
  showValidationWarning: boolean;
  isMobile: boolean;
}

export const ServiceCategorySection: React.FC<ServiceCategorySectionProps> = ({
  serviceCategoriesAvailable,
  selectedServiceCategoryIds,
  selectedCategoryId,
  onServiceCategoryToggle,
  onSelectAllServiceCategories,
  clearAllServiceCategories,
  serviceCategoryCounts,
  showValidationWarning,
  isMobile,
}) => {
  const showClearButton = selectedServiceCategoryIds.length > 0;

  const isAllSelected = useMemo(
    () =>
      serviceCategoriesAvailable.length > 0 &&
      selectedServiceCategoryIds.length === serviceCategoriesAvailable.length,
    [serviceCategoriesAvailable, selectedServiceCategoryIds]
  );

  const isIndeterminate = useMemo(
    () => selectedServiceCategoryIds.length > 0 && !isAllSelected,
    [selectedServiceCategoryIds, isAllSelected]
  );

  const showSelectAll =
    serviceCategoriesAvailable.length > 0 && selectedCategoryId !== null;

  return (
    <div
      style={{
        flex: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        paddingLeft: "12px",
        marginLeft: "12px",
        borderLeft: "1px solid #D4D4D4",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <Space size="small" style={{ alignItems: "center" }}>
          {showSelectAll && (
            <CustomCheckbox
              indeterminate={isIndeterminate}
              checked={isAllSelected}
              onChange={(e) => onSelectAllServiceCategories(e.target.checked)}
            />
          )}
          {renderSectionTitle(!isMobile ? "Danh mục Dịch vụ" : "DMDV", "")}
        </Space>
        {showClearButton && (
          <Button
            type="link"
            danger
            onClick={clearAllServiceCategories}
            style={{ padding: 0, height: "auto", lineHeight: "normal" }}
          >
            Bỏ chọn tất cả
          </Button>
        )}
      </div>
      <div style={{ flexGrow: 1, overflowY: "auto" }}>
        {selectedCategoryId === null ? (
          <Typography.Text type="secondary">
            Vui lòng chọn Lĩnh vực để xem danh mục.
          </Typography.Text>
        ) : (
          <>
            {renderCheckableTags({
              data: serviceCategoriesAvailable,
              idKey: "cateServiceId",
              checkedIds: selectedServiceCategoryIds,
              onChange: onServiceCategoryToggle,
              emptyText: "Không có Danh mục Dịch vụ",
              disabled: selectedCategoryId === null,
              itemCounts: serviceCategoryCounts,
            })}
            {showValidationWarning &&
              selectedServiceCategoryIds.length === 0 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "red",
                    marginTop: "10px",
                  }}
                >
                  <ExclamationCircleOutlined style={{ marginRight: "8px" }} />
                  <Typography.Text style={{ color: "red" }}>
                    Bạn cần chọn ít nhất một danh mục
                  </Typography.Text>
                </div>
              )}
          </>
        )}
      </div>
    </div>
  );
};
