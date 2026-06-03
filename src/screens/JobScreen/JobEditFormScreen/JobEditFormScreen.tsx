import React, { useMemo, useRef, useState, useEffect } from "react";
import RootLayout from "@/src/layouts/RootLayout";
import { Breadcrumb, Form, Row, Spin, message } from "antd";
import { JobFormParams, JobSelectboxResource } from "@/src/data/job/models/job.types";
import Constants from "@/src/constants/Constants";
import useSelectedJob from "../JobDetailScreen/hooks/useSelectedJob";
import _ from "lodash";
import datetimeUtils from "@/src/utils/DatetimeUtils";
import useJobUpdate from "./hooks/useJobUpdate";

import JobFormActions from "./components/JobFormActions";
import JobFormNavigationButtons from "./components/JobFormNavigationButtons"; // Import JobFormNavigationButtons

import Head from "next/head";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import JobRouteUtils from "@/src/data/job/utils/JobRouteUtils";
import AuthJobRouteUtils from "@/src/data/auth/utils/AuthJobRouteUtils";
import { JobFormSteps } from "./components/JobFormSteps";
import { SkillResource } from "@/src/data/skill/models/skill.types";
import { CateServiceResource } from "@/src/data/category/models/category.types";
import JobScopeAndBudgetStep from "./components/steps/scope_and_budget_step/JobScopeAndBudgetStep";
import JobRegisteredOptionsStep from "./components/steps/registered_options_step/JobRegisteredOptionsStep";
import JobConfirmAndRegisterStep from "./components/steps/confirm_and_register_tep/JobConfirmAndRegisterStep"; // Import JobConfirmAndRegisterStep
import JobOverviewStep from "./components/steps/over_view_step/JobOverviewStep";
import JobEditFormUtils from "./utils/JobEditFormUtils";
import useJobEditFormStep from "./hooks/useJobEditFormStep";
import useJobAddSelectbox from "../JobFormScreen/hooks/useJobAddSelectbox";

interface JobEditFormScreenProps {
  jobId?: number | null | undefined;
}

