import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Row, Col, Form, UploadFile } from "antd";
import Link from "next/link";
import usePartnerRegisterStep from "./hooks/usePartnerRegisterStep";
import { StepIndicator } from "./components/StepIndicator";
import { PartnerRegisterNavigation } from "./components/PartnerRegisterNavigation";
import { PartnerRegisterLayout } from "./components/PartnerRegisterLayout";
import { PARTNER_REGISTER_FORM } from "./constants/PartnerRegisterConstants";
// import { usePartnerFormValidation } from "./hooks/usePartnerFormValidation";
import { usePartnerFormValidationV2 } from "./hooks/usePartnerFormValidationV2";

import { PartnerRegisterSteps } from "./components/PartnerRegisterSteps";
import { usePartnerSelectBox } from "../PartnerScreen/hooks/usePartnerSelectBox";
import {
  PartnerRegisterParams,
  PartnerSelectBoxResource,
} from "@/src/data/partner/models/partner.types";
import { useAccountContext } from "@/src/contexts/AccountContext";
import { ModalizeHelperVisible } from "@/src/data/base/models/base.types";
import { usePartnerRegister } from "../PartnerScreen/hooks/usePartnerRegister";
import PartnerRegisterSuccessModal from "../PartnerScreen/components/PartnerRegisterSuccessModal";
import { ProjectItem } from "./pages/step_5/Step5Page";
import Head from "next/head";
import Cookies from "js-cookie";
import Constants from "@/src/constants/Constants";
import { useRouter } from "next/router";
import { PartnerRouteUtils } from "@/src/data/partner/utils/PartnerRouteUtils";
import { isEmpty } from "lodash";

interface PartnerRegisterScreenV2Props {}

