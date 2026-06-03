import React, { useMemo } from "react";
import { Typography, Button, Space, Divider } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { ServiceResource } from "@/src/data/category/models/category.types";
import {
  renderSectionTitle,
  renderCheckableTags,
} from "../../../utils/RenderUtils";
import { CustomCheckbox } from "../../../components/CustomCheckbox";

interface ServiceDetailSectionProps {
  servicesGroupedByServiceCategory: {
    title: string;
    children: ServiceResource[];
    id: number;
    selectedServices: number[];
  }[];
  selectedServiceCategoryIds: number[];
  toggleService: (serviceId: number) => void;
  onSelectAllServices: (serviceCategoryId: number, checked: boolean) => void;
  onSelectAllServicesInAllCategories: (checked: boolean) => void;
  clearAllServices: () => void;
  isMobile: boolean;
}

export const ServiceDetailSection: React.FC<ServiceDetailSectionProps> = ({
  servicesGroupedByServiceCategory,
  selectedServiceCategoryIds,
  toggleService,
  onSelectAllServices,
  onSelectAllServicesInAllCategories,
  clearAllServices,
  isMobile,
}) => {
  const isAnyServiceSelected = servicesGroupedByServiceCategory.some(
    (group) => group.selectedServices.length > 0
  );

  const showClearButton = isAnyServiceSelected;

  const allServicesCount = useMemo(() => {
    return servicesGroupedByServiceCategory.reduce(
      (total, group) => total + group.children.length,
      0
    );
  }, [servicesGroupedByServiceCategory]);

  const selectedServicesCount = useMemo(() => {
    return servicesGroupedByServiceCategory.reduce(
      (total, group) => total + group.selectedServices.length,
      0
    );
  }, [servicesGroupedByServiceCategory]);

  const isAllServicesSelected =
    allServicesCount > 0 && allServicesCount === selectedServicesCount;
  const isAllServicesIndeterminate =
    selectedServicesCount > 0 && !isAllServicesSelected;

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
          {allServicesCount > 0 && (
            <CustomCheckbox
              indeterminate={isAllServicesIndeterminate}
              checked={isAllServicesSelected}
              onChange={(e) =>
                onSelectAllServicesInAllCategories(e.target.checked)
              }
            />
          )}
          {renderSectionTitle(!isMobile ? "Dịch vụ" : "DV", "")}
        </Space>

        {showClearButton && (
          <Button
            type="link"
            danger
            onClick={clearAllServices}
            style={{
              padding: 0,
              height: "auto",
              lineHeight: "normal",
            }}
          >
            Bỏ chọn tất cả
          </Button>
        )}
      </div>

      <div style={{ flexGrow: 1, minWidth: "400px",
      height: 470,
      
      overflowY: "auto" }}>
        {selectedServiceCategoryIds.length === 0 ? (
          <Typography.Text type="secondary">
            Vui lòng chọn Danh mục Dịch vụ để xem dịch vụ.
          </Typography.Text>
        ) : (
          <>
            {servicesGroupedByServiceCategory?.map((group) => {
              const isAllGroupSelected =
                group.selectedServices.length === group.children.length;
              const isGroupIndeterminate =
                group.selectedServices.length > 0 && !isAllGroupSelected;

              // Kiểm tra xem nhóm hiện tại có cần hiển thị cảnh báo không
              const isGroupValidationRequired =
                group.selectedServices.length === 0;

              return (
                <div key={group.id} style={{ marginBottom: "15px" }}>
                  <Divider
                    type="horizontal"
                    style={{
                      marginTop: 5,
                      marginBottom: 10,
                      borderTop: "0.5px solid #D4D4D4",
                    }}
                  />
                  <Space
                    size="small"
                    style={{ alignItems: "center", marginBottom: 12 }}
                  >
                    <CustomCheckbox
                      indeterminate={isGroupIndeterminate}
                      checked={isAllGroupSelected}
                      onChange={(e) =>
                        onSelectAllServices(group.id, e.target.checked)
                      }
                    />
                    <Typography.Title level={5} style={{ margin: 0 }}>
                      {group.title}
                    </Typography.Title>
                  </Space>

                  {renderCheckableTags({
                    data: group?.children,
                    idKey: "serviceId",
                    checkedIds: group?.selectedServices,
                    onChange: toggleService,
                  })}

                  {/* Hiển thị cảnh báo lỗi nếu nhóm này không có dịch vụ nào được chọn */}
                  {isGroupValidationRequired && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        color: "red",
                        marginTop: "10px",
                      }}
                    >
                      <ExclamationCircleOutlined
                        style={{ marginRight: "8px" }}
                      />
                      <Typography.Text style={{ color: "red" }}>
                        Bạn cần chọn ít nhất một dịch vụ cho danh mục{" "}
                        {group.title}
                      </Typography.Text>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};
