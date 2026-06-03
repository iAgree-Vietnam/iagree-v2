import { useAccountContext } from "@/src/contexts/AccountContext";
import { Row, Col, Form, Input, Select } from "antd";
import { usePartnerSelectBox } from "../../hooks/usePartnerSelectBox";
import { PartnerSelectBoxResource } from "@/src/data/partner/models/partner.types";
import { PartnerRegisterProps } from "../PartnerRegisterScreen";
import {
  CateServiceResource,
  ServiceResource,
} from "@/src/data/category/models/category.types";
import { useEffect, useMemo, useRef } from "react";

function PartnerCompanyRegisterInfo(
  props: PartnerRegisterProps & { form: any }
) {
  const { auth: userInfo } = useAccountContext();
  const selectBoxQuery = usePartnerSelectBox();
  const selectBoxResource = selectBoxQuery.data as PartnerSelectBoxResource;

  const { form } = props;

  // Add refs to track if this is the initial mount
  const isInitialMountForCategoryServices = useRef(true);
  const isInitialMountForServices = useRef(true);

  // Watch the selected categoryId
  const selectedCategoryIds = Form.useWatch("categoryProjectIds", form);

  // Remove invalid categoryServiceIds
  useEffect(() => {
    // Skip the cleanup on initial mount to preserve existing values
    if (isInitialMountForCategoryServices.current) {
      isInitialMountForCategoryServices.current = false;
      return;
    }

    // Category services
    let validCategoryServiceIds: number[] = [];
    if (selectedCategoryIds) {
      const selectedCateProjectIds = Array.isArray(selectedCategoryIds)
        ? selectedCategoryIds
        : [selectedCategoryIds];
      validCategoryServiceIds = selectBoxResource.categories
        .filter((category) =>
          selectedCateProjectIds.includes(category.categoryId)
        )
        .flatMap((category) => category.childrens || [])
        .map((service) => service.cateServiceId);
    }

    // Get current selected categoryServiceIds
    const currentCategoryServiceIds = form.getFieldValue("categoryServiceIds");

    // Only clear if there are currently selected values that are now invalid
    if (currentCategoryServiceIds && currentCategoryServiceIds.length > 0) {
      const filtered = Array.isArray(currentCategoryServiceIds)
        ? currentCategoryServiceIds.filter((id: number) =>
            validCategoryServiceIds.includes(id)
          )
        : validCategoryServiceIds.includes(currentCategoryServiceIds)
        ? currentCategoryServiceIds
        : undefined;

      if (
        (Array.isArray(filtered) &&
          filtered.length !== (currentCategoryServiceIds?.length || 0)) ||
        (!Array.isArray(filtered) && filtered !== currentCategoryServiceIds)
      ) {
        form.setFieldValue(
          "categoryServiceIds",
          filtered && (Array.isArray(filtered) ? filtered : [filtered])
        );
      }
    } else if (!selectedCategoryIds) {
      // Only clear if no categories are selected
      form.setFieldValue("categoryServiceIds", undefined);
    }
  }, [selectedCategoryIds, selectBoxResource?.categories, form]);

  // Filter categoryServices based on selected categoryIds
  const serviceCategoriesAvailable: CateServiceResource[] = useMemo(() => {
    // Find all categoryServices for selected categories
    if (!selectedCategoryIds) return [];

    return selectBoxResource?.categories
      ?.filter((category) => {
        if (Array.isArray(selectedCategoryIds)) {
          return selectedCategoryIds?.includes(category?.categoryId);
        }
        return category?.categoryId === selectedCategoryIds;
      })
      .flatMap((category) => category?.childrens || []);
  }, [selectedCategoryIds, selectBoxResource.categories]);

  // Watch the selected categoryServiceIds
  const selectedCategoryServiceIds = Form.useWatch("categoryServiceIds", form);

  // Remove invalid serviceIds
  useEffect(() => {
    // Skip the cleanup on initial mount to preserve existing values
    if (isInitialMountForServices.current) {
      isInitialMountForServices.current = false;
      return;
    }

    // Get all valid serviceIds from the currently selected categoryServiceIds
    let validServiceIds: number[] = [];
    if (selectedCategoryServiceIds && selectBoxResource.categories) {
      const selectedIds = Array.isArray(selectedCategoryServiceIds)
        ? selectedCategoryServiceIds
        : [selectedCategoryServiceIds];
      validServiceIds = selectBoxResource.categories
        .flatMap((category) => category.childrens || [])
        .filter((serviceCategory) =>
          selectedIds.includes(serviceCategory.cateServiceId)
        )
        .flatMap((serviceCategory) => serviceCategory.childrens || [])
        .map((service) => service.serviceId);
    }

    // Get current selected serviceIds
    const currentServiceIds = form.getFieldValue("serviceIds");

    // Only clear if there are currently selected values that are now invalid
    if (currentServiceIds && currentServiceIds.length > 0) {
      const filtered = Array.isArray(currentServiceIds)
        ? currentServiceIds.filter((id: number) => validServiceIds.includes(id))
        : validServiceIds.includes(currentServiceIds)
        ? currentServiceIds
        : undefined;

      if (
        (Array.isArray(filtered) &&
          filtered.length !== (currentServiceIds?.length || 0)) ||
        (!Array.isArray(filtered) && filtered !== currentServiceIds)
      ) {
        form.setFieldValue(
          "serviceIds",
          filtered && (Array.isArray(filtered) ? filtered : [filtered])
        );
      }
    } else if (!selectedCategoryServiceIds) {
      // Only clear if no service categories are selected
      form.setFieldValue("serviceIds", undefined);
    }
  }, [selectedCategoryServiceIds, selectBoxResource.categories, form]);

  // Filter services based on selected categoryServiceIds
  const servicesAvailable: ServiceResource[] = useMemo(() => {
    // Find all services for selected service categories
    if (!selectedCategoryServiceIds) return [];

    return selectBoxResource.categories
      .flatMap((category) => category.childrens || [])
      .filter((serviceCategory) => {
        if (Array.isArray(selectedCategoryServiceIds)) {
          return selectedCategoryServiceIds.includes(
            serviceCategory.cateServiceId
          );
        }
        return serviceCategory.cateServiceId === selectedCategoryServiceIds;
      })
      .flatMap((serviceCategory) => serviceCategory.childrens || []);
  }, [selectedCategoryServiceIds]);

  return (
    <div className={"formGroupContainer"}>
      <div className={"formGroupContentContainer"}>
        <Row gutter={[20, 10]} justify={"space-between"}>
          <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={12}>
            <Form.Item label={"Tên doanh nghiệp"} required>
              <Input value={userInfo?.fullName} disabled size={"large"} />
            </Form.Item>

            <Form.Item
              label={"Danh mục dịch vụ"}
              name={"categoryServiceIds"}
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn danh mục dịch vụ công việc",
                },
              ]}
            >
              <Select
                mode={"multiple"}
                options={serviceCategoriesAvailable.map((catItem) => ({
                  value: catItem.cateServiceId,
                  label: catItem.name,
                }))}
                placeholder={
                  !selectedCategoryIds
                    ? "Vui lòng chọn lĩnh vực"
                    : "Chọn danh mục dịch vụ"
                }
                size={"large"}
                showSearch
                disabled={
                  !selectedCategoryIds || selectedCategoryIds.length === 0
                }
                notFoundContent="Không có dữ liệu"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </Form.Item>

            <Form.Item
              label={"Ngôn ngữ"}
              name={"languageIds"}
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn ngôn ngữ",
                },
              ]}
            >
              <Select
                mode={"multiple"}
                options={selectBoxResource.languages.items.map(
                  (languageItem) => ({
                    value: languageItem.languageId,
                    label: languageItem.name,
                  })
                )}
                placeholder={"Chọn ngôn ngữ"}
                size={"large"}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label={"Lĩnh vực"}
              name={"categoryProjectIds"}
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn lĩnh vực",
                },
              ]}
            >
              <Select
                mode={"multiple"}
                options={selectBoxResource.categories.map((catItem) => ({
                  value: catItem.categoryId,
                  label: catItem.name,
                }))}
                placeholder={"Chọn lĩnh vực"}
                size={"large"}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </Form.Item>

            <Form.Item
              label={"Dịch vụ"}
              name={"serviceIds"}
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn dịch vụ công việc",
                },
              ]}
            >
              <Select
                mode={"multiple"}
                options={servicesAvailable.map((serviceItem) => ({
                  value: serviceItem.serviceId,
                  label: serviceItem.name,
                }))}
                placeholder={
                  !selectedCategoryServiceIds
                    ? "Vui lòng chọn danh mục dịch vụ"
                    : "Chọn dịch vụ"
                }
                size={"large"}
                showSearch
                disabled={
                  !selectedCategoryServiceIds ||
                  selectedCategoryServiceIds.length === 0
                }
                notFoundContent="Không có dữ liệu"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </Form.Item>

            <Form.Item
              label={"Địa điểm"}
              name={"locationId"}
              required
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn địa điểm",
                },
              ]}
            >
              <Select
                options={selectBoxResource.locations.items.map((locItem) => ({
                  value: locItem.locationId,
                  label: locItem.name,
                }))}
                placeholder={"Chọn địa điểm"}
                size={"large"}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </Form.Item>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default PartnerCompanyRegisterInfo;
