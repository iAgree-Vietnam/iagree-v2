/* eslint-disable import/no-unused-modules */
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Select,
  Typography,
} from "antd";

import { withThemeRevert } from "@/theme";
import AppDatePicker from "@/src/components/date/DatePicker";
import AppInputNumber from "@/src/components/AppInputNumber";
import Constants from "@/src/constants/Constants";
import useJobAddSelectbox from "../../JobScreen/JobFormScreen/hooks/useJobAddSelectbox";
import { JobSelectboxResource } from "@/src/data/job/models/job.types";
import { SkillResource } from "@/src/data/skill/models/skill.types";
import {
  CategoryResource,
  CateServiceResource,
  ServiceResource,
} from "@/src/data/category/models/category.types";
import useJobAdd from "../../JobScreen/JobFormScreen/hooks/useJobAdd";
import moment from "moment";
import dynamic from "next/dynamic";

const TextEditor = dynamic(
  () => import("@/src/screens/EditorScreen/TextEditor"),
  { ssr: false }
);

type PartnerConnectModalProps = {
  partnerId: number;
  parnerName: string;
  categories: CategoryResource[] | null;
  categoryServices: CateServiceResource[] | null;
  services: ServiceResource[] | null;
  skills: SkillResource[] | null;
};

const PartnerConnectModalV2 = React.forwardRef(
  (props: PartnerConnectModalProps, ref) => {
    const [form] = Form.useForm();
    const actionValue = useRef<number | null>(null);
    const [isOpen, setOpen] = useState(false);

    const open = useCallback(() => setOpen(true), []);
    const close = useCallback(() => setOpen(false), []);

    useImperativeHandle(
      ref,
      useCallback(() => ({ open, close }), [open, close])
    );

    const [salaryType, setSalaryType] = useState<number>(
      Constants.JOB.SALARY_TYPE.DEAL
    );

    const selectboxQuery = useJobAddSelectbox();
    const selectboxResource = selectboxQuery.data as JobSelectboxResource;

    // Watch the selected categoryId
    const selectedCategoryIds = Form.useWatch("categoryProjectIds", form);

    // Filter skills based on selected categoryIds
    const filteredSkills: SkillResource[] = useMemo(() => {
      if (!selectedCategoryIds || !props.skills) return [];

      return props.skills.filter((skillItem) => {
        if (Array.isArray(selectedCategoryIds)) {
          return selectedCategoryIds.includes(skillItem.categoryProjectId);
        }
        return skillItem.categoryProjectId === selectedCategoryIds;
      });
    }, [selectedCategoryIds, props.skills]);

    // Remove invalid skillIds and categoryServiceIds
    useEffect(() => {
      // Skills
      let validSkillIds: number[] = [];
      if (selectedCategoryIds) {
        const selectedCateProjectIds = Array.isArray(selectedCategoryIds)
          ? selectedCategoryIds
          : [selectedCategoryIds];
        validSkillIds = (props.skills || [])
          .filter((skill) =>
            selectedCateProjectIds.includes(skill.categoryProjectId)
          )
          .map((skill) => skill.skillId);
      }
      // Get current selected skillIds
      const currentSkillIds = form.getFieldValue("skillIds");
      // If any selected skillId is not in validSkillIds, clear them
      if (currentSkillIds) {
        const filtered = Array.isArray(currentSkillIds)
          ? currentSkillIds.filter((id: number) => validSkillIds.includes(id))
          : validSkillIds.includes(currentSkillIds)
          ? currentSkillIds
          : undefined;
        if (
          (Array.isArray(filtered) &&
            filtered.length !== (currentSkillIds?.length || 0)) ||
          (!Array.isArray(filtered) && filtered !== currentSkillIds)
        ) {
          form.setFieldValue(
            "skillIds",
            filtered && (Array.isArray(filtered) ? filtered : [filtered])
          );
        }
      } else if (!selectedCategoryIds) {
        form.setFieldValue("skillIds", undefined);
      }

      // Category services
      let validCategoryServiceIds: number[] = [];
      if (selectedCategoryIds) {
        const selectedCateProjectIds = Array.isArray(selectedCategoryIds)
          ? selectedCategoryIds
          : [selectedCategoryIds];
        // validCategoryServiceIds = (props.categories || [])
        //     .filter(category => selectedCateProjectIds.includes(category.id))
        //     .flatMap(category => category.childrens || [])
        //     .map(service => service.id);
        validCategoryServiceIds = (props?.categoryServices || [])
          .filter((cateService) =>
            selectedCateProjectIds?.includes(cateService?.parentId)
          )
          .map((cateService) => cateService?.cateServiceId);
      }
      // Get current selected categoryServiceIds
      const currentCategoryServiceIds =
        form.getFieldValue("categoryServiceIds");
      // If any selected categoryServiceId is not in validCategoryServiceIds, clear them
      if (currentCategoryServiceIds) {
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
        form.setFieldValue("categoryServiceIds", undefined);
      }
    }, [selectedCategoryIds, filteredSkills, props?.categories, form]);

    // Filter categoryServices based on selected categoryIds
    const serviceCategoriesAvailable: CateServiceResource[] = useMemo(() => {
      // Find all categoryServices for selected categories
      if (!selectedCategoryIds) return [];

      return (props?.categoryServices || []).filter((cateService) =>
        selectedCategoryIds?.includes(cateService?.parentId)
      );

    }, [selectedCategoryIds, props?.categories]);

    // Watch the selected categoryServiceIds
    const selectedCategoryServiceIds = Form.useWatch(
      "categoryServiceIds",
      form
    );

    // Remove invalid serviceIds
    useEffect(() => {
      // Get all valid serviceIds from the currently selected categoryServiceIds
      let validServiceIds: number[] = [];
      if (selectedCategoryServiceIds && props?.services) {
        const selectedIds = Array.isArray(selectedCategoryServiceIds)
          ? selectedCategoryServiceIds
          : [selectedCategoryServiceIds];
        // validServiceIds = (props.categories || [])
        //     .flatMap(category => category.childrens || [])
        //     .filter(serviceCategory => selectedIds.includes(serviceCategory.id))
        //     .flatMap(serviceCategory => serviceCategory.childrens || [])
        //     .map(service => service.id);
        validServiceIds = (props?.services || [])
          .filter((service) => selectedIds.includes(service.parentId))
          .map((service) => service.serviceId);
      }
      // Get current selected serviceIds
      const currentServiceIds = form.getFieldValue("serviceIds");
      // If any selected serviceId is not in validServiceIds, clear them
      if (currentServiceIds) {
        const filtered = Array.isArray(currentServiceIds)
          ? currentServiceIds.filter((id: number) =>
              validServiceIds.includes(id)
            )
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
        // If nothing is selected, clear serviceIds
        form.setFieldValue("serviceIds", undefined);
      }
    }, [selectedCategoryServiceIds, props.categories, form]);

    // Filter services based on selected categoryServiceIds
    const servicesAvailable: ServiceResource[] = useMemo(() => {
      // Find all services for selected service categories
      if (!selectedCategoryServiceIds) return [];

      return (props.services || []).filter((service) =>
        selectedCategoryServiceIds?.includes(service?.parentId)
      );

      // return (props.categories || [])
      //     .flatMap(category => category.childrens || [])
      //     .filter(serviceCategory => {
      //         if (Array.isArray(selectedCategoryServiceIds)) {
      //             return selectedCategoryServiceIds.includes(serviceCategory.id);
      //         }
      //         return serviceCategory.id === selectedCategoryServiceIds;
      //     })
      //     .flatMap(serviceCategory => serviceCategory.childrens || [])
    }, [selectedCategoryServiceIds]);

    // const { mutate: mutateConnect, isLoading } = usePartnerConnect({
    //     onSuccess: () => {
    //         close();
    //         form.resetFields();
    //     },
    //     onError: () => close(),
    // });

    const submitMutation = useJobAdd();

    return (
      <Modal
        style={{ top: 20 }}
        width={{
          xs: "90%",
          sm: "80%",
          md: "70%",
          lg: "60%",
          xl: "50%",
          xxl: "40%",
        }}
        centered
        open={isOpen}
        className={"applyJobModalContainer"}
        footer={null}
        onCancel={close}
      >
        <Typography.Paragraph
          className={"modalTitle"}
          style={{ textAlign: "left" }}
        >
          Kết nối với Đối tác {props.parnerName}
        </Typography.Paragraph>
        <Form
          form={form}
          layout={"vertical"}
          initialValues={{
            partner_id: props.partnerId,
            messages: null,
          }}
          // onFinish={mutateConnect}
          onFinish={(values) => {
            if (values.isPublic) {
              values.isPublic = 1;
            } else {
              values.isPublic = 0;
            }

            values.partners = [props.partnerId];

            submitMutation.mutate({
              ...values,
              salaryType: salaryType,
              status: actionValue.current,
            });
          }}
          className={"jobFormContainer"}
        >
          <div className={"formGroupContainer"}>
            <div className={"formGroupTitleContainer"}>
              <h3 className={"formGroupTitle"}>Thông tin chung</h3>
            </div>

            <div className={"formGroupContentContainer"}>
              <Row gutter={[20, 0]}>
                <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                  <Form.Item
                    label={"Tên công việc"}
                    name={"title"}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập tên công việc",
                      },
                    ]}
                  >
                    <Input
                      size={"large"}
                      placeholder={"Nhập tên công việc"}
                      variant={"outlined"}
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

                  <Form.Item
                    label={"Kỹ năng yêu cầu"}
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
                    label={"Số lần nghiệm thu"}
                    name={"numberAccept"}
                    rules={[
                      {
                        required: true,
                        message:
                          "Vui lòng nhập số lần nghiệm thu cho công việc",
                      },
                    ]}
                  >
                    <AppInputNumber
                      placeholder={"Nhập số lần nghiệm thu"}
                      size={"large"}
                      min={1}
                    />
                  </Form.Item>

                  <Form.Item label={"Thù lao công việc"} required>
                    <Radio.Group
                      options={[
                        {
                          value: Constants.JOB.SALARY_TYPE.DEAL,
                          label: "Thỏa thuận",
                        },
                        {
                          value: Constants.JOB.SALARY_TYPE.FIXED,
                          label: "Cố định",
                        },
                        {
                          value: Constants.JOB.SALARY_TYPE.RANGE,
                          label: "Khoảng giá",
                        },
                      ]}
                      onChange={(e) => setSalaryType(Number(e.target.value))}
                      value={salaryType}
                      optionType={"button"}
                      buttonStyle={"solid"}
                      className={"jobSalaryTypeContainer"}
                    />
                  </Form.Item>

                  {/* <Form.Item
                                        label={'Yêu cầu kinh nghiệm'}
                                        name={'experienceId'}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng chọn yêu cầu công việc',
                                            },
                                        ]}
                                    >
                                        <Select
                                            options={selectboxResource.experiences.items.map(
                                                (exItem) => ({
                                                    value: exItem.experienceId,
                                                    label: exItem.name,
                                                })
                                            )}
                                            placeholder={'Chọn yêu cầu kinh nghiệm'}
                                            size={'large'}
                                        />
                                    </Form.Item> */}

                  {/* <Form.Item
                                        label={'Địa điểm'}
                                        name={'locationId'}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng chọn địa điểm công việc',
                                            },
                                        ]}
                                    >
                                        <Select
                                            options={selectboxResource.locations.items.map(
                                                (locItem) => ({
                                                    value: locItem.locationId,
                                                    label: locItem.name,
                                                })
                                            )}
                                            placeholder={'Chọn địa điểm'}
                                        />
                                    </Form.Item> */}
                </Col>

                <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                  <Form.Item
                    label={"Lĩnh vực"}
                    name={"categoryProjectIds"}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn lĩnh vực công việc",
                      },
                    ]}
                  >
                    <Select
                      mode={"multiple"}
                      // options={selectboxResource.categories.map(
                      //     (catItem) => ({
                      //         value: catItem.categoryId,
                      //         label: catItem.name,
                      //     })
                      // )}
                      options={props.categories?.map((catItem) => ({
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
                    label={"Thời gian thực hiện công việc"}
                    name={"timeId"}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn thời gian thực hiện công việc",
                      },
                    ]}
                  >
                    <Select
                      options={selectboxResource.times.items.map(
                        (timeItem) => ({
                          value: timeItem.timeId,
                          label: timeItem.name,
                        })
                      )}
                      size={"large"}
                      placeholder={"Chọn mốc thời gian"}
                    />
                  </Form.Item>

                  <Form.Item
                    label={"Thời hạn xác nhận công việc"}
                    name={"endDate"}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn thời hạn ứng tuyển",
                      },
                    ]}
                  >
                    <AppDatePicker
                      format={"DD/MM/YYYY"}
                      placeholder={"Chọn thời hạn ứng tuyển"}
                      className={"full-width"}
                      disabledDate={(d) => d.isBefore(moment(), "date")}
                      size={"large"}
                      style={{ paddingTop: "13px", paddingBottom: "12px" }}
                    />
                  </Form.Item>

                  {salaryType === Constants.JOB.SALARY_TYPE.RANGE && (
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                        <Form.Item
                          label={"Từ"}
                          name={"priceMin"}
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập số tiền thấp nhất",
                            },
                          ]}
                          labelCol={{
                            lg: 6,
                          }}
                        >
                          <AppInputNumber
                            size={"large"}
                            placeholder={"Nhập số tiền thấp nhất"}
                          />
                        </Form.Item>
                      </Col>

                      <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                        <Form.Item
                          label={"Đến"}
                          name={"priceMax"}
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập số tiền cao nhất",
                            },
                          ]}
                          labelCol={{
                            lg: 6,
                          }}
                        >
                          <AppInputNumber
                            size={"large"}
                            placeholder={"Nhập số tiền cao nhất"}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  )}

                  {salaryType === Constants.JOB.SALARY_TYPE.FIXED && (
                    <Form.Item
                      label={"Số tiền"}
                      name={"price"}
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập số tiền cho công việc",
                        },
                      ]}
                    >
                      <AppInputNumber
                        placeholder={"Nhập số tiền"}
                        size={"large"}
                      />
                    </Form.Item>
                  )}

                
                </Col>
              </Row>
            </div>
          </div>

          <div className={"formGroupContainer"}>
            <div className={"formGroupTitleContainer"}>
              <h3 className={"formGroupTitle"}>Nội dung công việc</h3>
            </div>

            <div className={"formGroupContentContainer"}>
              <div className={"jobEditorContainer"}>
                <Form.Item
                  name={"description"}
                  label={"Mô tả công việc"}
                  required
                  rules={[
                    () => ({
                      validator(_, value) {
                        if (value && value !== "<p>&nbsp;</p>")
                          return Promise.resolve();

                        return Promise.reject(
                          new Error("Vui lòng nhập mô tả cho công việc")
                        );
                      },
                    }),
                  ]}
                  valuePropName={"data"}
                >
                  <TextEditor
                    onChange={(value: string) =>
                      form.setFieldValue("description", value)
                    }
                  />
                </Form.Item>

                <Form.Item name="isPublic" valuePropName="checked" label={null}>
                  <Checkbox>Đăng công việc trên nền tảng</Checkbox>
                </Form.Item>
              </div>
            </div>
          </div>
        </Form>
        <Row justify={"center"}>
          {withThemeRevert(
            <Button
              // onClick={form.submit}
              onClick={() => {
                actionValue.current = Constants.JOB.STATUS.YEU_CAU_DANG_TUYEN;
                form.submit();
              }}
              loading={submitMutation.isLoading}
              disabled={submitMutation.isLoading}
              type={"primary"}
              style={{ width: "200px" }}
            >
              {submitMutation.isLoading ? "Đang thực hiện, xin đợi..." : "Gửi"}
            </Button>
          )}
        </Row>
      </Modal>
    );
  }
);

PartnerConnectModalV2.displayName = "PartnerConnectModal";

export default PartnerConnectModalV2;