export function PartnerRegisterScreenV2({}: PartnerRegisterScreenV2Props) {
  const router = useRouter();
  const { auth: userInfo } = useAccountContext();
  const isSigningUpBecomePartner = Cookies.get(
    Constants.IS_REGISTER_BECOME_PARTNER
  );

  const { stepIndex, totalSteps, stepName, onChangeStepIndex } =
    usePartnerRegisterStep();

  const accountContext = useAccountContext();
  const fullProfileResource = accountContext.auth;

  useEffect(() => {
    const isPartner =
      fullProfileResource?.partner !== null &&
      fullProfileResource?.partner?.status === Constants.PARTNER.DA_DUYET;

    // Only redirect if user is ALREADY an approved partner
    if (isPartner) {
      const jobDetailPage = Cookies.get("JOB_DETAIL_PAGE");
      const routePreLogin = Cookies.get(Constants.ROUTE_PRE_LOGIN);

      if (jobDetailPage) {
        // Clear both cookies and redirect to job detail page
        Cookies.remove("JOB_DETAIL_PAGE");
        Cookies.remove(Constants.ROUTE_PRE_LOGIN);
        router.replace(jobDetailPage);
      } else if (routePreLogin && routePreLogin.trim() !== "") {
        // Clear the cookie and redirect to the original page
        Cookies.remove(Constants.ROUTE_PRE_LOGIN);
        router.replace(routePreLogin);
      } else {
        // Redirect to profile page if no specific route is stored
        router.replace(PartnerRouteUtils.toProfileUrl());
      }
    }
    // Non-approved users (including clients) will continue with registration
  }, [fullProfileResource, router]);

  if (
    fullProfileResource?.partner !== null &&
    fullProfileResource?.partner?.status === Constants.PARTNER.DA_DUYET
  ) {
    return null; // Loading while redirecting approved partners
  }

  const [form] = Form.useForm();
  const formValues = Form.useWatch([], form);

  const partnerRegisterSuccessModalRef = useRef<ModalizeHelperVisible>(null);

  const { mutateAsync, isLoading: isSubmitting } = usePartnerRegister({
    onSuccess: () => partnerRegisterSuccessModalRef.current?.open(),
  });

  const selectBoxQuery = usePartnerSelectBox();
  const selectBoxResource = selectBoxQuery.data as PartnerSelectBoxResource;

  const clearStepData = useCallback(
    (currentStepName: string) => {
      let fieldNamesToClear: string[] = [];

      switch (currentStepName) {
        case PARTNER_REGISTER_FORM.TAB.STEP_4:
          fieldNamesToClear = [PARTNER_REGISTER_FORM.FIELD_NAME.STEP4_DATA];
          break;
        case PARTNER_REGISTER_FORM.TAB.STEP_5:
          fieldNamesToClear = [PARTNER_REGISTER_FORM.FIELD_NAME.STEP5_DATA];
          break;
        case PARTNER_REGISTER_FORM.TAB.STEP_6:
          fieldNamesToClear = [PARTNER_REGISTER_FORM.FIELD_NAME.STEP6_DATA];
          break;
        case PARTNER_REGISTER_FORM.TAB.STEP_11:
          fieldNamesToClear = [PARTNER_REGISTER_FORM.FIELD_NAME.STEP11_DATA];
          break;
        default:
          break;
      }

      if (fieldNamesToClear?.length > 0) {
        form.resetFields(fieldNamesToClear);
      }
    },
    [form]
  );

  const handleSkip = useCallback(() => {
    clearStepData(stepName);
    onChangeStepIndex(stepIndex + 1);
  }, [stepName, stepIndex, onChangeStepIndex, clearStepData]);

  const {
    isStep1V2Valid,
    isStep2V2Valid,
    isStep3V2Valid,
    isStep4Valid,
    isStep5Valid,
    isStep6Valid,
    isStep7Valid,
    isStep8Valid,
    isStep9PersonalValid,
    isStep9CompanyValid,
    isStep10Valid,
    isStep11Valid,
    isStep12PersonalValid,
    isStep12CompanyValid,
  } = usePartnerFormValidationV2({ form, formValues });

  const selectedCategoryIdsFromStep2V2 = useMemo(() => {
    const step2V2Data = form.getFieldValue(
      PARTNER_REGISTER_FORM.FIELD_NAME.STEP2_V2_DATA
    );
    return step2V2Data ? Object.keys(step2V2Data).map(Number) : [];
  }, [formValues]);

  const onFinishV2 = async (values: any) => {
    const formData = new FormData();

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

    // B1 (V2): Thông tin Profile
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

    // B2 (V2): Lĩnh vực, Danh mục & Dịch vụ
    if (step2V2Data) {
      Object.keys(step2V2Data).forEach((catId) => {
        formData.append("category_project_ids[]", catId);
        step2V2Data[catId]?.selectedServiceCategories?.forEach((sc: any) => {
          formData.append("category_service_ids[]", sc.id.toString());
          if (sc?.services && sc?.services?.length > 0) {
            sc?.services?.forEach((serviceId: number) => {
              formData.append("service_ids[]", serviceId.toString());
            });
          }
        });
      });
    }

    // B3 (V2): Kỹ năng
    if (
      step3V2Data?.selectedSkillIds &&
      step3V2Data?.selectedSkillIds?.length > 0
    ) {
      step3V2Data.selectedSkillIds.forEach((skillId: number) => {
        formData.append(`main_skills[]`, skillId.toString());
      });
    }

    // B4: Kinh nghiệm làm việc
    if (step4Data?.workHistories || form.getFieldValue("workHistories")) {
      (
        form.getFieldValue("workHistories") || step4Data?.workHistories
      )?.forEach((exp: any, index: number) => {
        formData.append(`workHistories[${index}][order]`, "1");

        Object.keys(exp).forEach((key) => {
          if (exp[key] !== undefined && exp[key] !== null) {
            formData.append(`workHistories[${index}][${key}]`, exp[key]);
          }
        });
      });
    }

    // B5: Dự án tiêu biểu
    if (
      form.getFieldValue("featuredProjects") &&
      Array.isArray(form.getFieldValue("featuredProjects"))
    ) {
      form
        .getFieldValue("featuredProjects")
        .forEach((project: ProjectItem, index: number) => {
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
          if (Array.isArray(project?.files) && project?.files?.length > 0) {
            project?.files?.forEach((file: File) => {
              if (file instanceof File) {
                formData.append(`typicalProjects[${index}][files][]`, file);
              }
            });
          }
        });
    }

    if (
      step5Data?.featuredProjects &&
      Array.isArray(step5Data.featuredProjects)
    ) {
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
          if (Array.isArray(project?.files) && project?.files?.length > 0) {
            project?.files?.forEach((file: File) => {
              if (file instanceof File) {
                formData.append(`typicalProjects[${index}][files][]`, file);
              }
            });
          }
        }
      );
    }

    // B6: Học vấn & Chứng chỉ
    if (form.getFieldValue("partnerEducations")) {
      form
        .getFieldValue("partnerEducations")
        .forEach((item: any, index: number) => {
          formData.append(`educations[${index}][type]`, item.type);
          formData.append(`educations[${index}][name]`, item.name);

          if (item.type === "education") {
            if (item.degree)
              formData.append(`educations[${index}][degree]`, item.degree);
            if (item.majors)
              formData.append(`educations[${index}][majors]`, item.majors);
            formData.append(
              `educations[${index}][start_date]`,
              item.start_date
            );
            formData.append(`educations[${index}][end_date]`, item.end_date);
          } else {
            if (item.grade)
              formData.append(`educations[${index}][grade]`, item.grade);
            formData.append(
              `educations[${index}][start_date]`,
              item.start_date
            );
            if (item.end_date)
              formData.append(`educations[${index}][end_date]`, item.end_date);
          }
          if (item.description)
            formData.append(
              `educations[${index}][description]`,
              item.description
            );
        });
    }

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
          formData.append(
            `educations[${index}][description]`,
            item.description
          );
      });
    }

    // B7: Giới thiệu bản thân
    if (step7Data?.selfIntroduction) {
      formData.append(`description`, step7Data.selfIntroduction);
    }

    // B8: Ngôn ngữ & Địa điểm
    if (step8Data?.languageIds && step8Data?.languageIds?.length > 0) {
      step8Data?.languageIds?.forEach((langId: number) => {
        formData.append(`languages[]`, langId.toString());
      });
    }

    if (step8Data?.locationIds && step8Data?.locationIds?.length > 0) {
      step8Data?.locationIds?.forEach((locationId: number) => {
        formData.append(`location_ids[]`, locationId.toString());
      });
    }

    // B9.1: Xác minh cá nhân (và file)
    if (step9PersonalData) {
      // Kiểm tra và append cardNumber
      if (
        step9PersonalData?.cardNumber &&
        step9PersonalData?.cardNumber !== userInfo?.cardNumber
      ) {
        formData.append("card_number", step9PersonalData?.cardNumber);
      }

      // Kiểm tra và append taxCode
      if (
        step9PersonalData.taxCode &&
        step9PersonalData.taxCode !== userInfo?.taxCode
      ) {
        formData.append("tax_code", step9PersonalData.taxCode);
      }

      // Kiểm tra và append frontCard
      if (
        step9PersonalData.frontCard &&
        step9PersonalData.frontCard instanceof File
      ) {
        formData.append("front_card", step9PersonalData.frontCard);
      }

      // Kiểm tra và append backCard
      if (
        step9PersonalData.backCard &&
        step9PersonalData.backCard instanceof File
      ) {
        formData.append("back_card", step9PersonalData.backCard);
      }

      if (step9PersonalData.portraitCard)
        formData.append("portrait_card", step9PersonalData.portraitCard);
    }

    if (step9CompanyData) {
      const getFileInstance = (fieldData: UploadFile[] | undefined | null) => {
        if (Array.isArray(fieldData) && fieldData?.length > 0) {
          const fileItem = fieldData?.[0];
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
        formData.append("tax_code", step9CompanyData.taxCode);
      }
      if (
        step9CompanyData?.nameRep &&
        step9CompanyData?.nameRep !== userInfo?.nameRep
      ) {
        formData.append("name_rep", step9CompanyData.nameRep);
      }
      if (
        step9CompanyData?.cardNumber &&
        step9CompanyData?.cardNumber !== userInfo?.cardNumber
      ) {
        formData.append("card_number", step9CompanyData.cardNumber);
      }

      const businessLicenseFile = getFileInstance(
        step9CompanyData.businessLicense
      );

      const frontCardFile =
        step9CompanyData.frontCard &&
        step9CompanyData.frontCard instanceof File;
      const backCardFile =
        step9CompanyData.backCard && step9CompanyData.backCard instanceof File;
      const portraitCardFile =
        step9CompanyData.portraitCard &&
        step9CompanyData.portraitCard instanceof File;

      if (businessLicenseFile) {
        formData.append("business_license", businessLicenseFile);
      }
      if (frontCardFile) {
        formData.append("front_card", step9CompanyData.frontCard);
      }
      if (backCardFile) {
        formData.append("back_card", step9CompanyData.backCard);
      }
      if (portraitCardFile) {
        formData.append("portrait_card", step9CompanyData.portraitCard);
      }
    }

    // B10: Thông tin thanh toán (và file)
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
      // if (step10Data.qrCode) {
      //   formData.append("qr_code", step10Data.qrCode);
      // }
    }

    // B11: Mã giới thiệu
    if (step11Data?.referralCode) {
      formData.append("referral_code", step11Data?.referralCode);
    }
    formData.append("referral_source_id", step11Data?.referral_source_id || 1);
    if (!isEmpty(step11Data?.referral_source_description)) {
      formData.append(
        "referral_source_description",
        step11Data?.referral_source_description
      );
    }

    if (stepIndex === totalSteps - 1) {
      try {
        await mutateAsync(formData as unknown as PartnerRegisterParams);
      } catch (_) {}
    } else {
      onChangeStepIndex(stepIndex + 1);
    }
  };

  const onFinishFailed = (errorInfo: any) => {};

  const handleNextOrSubmit = () => {
    form.submit();
  };
