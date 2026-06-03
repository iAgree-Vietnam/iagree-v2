import React, { useEffect, useMemo, useState } from "react";
import { Button, Space, Grid, Form } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import JobAddFormUtils from "../utils/JobAddFormUtils";
import Constants from "@/src/constants/Constants";
import { FormInstance } from "antd/lib";

const { useBreakpoint } = Grid;

interface JobFormNavigationButtonsProps {
  partnerId: number | null | undefined;
  stepIndex: number;
  totalSteps: number;
  onPrevious: () => void;
  onDraft: () => void;
  onNext: () => void;
  form: FormInstance;
  nextButtonText?: string;
  nextButtonLoading?: boolean;
  draftButtonLoading?: boolean;
  disabledNextButton?: boolean;
}

const getRequiredFieldsForStep = (stepIndex: number): string[] => {
  const overviewStepIndex = JobAddFormUtils.getActiveStepIndex(
    Constants.JOB_ADD_FORM.TAB.JOB_ADD_OVERVIEW
  );

  const scopeAndBudgetStepIndex = JobAddFormUtils.getActiveStepIndex(
    Constants.JOB_ADD_FORM.TAB.JOB_ADD_SCOPE_AND_BUDGET
  );

  const confirmAndRegisterStepIndex = JobAddFormUtils.getActiveStepIndex(
    Constants.JOB_ADD_FORM.TAB.JOB_ADD_CONFIRM_AND_REGISTER
  );

  switch (stepIndex) {
    case overviewStepIndex:
      return ["name", "category_project_ids", "skills", "description"];
    case scopeAndBudgetStepIndex:
      return ["number_accept"];
    case confirmAndRegisterStepIndex:
      return ["accept_condition"];
    default:
      return [];
  }
};
const getConditionalRequiredFields = (
  stepIndex: number,
  form: FormInstance
): string[] => {
  const scopeAndBudgetStepIndex = JobAddFormUtils.getActiveStepIndex(
    Constants.JOB_ADD_FORM.TAB.JOB_ADD_SCOPE_AND_BUDGET
  );

  if (stepIndex === scopeAndBudgetStepIndex) {
    const salaryType = form.getFieldValue("salary_type");
    const needManyPartners = form.getFieldValue("need_many_partners");

    const conditionalFields: string[] = [];

    // Add salary-specific required fields
    if (salaryType === Constants.JOB.SALARY_TYPE.FIXED) {
      conditionalFields.push("price");
    } else if (salaryType === Constants.JOB.SALARY_TYPE.DEAL) {
      conditionalFields.push("price_min", "price_max");
    }

    // Add needPartners if needManyPartners is checked
    if (needManyPartners) {
      conditionalFields.push("need_partners");
    }

    return conditionalFields;
  }

  return [];
};

function JobFormNavigationButtons({
  partnerId,
  stepIndex,
  totalSteps,
  onPrevious,
  onDraft,
  onNext,
  form,
  nextButtonText,
  nextButtonLoading = false,
  draftButtonLoading = false,
  disabledNextButton = false,
}: JobFormNavigationButtonsProps) {
  const screens = useBreakpoint();

  const watchedValues = Form.useWatch([], form);
  const salaryType = Form.useWatch("salary_type", form);
  const needManyPartners = Form.useWatch("need_many_partners", form);

  const requiredFields = useMemo(
    () => getRequiredFieldsForStep(stepIndex),
    [stepIndex]
  );

  const conditionalFields = useMemo(
    () => getConditionalRequiredFields(stepIndex, form),
    [stepIndex, salaryType, needManyPartners, form]
  );

  const allRequiredFields = [...requiredFields, ...conditionalFields];

  const [isStepValid, setIsStepValid] = useState(false);

  useEffect(() => {
    const formValues = form.getFieldsValue();
    let isValid = true;

    for (const fieldName of allRequiredFields) {
      const value = formValues[fieldName];
      const errors = form.getFieldError(fieldName);

      if (errors.length > 0) {
        isValid = false;
        break;
      }

      if (value === undefined || value === null || value === "") {
        isValid = false;
        break;
      }

      if (Array.isArray(value) && value.length === 0) {
        isValid = false;
        break;
      }

      if (fieldName === "accept_condition" && value !== true) {
        isValid = false;
        break;
      }
    }

    // Check priceMin < priceMax
    if (
      allRequiredFields.includes("price_min") &&
      allRequiredFields.includes("price_max")
    ) {
      if (formValues.price_min >= formValues.price_max) {
        isValid = false;
      }
    }

    setIsStepValid(isValid);
  }, [watchedValues, allRequiredFields, form]);

  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === totalSteps - 1;

  const confirmAndRegisterStepIndex = JobAddFormUtils.getActiveStepIndex(
    Constants.JOB_ADD_FORM.TAB.JOB_ADD_CONFIRM_AND_REGISTER
  );

  const isConfirmAndRegisterStep = stepIndex === confirmAndRegisterStepIndex;

  const buttonSize = screens.md ? "large" : "middle";

  const checkPartnerForm = !isLastStep || (isLastStep && partnerId !== 0);

  const isNextButtonDisabled = disabledNextButton || !isStepValid;

  const showDraftButton = isConfirmAndRegisterStep && partnerId === 0;

  return (
    <Space
      style={{
        width: "100%",
        display: "flex",
        justifyContent: isFirstStep ? "flex-end" : "space-between",
        marginTop: 24,
        padding: "16px 0",
        borderTop: "1px solid #f0f0f0",
      }}
    >
      {/* Previous Button */}
      {!isFirstStep && (
        <Button size={buttonSize} onClick={onPrevious} icon={<LeftOutlined />}>
          Quay lại
        </Button>
      )}
      {/* Next / Submit Button Group */}
      {/* {checkPartnerForm && ( */}
      <Space>
        {/* {showDraftButton && (
            <Button
              type="primary"
              size={buttonSize}
              onClick={onDraft}
              loading={draftButtonLoading}
              disabled={nextButtonLoading}
            >
              Lưu nháp
            </Button>
          )} */}

        <Button
          type="primary"
          size={buttonSize}
          onClick={onNext}
          loading={nextButtonLoading}
          disabled={isNextButtonDisabled || draftButtonLoading}
        >
          {isConfirmAndRegisterStep
            ? nextButtonText || "Đăng tuyển"
            : nextButtonText || "Tiếp theo"}{" "}
          <RightOutlined />
        </Button>
      </Space>
      {/* } */}
    </Space>
  );
}

export default JobFormNavigationButtons;