function JobEditFormScreen(props: JobEditFormScreenProps) {
  const { jobId } = props;
  // const router = useRouter();

  const [form] = Form.useForm();
  const actionValue = useRef<number | null>(null);

  const [salaryType, setSalaryType] = useState<number>(
    Constants.JOB.SALARY_TYPE.DEAL
  );
  // const [isSubmittingJob, setIsSubmittingJob] = useState(false);
  const [actionLoading, setActionLoading] = useState<"draft" | "next" | null>(null);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  // Re-introduce acceptCondition state to control the "Đăng tuyển" button directly
  const [acceptCondition, setAcceptCondition] = useState<boolean>(false);

  const { stepIndex, steps, onChangeStepIndex } = useJobEditFormStep("0");

  const selectboxQuery = useJobAddSelectbox();
  const jobQuery = useSelectedJob(jobId as number, {
    initData: undefined,
    onSuccess: (fullJobResource) => {
      // setSalaryType(fulljobResource?.salaryType);

      // if (fullJobResource) {
      //   form.setFieldsValue({
      //     skills: fullJobResource.skills?.map((skill) => skill.skillId) || [],
      //     categoryServiceIds:
      //       fullJobResource.categoryServices?.map(
      //         (service) => service.cateServiceId
      //       ) || [],
      //     serviceIds:
      //       fullJobResource.services?.map((service) => service.serviceId) || [],
      //     // Set initial value for acceptCondition from fullJobResource.isReadTerm
      //     // acceptCondition: fullJobResource.isReadTerm === 1,
      //   });
      //   // Also update the local state for acceptCondition
      //   // setAcceptCondition(fullJobResource.isReadTerm === 1);
      // }
    },
  });

  const fullJobResource = jobQuery.data;
  const selectboxResource = selectboxQuery.data as JobSelectboxResource;

  const pageTitle = fullJobResource?.name;

  const updateMutation = useJobUpdate(fullJobResource!);

  const selectedCategoryServiceIds = Form.useWatch("category_service_ids", form);
  const selectedCategoryIds = Form.useWatch("category_project_ids", form);

  const filteredSkills: SkillResource[] = useMemo(() => {
    if (!selectedCategoryIds || !selectboxResource?.skills) return [];

    return selectboxResource.skills.filter((skillItem) => {
      if (Array.isArray(selectedCategoryIds)) {
        return selectedCategoryIds.includes(skillItem.categoryProjectId);
      }
      return skillItem.categoryProjectId === selectedCategoryIds;
    });
  }, [selectedCategoryIds, selectboxResource.skills]);

  const servicesAvailable = useMemo(() => {
    if (!selectedCategoryServiceIds || !selectboxResource?.categories)
      return [];

    const allServiceCategories = selectboxResource.categories.flatMap(
      (category) => category.childrens || []
    );

    return allServiceCategories
      .filter((serviceCategory) => {
        if (Array.isArray(selectedCategoryServiceIds)) {
          return selectedCategoryServiceIds.includes(
            serviceCategory.cateServiceId
          );
        }
        return serviceCategory.cateServiceId === selectedCategoryServiceIds;
      })
      .flatMap((serviceCategory) => serviceCategory.childrens || []);
  }, [selectedCategoryServiceIds, selectboxResource?.categories]);

  const serviceCategoriesAvailable: CateServiceResource[] = useMemo(() => {
    if (!selectedCategoryIds || !selectboxResource?.categories) return [];

    return selectboxResource.categories
      .filter((category) => {
        if (Array.isArray(selectedCategoryIds)) {
          return selectedCategoryIds.includes(category.categoryId);
        }
        return category.categoryId === selectedCategoryIds;
      })
      .flatMap((category) => category.childrens || []);
  }, [selectedCategoryIds, selectboxResource.categories]);

  useEffect(() => {
    if (!selectboxResource?.skills || !selectboxResource?.categories) {
      return;
    }

    const currentSkillIds = form.getFieldValue("skills");
    let calculatedValidSkillIds: number[] = [];

    if (
      selectedCategoryIds &&
      (!Array.isArray(selectedCategoryIds) || selectedCategoryIds.length > 0)
    ) {
      const selectedCateProjectIds = Array.isArray(selectedCategoryIds)
        ? selectedCategoryIds
        : [selectedCategoryIds];
      calculatedValidSkillIds = selectboxResource.skills
        .filter((skill) =>
          selectedCateProjectIds.includes(skill.categoryProjectId)
        )
        .map((skill) => skill.skillId);
    }

    if (currentSkillIds && currentSkillIds.length > 0 && selectedCategoryIds) {
      const filtered = Array.isArray(currentSkillIds)
        ? currentSkillIds.filter((id: number) =>
            calculatedValidSkillIds.includes(id)
          )
        : calculatedValidSkillIds.includes(currentSkillIds)
        ? currentSkillIds
        : undefined;

      if (!_.isEqual(filtered, currentSkillIds)) {
        form.setFieldValue(
          "skills",
          filtered ? (Array.isArray(filtered) ? filtered : [filtered]) : []
        );
      }
    }
  }, [
    selectedCategoryIds,
    selectboxResource?.skills,
    selectboxResource?.categories,
    form,
  ]);

  useEffect(() => {
    if (!selectboxResource?.categories) {
      return;
    }

    const currentCategoryServiceIds = form.getFieldValue("category_service_ids");
    let calculatedValidCategoryServiceIds: number[] = [];

    if (
      selectedCategoryIds &&
      (!Array.isArray(selectedCategoryIds) || selectedCategoryIds.length > 0)
    ) {
      const selectedCateProjectIds = Array.isArray(selectedCategoryIds)
        ? selectedCategoryIds
        : [selectedCategoryIds];
      calculatedValidCategoryServiceIds = selectboxResource.categories
        .filter((category) =>
          selectedCateProjectIds.includes(category.categoryId)
        )
        .flatMap((category) => category.childrens || [])
        .map((catService) => catService.cateServiceId);
    }

    if (
      currentCategoryServiceIds &&
      currentCategoryServiceIds.length > 0 &&
      selectedCategoryIds
    ) {
      const filtered = Array.isArray(currentCategoryServiceIds)
        ? currentCategoryServiceIds.filter((id: number) =>
            calculatedValidCategoryServiceIds.includes(id)
          )
        : calculatedValidCategoryServiceIds.includes(currentCategoryServiceIds)
        ? currentCategoryServiceIds
        : undefined;

      if (!_.isEqual(filtered, currentCategoryServiceIds)) {
        form.setFieldValue(
          "category_service_ids",
          filtered ? (Array.isArray(filtered) ? filtered : [filtered]) : []
        );
      }
    }
  }, [selectedCategoryIds, selectboxResource?.categories, form]);

  useEffect(() => {
    if (!selectboxResource?.categories) {
      return;
    }

    const currentServiceIds = form.getFieldValue("service_ids");
    let calculatedValidServiceIds: number[] = [];

    if (
      selectedCategoryServiceIds &&
      (!Array.isArray(selectedCategoryServiceIds) ||
        selectedCategoryServiceIds.length > 0)
    ) {
      const selectedIds = Array.isArray(selectedCategoryServiceIds)
        ? selectedCategoryServiceIds
        : [selectedCategoryServiceIds];
      calculatedValidServiceIds = selectboxResource.categories
        .flatMap((category) => category.childrens || [])
        .filter((serviceCategory) =>
          selectedIds.includes(serviceCategory.cateServiceId)
        )
        .flatMap((serviceCategory) => serviceCategory.childrens || [])
        .map((service) => service.serviceId);
    }

    if (
      currentServiceIds &&
      currentServiceIds.length > 0 &&
      selectedCategoryServiceIds
    ) {
      const filtered = Array.isArray(currentServiceIds)
        ? currentServiceIds.filter((id: number) =>
            calculatedValidServiceIds.includes(id)
          )
        : calculatedValidServiceIds.includes(currentServiceIds)
        ? currentServiceIds
        : undefined;

      if (!_.isEqual(filtered, currentServiceIds)) {
        form.setFieldValue("service_ids", filtered);
      }
    }
  }, [selectedCategoryServiceIds, selectboxResource?.categories, form]);

  const isConfirmAndRegisterStep =
    stepIndex === Constants.JOB_ADD_FORM.CONFIRM_AND_REGISTER;
  const isRegisteredOptionsStep =
    stepIndex === Constants.JOB_ADD_FORM.REGISTERED_OPTIONS;

  const mutation = async (
    status: number, 
    successMessage: string, 
    type: "draft" | "next"
  ) => {
    // setIsSubmittingJob(true);
    setActionLoading(type);

    actionValue.current = status;

    const values = form.getFieldsValue(true);
    const categoryProjectIds = Array.isArray(values.category_project_ids)
      ? values.category_project_ids
      : values.category_project_ids
        ? [values.category_project_ids]
        : [];
    let priceMin = 0;
    let priceMax = 0;
    if (values.salary_type === Constants.JOB.SALARY_TYPE.FIXED) {
      priceMin = values.price || 0;
      priceMax = values.price || 0;
    } else if (values.salary_type === Constants.JOB.SALARY_TYPE.DEAL) {
      priceMin = values.price_min || 0;
      priceMax = values.price_max || 0;
    }

    try {
      const result = await updateMutation.mutateAsync({
        ...values,
        category_project_ids: categoryProjectIds,
        price_min: priceMin,
        price_max: priceMax,
        status: actionValue.current,
      });

      if (result && typeof result === "string") {
        setRedirectUrl(result);
      }

      message.success(successMessage);
      return true;
    } catch (apiError: any) {
      message.error(apiError.message || "Đã xảy ra lỗi không xác định.");
      return false;
    } finally {
      // setIsSubmittingJob(false);
      setActionLoading(null);
    }
  }

  const handleDraft = async () => {
    try {
      // setIsSavingDraft(true);
      await form.validateFields();
      const status = Constants.JOB.STATUS.LUU_NHAP;
      const successMessage = "Công việc đã được lưu nháp thành công!";
      const ok = await mutation(status, successMessage, "draft");
      // if (ok) {
      //   router.push(AuthJobRouteUtils.toManagementUrl());
      // }
    } catch {
      message.error("Vui lòng điền đầy đủ và chính xác các thông tin bắt buộc.");
    } 
    // finally {
    //   setIsSavingDraft(false);
    // }
  }

  const handleNextStep = async () => {
    try {
      // setIsSubmittingJob(true);
      await form.validateFields();

      if (isConfirmAndRegisterStep) {
        const status = Constants.JOB.STATUS.DUYET_DANG_TUYEN;
        const successMessage = "Công việc đã được đăng tuyển thành công!";
        const ok = await mutation(status, successMessage, "next");
        if (ok) {
          onChangeStepIndex(stepIndex + 1);
        }
      } else {
        const nextStepIndex = stepIndex + 1;
        if (nextStepIndex < steps.length) {
          onChangeStepIndex(nextStepIndex);
        }
      }
    } catch (validationError) {
      message.error(
        "Vui lòng điền đầy đủ và chính xác các thông tin bắt buộc."
      );
    } 
    // finally {
    //   setIsSubmittingJob(false);
    // }
  };

  const handlePreviousStep = () => {
    if (stepIndex > 0) {
      onChangeStepIndex(stepIndex - 1);
    }
  };

  const isLoading = !selectboxResource || (jobQuery.isFetching || !fullJobResource);

  function renderForm() {
    return (
      <Form
        name={"jobForm"}
        form={form}
        initialValues={{
          name: fullJobResource?.name,
          category_project_ids: _.isArray(fullJobResource?.categories)
            ? fullJobResource?.categories.map(
              (cateProject) => cateProject.categoryId
            )
            : [],
          // locationId: fullJobResource?.location?.locationId,
          // salaryId: fullJobResource?.salary?.salaryId,
          // experienceId: fullJobResource?.experience?.experienceId,
          // timeId: fullJobResource?.time?.timeId,
          // tagIds: _.isArray(fullJobResource?.tags)
          //   ? fullJobResource?.tags.map((tItem) => tItem.tagId)
          //   : [],
          description: fullJobResource?.description,
          // requirements: fullJobResource?.jobRequirements,
          // benefits: fullJobResource?.benefits,
          posting_end_date: fullJobResource?.postingEndDate
            ? datetimeUtils.getMoment(
              fullJobResource?.postingEndDate,
              datetimeUtils.LOCAL_DATE
            )
            : null,
          salary_type: fullJobResource?.salaryType,
          price: fullJobResource?.priceMax,
          price_min: fullJobResource?.priceMin,
          price_max: fullJobResource?.priceMax,
          skills: _.isArray(fullJobResource?.skills)
            ? fullJobResource?.skills.map((tItem) => tItem.skillId)
            : [],
          category_service_ids: _.isArray(fullJobResource?.categoryServices)
            ? fullJobResource?.categoryServices.map(
              (cateService) => cateService.cateServiceId
            )
            : [],
          service_ids: _.isArray(fullJobResource?.services)
            ? fullJobResource?.services.map(
              (service) => service.serviceId
            )
            : [],
          number_accept: fullJobResource?.numberAccept,
          is_public: fullJobResource?.isPublic || 1,
          job_duration_type: fullJobResource?.jobDurationType || 1,
          duration: fullJobResource?.duration,
          need_partners: 1,
          need_many_partners: false,
        }}
        layout={"vertical"}
        className={"jobFormContainer"}
      >
        {stepIndex ===
          JobEditFormUtils.getActiveStepIndex(
            Constants.JOB_ADD_FORM.TAB.JOB_ADD_OVERVIEW
          ) && (
            <JobOverviewStep
              form={form}
              selectboxResource={selectboxResource}
              salaryType={salaryType}
              setSalaryType={setSalaryType}
              selectedCategoryIds={selectedCategoryIds}
              filteredSkills={filteredSkills}
              serviceCategoriesAvailable={serviceCategoriesAvailable}
              selectedCategoryServiceIds={selectedCategoryServiceIds}
              servicesAvailable={servicesAvailable}
            />
          )}
 <JobScopeAndBudgetStep
              form={form}
              partnerId={0}
            />
        {stepIndex ===
          JobEditFormUtils.getActiveStepIndex(
            Constants.JOB_ADD_FORM.TAB.JOB_ADD_SCOPE_AND_BUDGET
          ) && (
            <JobScopeAndBudgetStep
              form={form}
              partnerId={0}
            />
          )}

        {stepIndex ===
          JobEditFormUtils.getActiveStepIndex(
            Constants.JOB_ADD_FORM.TAB.JOB_ADD_CONFIRM_AND_REGISTER
          ) && (
            <JobConfirmAndRegisterStep
              form={form}
              selectboxResource={selectboxResource}
              onAcceptConditionChange={setAcceptCondition}
            />
          )}

        {stepIndex ===
          JobEditFormUtils.getActiveStepIndex(
            Constants.JOB_ADD_FORM.TAB.JOB_ADD_REGISTERED_OPTIONS
          ) && (
            <JobRegisteredOptionsStep
              form={form}
              redirectUrl={redirectUrl}
            />
          )}

        {!isRegisteredOptionsStep && (
          <JobFormNavigationButtons
            partnerId={"0"}
            stepIndex={stepIndex}
            totalSteps={steps.length}
            onPrevious={handlePreviousStep}
            onDraft={handleDraft}
            onNext={handleNextStep}
            form={form}
            nextButtonText={
              isConfirmAndRegisterStep ? "Đăng tuyển" : "Tiếp theo"
            }
            nextButtonLoading={actionLoading === "next"}
            draftButtonLoading={actionLoading === "draft"}
          />
        )}

        {/* {isEditMode && (
          <JobFormActions
            jobId={jobId}
            isLoading={submitMutation.isLoading}
            onSaveDraft={() => {
              actionValue.current = Constants.JOB.STATUS.LUU_NHAP;
              form.submit();
            }}
            onRequestPost={() => {
              actionValue.current =
                Constants.JOB.STATUS.YEU_CAU_DANG_TUYEN;
              form.submit();
            }}
          />
        )} */}
      </Form>
    )
  }

  return (
    <RootLayout>
      <Head>
        <title>{`${pageTitle}`}</title>
      </Head>

      <section className={"breadcrumbContainer"}>
        <div className="contentWrapper">
          <Breadcrumb
            items={[
              {
                title: (
                  <>
                    <IconSvgLocal name={"IC_HOME"} />
                    <span>Trang chủ</span>
                  </>
                ),
                href: "/",
              },
              {
                title: "Công việc",
                href: JobRouteUtils.toJobsSearchScreen({}),
              },
              {
                title: "Công việc đăng tuyển",
                href: AuthJobRouteUtils.toManagementUrl(),
              },
              { title: pageTitle },
            ]}
          />
        </div>
      </section>

      <section className={"sectionContainer"} style={{ paddingTop: "0px" }}>
        <div
          className={"jobFormSectionContainer"}
          style={{ maxWidth: "100%", width: "1395px" }}
        >
          <div className={"contentWrapper"}>
            {fullJobResource?.status === 0 && (
              <div
                className={"jobStepControlContainer"}
                style={{ paddingBottom: "30px" }}
              >
                <JobFormSteps stepIndex={stepIndex} steps={steps as any} partnerId={0} />
              </div>
            )}

            {isLoading ? (
              <Row align={"middle"} justify={"center"} style={{ minHeight: "50vh" }}>
                <Spin size={"large"} />
              </Row>
            ) : fullJobResource?.status !== 0 ? (
              <Row align={"middle"} justify={"center"} style={{ minHeight: "50vh" }}>
                <p>Hãy liên hệ với admin để chỉnh sửa công việc của bạn</p>
              </Row>
            ) : (
              renderForm()
            )}
          </div>
        </div>
      </section>
    </RootLayout>
  );
}

export default JobEditFormScreen;