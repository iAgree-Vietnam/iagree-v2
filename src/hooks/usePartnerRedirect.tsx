import { useRouter } from "next/router";
import { useCallback } from "react";
import Constants from "../constants/Constants";
import Cookies from "js-cookie";
import { PartnerRouteUtils } from "../data/partner/utils/PartnerRouteUtils";
import { isArray } from "lodash";
import { FormInstance, UploadFile } from "antd";
import { ProjectItem } from "../screens/PartnerRegisterFirstScreen/pages/step_5/Step5Page";
import { PARTNER_REGISTER_FORM } from "../screens/PartnerRegisterFirstScreen/constants/PartnerRegisterConstants";
export const buildFormData = (form: FormInstance, userInfo: any): FormData => {
  const formData = new FormData();

  // --- Lấy dữ liệu của TẤT CẢ các bước ---
  const step1V2Data = form.getFieldValue(
    PARTNER_REGISTER_FORM.FIELD_NAME.STEP1_V2_DATA
  );
  const step2V2Data = form.getFieldValue(
    PARTNER_REGISTER_FORM.FIELD_NAME.STEP2_V2_DATA
  );
  const step3V2Data = form.getFieldValue(
    PARTNER_REGISTER_FORM.FIELD_NAME.STEP3_V2_DATA
  );
  const step4Data = form.getFieldValue(
    PARTNER_REGISTER_FORM.FIELD_NAME.STEP4_DATA
  );
  const step5Data = form.getFieldValue(
    PARTNER_REGISTER_FORM.FIELD_NAME.STEP5_DATA
  );
  const step6Data = form.getFieldValue(
    PARTNER_REGISTER_FORM.FIELD_NAME.STEP6_DATA
  );
  const step7Data = form.getFieldValue(
    PARTNER_REGISTER_FORM.FIELD_NAME.STEP7_DATA
  );
  const step8Data = form.getFieldValue(
    PARTNER_REGISTER_FORM.FIELD_NAME.STEP8_DATA
  );
  const step9PersonalData = form.getFieldValue(
    PARTNER_REGISTER_FORM.FIELD_NAME.STEP9_PERSONAL_DATA
  );
  const step9CompanyData = form.getFieldValue(
    PARTNER_REGISTER_FORM.FIELD_NAME.STEP9_COMPANY_DATA
  );
  const step10Data = form.getFieldValue(
    PARTNER_REGISTER_FORM.FIELD_NAME.STEP10_DATA
  );
  const step11Data = form.getFieldValue(
    PARTNER_REGISTER_FORM.FIELD_NAME.STEP11_DATA
  );

  // --- B1 (V2): Thông tin Profile ---
  if (step1V2Data) {
    if (step1V2Data?.professionalRole) {
      formData.append("position", step1V2Data.professionalRole);
    }
    if (step1V2Data?.displayName) {
      formData.append("username", step1V2Data.displayName);
    }
    const avatarFile = step1V2Data?.avatar?.[0];
    if (avatarFile instanceof File) {
      formData.append("avatar", avatarFile);
    }
  }

  // --- B2 (V2): Lĩnh vực, Danh mục & Dịch vụ ---
  if (step2V2Data) {
    Object.keys(step2V2Data).forEach((catId) => {
      formData.append("category_project_ids[]", catId);
      step2V2Data[catId]?.selectedServiceCategories?.forEach((sc: any) => {
        formData.append("category_service_ids[]", sc.id.toString());
        if (sc.services && sc.services.length > 0) {
          sc.services.forEach((serviceId: number) => {
            formData.append("service_ids[]", serviceId.toString());
          });
        }
      });
    });
  }

  // --- B3 (V2): Kỹ năng ---
  if (
    step3V2Data?.selectedSkillIds &&
    step3V2Data.selectedSkillIds.length > 0
  ) {
    step3V2Data.selectedSkillIds.forEach((skillId: number) => {
      formData.append(`main_skills[]`, skillId.toString());
    });
  }

  // --- B4: Kinh nghiệm làm việc ---
  if (step4Data?.workHistories) {
    step4Data.workHistories.forEach((exp: any, index: number) => {
      formData.append(`workHistories[${index}][order]`, "1");

      Object.keys(exp).forEach((key) => {
        if (exp[key] !== undefined && exp[key] !== null) {
          formData.append(`workHistories[${index}][${key}]`, exp[key]);
        }
      });
    });
  }

  // --- B5: Dự án tiêu biểu ---
  if (step5Data?.featuredProjects && isArray(step5Data.featuredProjects)) {
    step5Data.featuredProjects.forEach(
      (project: ProjectItem, index: number) => {
        // 1. Append các trường dữ liệu text
        formData.append(`typicalProjects[${index}][name]`, project.name);
        formData.append(
          `typicalProjects[${index}][description]`,
          project.description
        );
        formData.append(
          `typicalProjects[${index}][start_date]`,
          project.start_date
        );
        formData.append(
          `typicalProjects[${index}][end_date]`,
          project.end_date
        );
        formData.append(`typicalProjects[${index}][role]`, project.role);

        // Append các trường dữ liệu tùy chọn
        if (project.achievements) {
          formData.append(
            `typicalProjects[${index}][achievements]`,
            project.achievements
          );
        }
        if (project.projectUrl) {
          formData.append(
            `typicalProjects[${index}][projectUrl]`,
            project.projectUrl
          );
        }

        // 2. Lấy và append hình bìa (File)
        if (project.image instanceof File) {
          formData.append(`typicalProjects[${index}][image]`, project.image);
        }

        // 3. Lấy và append các tệp đính kèm (Files)
        if (isArray(project.files) && project.files.length > 0) {
          project.files.forEach((file: File) => {
            if (file instanceof File) {
              formData.append(`typicalProjects[${index}][files][]`, file);
            }
          });
        }
      }
    );
  }

  // --- B6: Học vấn & Chứng chỉ ---
  if (step6Data?.partnerEducations) {
    step6Data.partnerEducations.forEach((item: any, index: number) => {
      formData.append(`educations[${index}][type]`, item.type);
      formData.append(`educations[${index}][name]`, item.name);

      if (item.type === "education") {
        if (item.degree)
          formData.append(`educations[${index}][degree]`, item.degree);
        if (item.majors)
          formData.append(`educations[${index}][majors]`, item.majors);
        formData.append(`educations[${index}][start_date]`, item.start_date);
        formData.append(`educations[${index}][end_date]`, item.end_date);
      } else {
        if (item.grade)
          formData.append(`educations[${index}][grade]`, item.grade);
        formData.append(`educations[${index}][start_date]`, item.start_date);
        if (item.end_date)
          formData.append(`educations[${index}][end_date]`, item.end_date);
      }
      if (item.description)
        formData.append(`educations[${index}][description]`, item.description);
    });
  }

  // --- B7: Giới thiệu bản thân ---
  if (step7Data?.selfIntroduction) {
    formData.append(`description`, step7Data.selfIntroduction);
  }

  // --- B8: Ngôn ngữ & Địa điểm ---
  if (step8Data?.languageIds && step8Data.languageIds.length > 0) {
    step8Data.languageIds.forEach((langId: number) => {
      formData.append(`languages[]`, langId.toString());
    });
  }
  if (step8Data?.locationIds && step8Data.locationIds.length > 0) {
    step8Data.locationIds.forEach((locationId: number) => {
      formData.append(`location_ids[]`, locationId.toString());
    });
  }

  // --- B9.1: Xác minh cá nhân (và file) ---
  if (step9PersonalData) {
    const shouldAppend = (formValue: any, userInfoValue: any) =>
      formValue && formValue !== userInfoValue;

    if (shouldAppend(step9PersonalData?.cardNumber, userInfo?.cardNumber)) {
      formData.append("card_number", step9PersonalData?.cardNumber);
    }
    if (shouldAppend(step9PersonalData.taxCode, userInfo?.taxCode)) {
      formData.append("tax_code", step9PersonalData.taxCode);
    }

    if (step9PersonalData.frontCard instanceof File) {
      formData.append("front_card", step9PersonalData.frontCard);
    }
    if (step9PersonalData.backCard instanceof File) {
      formData.append("back_card", step9PersonalData.backCard);
    }
    if (step9PersonalData.portraitCard)
      formData.append("portrait_card", step9PersonalData.portraitCard);
  }

  // --- B9.2: Xác minh công ty (và file) ---
  if (step9CompanyData) {
    const getFileInstance = (fieldData: UploadFile[] | undefined | null) => {
      if (isArray(fieldData) && fieldData.length > 0) {
        const fileItem = fieldData[0];
        if (fileItem.originFileObj instanceof File) {
          return fileItem.originFileObj;
        }
      }
      return null;
    };

    if (
      step9CompanyData?.taxCode &&
      step9CompanyData?.taxCode !== userInfo?.taxCode
    ) {
      formData.append("tax_code", step9CompanyData?.taxCode);
    }
    if (
      step9CompanyData?.nameRep &&
      step9CompanyData?.nameRep !== userInfo?.nameRep
    ) {
      formData.append("name_rep", step9CompanyData?.nameRep);
    }
    if (
      step9CompanyData?.cardNumber &&
      step9CompanyData?.cardNumber !== userInfo?.cardNumber
    ) {
      formData.append("card_number", step9CompanyData?.cardNumber);
    }

    const businessLicenseFile = getFileInstance(
      step9CompanyData?.businessLicense
    );
    const frontCardFile =
      step9CompanyData?.frontCard &&
      step9CompanyData?.frontCard instanceof File;
    const backCardFile =
      step9CompanyData?.backCard && step9CompanyData?.backCard instanceof File;
    const portraitCardFile =
      step9CompanyData?.portraitCard &&
      step9CompanyData?.portraitCard instanceof File;

    if (businessLicenseFile) {
      formData.append("business_license", businessLicenseFile);
    }
    if (frontCardFile) {
      formData.append("front_card", step9CompanyData?.frontCard);
    }
    if (backCardFile) {
      formData.append("back_card", step9CompanyData?.backCard);
    }
    if (portraitCardFile) {
      formData.append("portrait_card", step9CompanyData?.portraitCard);
    }
  }

  // --- B10: Thông tin thanh toán ---
  if (step10Data) {
    if (step10Data.bankAccountName) {
      formData.append(
        "bank_account_name",
        step10Data.bankAccountName.toString()
      );
    }
    if (step10Data.bankId) {
      formData.append("bank_id", step10Data.bankId.toString());
    }
    if (step10Data.accountNumber) {
      formData.append("account_number", step10Data.accountNumber);
    }
  }

  // --- B11: Mã giới thiệu ---
  if (step11Data?.referral_source_id) {
    formData.append("referral_source_id", step11Data.referral_source_id);
  }
  if (step11Data?.referral_source_description) {
    formData.append(
      "referral_source_description",
      step11Data.referral_source_description
    );
  }
  if (step11Data?.referred_by_code) {
    formData.append("referred_by_code", step11Data.referred_by_code);
  }

  return formData;
};
export const usePartnerRedirect = () => {
  const router = useRouter();

  const redirectIfApproved = useCallback(
    (fullProfileResource: any) => {
      // Kiểm tra trạng thái Đối tác
      const isPartnerApproved =
        fullProfileResource?.partner !== null &&
        fullProfileResource?.partner.status === Constants.PARTNER.DA_DUYET;

      if (isPartnerApproved) {
        const jobDetailPage = Cookies.get("JOB_DETAIL_PAGE");
        const routePreLogin = Cookies.get(Constants.ROUTE_PRE_LOGIN);

        if (jobDetailPage) {
          // Xóa cookie và chuyển hướng tới trang chi tiết công việc
          Cookies.remove("JOB_DETAIL_PAGE");
          Cookies.remove(Constants.ROUTE_PRE_LOGIN);
          router.replace(jobDetailPage);
        } else if (routePreLogin && routePreLogin.trim() !== "") {
          // Xóa cookie và chuyển hướng tới trang trước đó
          Cookies.remove(Constants.ROUTE_PRE_LOGIN);
          router.replace(routePreLogin);
        } else {
          // Chuyển hướng tới trang hồ sơ mặc định
          router.replace(PartnerRouteUtils.toProfileUrl());
        }
      }
    },
    [router]
  );

  return redirectIfApproved;
};
