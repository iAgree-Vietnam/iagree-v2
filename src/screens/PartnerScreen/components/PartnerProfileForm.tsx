"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  Col,
  Form,
  Row,
  Typography,
  Select,
  Input,
  Button,
  Space,
  Image,
  message,
} from "antd";

import { useMutationPartner } from "../hooks/useMutationPartner";
import { PartnerExperience } from "./PartnerExperience";
import {} from "./PartnerFeaturedProjectsEdit";
import type {
  PartnerDetailResource,
  PartnerUpdateParams,
} from "@/src/data/partner/models/partner.types";
import { useAccountContext } from "@/src/contexts/AccountContext";
import { PartnerEducationForm } from "./PartnerEducationForm";
import { PartnerFeaturedProjectsEditV2 } from "./PartnerFeaturedProjectsEditV2";
import Images from "@/src/constants/Images";
import { ImageCropper } from "@/src/components/modals/CropImageModal";
import Constants from "@/src/constants/Constants";
import { flatMap, includes, isEmpty, map } from "lodash";
import { usePartnerSelectBox } from "../hooks/usePartnerSelectBox";
import PartnerRegisterUtils from "../PartnerRegisterScreen/utils/PartnerRegisterUtils";

const { Title, Text } = Typography;
const { TextArea } = Input;

export interface PartnerProfileFormProps {
  partnerDetails: PartnerDetailResource;
}