// console.log("stepName", stepName);

  const disableNext = useMemo(() => {
    if (isSubmitting) return true;

    switch (stepName) {
      case PARTNER_REGISTER_FORM.TAB.STEP_1_V2:
        return !isStep1V2Valid;
      case PARTNER_REGISTER_FORM.TAB.STEP_2_V2:
        return !isStep2V2Valid;
      case PARTNER_REGISTER_FORM.TAB.STEP_3_V2:
        return !isStep3V2Valid;
      case PARTNER_REGISTER_FORM.TAB.STEP_4:
        return !isStep4Valid;
      case PARTNER_REGISTER_FORM.TAB.STEP_5:
        return !isStep5Valid;
      case PARTNER_REGISTER_FORM.TAB.STEP_6:
        return !isStep6Valid;
      case PARTNER_REGISTER_FORM.TAB.STEP_7:
        return !isStep7Valid;
      case PARTNER_REGISTER_FORM.TAB.STEP_8:
        return !isStep8Valid;
      case PARTNER_REGISTER_FORM.TAB.STEP_9:
        if (fullProfileResource?.accountType === "PERSONAL") {
          return !isStep9PersonalValid;
        }
        return !isStep9CompanyValid;
      case PARTNER_REGISTER_FORM.TAB.STEP_10:
        return !isStep10Valid;
      case PARTNER_REGISTER_FORM.TAB.STEP_11:
        return !isStep11Valid;
      case PARTNER_REGISTER_FORM.TAB.STEP_12:
        if (fullProfileResource?.accountType === "PERSONAL") {
          return !isStep12PersonalValid;
        }
        return !isStep12CompanyValid;
      default:
        return true;
    }
  }, [
    stepName,
    isSubmitting,
    isStep1V2Valid,
    isStep2V2Valid,
    isStep3V2Valid,
    isStep4Valid,
    isStep5Valid,
    isStep6Valid,
    isStep7Valid,
    isStep8Valid,
    isStep9PersonalValid,
    isStep9CompanyValid,
    isStep10Valid,
    isStep11Valid,
    isStep12PersonalValid,
    isStep12CompanyValid,
  ]);
 
  const isStepOptional = useMemo(() => {
    const optionalSteps = [
      PARTNER_REGISTER_FORM.TAB.STEP_4,
      PARTNER_REGISTER_FORM.TAB.STEP_5,
      PARTNER_REGISTER_FORM.TAB.STEP_6,
      // PARTNER_REGISTER_FORM.TAB.STEP_11,
    ];
    return optionalSteps.includes(stepName);
  }, [stepName]);

  const title = useMemo(() => {
    const currentStepNumber = stepIndex + 1;
    const stepLabels: { [key: string]: string } = {
      [PARTNER_REGISTER_FORM.TAB.STEP_1_V2]: "Thông tin cá nhân",
      [PARTNER_REGISTER_FORM.TAB.STEP_2_V2]: "Lĩnh vực & dịch vụ",
      [PARTNER_REGISTER_FORM.TAB.STEP_3_V2]: "Kỹ năng",
      [PARTNER_REGISTER_FORM.TAB.STEP_4]: "Kinh nghiệm làm việc",
      [PARTNER_REGISTER_FORM.TAB.STEP_5]: "Dự án tiêu biểu",
      [PARTNER_REGISTER_FORM.TAB.STEP_6]: "Học vấn & Chứng chỉ",
      [PARTNER_REGISTER_FORM.TAB.STEP_7]: "Giới thiệu bản thân",
      [PARTNER_REGISTER_FORM.TAB.STEP_8]: "Ngôn ngữ & Địa điểm",
      [PARTNER_REGISTER_FORM.TAB.STEP_9]: "Xác minh thông tin",
      [PARTNER_REGISTER_FORM.TAB.STEP_10]: "Thông tin thanh toán",
      [PARTNER_REGISTER_FORM.TAB.STEP_11]: "Mã giới thiệu",
      [PARTNER_REGISTER_FORM.TAB.STEP_12]: "Kiểm tra thông tin",
    };
    const stepLabel = stepLabels[stepName] || "Đăng ký Đối tác";
    return `Bước ${currentStepNumber}/${totalSteps}: ${stepLabel}`;
  }, [stepIndex, totalSteps, stepName]);

  return (
    <PartnerRegisterLayout>
      <Head>
        <title>{title}</title>
      </Head>
      <Form
        form={form}
        name="partner-register-form"
        onFinish={onFinishV2}
        onFinishFailed={onFinishFailed}
        layout="vertical"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "100%",
          boxSizing: "border-box",
          paddingInline: "50px",
          paddingBottom: "20px",
          paddingTop: "25px",
        }}
        initialValues={{}}
      >
        <div
          style={{ flex: "0 0 auto", marginBottom: "15px", overflow: "hidden" }}
        >
          <Row justify="start" align="middle" style={{ flexShrink: 0 }}>
            <Col>
              {isSigningUpBecomePartner &&
              isSigningUpBecomePartner === "true" ? (
                <img
                  alt={"iagree"}
                  src={"/assets/img/logo.svg"}
                  className={"logoImg"}
                />
              ) : (
                <Link className={"logo"} href={"/"}>
                  <img
                    alt={"iagree"}
                    src={"/assets/img/logo.svg"}
                    className={"logoImg"}
                  />
                </Link>
              )}
            </Col>
          </Row>
        </div>
        <div
          style={{
            flex: "1 1 auto",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            marginBottom: "10px",
          }}
        >
          <div
            style={{ flexShrink: 0, marginBottom: "10px", marginTop: "10px" }}
          >
            <StepIndicator stepIndex={stepIndex} totalSteps={totalSteps} />
          </div>
          <PartnerRegisterSteps
            stepName={stepName}
            selectedCategoryIdsFromStep2V2={selectedCategoryIdsFromStep2V2}
            form={form}
            selectBoxResource={selectBoxResource}
          />
        </div>
        <div
          style={{
            flex: "0 0 auto",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingTop: "0",
            flexShrink: 0,
          }}
        >
          <PartnerRegisterNavigation
            stepIndex={stepIndex}
            totalSteps={totalSteps}
            onChangeStepIndex={onChangeStepIndex}
            onNextClick={handleNextOrSubmit}
            onSkipClick={handleSkip}
            disableNext={disableNext}
            isSubmitting={isSubmitting}
            isStepOptional={isStepOptional}
          />
        </div>
      </Form>
      <PartnerRegisterSuccessModal ref={partnerRegisterSuccessModalRef} />
    </PartnerRegisterLayout>
  );
}
