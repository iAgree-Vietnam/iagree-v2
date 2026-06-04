import React, { useMemo, useRef, useState, useEffect } from "react";
import RootLayout from "@/src/layouts/RootLayout";
import { Breadcrumb, Form, Row, Spin, message } from "antd";
import useJobAddSelectbox from "./hooks/useJobAddSelectbox";
import {
  JobFormParams,
  JobSelectboxResource,
} from "@/src/data/job/models/job.types";
import useJobAdd from "./hooks/useJobAdd";
import Constants from "@/src/constants/Constants";
import useSelectedJob from "../JobDetailScreen/hooks/useSelectedJob";
import _, { isEmpty } from "lodash";
import datetimeUtils from "@/src/utils/DatetimeUtils";
import JobFormNavigationButtons from "./components/JobFormNavigationButtons";
import Head from "next/head";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import JobRouteUtils from "@/src/data/job/utils/JobRouteUtils";
import AuthJobRouteUtils from "@/src/data/auth/utils/AuthJobRouteUtils";
import JobAddFormUtils from "./utils/JobAddFormUtils";
import useJobAddFormStep from "./hooks/useJobAddFormStep";
import { JobFormSteps } from "./components/JobFormSteps";
import { SkillResource } from "@/src/data/skill/models/skill.types";
import { CateServiceResource } from "@/src/data/category/models/category.types";
import JobScopeAndBudgetStep from "./components/steps/scope_and_budget_step/JobScopeAndBudgetStepV2";
import JobRegisteredOptionsStep from "./components/steps/registered_options_step/JobRegisteredOptionsStep";
import JobConfirmAndRegisterStep from "./components/steps/confirm_and_register_tep/JobConfirmAndRegisterStep";
import JobOverviewStep from "./components/steps/over_view_step/JobOverviewStep";
import { useRouter } from "next/router";
import PostJobSuccessScreen from "../../JobsPostSuccess/JobsPostSuccess";
import { useSearchParams } from "next/navigation";
import AIJobBriefButton from "@/src/components/AIJobBrief/AIJobBriefButton";

interface JobFormScreenV2Props {
  jobId?: number | null | undefined;
}

