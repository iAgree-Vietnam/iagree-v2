import React, { useRef } from "react";
import { Form } from "antd";
import { PARTNER_REGISTER_FORM } from "../constants/PartnerRegisterConstants";
import { Step4Page } from "../pages/step_4/Step4Page";
import { Step5Page } from "../pages/step_5/Step5Page";
import { Step6Page } from "../pages/step_6/Step6Page";
import { Step7Page } from "../pages/step_7/Step7Page";
import { Step8Page } from "../pages/step_8/Step8Page";
import { Step9PersonalPage } from "../pages/step_9/personal/Step9PersonalPage";
import { Step9CompanyPage } from "../pages/step_9/company/Step9CompanyPage";
import { Step11Page } from "../pages/step_11/Step11Page";
import { PartnerSelectBoxResource } from "@/src/data/partner/models/partner.types";
import { useAccountContext } from "@/src/contexts/AccountContext";
import { Step10Page } from "../pages/step_10/Step10Page";
import { Step12PersonalPage } from "../pages/step_12/personal/Step12PersonalPage";
import { Step12CompanyPage } from "../pages/step_12/company/Step12CompanyPage";
import { Step1V2Page } from "../pages/step_1_v2/Step1_V2Page";
import { Step2V2Page } from "../pages/step_2_v2/Step2_V2_Page";
import { Step3V2Page } from "../pages/step_3_v2/Step3_V2Page";

interface PartnerRegisterStepsProps {
  stepName: string;
  selectedCategoryIdsFromStep2V2: number[];
  form: any;
  selectBoxResource?: PartnerSelectBoxResource;
}

const getFormItem = (
  fieldName: string,
  component: React.ReactNode,
  rules?: any,
  initialValue?: any
) => (
  <Form.Item name={fieldName} initialValue={initialValue} rules={rules}>
    {component}
  </Form.Item>
);

