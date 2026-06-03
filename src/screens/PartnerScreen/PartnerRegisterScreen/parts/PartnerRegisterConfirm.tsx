import { useAccountContext } from "@/src/contexts/AccountContext";
import { Row, Col, Form, Input, Select, Typography } from "antd";
import { usePartnerSelectBox } from "../../hooks/usePartnerSelectBox";
import { PartnerSelectBoxResource } from "@/src/data/partner/models/partner.types";
import { PartnerRegisterProps } from "../PartnerRegisterScreen";
import AppIDUpload from "@/src/screens/ProfileScreen/components/AppIDUpload";
import {
  CateServiceResource,
  ServiceResource,
} from "@/src/data/category/models/category.types";
import { useMemo } from "react";
import { SkillResource } from "@/src/data/skill/models/skill.types";
import { includes } from "lodash";

function PartnerRegisterConfirm(props: PartnerRegisterProps & { form: any }) {
  const { auth: userInfo } = useAccountContext();
  const selectBoxQuery = usePartnerSelectBox();
  // const selectBoxResource: PartnerSelectBoxResource = selectBoxQuery.data;
  const selectBoxResource = selectBoxQuery.data as PartnerSelectBoxResource;

  const { form } = props;

  // Watch the selected categoryIds
  const selectedCategoryIds = Form.useWatch("categoryProjectIds", form);
  // const selectedCategoryServiceIds = Form.useWatch("categoryServiceIds", form);

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
  // useEffect(() => {
  //     // Skills
  //     let validSkillIds: number[] = [];
  //     if (selectedCategoryIds) {
  //         const selectedCateProjectIds = Array.isArray(selectedCategoryIds)
  //             ? selectedCategoryIds
  //             : [selectedCategoryIds];
  //         validSkillIds = selectBoxResource.skills
  //             .filter(skill => selectedCateProjectIds.includes(skill.categoryProjectId))
  //             .map(skill => skill.skillId);
  //     }
  //     // Get current selected skillIds
  //     const currentSkillIds = form.getFieldValue('skillIds');
  //     // If any selected skillId is not in validSkillIds, clear them
  //     if (currentSkillIds) {
  //         const filtered = Array.isArray(currentSkillIds)
  //             ? currentSkillIds.filter((id: number) => validSkillIds.includes(id))
  //             : validSkillIds.includes(currentSkillIds) ? currentSkillIds : undefined;
  //         if (
  //             (Array.isArray(filtered) && filtered.length !== (currentSkillIds?.length || 0)) ||
  //             (!Array.isArray(filtered) && filtered !== currentSkillIds)
  //         ) {
  //             form.setFieldValue('skillIds', filtered && (Array.isArray(filtered) ? filtered : [filtered]));
  //         }
  //     } else if (!selectedCategoryIds) {
  //         form.setFieldValue('skillIds', undefined);
  //     }

  //     // Category services
  //     let validCategoryServiceIds: number[] = [];
  //     if (selectedCategoryIds) {
  //         const selectedCateProjectIds = Array.isArray(selectedCategoryIds)
  //             ? selectedCategoryIds
  //             : [selectedCategoryIds];
  //         validCategoryServiceIds = selectBoxResource.categories
  //             .filter(category => selectedCateProjectIds.includes(category.categoryId))
  //             .flatMap(category => category.childrens || [])
  //             .map(service => service.cateServiceId);
  //     }
  //     // Get current selected categoryServiceIds
  //     const currentCategoryServiceIds = form.getFieldValue('categoryServiceIds');
  //     // If any selected categoryServiceId is not in validCategoryServiceIds, clear them
  //     if (currentCategoryServiceIds) {
  //         const filtered = Array.isArray(currentCategoryServiceIds)
  //             ? currentCategoryServiceIds.filter((id: number) => validCategoryServiceIds.includes(id))
  //             : validCategoryServiceIds.includes(currentCategoryServiceIds) ? currentCategoryServiceIds : undefined;
  //         if (
  //             (Array.isArray(filtered) && filtered.length !== (currentCategoryServiceIds?.length || 0)) ||
  //             (!Array.isArray(filtered) && filtered !== currentCategoryServiceIds)
  //         ) {
  //             form.setFieldValue('categoryServiceIds', filtered && (Array.isArray(filtered) ? filtered : [filtered]));
  //         }
  //     } else if (!selectedCategoryIds) {
  //         form.setFieldValue('categoryServiceIds', undefined);
  //     }
  // }, [selectedCategoryIds, selectBoxResource.skills, selectBoxResource.categories, form]);

  // Filter categoryServices based on selected categoryIds - for display only
  const serviceCategoriesAvailable: CateServiceResource[] = useMemo(() => {
    // Find all categoryServices for selected categories
    if (!selectedCategoryIds) return [];

    return selectBoxResource?.categories
      ?.filter((category) => {
        if (Array.isArray(selectedCategoryIds)) {
          return includes(selectedCategoryIds, category?.categoryId);
        }
        return category.categoryId === selectedCategoryIds;
      })
      .flatMap((category) => category?.childrens || []);
  }, [selectedCategoryIds, selectBoxResource?.categories]);

  // Watch the selected categoryServiceIds
  const selectedCategoryServiceIds = Form.useWatch("categoryServiceIds", form);

  // Remove invalid serviceIds
  // useEffect(() => {
  //     // Get all valid serviceIds from the currently selected categoryServiceIds
  //     let validServiceIds: number[] = [];
  //     if (selectedCategoryServiceIds && selectBoxResource.categories) {
  //         const selectedIds = Array.isArray(selectedCategoryServiceIds)
  //             ? selectedCategoryServiceIds
  //             : [selectedCategoryServiceIds];
  //         validServiceIds = selectBoxResource.categories
  //             .flatMap(category => category.childrens || [])
  //             .filter(serviceCategory => selectedIds.includes(serviceCategory.cateServiceId))
  //             .flatMap(serviceCategory => serviceCategory.childrens || [])
  //             .map(service => service.serviceId);
  //     }
  //     // Get current selected serviceIds
  //     const currentServiceIds = form.getFieldValue('serviceIds');
  //     // If any selected serviceId is not in validServiceIds, clear them
  //     if (currentServiceIds) {
  //         const filtered = Array.isArray(currentServiceIds)
  //             ? currentServiceIds.filter((id: number) => validServiceIds.includes(id))
  //             : validServiceIds.includes(currentServiceIds) ? currentServiceIds : undefined;
  //         if (
  //             (Array.isArray(filtered) && filtered.length !== (currentServiceIds?.length || 0)) ||
  //             (!Array.isArray(filtered) && filtered !== currentServiceIds)
  //         ) {
  //             form.setFieldValue('serviceIds', filtered && (Array.isArray(filtered) ? filtered : [filtered]));
  //         }
  //     } else if (!selectedCategoryServiceIds) {
  //         // If nothing is selected, clear serviceIds
  //         form.setFieldValue('serviceIds', undefined);
  //     }
  // }, [selectedCategoryServiceIds, selectBoxResource.categories, form]);

  // Filter services based on selected categoryServiceIds - for display only
  const servicesAvailable: ServiceResource[] = useMemo(() => {
    // Find all services for selected service categories
    if (!selectedCategoryServiceIds) return [];

    return selectBoxResource?.categories
      ?.flatMap((category) => category.childrens || [])
      ?.filter((serviceCategory) => {
        if (Array.isArray(selectedCategoryServiceIds)) {
          return includes(
            selectedCategoryServiceIds,
            serviceCategory.cateServiceId
          );
        }
        return serviceCategory?.cateServiceId === selectedCategoryServiceIds;
      })
      ?.flatMap((serviceCategory) => serviceCategory?.childrens || []);
  }, [selectedCategoryServiceIds, selectBoxResource?.categories]);

  return (
    <div className={"formGroupContainer"}>
      <div className={"formGroupContentContainer"}>
        <Row gutter={[20, 0]}>
          <Col xs={24} lg={24}>
            <Typography.Title>Thông tin chung</Typography.Title>
          </Col>

          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item label={"Họ và tên"}>
              <Input value={userInfo?.fullName} disabled size={"large"} />
            </Form.Item>

            <Form.Item label={"Lĩnh vực"} name={"categoryProjectIds"}>
              <Select
                mode={"multiple"}
                options={selectBoxResource?.categories?.map((catItem) => ({
                  value: catItem?.categoryId,
                  label: catItem?.name,
                }))}
                placeholder={"Chọn lĩnh vực"}
                size={"large"}
                disabled
              />
            </Form.Item>

            <Form.Item label={"Danh mục dịch vụ"} name={"categoryServiceIds"}>
              <Select
                mode={"multiple"}
                options={serviceCategoriesAvailable?.map((catItem) => ({
                  value: catItem?.cateServiceId,
                  label: catItem?.name,
                }))}
                placeholder={
                  !selectedCategoryIds
                    ? "Vui lòng chọn lĩnh vực"
                    : "Chọn danh mục dịch vụ"
                }
                size={"large"}
                showSearch
                disabled
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

            <Form.Item label={"Địa điểm"} name={"locationId"}>
              <Select
                options={selectBoxResource.locations.items.map((locItem) => ({
                  value: locItem.locationId,
                  label: locItem.name,
                }))}
                placeholder={"Chọn địa điểm"}
                size={"large"}
                disabled
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

            <Form.Item
              label={"Số CCCD/CMND"}
              // name={'citizenId'}
              name={"cardNumber"}
            >
              <Input
                size={"large"}
                placeholder={"Nhập số CCCD/CMND"}
                disabled
              />
            </Form.Item>

            <Form.Item
              label={"Hình CCCD/CMND mặt trước"}
              // name={"citizen_photo_front"}
              name={"frontCard"}
            >
              <AppIDUpload disabled={true} />
            </Form.Item>

            <Form.Item
              label={"Hình chân dung cầm CCCD/CMND"}
              name={"portraitCard"}
            >
              <AppIDUpload disabled={true} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item label={"Vai trò công việc"} name={"position"}>
              <Input size={"large"} placeholder={"Developer,..."} disabled />
            </Form.Item>

            <Form.Item label={"Kỹ năng chính"} name={"skillIds"}>
              <Select
                mode={"multiple"}
                options={filteredSkills?.map((skillItem) => ({
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
                disabled
                notFoundContent="Không có dữ liệu"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </Form.Item>

            <Form.Item label={"Dịch vụ"} name={"serviceIds"}>
              <Select
                mode={"multiple"}
                options={servicesAvailable?.map((serviceItem) => ({
                  value: serviceItem?.serviceId,
                  label: serviceItem?.name,
                }))}
                placeholder={
                  !selectedCategoryServiceIds
                    ? "Vui lòng chọn danh mục dịch vụ"
                    : "Chọn dịch vụ"
                }
                size={"large"}
                showSearch
                disabled
                notFoundContent="Không có dữ liệu"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </Form.Item>

            <Form.Item label={"Ngôn ngữ"} name={"languageIds"}>
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
                disabled
              />
            </Form.Item>

            <Form.Item label={"Mã số thuế cá nhân"} name={"taxCode"}>
              <Input
                size={"large"}
                placeholder={"Nhập mã số thuế cá nhân"}
                disabled
              />
            </Form.Item>

            <Form.Item
              label={"Hình CCCD/CMND mặt sau"}
              // name={"citizen_photo_back"}
              name={"backCard"}
            >
              <AppIDUpload disabled={true} />
            </Form.Item>
          </Col>

          <Col xs={24} lg={24}>
            <Typography.Title>Thông tin thanh toán</Typography.Title>
          </Col>

          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item label={"Ngân hàng"} name={"bankId"}>
              <Select
                options={selectBoxResource.banks.map((bankItem) => ({
                  value: bankItem.bankId,
                  label: bankItem.name,
                }))}
                placeholder={"Chọn ngân hàng"}
                size={"large"}
                disabled
              />
            </Form.Item>

            <Form.Item
              label={"Hình QR mã tài khoản nhận thanh toán"}
              name={"qrCode"}
            >
              <AppIDUpload disabled={true} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
            <Form.Item
              label={"Số tài khoản"}
              name={"accountNumber"}
              rules={[
                {
                  pattern: /^\d{6,20}$/,
                  message: "Số tài khoản chỉ gồm số (6–20 ký tự)",
                },
              ]}
            >
              <Input
                size={"large"}
                placeholder={"Nhập số tài khoản"}
                disabled
              />
            </Form.Item>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default PartnerRegisterConfirm;
