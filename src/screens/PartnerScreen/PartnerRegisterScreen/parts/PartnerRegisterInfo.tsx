import { useAccountContext } from "@/src/contexts/AccountContext";
import { Row, Col, Form, Input, Select } from "antd";
import { usePartnerSelectBox } from "../../hooks/usePartnerSelectBox";
import { PartnerSelectBoxResource } from "@/src/data/partner/models/partner.types";
import { PartnerRegisterProps } from "../PartnerRegisterScreen";
import {
  CateServiceResource,
  ServiceResource,
} from "@/src/data/category/models/category.types";
import { useMemo, useEffect, useRef } from "react";
import { SkillResource } from "@/src/data/skill/models/skill.types";

function PartnerRegisterInfo(props: PartnerRegisterProps & { form: any }) {
  const { auth: userInfo } = useAccountContext();
  const selectBoxQuery = usePartnerSelectBox();
  // const selectBoxResource: PartnerSelectBoxResource = selectBoxQuery.data;
  const selectBoxResource = selectBoxQuery.data as PartnerSelectBoxResource;


  const { form } = props;

  // Add refs to track if this is the initial mount
  const isInitialMountForCategoryServices = useRef(true);
  const isInitialMountForServices = useRef(true);

  // Watch the selected categoryId
  const selectedCategoryIds = Form.useWatch("categoryProjectIds", form);

  // Filter skills based on selected categoryIds
  const filteredSkills: SkillResource[] = useMemo(() => {
    if (!selectedCategoryIds || !selectBoxResource.skills) return [];

    return selectBoxResource.skills.filter((skillItem) => {
      if (Array.isArray(selectedCategoryIds)) {
        return selectedCategoryIds.includes(skillItem.categoryProjectId);
      }
      return skillItem.categoryProjectId === selectedCategoryIds;
    });
  }, [selectedCategoryIds, selectBoxResource.skills]);

  // Remove invalid skillIds and categoryServiceIds
  useEffect(() => {
    // Skip the cleanup on initial mount to preserve existing values
    if (isInitialMountForCategoryServices.current) {
      isInitialMountForCategoryServices.current = false;
      return;
    }

    // Only proceed if we have selectedCategoryIds and they actually changed
    if (!selectedCategoryIds || selectedCategoryIds.length === 0) {
      return; // Don't clear values when no categories are selected
    }

    const selectedCateProjectIds = Array.isArray(selectedCategoryIds)
      ? selectedCategoryIds
      : [selectedCategoryIds];

    // Skills
    const validSkillIds = filteredSkills.map((skill) => skill.skillId);

    // Get the selected skillIds
    const currentSkillIds = form.getFieldValue("skillIds");

    // Only filter out invalid values if there are currently selected values
    if (currentSkillIds && currentSkillIds.length > 0) {
      const filtered = Array.isArray(currentSkillIds)
        ? currentSkillIds.filter((id: number) => validSkillIds.includes(id))
        : validSkillIds.includes(currentSkillIds)
        ? [currentSkillIds]
        : [];

      // Only update if the filtered result is different
      if (
        filtered.length !==
        (Array.isArray(currentSkillIds) ? currentSkillIds.length : 1)
      ) {
        form.setFieldValue(
          "skillIds",
          filtered.length > 0 ? filtered : undefined
        );
      }
    }

    // Category services - Get valid category service IDs based on selected categories
    const validCategoryServiceIds = selectBoxResource.categories
      .filter((category) =>
        selectedCateProjectIds.includes(category.categoryId)
      )
      .flatMap((category) => category.childrens || [])
      .map((service) => service.cateServiceId);

    // Get current selected categoryServiceIds
    const currentCategoryServiceIds = form.getFieldValue("categoryServiceIds");

    // Only filter out invalid values if there are currently selected values
    // AND if there are valid options available
    if (
      currentCategoryServiceIds &&
      currentCategoryServiceIds.length > 0 &&
      validCategoryServiceIds.length > 0
    ) {
      const filtered = Array.isArray(currentCategoryServiceIds)
        ? currentCategoryServiceIds.filter((id: number) =>
            validCategoryServiceIds.includes(id)
          )
        : validCategoryServiceIds.includes(currentCategoryServiceIds)
        ? [currentCategoryServiceIds]
        : [];

      // Only update if the filtered result is different
      if (
        filtered.length !==
        (Array.isArray(currentCategoryServiceIds)
          ? currentCategoryServiceIds.length
          : 1)
      ) {
        form.setFieldValue(
          "categoryServiceIds",
          filtered.length > 0 ? filtered : undefined
        );
      }
    }
  }, [selectedCategoryIds, filteredSkills, selectBoxResource.categories, form]);

  // Filter categoryServices based on selected categoryIds
  const serviceCategoriesAvailable: CateServiceResource[] = useMemo(() => {
    // Find all categoryServices for selected categories
    if (!selectedCategoryIds) return [];

    return selectBoxResource.categories
      .filter((category) => {
        if (Array.isArray(selectedCategoryIds)) {
          return selectedCategoryIds.includes(category.categoryId);
        }
        return category.categoryId === selectedCategoryIds;
      })
      .flatMap((category) => category.childrens || []);
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

    // Only proceed if we have selectedCategoryServiceIds
    if (
      !selectedCategoryServiceIds ||
      selectedCategoryServiceIds.length === 0
    ) {
      return; // Don't clear values when no service categories are selected
    }

    // Get all valid serviceIds from the currently selected categoryServiceIds
    const selectedIds = Array.isArray(selectedCategoryServiceIds)
      ? selectedCategoryServiceIds
      : [selectedCategoryServiceIds];
    const validServiceIds = selectBoxResource.categories
      .flatMap((category) => category.childrens || [])
      .filter((serviceCategory) =>
        selectedIds.includes(serviceCategory.cateServiceId)
      )
      .flatMap((serviceCategory) => serviceCategory.childrens || [])
      .map((service) => service.serviceId);

    // Get current selected serviceIds
    const currentServiceIds = form.getFieldValue("serviceIds");

    // Only filter out invalid values if there are currently selected values
    // AND if there are valid options available
    if (
      currentServiceIds &&
      currentServiceIds.length > 0 &&
      validServiceIds.length > 0
    ) {
      const filtered = Array.isArray(currentServiceIds)
        ? currentServiceIds.filter((id: number) => validServiceIds.includes(id))
        : validServiceIds.includes(currentServiceIds)
        ? [currentServiceIds]
        : [];

      // Only update if the filtered result is different
      if (
        filtered.length !==
        (Array.isArray(currentServiceIds) ? currentServiceIds.length : 1)
      ) {
        form.setFieldValue(
          "serviceIds",
          filtered.length > 0 ? filtered : undefined
        );
      }
    }
  }, [selectedCategoryServiceIds, selectBoxResource.categories, form]);

  // Filter services based on selected categoryServiceIds
  const servicesAvailable: ServiceResource[] = useMemo(() => {
    // Find all services for selected service categories
    if (!selectedCategoryServiceIds) return [];

    return selectBoxResource?.categories
      ?.flatMap((category) => category.childrens || [])
      ?.filter((serviceCategory) => {
        if (Array.isArray(selectedCategoryServiceIds)) {
          return selectedCategoryServiceIds?.includes(
            serviceCategory.cateServiceId
          );
        }
        return serviceCategory?.cateServiceId === selectedCategoryServiceIds;
      })
      .flatMap((serviceCategory) => serviceCategory.childrens || []);
  }, [selectedCategoryServiceIds]);

  return (
    <div className={"formGroupContainer"}>
      <div className={"formGroupContentContainer"}>
        <Row gutter={[20, 10]} justify={"space-between"}>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item label={"Họ và tên"} required>
              <Input value={userInfo?.fullName} disabled size={"large"} />
            </Form.Item>

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
                options={selectBoxResource?.categories?.map((catItem) => ({
                  value: catItem?.categoryId,
                  label: catItem?.name,
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

            {/* <Form.Item
                    label={'Kinh nghiệm'}
                    name={'experienceId'}
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng chọn kinh nghiệm',
                      },
                    ]}
                  >
                    <Select
                      options={selectBoxResource.experiences.items.map(
                        (exItem) => ({
                          value: exItem.experienceId,
                          label: exItem.name,
                        })
                      )}
                      placeholder={'Chọn kinh nghiệm'}
                      size={'large'}
                    />
                  </Form.Item> */}

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

            {/* <Form.Item 
                    label={'Tags'} 
                    name={'tagIds'}
                  >
                    <Select
                      mode={'multiple'}
                      options={selectBoxResource.tags.items.map((tagItem) => ({
                        value: tagItem.tagId,
                        label: tagItem.name,
                      }))}
                      placeholder={'Chọn tags'}
                      size={'large'}
                    />
                  </Form.Item> */}
          </Col>

          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            {/* <Form.Item label={'Số điện thoại liên hệ'} name={'phoneNumber'} required>
                    <Input value={userInfo?.phoneNumber} size={'large'} />
                  </Form.Item> */}

            <Form.Item
              label={"Chức danh"}
              name={"position"}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập chức danh",
                },
              ]}
            >
              <Input size={"large"} placeholder={"Developer,..."} />
            </Form.Item>

            <Form.Item
              label={"Kỹ năng chính"}
              name={"skillIds"}
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn kỹ năng chính",
                },
              ]}
            >
              <Select
                mode={"multiple"}
                options={filteredSkills.map((skillItem) => ({
                  value: skillItem.skillId,
                  label: skillItem.name,
                }))}
                placeholder={
                  !selectedCategoryIds
                    ? "Vui lòng chọn lĩnh vực"
                    : "Chọn kỹ năng chính"
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
        </Row>
      </div>
    </div>
  );
}

export default PartnerRegisterInfo;
