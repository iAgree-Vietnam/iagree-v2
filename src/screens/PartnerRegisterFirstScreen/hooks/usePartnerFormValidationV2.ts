import { Form, FormInstance } from "antd";
import { useEffect, useMemo } from "react";
import { PARTNER_REGISTER_FORM } from "../constants/PartnerRegisterConstants";
import moment from "moment";
import { isEmpty, trim } from "lodash";
import { useAppSelector } from "@/src/hooks/store";
import { useRouter } from "next/router";

interface FormValidationProps {
  form: FormInstance;
  formValues: Record<string, any>;
}

export const usePartnerFormValidationV2 = ({
  form,
  formValues,
}: FormValidationProps) => {
  const isStep1V2Valid = useMemo(() => {
    const step1V2Data = form.getFieldValue(
      PARTNER_REGISTER_FORM.FIELD_NAME.STEP1_V2_DATA
    );
    const hasDisplayName =
      !!step1V2Data?.displayName && step1V2Data.displayName.trim().length > 0;
    const hasProfessionalRole =
      !!step1V2Data?.professionalRole &&
      step1V2Data.professionalRole.trim().length > 0;

    const hasAvatar =
      (!!step1V2Data?.avatar && step1V2Data.avatar.length > 0) ||
      !!step1V2Data?.defaultAvatar;

    return hasDisplayName && hasProfessionalRole && hasAvatar;
  }, [formValues]);

  const isStep2V2Valid = useMemo(() => {
    const step2V2Data = form.getFieldValue(
      PARTNER_REGISTER_FORM.FIELD_NAME.STEP2_V2_DATA
    );

    // 1. Kiểm tra dữ liệu tổng thể
    if (!step2V2Data || Object.keys(step2V2Data).length === 0) {
      return false;
    }

    // 2. Kiểm tra có ít nhất một lĩnh vực có DMDV được chọn
    const isAnyCategorySelected = Object.keys(step2V2Data).some(
      (catId) => step2V2Data[catId]?.selectedServiceCategories?.length > 0
    );

    // Nếu không có lĩnh vực nào được chọn, validation thất bại
    if (!isAnyCategorySelected) {
      return false;
    }

    // 3. Kiểm tra mỗi DMDV đã chọn phải có ít nhất một dịch vụ
    const allSelectedDmdvHaveServices = Object.keys(step2V2Data).every(
      (catId) => {
        const selectedDmdv = step2V2Data[catId]?.selectedServiceCategories;
        // Nếu không có DMDV nào được chọn cho lĩnh vực này, coi như hợp lệ cho phần này
        if (!selectedDmdv || selectedDmdv.length === 0) {
          return true;
        }
        // Kiểm tra mỗi DMDV trong mảng này phải có ít nhất một dịch vụ
        return selectedDmdv.every(
          (serviceCategory: { services: any[] }) =>
            serviceCategory.services?.length > 0
        );
      }
    );

    // Trả về true chỉ khi cả hai điều kiện đều đúng
    return isAnyCategorySelected && allSelectedDmdvHaveServices;
  }, [formValues]);

  const isStep3V2Valid = useMemo(() => {
    const step2Data = form.getFieldValue(
      PARTNER_REGISTER_FORM.FIELD_NAME.STEP3_V2_DATA
    );
    return (step2Data?.selectedSkillIds?.length || 0) > 4;
  }, [formValues]);

  const isStep4Valid = useMemo(() => {
    const step4Data = form
      .getFieldsValue
      // PARTNER_REGISTER_FORM.FIELD_NAME.STEP4_DATA
      ();

    const workHistories = step4Data?.workHistories;

    if (
      !workHistories ||
      workHistories.length === 0 ||
      isEmpty(workHistories)
    ) {
      return true;
    }
    return workHistories.every(
      (exp: any) =>
        !!exp.name &&
        exp.name?.trim().length > 0 &&
        !!exp.position &&
        exp.position?.trim().length > 0 &&
        !!exp.start_date &&
        !!exp.description &&
        exp.description?.trim().length > 0 &&
        (!exp.end_date || moment(exp.start_date).isBefore(moment(exp.end_date)))
    );
  }, [formValues]);

  const isStep5Valid = useMemo(() => {
    const step5Data = form
      .getFieldsValue
      // PARTNER_REGISTER_FORM.FIELD_NAME.STEP5_DATA
      ();

    const featuredProjects = step5Data?.featuredProjects;
    if (!featuredProjects || featuredProjects.length === 0) {
      return true;
    }
    return featuredProjects.every(
      (project: any) =>
        !!project.name &&
        project.name?.trim().length > 0 &&
        !!project.description &&
        project.description?.trim().length > 0 &&
        !!project.role &&
        project.role?.trim().length > 0 &&
        !!project.start_date &&
        !!project.image &&
        (!project.end_date ||
          moment(project.start_date).isBefore(moment(project.end_date)))
    );
  }, [formValues]);

  const isStep6Valid = useMemo(() => {
    const step6Data = form
      .getFieldsValue
      // PARTNER_REGISTER_FORM.FIELD_NAME.STEP6_DATA
      ();
    const partnerEducations = step6Data?.partnerEducations;
    if (!partnerEducations || partnerEducations.length === 0) {
      return true;
    }
    return partnerEducations.every((item: any) => {
      if (item.type === "education") {
        return (
          !!item.name &&
          item.name.trim().length > 0 &&
          !!item.start_date &&
          item.start_date.trim().length > 0 &&
          !!item.end_date &&
          item.end_date.trim().length > 0 &&
          moment(item.start_date).isBefore(moment(item.end_date))
        );
      }
      if (item.type === "certificate") {
        const isDatesValid =
          !item.end_date ||
          moment(item.start_date).isBefore(moment(item.end_date));

        return (
          !!item.name &&
          item.name.trim().length > 0 &&
          !!item.start_date &&
          item.start_date.trim().length > 0 &&
          isDatesValid
        );
      }
      return false;
    });
  }, [formValues]);

  const isStep7Valid = useMemo(() => {
    const step7Data = form.getFieldValue(
      PARTNER_REGISTER_FORM.FIELD_NAME.STEP7_DATA
    );
    return (
      !!step7Data?.selfIntroduction &&
      step7Data.selfIntroduction.trim().length > 0
    );
  }, [formValues]);

  const isStep8Valid = useMemo(() => {
    const step8Data = form.getFieldValue(
      PARTNER_REGISTER_FORM.FIELD_NAME.STEP8_DATA
    );

    const languageIds = step8Data?.languageIds;
    const locationIds = step8Data?.locationIds;

    const areLanguagesSelected = !!languageIds && languageIds.length > 0;
    const isLocationSelected = !!locationIds && locationIds.length > 0;

    return areLanguagesSelected && isLocationSelected;
  }, [formValues]);

  const isStep9PersonalValid = useMemo(() => {
    const step9PersonalData = form.getFieldValue(
      PARTNER_REGISTER_FORM.FIELD_NAME.STEP9_PERSONAL_DATA
    );

    const cardNumber = trim(step9PersonalData?.cardNumber);
    const isNumeric = (value: string) => /^\d+$/.test(value);

    const isCardNumberValid =
      cardNumber &&
      cardNumber.length >= 9 &&
      cardNumber.length <= 12 &&
      isNumeric(cardNumber);

    return (
      isCardNumberValid 
      //&& !!step9PersonalData?.frontCard &&
      // !!step9PersonalData?.backCard
    );
  }, [formValues]);

  const isStep9CompanyValid = useMemo(() => {
    const step9CompanyData = form.getFieldValue(
      PARTNER_REGISTER_FORM.FIELD_NAME.STEP9_COMPANY_DATA
    );
    const cardNumber = step9CompanyData?.cardNumber?.trim();

    const isNumeric = (value: string) => /^\d+$/.test(value);

    const isCardNumberValid =
      cardNumber &&
      cardNumber.length >= 10 &&
      cardNumber.length <= 12 &&
      isNumeric(cardNumber);

    return (
      isCardNumberValid 
      // &&
      // !!step9CompanyData?.frontCard &&
      // !!step9CompanyData?.backCard
    );
  }, [formValues]);

  const isStep10Valid = useMemo(() => {
    const step10Data = form.getFieldValue(
      PARTNER_REGISTER_FORM.FIELD_NAME.STEP10_DATA
    );

    const isNumeric = (value: string) => /^\d+$/.test(value);

    const isBankAccountNameValid = (name: string) => /^[A-Z\s]*$/.test(name);

    const isBankIdValid = !!step10Data?.bankId;

    const isAccountNumberValid =
      !!step10Data?.accountNumber &&
      step10Data?.accountNumber.trim().length > 0 &&
      isNumeric(step10Data?.accountNumber);

    const isAccountNameValid =
      !!step10Data?.bankAccountName &&
      step10Data?.bankAccountName.trim().length > 0 &&
      isBankAccountNameValid(step10Data?.bankAccountName);

    return isBankIdValid && isAccountNumberValid && isAccountNameValid;
  }, [formValues]);
  const auth = useAppSelector((store) => store.auth);
  const router = useRouter();

  const { query } = router;
  // Lấy ref_code từ URL và ép kiểu string
  const ref_code = query?.ref_code as string;

  const isStep11Valid = useMemo(() => {
    const step11Data = form.getFieldValue(
      PARTNER_REGISTER_FORM.FIELD_NAME.STEP11_DATA
    );
    const showCheckButton = !ref_code; // Chỉ hiển thị nút khi không có code từ URL

    const referralCode =
      (!!step11Data?.referral_source_id &&
        step11Data.referral_source_id.trim().length > 0) ||
      !!ref_code;

    return referralCode && auth.isValidRefCode;
  }, [formValues, auth.isValidRefCode]);
  const acceptTerms = Form.useWatch("accept_terms", form);
  const acceptTermsForPartner = Form.useWatch("accept_terms_for_partner", form);
  const isStep12PersonalValid = useMemo(() => {
    // const acceptTerms = form.getFieldValue("accept_terms");
    // const acceptTermsForPartner = form.getFieldValue(
    //   "accept_terms_for_partner"
    // );

    return acceptTerms && acceptTermsForPartner;
  }, [formValues, acceptTerms, acceptTermsForPartner]);

  const isStep12CompanyValid = useMemo(() => {
    // const acceptTerms = form.getFieldValue("accept_terms");
    // const acceptTermsForPartner = form.getFieldValue(
    //   "accept_terms_for_partner"
    // );

    return !!acceptTerms && !!acceptTermsForPartner;
  }, [formValues, acceptTerms, acceptTermsForPartner]);

  const disableNext = useMemo(() => {}, [
    formValues,
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

  return {
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
    disableNext,
  };
};