export function PartnerProfileForm({
  partnerDetails,
}: PartnerProfileFormProps) {
  const { auth: userInfo } = useAccountContext();
  const [form] = Form.useForm();
  // const [projects, setProjects] = useState<FeaturedProjectUploadItem[]>([]);
  const { setFieldValue } = form;
  const avatarUrl = Form.useWatch("avatar", form);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { data } = usePartnerSelectBox();
  const categoryList = flatMap(map(data?.categories, "childrens"));
  // Image cropper states
  const servicesList = flatMap(map(categoryList, "childrens"));

  const [showCropper, setShowCropper] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState<string>("");

  // Handle avatar file selection and show cropper
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];

      // Validate file type
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        message.error("Bạn chỉ có thể tải lên file JPG/PNG!");
        return;
      }

      // Validate file size
      const maxFileSize = Constants.MAX_FILE_SIZE;
      if (file.size > maxFileSize) {
        message.error(
          `Tệp ${file.name} vượt quá ${maxFileSize / 1024 / 1024}MB!`
        );
        return false;
      }

      // Show cropper with selected image
      const imageUrl = URL.createObjectURL(file);
      setTempImageUrl(imageUrl);
      setShowCropper(true);
    }
  };

  // Handle crop confirm
  const handleCropConfirm = (croppedImageFile: File) => {
    setAvatarFile(croppedImageFile);
    setFieldValue("avatar", URL.createObjectURL(croppedImageFile));
    setShowCropper(false);

    // Clean up temp URL
    if (tempImageUrl) {
      URL.revokeObjectURL(tempImageUrl);
      setTempImageUrl("");
    }
  };

  // Handle crop cancel
  const handleCropCancel = () => {
    setShowCropper(false);

    // Clean up temp URL
    if (tempImageUrl) {
      URL.revokeObjectURL(tempImageUrl);
      setTempImageUrl("");
    }
  };

  // Handle remove avatar
  const handleRemoveAvatar = async () => {
    const defaultAccountBlob = await fetch(Images.ACCOUNT_DEFAULT).then((res) =>
      res.blob()
    );
    setFieldValue("avatar", URL.createObjectURL(defaultAccountBlob));
    //@ts-ignore
    setAvatarFile(defaultAccountBlob);
  };

  const {
    partner: {
      partnerId,
      user,
      categories,
      position,
      work_experience,
      tags,
      languages,
      educations,
      work_histories,
      typical_projects,
      description,
      skills,
    },
    locations: listLocation,
  } = partnerDetails;
  const listSkill = useMemo(() => {
    return partnerDetails?.partner?.skills;
  }, [data?.skills]);

  const category_services = partnerDetails?.category_services;

  const services = partnerDetails?.partner?.services;

  const selectedCategoryIds = Form.useWatch("categoryProjectIds", form);
  const selectedCategoryServiceIds = Form.useWatch("categoryServiceIds", form);
  // console.log("data?.skills", data?.skills);

  const filteredSkills = useMemo(() => {
    if (isEmpty(selectedCategoryIds)) return data?.skills;

    return data?.skills?.filter((it) =>
      includes(selectedCategoryIds, it.categoryProjectId)
    );
  }, [
    selectedCategoryIds,
    listSkill,
    data?.categories,
    data?.skills,
    categoryList,
  ]);

  // Find all categoryServices for selected categories
  const filteredCategoryServices = useMemo(() => {
    if (isEmpty(selectedCategoryIds)) return categoryList;

    return data?.categories
      .filter((it) => includes(selectedCategoryIds, it.categoryId))
      .flatMap((category) => category.childrens || []);
  }, [selectedCategoryIds, data?.categories, categoryList]);

  // Watch the selected categoryServiceIds

  // Find all services for selected categoryServices
  const filteredServices = useMemo(() => {
    if (isEmpty(selectedCategoryServiceIds)) return servicesList;

    return (
      flatMap(
        filteredCategoryServices?.filter((it) =>
          includes(selectedCategoryServiceIds, it?.cateServiceId)
        ),
        "childrens"
      ) || []
    );
  }, [selectedCategoryServiceIds, categoryList, filteredCategoryServices]);
  const { mutate, isLoading: isSubmitting } = useMutationPartner();

  // const handleProjectsChange = (updatedProjects: FeaturedProjectUploadItem[]) => {
  //   setProjects(updatedProjects);
  // };

  // Add this function to handle form data preparation

  const processedEducations = useMemo(() => {
    return (
      educations?.map((education) => ({
        ...education,
        // Set type based on whether degree exists
        type: education.degree !== null ? "education" : "certificate",
      })) || []
    );
  }, [educations]);

  const maxLength = Constants.TEXT_MAX_LENGTH;

  const selfIntroduction = Form.useWatch("description", form);

  const currentLength = selfIntroduction ? selfIntroduction.length : 0;

  const ALL_COUNTRY_LOCATION_NAME = "Toàn quốc";
  const selectedLocationIds: number[] =
    Form.useWatch("locationIds", form) || [];
  const allLocations = useMemo(
    () =>
      listLocation?.items?.map((locItem) => ({
        value: locItem.locationId,
        label: locItem.name,
      })) || [],
    [listLocation]
  );
  const allCountryLocationId = useMemo(() => {
    const allCountry = allLocations.find(
      (loc) => loc.label === ALL_COUNTRY_LOCATION_NAME
    );
    return allCountry?.value;
  }, [allLocations]);

  const isAllCountrySelected = selectedLocationIds.includes(
    allCountryLocationId as number
  );

  const handleLocationChange = (selectedValues: number[]) => {
    if (
      allCountryLocationId !== undefined &&
      selectedValues.includes(allCountryLocationId)
    ) {
      if (selectedValues.length > 1) {
        return [allCountryLocationId];
      }
    }
    return selectedValues;
  };

  const handleClearLocations = () => {
    form.setFieldValue("locationIds", []);
  };

  const handleClearSkills = () => {
    form.setFieldValue("skillIds", []);
  };

  const handleClearCategories = () => {
    form.setFieldValue("categoryProjectIds", []);
  };

  const handleClearCategoryServices = () => {
    form.setFieldValue("categoryServiceIds", []);
  };

  const handleClearServices = () => {
    form.setFieldValue("serviceIds", []);
  };

  const handleClearLanguages = () => {
    form.setFieldValue("languageIds", []);
  };

  return (
    <>
      <Form
        name={"partnerProfileForm"}
        form={form}
        initialValues={{
          avatar: user?.avatarUrl || "",
          locationIds: partnerDetails?.locations?.items?.map((loc) => loc.id),
          experienceId: work_experience?.experienceId,
          tagIds: map(tags, (tag) => tag?.tagId),
          languageIds: map(languages, (language) => language.languageId),
          typicalProjects: typical_projects,
          partnerEducations: processedEducations,
          workHistories: work_histories,
          position: position,
          description: description,
          categoryProjectIds: map(categories, (cat) => cat.categoryId),
          skillIds: map(skills, (skill) => skill.skillId),
          categoryServiceIds: category_services?.map((cat) => cat.id),
          serviceIds: map(services, (service) => service.serviceId),
        }}
        onFinish={(values) => {
          const formData = PartnerRegisterUtils.prepareFormDataForSubmission(
            values,
            avatarFile
          );
          // console.log("formData.", formData);

          mutate({
            partnerId: partnerId || -1,
            formData: formData as unknown as PartnerUpdateParams,
          });

          setAvatarFile(null);
        }}
        scrollToFirstError={{
          behavior: "smooth",
          block: "center",
          inline: "center",
        }}
        layout={"vertical"}
        className={"jobFormSectionContainer"}
      >
        <div className={"jobFormTitleContainer"}>
          <Typography.Title className={"jobFormTitle"} level={3}>
            Chỉnh sửa hồ sơ Đối tác
          </Typography.Title>
        </div>

        <div
          className={"partnerDetailPartContainer partnerGeneralPartContainer"}
        >
          <div className="partnerDetailPartTitleContainer">
            <Typography.Title
              className={"partnerDetailPartTitle nm-typo"}
              level={3}
            >
              Thông tin chung
            </Typography.Title>

            <Form.Item name={"avatar"} style={{ marginTop: "15px" }}>
              <Space className={"upload-wrapper"} size={"large"}>
                <Image
                  className="avatar"
                  preview={false}
                  src={avatarUrl || "/placeholder.svg"}
                  alt="Avatar"
                  onLoad={() => {
                    URL.revokeObjectURL(avatarUrl);
                  }}
                  fallback={Images.ACCOUNT_DEFAULT}
                />
                <Space size={10}>
                  <Button size={"small"}>
                    <label htmlFor="input-avatar">Tải ảnh đại diện</label>
                  </Button>
                  <Button
                    type={"primary"}
                    size={"small"}
                    onClick={handleRemoveAvatar}
                  >
                    Xóa
                  </Button>
                </Space>
              </Space>
            </Form.Item>

            <Form.Item style={{ display: "none" }}>
              <div>
                <input
                  id="input-avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFileChange}
                />
              </div>
            </Form.Item>
          </div>

          <div className={"partnerDetailPartContentContainer"}>
            <Row gutter={[20, 0]}>
              <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                <Form.Item label={"Họ và tên"} required>
                  <Input value={userInfo?.fullName} disabled size={"large"} />
                </Form.Item>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Title level={5} style={{ marginBottom: 5 }}>
                    Lĩnh vực <span style={{ color: "red" }}>*</span>
                  </Title>
                  {selectedCategoryIds && selectedCategoryIds.length > 0 && (
                    <a
                      onClick={handleClearCategories}
                      style={{ color: "red", cursor: "pointer" }}
                    >
                      Bỏ chọn tất cả
                    </a>
                  )}
                </div>
                <Form.Item
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
                    options={data?.categories?.map((catItem) => {
                      return {
                        value: catItem.categoryId,
                        label: catItem.name,
                      };
                    })}
                    placeholder={"Chọn lĩnh vực"}
                    size={"large"}
                    filterOption={(inputValue, option) => {
                      return (option?.label as string)
                        ?.toLowerCase()
                        ?.includes(inputValue.toLowerCase());
                    }}
                    onChange={(nextCategoryIds: number[]) => {
                      // 1) cập nhật lĩnh vực mới vào form
                      form.setFieldValue("categoryProjectIds", nextCategoryIds);

                      // 2) lấy current (không fallback initial)
                      const currentSkillIds: number[] =
                        form.getFieldValue("skillIds") || [];
                      const currentCateServiceIds: number[] =
                        form.getFieldValue("categoryServiceIds") || [];
                      const currentServiceIds: number[] =
                        form.getFieldValue("serviceIds") || [];

                      // 3) valid skills theo nextCategoryIds
                      const validSkillIds = new Set<number>(
                        (data?.skills || [])
                          .filter((s: any) =>
                            nextCategoryIds.includes(s.categoryProjectId)
                          )
                          .map((s: any) => s.skillId)
                      );

                      // 4) valid category services theo nextCategoryIds
                      const validCateServices = (data?.categories || [])
                        .filter((c: any) =>
                          nextCategoryIds.includes(c.categoryId)
                        )
                        .flatMap((c: any) => c.childrens || []);

                      const validCateServiceIds = new Set<number>(
                        validCateServices.map((cs: any) => cs.cateServiceId)
                      );

                      // 5) categoryServiceIds sau khi lọc
                      const nextCateServiceIds = currentCateServiceIds.filter(
                        (id) => validCateServiceIds.has(id)
                      );

                      // 6) valid services dựa trên cate services đã chọn (sau lọc)
                      const validServices = validCateServices
                        .filter((cs: any) =>
                          nextCateServiceIds.includes(cs.cateServiceId)
                        )
                        .flatMap((cs: any) => cs.childrens || []);

                      const validServiceIds = new Set<number>(
                        validServices.map((sv: any) => sv.serviceId)
                      );

                      // 7) lọc skill/service
                      const nextSkillIds = currentSkillIds.filter((id) =>
                        validSkillIds.has(id)
                      );
                      const nextServiceIds = currentServiceIds.filter((id) =>
                        validServiceIds.has(id)
                      );

                      form.setFieldsValue({
                        skillIds: nextSkillIds,
                        categoryServiceIds: nextCateServiceIds,
                        serviceIds: nextServiceIds,
                      });
                    }}
                  />
                </Form.Item>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Title level={5} style={{ marginBottom: 5 }}>
                    Danh mục dịch vụ <span style={{ color: "red" }}>*</span>
                  </Title>
                  {selectedCategoryServiceIds &&
                    selectedCategoryServiceIds.length > 0 && (
                      <a
                        onClick={handleClearCategoryServices}
                        style={{ color: "red", cursor: "pointer" }}
                      >
                        Bỏ chọn tất cả
                      </a>
                    )}
                </div>
                <Form.Item
                  name={"categoryServiceIds"}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn danh mục dịch vụ",
                    },
                  ]}
                >
                  <Select
                    mode={"multiple"}
                    options={filteredCategoryServices?.map((catItem) => ({
                      value: catItem?.cateServiceId,
                      label: catItem?.name,
                    }))} // chưa
                    placeholder={"Chọn danh mục dịch vụ"}
                    size={"large"}
                    filterOption={(inputValue, option) =>
                      (option?.label as string)
                        .toLowerCase()
                        .includes(inputValue.toLowerCase())
                    }
                    onChange={(nextCategoryServiceIds: number[]) => {
                      // 1️⃣ set value mới
                      form.setFieldValue(
                        "categoryServiceIds",
                        nextCategoryServiceIds
                      );

                      // 2️⃣ lấy serviceIds hiện tại
                      const currentServiceIds: number[] =
                        form.getFieldValue("serviceIds") || [];

                      // 3️⃣ từ categoryServiceIds → tìm service hợp lệ
                      const validServiceIds = new Set<number>(
                        flatMap(
                          filteredCategoryServices?.filter((cs) =>
                            cs?.cateServiceId
                              ? nextCategoryServiceIds.includes(
                                  cs?.cateServiceId
                                )
                              : false
                          ) || [],
                          "childrens"
                        ).map((sv: any) => sv.serviceId)
                      );

                      // 4️⃣ lọc serviceIds
                      const nextServiceIds = currentServiceIds.filter((id) =>
                        validServiceIds.has(id)
                      );

                      // 5️⃣ update nếu có thay đổi
                      if (
                        JSON.stringify(nextServiceIds) !==
                        JSON.stringify(currentServiceIds)
                      ) {
                        form.setFieldValue("serviceIds", nextServiceIds);
                      }
                    }}
                  />
                </Form.Item>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Title level={5} style={{ marginBottom: 5 }}>
                    Ngôn ngữ <span style={{ color: "red" }}>*</span>
                  </Title>
                  {form.getFieldValue("languageIds") &&
                    form.getFieldValue("languageIds").length > 0 && (
                      <a
                        onClick={handleClearLanguages}
                        style={{ color: "red", cursor: "pointer" }}
                      >
                        Bỏ chọn tất cả
                      </a>
                    )}
                </div>
                <Form.Item
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
                    options={data?.languages?.items.map(
                      (languageItem: any) => ({
                        value: languageItem.languageId,
                        label: languageItem.name,
                      })
                    )}
                    placeholder={"Chọn ngôn ngữ"}
                    size={"large"}
                    filterOption={(inputValue, option) =>
                      (option?.label as string)
                        .toLowerCase()
                        ?.includes(inputValue.toLowerCase())
                    }
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                <Form.Item
                  label={"Ngành nghề"}
                  name={"position"}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập ngành nghề của bạn.",
                    },
                    {
                      max: 120,
                      message: "Chức danh không được vượt quá 120 ký tự.",
                    },
                  ]}
                >
                  <Input
                    placeholder={
                      "Ví dụ: Luật sư, Thiết kế đồ họa, Kỹ sư phần mềm..."
                    }
                    size={"large"}
                  />
                </Form.Item>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Title level={5} style={{ marginBottom: 5 }}>
                    Kỹ năng chính <span style={{ color: "red" }}>*</span>
                  </Title>
                  {form.getFieldValue("skillIds") &&
                    form.getFieldValue("skillIds").length > 0 && (
                      <a
                        onClick={handleClearSkills}
                        style={{ color: "red", cursor: "pointer" }}
                      >
                        Bỏ chọn tất cả
                      </a>
                    )}
                </div>
                <Form.Item
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
                    options={filteredSkills?.map((skillItem) => {
                      return {
                        value: skillItem.skillId,
                        label: skillItem.name,
                      };
                    })}
                    placeholder={"Chọn kỹ năng chính"}
                    size={"large"}
                    showSearch
                    filterOption={(inputValue, option) =>
                      (option?.label as string)
                        .toLowerCase()
                        .includes(inputValue.toLowerCase())
                    }
                  />
                </Form.Item>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Title level={5} style={{ marginBottom: 5 }}>
                    Dịch vụ <span style={{ color: "red" }}>*</span>
                  </Title>
                  {form.getFieldValue("serviceIds") &&
                    form.getFieldValue("serviceIds").length > 0 && (
                      <a
                        onClick={handleClearServices}
                        style={{ color: "red", cursor: "pointer" }}
                      >
                        Bỏ chọn tất cả
                      </a>
                    )}
                </div>
                <Form.Item
                  name={"serviceIds"}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn dịch vụ",
                    },
                  ]}
                >
                  <Select
                    mode={"multiple"}
                    options={filteredServices?.map((serviceItem) => {
                      return {
                        value: serviceItem.serviceId,
                        label: serviceItem.name,
                      };
                    })}
                    placeholder={"Chọn dịch vụ"}
                    size={"large"}
                    filterOption={(inputValue, option) =>
                      (option?.label as string)
                        .toLowerCase()
                        .includes(inputValue.toLowerCase())
                    }
                  />
                </Form.Item>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Title level={5} style={{ marginBottom: 5 }}>
                    Địa điểm{" "}
                    <span
                      style={{
                        display: "inline - block",
                        marginInlineEnd: "4px",
                        color: "#e14141",
                        fontSize: "14px",
                        fontFamily: "SimSun, sans-serif",
                        lineHeight: 1,
                      }}
                    >
                      *
                    </span>
                  </Title>
                  {selectedLocationIds.length > 0 && (
                    <a
                      onClick={handleClearLocations}
                      style={{ color: "red", cursor: "pointer" }}
                    >
                      Bỏ chọn tất cả
                    </a>
                  )}
                </div>
                <Form.Item
                  name={"locationIds"}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn địa điểm",
                    },
                  ]}
                  getValueFromEvent={handleLocationChange}
                >
                  <Select
                    mode={"multiple"}
                    options={data?.locations?.items?.map((locItem) => ({
                      value: locItem.locationId,
                      label: locItem.name,
                    }))}
                    disabled={isAllCountrySelected}
                    placeholder={"Chọn địa điểm"}
                    size={"large"}
                    filterOption={(inputValue, option) =>
                      (option?.label as string)
                        .toLowerCase()
                        .includes(inputValue.toLowerCase())
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </div>

        {/* Section: Giới thiệu */}
        <div className={"partnerDetailPartContainer"}>
          <div className="partnerDetailPartTitleContainer">
            <Typography.Title
              className={"partnerDetailPartTitle nm-typo"}
              level={3}
            >
              Giới thiệu
            </Typography.Title>
          </div>

          <div className={"partnerDetailPartContentContainer"}>
            <div className={"partnerDetailSpecialContentContainer"}>
              <Form.Item
                label={"Mô tả bản thân"}
                name={"description"}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mô tả bản thân",
                  },
                  {
                    max: maxLength,
                    message: `Mô tả không được vượt quá ${maxLength} ký tự.`,
                  },
                ]}
              >
                <TextArea
                  placeholder="Ví dụ: Tôi là chuyên gia với 10 năm kinh nghiệm trong lĩnh vực thiết kế đồ họa. Tôi có khả năng biến ý tưởng của bạn thành những sản phẩm trực quan ấn tượng và hiệu quả."
                  maxLength={maxLength}
                  autoSize={{ minRows: 4, maxRows: 8 }}
                />
              </Form.Item>

              <div style={{ textAlign: "right", marginTop: "-12px" }}>
                <Text
                  type="secondary"
                  style={{
                    color: currentLength > maxLength ? "red" : undefined,
                  }}
                >
                  ({`${currentLength} / ${maxLength}`})
                </Text>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Kinh nghiệm làm việc */}
        <div className={"partnerDetailPartContainer"}>
          <div className="partnerDetailPartTitleContainer">
            <Typography.Title
              className={"partnerDetailPartTitle nm-typo"}
              level={3}
            >
              Kinh nghiệm làm việc
            </Typography.Title>
          </div>

          <div className={"partnerDetailPartContentContainer"}>
            <div className={"partnerDetailSpecialContentContainer"}>
              <PartnerExperience />
            </div>
          </div>
        </div>

        {/* Section: Học vấn - chứng chỉ */}
        <div className={"partnerDetailPartContainer"}>
          <div className="partnerDetailPartTitleContainer">
            <Typography.Title
              className={"partnerDetailPartTitle nm-typo"}
              level={3}
            >
              Học vấn - Chứng chỉ
            </Typography.Title>
          </div>

          <div className={"partnerDetailPartContentContainer"}>
            <div className={"partnerDetailSpecialContentContainer"}>
              <PartnerEducationForm />
            </div>
          </div>
        </div>

        {/* Section: Các dự án tiêu biểu */}
        <div className={"partnerDetailPartContainer"}>
          <div className="partnerDetailPartTitleContainer">
            <Typography.Title
              className={"partnerDetailPartTitle nm-typo"}
              level={3}
            >
              Các dự án tiêu biểu
            </Typography.Title>
          </div>

          <div className={"partnerDetailPartContentContainer"}>
            <div className={"partnerDetailSpecialContentContainer"}>
              {/* <PartnerFeaturedProjectsEdit
              projects={typicalProjects}
              onProjectsChange={handleProjectsChange}
            /> */}
              <PartnerFeaturedProjectsEditV2 />
            </div>
          </div>
        </div>

        {/* Section: Các gói dịch vụ cung cấp */}
        {/* <div className={"partnerDetailPartContainer"}>
        <div className="partnerDetailPartTitleContainer">
          <Typography.Title
            className={"partnerDetailPartTitle nm-typo"}
            level={3}
          >
            Các gói dịch vụ cung cấp
          </Typography.Title>
        </div>

        <div className={"partnerDetailPartContentContainer"}>
          <div className={"partnerDetailSpecialContentContainer"}>
            <PartnerServicePackagesEdit />
          </div>
        </div>
      </div> */}

        {/* Submit Button */}
        <div className={"partnerDetailPartContainer"}>
          <Button
            size={"large"}
            block
            type={"primary"}
            onClick={form.submit}
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            {isSubmitting ? "Đang lưu..." : "Lưu hồ sơ"}
          </Button>
        </div>
      </Form>

      {/* Image Cropper Modal */}
      <ImageCropper
        visible={showCropper}
        imageUrl={tempImageUrl}
        onCancel={handleCropCancel}
        onConfirm={handleCropConfirm}
      />
    </>
  );
}