function JobFormScreenV2(props: JobFormScreenV2Props) {
  const { jobId } = props;
  const router = useRouter();

  const [form] = Form.useForm();
  const actionValue = useRef<number | null>(null);

  const [salaryType, setSalaryType] = useState<number>(
    Constants.JOB.SALARY_TYPE.DEAL
  );
  const [actionLoading, setActionLoading] = useState<"draft" | "next" | null>(
    null
  );
  // const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  const [acceptCondition, setAcceptCondition] = useState<boolean>(false);
  const [postSuccess, setPostSuccess] = useState<string>("");

  const { stepIndex, steps, onChangeStepIndex } = useJobAddFormStep("0");

  const selectboxQuery = useJobAddSelectbox();
  const jobQuery = useSelectedJob(jobId as number, {
    initData: undefined,
    onSuccess: (fullJobResource) => {
      setSalaryType(fullJobResource?.salaryType);

      if (fullJobResource) {
        form.setFieldsValue({
          skillIds: fullJobResource.skills?.map((skill) => skill.skillId) || [],
          categoryServiceIds:
            fullJobResource.categoryServices?.map(
              (service) => service.cateServiceId
            ) || [],
          serviceIds:
            fullJobResource.services?.map((service) => service.serviceId) || [],
          acceptCondition: fullJobResource.isReadTerm === 1,
        });
        setAcceptCondition(fullJobResource.isReadTerm === 1);
      }
    },
  });

  const fullJobResource = jobQuery.data;
  const selectboxResource = selectboxQuery.data as JobSelectboxResource;

  const pageTitle = "Đăng công việc mới";

  const addMutation = useJobAdd();

  const selectedCategoryServiceIds = Form.useWatch(
    "category_service_ids",
    form
  );
  const selectedCategoryIds = Form.useWatch("category_project_ids", form);

  const filteredSkills: SkillResource[] = useMemo(() => {
    if (!selectedCategoryIds || !selectboxResource?.skills) return [];

    return selectboxResource.skills.filter((skillItem) => {
      if (Array.isArray(selectedCategoryIds)) {
        return selectedCategoryIds.includes(skillItem.categoryProjectId);
      }
      return skillItem.categoryProjectId === selectedCategoryIds;
    });
  }, [selectedCategoryIds, selectboxResource?.skills]);

  const servicesAvailable = useMemo(() => {
    if (!selectedCategoryServiceIds || !selectboxResource?.categories)
      return [];

    const allServiceCategories = selectboxResource?.categories?.flatMap(
      (category) => category?.childrens || []
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

    return selectboxResource?.categories
      ?.filter((category) => {
        if (Array.isArray(selectedCategoryIds)) {
          return selectedCategoryIds?.includes(category?.categoryId);
        }
        return category?.categoryId === selectedCategoryIds;
      })
      .flatMap((category) => category?.childrens || []);
  }, [selectedCategoryIds, selectboxResource?.categories]);

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

    const currentCategoryServiceIds = form.getFieldValue(
      "category_service_ids"
    );
    let calculatedValidCategoryServiceIds: number[] = [];

    if (
      selectedCategoryIds &&
      (!Array.isArray(selectedCategoryIds) || selectedCategoryIds.length > 0)
    ) {
      const selectedCateProjectIds = Array.isArray(selectedCategoryIds)
        ? selectedCategoryIds
        : [selectedCategoryIds];
      calculatedValidCategoryServiceIds = selectboxResource?.categories
        ?.filter((category) =>
          selectedCateProjectIds?.includes(category.categoryId)
        )
        .flatMap((category) => category?.childrens || [])
        .map((catService) => catService?.cateServiceId);
    }

    if (
      currentCategoryServiceIds &&
      currentCategoryServiceIds.length > 0 &&
      selectedCategoryIds
    ) {
      const filtered = Array.isArray(currentCategoryServiceIds)
        ? currentCategoryServiceIds.filter((id: number) =>
            calculatedValidCategoryServiceIds?.includes(id)
          )
        : calculatedValidCategoryServiceIds?.includes(currentCategoryServiceIds)
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
      calculatedValidServiceIds = selectboxResource?.categories
        ?.flatMap((category) => category.childrens || [])
        ?.filter((serviceCategory) =>
          selectedIds?.includes(serviceCategory.cateServiceId)
        )
        ?.flatMap((serviceCategory) => serviceCategory.childrens || [])
        ?.map((service) => service.serviceId);
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
    setActionLoading(type);
    actionValue.current = status;

    const values = form.getFieldsValue(true);

    const formattedValues = {
      ...values,
      posting_end_date: values.posting_end_date
        ? values.posting_end_date.format(datetimeUtils.BACKEND_DATE_TIME)
        : null,
    };

    let priceMin = 0;
    let priceMax = 0;
    if (formattedValues.salary_type === Constants.JOB.SALARY_TYPE.FIXED) {
      priceMin = formattedValues.price || 0;
      priceMax = formattedValues.price || 0;
    } else if (formattedValues.salary_type === Constants.JOB.SALARY_TYPE.DEAL) {
      priceMin = formattedValues.price_min || 0;
      priceMax = formattedValues.price_max || 0;
    }

    const payload = new FormData();

    Object.entries(formattedValues).forEach(([key, value]) => {
      if (
        [
          "attachment_files",
          "category_project_ids",
          "category_service_ids",
          "service_ids",
          "skills",
          "price",
          "price_min",
          "price_max",
        ].includes(key)
      ) {
        return;
      }
      if (value !== null && value !== undefined) {
        payload.append(key, String(value));
      }
    });

    payload.append("price_min", String(priceMin));
    payload.append("price_max", String(priceMax));

    if (Array.isArray(formattedValues.attachment_files)) {
      formattedValues.attachment_files.forEach((file: any, index: number) => {
        payload.append(`attachment_files[${index}]`, file.originFileObj);
      });
    }

    if (formattedValues.category_project_ids) {
      payload.append(
        `category_project_ids[]`,
        String(formattedValues.category_project_ids)
      );
    }

    if (Array.isArray(formattedValues.category_service_ids)) {
      formattedValues.category_service_ids.forEach((id: number) => {
        payload.append("category_service_ids[]", String(id));
      });
    }

    if (Array.isArray(formattedValues.service_ids)) {
      formattedValues.service_ids.forEach((id: number) => {
        payload.append("service_ids[]", String(id));
      });
    }

    if (Array.isArray(formattedValues.skills)) {
      formattedValues.skills.forEach((id: number) => {
        payload.append("skills[]", String(id));
      });
    }

    payload.append("status", String(actionValue.current || 0));

    try {
      const result = await addMutation.mutateAsync(
        payload as unknown as JobFormParams
      );

      // if (result && typeof result === "string") {
      //   setRedirectUrl(result);
      // }

      // message.success(successMessage);
      // return true;

      if (result && typeof result === "string") {
        message.success(successMessage);
        return result;
      }
      return null;
    } catch (apiError: any) {
      message.error(apiError.message || "Đã xảy ra lỗi không xác định.");
      return false;
    } finally {
      setActionLoading(null);
    }
  };

  const handleDraft = async () => {
    try {
      await form.validateFields();
      const status = Constants.JOB.STATUS.LUU_NHAP;
      const successMessage = "Công việc đã được lưu nháp thành công!";
      const redirect = await mutation(status, successMessage, "draft");
      if (redirect) {
        // router.push(AuthJobRouteUtils.toManagementUrl());
        router.push(redirect);
      }
    } catch {
      message.error(
        "Vui lòng điền đầy đủ và chính xác các thông tin bắt buộc."
      );
    }
  };

  const handleNextStep = async () => {
    try {
      await form.validateFields();

      if (isConfirmAndRegisterStep) {
        const status = Constants.JOB.STATUS.YEU_CAU_DANG_TUYEN;
        const successMessage = "Công việc đã được gửi đến iAgree thành công!";
        const redirect = await mutation(status, successMessage, "next");
        if (redirect) {
          // const params = new URLSearchParams(location.search); // Lấy query string hiện tại
          // params.set("jobId", redirect); // Cập nhật hoặc thêm query string "jobId"

          // // Cập nhật URL mới mà không làm reload trang
          // navigate(`${location.pathname}?${params.toString()}`, { replace: true });

          setPostSuccess(redirect);
          // onChangeStepIndex(stepIndex + 1);
        }
      } else {
        const nextStepIndex = stepIndex + 1;
        if (nextStepIndex < steps.length) {
          onChangeStepIndex(nextStepIndex);
        }
      }
    } catch {
      message.error(
        "Vui lòng điền đầy đủ và chính xác các thông tin bắt buộc."
      );
    }
  };

  const handlePreviousStep = () => {
    if (stepIndex > 0) {
      onChangeStepIndex(stepIndex - 1);
    }
  };

  const isLoading = !selectboxResource;

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
          description: fullJobResource?.description,
          posting_end_date: fullJobResource?.endDate
            ? datetimeUtils.getMoment(
                fullJobResource?.endDate,
                datetimeUtils.LOCAL_DATE
              )
            : null,
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
            ? fullJobResource?.services.map((service) => service.serviceId)
            : [],
          number_accept: fullJobResource?.numberAccept,
          is_public: fullJobResource?.isPublic || 1,
          need_partners: 1,
          need_many_partners: false,
          accept_condition: fullJobResource ? 1 : 0,
        }}
        layout={"vertical"}
        className={"jobFormContainer"}
      >
        {stepIndex ===
          JobAddFormUtils.getActiveStepIndex(
            Constants.JOB_ADD_FORM.TAB.JOB_ADD_OVERVIEW
          ) && (
          <>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
              <AIJobBriefButton
                form={form}
                selectboxResource={selectboxResource}
              />
            </div>
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
          </>
        )}

        {stepIndex ===
          JobAddFormUtils.getActiveStepIndex(
            Constants.JOB_ADD_FORM.TAB.JOB_ADD_SCOPE_AND_BUDGET
          ) && <JobScopeAndBudgetStep form={form} partnerId={0} />}

        {stepIndex ===
          JobAddFormUtils.getActiveStepIndex(
            Constants.JOB_ADD_FORM.TAB.JOB_ADD_CONFIRM_AND_REGISTER
          ) && (
          <JobConfirmAndRegisterStep
            form={form}
            selectboxResource={selectboxResource}
            onAcceptConditionChange={setAcceptCondition}
          />
        )}

        {/* {stepIndex ===
          JobAddFormUtils.getActiveStepIndex(
            Constants.JOB_ADD_FORM.TAB.JOB_ADD_REGISTERED_OPTIONS
          ) && (
          <JobRegisteredOptionsStep form={form} redirectUrl={redirectUrl} />
        )} */}

        {!isRegisteredOptionsStep && (
          <JobFormNavigationButtons
            partnerId={0}
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
      </Form>
    );
  }

  return (
    <RootLayout>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      {isEmpty(postSuccess) ? (
        <>
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
                <div
                  className={"jobStepControlContainer"}
                  style={{ paddingBottom: "30px" }}
                >
                  <JobFormSteps
                    stepIndex={stepIndex}
                    steps={steps}
                    partnerId={0}
                  />
                </div>

                {isLoading ? (
                  <Row
                    align={"middle"}
                    justify={"center"}
                    style={{ minHeight: "50vh" }}
                  >
                    <Spin size={"large"} />
                  </Row>
                ) : (
                  renderForm()
                )}
              </div>
            </div>
          </section>
        </>
      ) : (
        <PostJobSuccessScreen jobId={postSuccess} />
      )}
    </RootLayout>
  );
}

export default JobFormScreenV2;