export const PartnerRegisterSteps: React.FC<PartnerRegisterStepsProps> = ({
  stepName,
  selectedCategoryIdsFromStep2V2: selectedCategoryIdsFromStep1,
  form,
  selectBoxResource,
}) => {
  const accountContext = useAccountContext();
  const fullProfileResource = accountContext.auth;
  const isInitialStep9 = useRef(true);
  const setInitialRenderStep9False = () => {
    isInitialStep9.current = false;
  };

  const isInitialStep10 = useRef(true);
  const setInitialRenderStep10False = () => {
    isInitialStep10.current = false;
  };
  const stepComponents = {
    [PARTNER_REGISTER_FORM.TAB.STEP_1_V2]: <Step1V2Page form={form} />,
    [PARTNER_REGISTER_FORM.TAB.STEP_2_V2]: (
      <Step2V2Page selectBoxResource={selectBoxResource} />
    ),
    [PARTNER_REGISTER_FORM.TAB.STEP_3_V2]: (
      <Step3V2Page categoryIds={selectedCategoryIdsFromStep1} />
    ),
    [PARTNER_REGISTER_FORM.TAB.STEP_4]: <Step4Page />,
    [PARTNER_REGISTER_FORM.TAB.STEP_5]: <Step5Page />,
    [PARTNER_REGISTER_FORM.TAB.STEP_6]: <Step6Page />,
    [PARTNER_REGISTER_FORM.TAB.STEP_7]: <Step7Page />,
    [PARTNER_REGISTER_FORM.TAB.STEP_8]: (
      <Step8Page selectBoxResource={selectBoxResource} />
    ),
    [PARTNER_REGISTER_FORM.TAB.STEP_9]:
    fullProfileResource?.accountType === "PERSONAL" ? (
    <Step9PersonalPage
    form={form}
    isInitialRender={isInitialStep9.current}
    onInit={setInitialRenderStep9False}
    />
    ) : (
    <Step9CompanyPage
    form={form}
    isInitialRender={isInitialStep9.current}
    onInit={setInitialRenderStep9False}
    />
    ),
    [PARTNER_REGISTER_FORM.TAB.STEP_10]: (
          <Step10Page
        selectBoxResource={selectBoxResource}
        isInitialRender={isInitialStep10.current}
        onInit={setInitialRenderStep10False}
      />
    ),
    [PARTNER_REGISTER_FORM.TAB.STEP_11]: <Step11Page />,
    [PARTNER_REGISTER_FORM.TAB.STEP_12]:
      fullProfileResource?.accountType === "PERSONAL" ? (
        <Step12PersonalPage form={form} selectBoxResource={selectBoxResource} />
      ) : (
        <Step12CompanyPage form={form} selectBoxResource={selectBoxResource} />
      ),
  };

  const commonRoleRules = [
    {
      validator: async (_: any, value: any) => {
        const role = value?.professionalRole?.trim();
        if (!role) {
          return Promise.reject(
            new Error("Vui lòng nhập vai trò chuyên nghiệp của bạn.")
          );
        }
        return Promise.resolve();
      },
    },
  ];

  switch (stepName) {
    case PARTNER_REGISTER_FORM.TAB.STEP_1_V2:
      return getFormItem(
        PARTNER_REGISTER_FORM.FIELD_NAME.STEP1_V2_DATA,
        stepComponents[stepName],
        commonRoleRules,
        { professionalRole: "" }
      );

    case PARTNER_REGISTER_FORM.TAB.STEP_2_V2:
      return getFormItem(
        PARTNER_REGISTER_FORM.FIELD_NAME.STEP2_V2_DATA,
        stepComponents[stepName],
        [
          {
            validator: async (_: any, value: any) => {
              if (!value || Object.keys(value).length === 0) {
                return Promise.reject();
              }

              const isAnyServiceCategorySelected = Object.keys(value).some(
                (catId) => value[catId]?.selectedServiceCategories?.length > 0
              );

              const isAnyServiceSelected = Object.keys(value).some((catId) =>
                value[catId]?.selectedServiceCategories?.some(
                  (serviceCategory: { services: any[] }) =>
                    serviceCategory.services?.length > 0
                )
              );

              if (isAnyServiceCategorySelected && isAnyServiceSelected) {
                return Promise.resolve();
              }

              return Promise.reject();
            },
          },
        ],
        {}
      );

    case PARTNER_REGISTER_FORM.TAB.STEP_3_V2:
      return getFormItem(
        PARTNER_REGISTER_FORM.FIELD_NAME.STEP3_V2_DATA,
        stepComponents[stepName],
        [
          {
            validator: async (_: any, value: any) => {
              if (!value || value.selectedSkillIds.length === 0) {
                return Promise.reject();
              }
              return Promise.resolve();
            },
          },
        ],
        { selectedSkillIds: [] }
      );
    case PARTNER_REGISTER_FORM.TAB.STEP_4:
      return getFormItem(
        PARTNER_REGISTER_FORM.FIELD_NAME.STEP4_DATA,
        stepComponents[stepName]
      );
    case PARTNER_REGISTER_FORM.TAB.STEP_5:
      return getFormItem(
        PARTNER_REGISTER_FORM.FIELD_NAME.STEP5_DATA,
        stepComponents[stepName]
      );
    case PARTNER_REGISTER_FORM.TAB.STEP_6:
      return getFormItem(
        PARTNER_REGISTER_FORM.FIELD_NAME.STEP6_DATA,
        stepComponents[stepName]
      );
    case PARTNER_REGISTER_FORM.TAB.STEP_7:
      return getFormItem(
        PARTNER_REGISTER_FORM.FIELD_NAME.STEP7_DATA,
        stepComponents[stepName]
      );
    case PARTNER_REGISTER_FORM.TAB.STEP_8:
      return getFormItem(
        PARTNER_REGISTER_FORM.FIELD_NAME.STEP8_DATA,
        stepComponents[stepName]
      );
    case PARTNER_REGISTER_FORM.TAB.STEP_9:
      return getFormItem(
        fullProfileResource?.accountType === "PERSONAL"
          ? PARTNER_REGISTER_FORM.FIELD_NAME.STEP9_PERSONAL_DATA
          : PARTNER_REGISTER_FORM.FIELD_NAME.STEP9_COMPANY_DATA,
        stepComponents[stepName]
      );
    case PARTNER_REGISTER_FORM.TAB.STEP_10:
      return getFormItem(
        PARTNER_REGISTER_FORM.FIELD_NAME.STEP10_DATA,
        stepComponents[stepName]
      );
    case PARTNER_REGISTER_FORM.TAB.STEP_11:
      return getFormItem(
        PARTNER_REGISTER_FORM.FIELD_NAME.STEP11_DATA,
        stepComponents[stepName]
      );
    case PARTNER_REGISTER_FORM.TAB.STEP_12:
      return getFormItem(
        fullProfileResource?.accountType === "PERSONAL"
          ? PARTNER_REGISTER_FORM.FIELD_NAME.STEP12_PERSONAL_DATA
          : PARTNER_REGISTER_FORM.FIELD_NAME.STEP12_COMPANY_DATA,
        stepComponents[stepName]
      );
    default:
      return <div>Lỗi: Bước không xác định.</div>;
  }
};
