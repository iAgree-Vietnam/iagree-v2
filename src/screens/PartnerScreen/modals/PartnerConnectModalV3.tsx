import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Form, Modal, Row, Spin, Typography, message } from 'antd';

import Constants from '@/src/constants/Constants';
import useJobAddSelectbox from '../../JobScreen/JobFormScreen/hooks/useJobAddSelectbox';
import { JobFormParams, JobSelectboxResource } from '@/src/data/job/models/job.types';
import { SkillResource } from '@/src/data/skill/models/skill.types';
import { CategoryResource, CateServiceResource, ServiceResource } from '@/src/data/category/models/category.types';
import useJobAdd from '../../JobScreen/JobFormScreen/hooks/useJobAdd';
import _ from 'lodash';

// Import the step components from JobAddFormScreenV2
import JobOverviewStep from '../../JobScreen/JobFormScreen/components/steps/over_view_step/JobOverviewStep';
import JobScopeAndBudgetStep from '../../JobScreen/JobFormScreen/components/steps/scope_and_budget_step/JobScopeAndBudgetStepV2';
import JobConfirmAndRegisterStep from '../../JobScreen/JobFormScreen/components/steps/confirm_and_register_tep/JobConfirmAndRegisterStep';
import JobFormNavigationButtons from '../../JobScreen/JobFormScreen/components/JobFormNavigationButtons';
import { JobFormSteps } from '../../JobScreen/JobFormScreen/components/JobFormSteps';
import useJobAddFormStep from '../../JobScreen/JobFormScreen/hooks/useJobAddFormStep';
import JobAddFormUtils from '../../JobScreen/JobFormScreen/utils/JobAddFormUtils';
import JobRegisteredOptionsStep from '../../JobScreen/JobFormScreen/components/steps/registered_options_step/JobRegisteredOptionsStep';
import { ExtendedJobSelectboxResource } from '../../JobScreen/JobFormScreen/components/steps/confirm_and_register_tep/JobForSummaryStep';

type PartnerConnectModalProps = {
    partnerId: number;
    parnerName: string;
    categories?: CategoryResource[] | null;
    categoryServices?: CateServiceResource[] | null;
    services?: ServiceResource[] | null;
    skills?: SkillResource[] | null;
}

const PartnerConnectModalV3 = React.forwardRef((props: PartnerConnectModalProps, ref) => {
    const [form] = Form.useForm();
    const actionValue = useRef<number | null>(null);
    const [isOpen, setOpen] = useState(false);
    const [isSubmittingJob, setIsSubmittingJob] = useState(false);
    const [_, setAcceptCondition] = useState<boolean>(false);

    const open = useCallback(() => setOpen(true), []);
    const close = useCallback(() => setOpen(false), []);

    useImperativeHandle(ref, useCallback(() => ({ open, close }), [open, close]));

    const [salaryType, setSalaryType] = useState<number>(
        Constants.JOB.SALARY_TYPE.DEAL
    );

    // Use the step management hook from JobAddFormScreenV2
    const { stepIndex, steps, onChangeStepIndex } = useJobAddFormStep(props.partnerId.toString());

    const selectboxQuery = useJobAddSelectbox();
    const selectboxResource = selectboxQuery.data as JobSelectboxResource;
    const submitMutation = useJobAdd();

    const selectedCategoryIds = Form.useWatch("category_project_ids", form);
    const selectedCategoryServiceIds = Form.useWatch("category_service_ids", form);
    const selectedSkillIds = Form.useWatch("skills", form);
    const selectedServiceIds = Form.useWatch("service_ids", form)

    // Filter skills based on selected categoryIds - using props data instead of selectboxResource
    const filteredSkills: SkillResource[] = useMemo(() => {
        if (!selectedCategoryIds || !props.skills) return [];

        return props.skills.filter((skillItem) => {
            if (Array.isArray(selectedCategoryIds)) {
                return selectedCategoryIds.includes(skillItem.categoryProjectId);
            }
            return skillItem.categoryProjectId === selectedCategoryIds;
        });
    }, [selectedCategoryIds, props.skills]);

    // Filter categoryServices based on selected categoryIds - adapted for props data
    const serviceCategoriesAvailable: CateServiceResource[] = useMemo(() => {
        if (!selectedCategoryIds || !props.categoryServices) return [];

        return props.categoryServices.filter(cateService => {
            if (Array.isArray(selectedCategoryIds)) {
                return selectedCategoryIds.includes(cateService.parentId);
            }
            return cateService.parentId === selectedCategoryIds;
        });
    }, [selectedCategoryIds, props.categoryServices]);

    // Filter services based on selected categoryServiceIds - adapted for props data
    const servicesAvailable: ServiceResource[] = useMemo(() => {
        if (!selectedCategoryServiceIds || !props.services) return [];

        return props.services.filter(service => {
            if (Array.isArray(selectedCategoryServiceIds)) {
                return selectedCategoryServiceIds.includes(service.parentId);
            }
            return service.parentId === selectedCategoryServiceIds;
        });
    }, [selectedCategoryServiceIds, props.services]);

    // Remove the useEffect hooks that were clearing form values
    // The validation will be handled at the component level in the select options

    // Reset dependent fields when categoryProjectIds changes
    useEffect(() => {
        if (!selectedCategoryIds) return;

        // Validate and reset skillIds
        const validSkillIds = Array.isArray(selectedSkillIds)
            ? selectedSkillIds.filter(skillId =>
                filteredSkills.some(skill => skill.skillId === skillId)
            )
            : [];

        // Validate and reset categoryServiceIds
        const validCategoryServiceIds = Array.isArray(selectedCategoryServiceIds)
            ? selectedCategoryServiceIds.filter(cateServiceId =>
                serviceCategoriesAvailable.some(cateService => cateService.cateServiceId === cateServiceId)
            )
            : [];

        // Validate and reset serviceIds
        const validServiceIds = Array.isArray(selectedServiceIds)
            ? selectedServiceIds.filter(serviceId =>
                servicesAvailable.some(service => service.serviceId === serviceId)
            )
            : [];

        // Update form fields if any invalid selections were found
        if (
            validSkillIds.length !== (selectedSkillIds?.length || 0) ||
            validCategoryServiceIds.length !== (selectedCategoryServiceIds?.length || 0) ||
            validServiceIds.length !== (selectedServiceIds?.length || 0)
        ) {
            form.setFieldsValue({
                skillIds: validSkillIds.length > 0 ? validSkillIds : undefined,
                categoryServiceIds: validCategoryServiceIds.length > 0 ? validCategoryServiceIds : undefined,
                serviceIds: validServiceIds.length > 0 ? validServiceIds : undefined,
            });
        }
    }, [selectedCategoryIds, filteredSkills, serviceCategoriesAvailable, servicesAvailable, form, selectedSkillIds, selectedCategoryServiceIds, selectedServiceIds]);

    // Step navigation handlers from JobAddFormScreenV2
    const isConfirmAndRegisterStep = 
        stepIndex === Constants.JOB_ADD_FORM.CONFIRM_AND_REGISTER;
    // const isRegisteredOptionsStep =
    //     stepIndex === Constants.JOB_ADD_FORM.REGISTERED_OPTIONS;

    const mutation = async (status: number, successMessage: string) => {
        setIsSubmittingJob(true);
        actionValue.current = status;

        const values = form.getFieldsValue(true);
        // const categoryProjectIds = [values.category_project_ids];
        let priceMin = 0;
        let priceMax = 0;
        if (values.salary_type === Constants.JOB.SALARY_TYPE.FIXED) {
            priceMin = values.price || 0;
            priceMax = values.price || 0;
        } else if (values.salary_type === Constants.JOB.SALARY_TYPE.DEAL) {
            priceMin = values.price_min || 0;
            priceMax = values.price_max || 0;
        }
        const isPublic = values.is_public ? 1 : 0;
        const partners = [props.partnerId];

        // const payload: any = {
        //     ...values,
        //     price_min: priceMin,
        //     price_max: priceMax,
        //     status: actionValue.current,
        //     is_public: isPublic,
        //     partners: partners,
        // };

        const payload = new FormData();

        Object.entries(values).forEach(([key, value]) => {
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
                "is_public",
                "partners",
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

        if (Array.isArray(values.attachment_files)) {
            values.attachment_files.forEach((file: any, index: number) => {
                payload.append(`attachment_files[${index}]`, file.originFileObj);
            });
        }

        if (values.category_project_ids) {
            // values.category_project_ids.forEach((categoryId: number, index: number) => {
            payload.append(`category_project_ids[]`, String(values.category_project_ids));
            // });
        }

        if (Array.isArray(values.category_service_ids)) {
            values.category_service_ids.forEach((cateServiceId: number, index: number) => {
                payload.append("category_service_ids[]", String(cateServiceId));
            });
        }

        if (Array.isArray(values.service_ids)) {
            values.service_ids.forEach((serviceId: number, index: number) => {
                payload.append("service_ids[]", String(serviceId));
            });
        }

        if (Array.isArray(values.skills)) {
            values.skills.forEach((skillId: number, index: number) => {
                payload.append("skills[]", String(skillId));
            });
        }

        payload.append("status", String(actionValue.current || 0));
        payload.append("is_public", String(isPublic));
        payload.append("partners[]", String(props.partnerId));

        try {
            const result = await submitMutation.mutateAsync(
                payload as unknown as JobFormParams
            );
            message.success(successMessage);
            return true;
        } catch (apiError: any) {
            message.error(apiError.message || "Đã xảy ra lỗi không xác định.");
            return false;
        } finally {
            setIsSubmittingJob(false);
        }
    }

    const handleNextStep = async () => {
        try {
            // Validate all fields in the current step
            await form.validateFields();

            if (isConfirmAndRegisterStep) {
                const status = Constants.JOB.STATUS.YEU_CAU_DANG_TUYEN;
                const successMessage = "Công việc đã được gửi đến Đối tác thành công!";
                const ok = await mutation(status, successMessage);
                if (ok) {
                    handleModalClose();
                }
            } else {
                const nextStepIndex = stepIndex + 1;
                if (nextStepIndex < steps.length) {
                    onChangeStepIndex(nextStepIndex);
                }
            }
        } catch (validationError) {
            message.error("Vui lòng điền đầy đủ và chính xác các thông tin bắt buộc.");
        }
    };

    const handlePreviousStep = () => {
        if (stepIndex > 0) {
            onChangeStepIndex(stepIndex - 1);
        }
    };

    // Handle modal close - reset form and step
    const handleModalClose = () => {
        close();
        form.resetFields();
        onChangeStepIndex(0);
        setAcceptCondition(false);
        setSalaryType(Constants.JOB.SALARY_TYPE.FIXED);
    };

    const isLoading = !selectboxResource;

    function renderForm() {
        return (
            <Form
                name={"partnerConnectJobForm"}
                form={form}
                initialValues={{
                    // Set default values
                    need_partners: 1,
                    need_many_partners: false,
                    accept_condition: false,
                }}
                layout={"vertical"}
                className={"jobFormContainer"}
                preserve={true}
            >
                {stepIndex === 
                    JobAddFormUtils.getActiveStepIndex(
                        Constants.JOB_ADD_FORM.TAB.JOB_ADD_OVERVIEW
                    ) && (
                        <JobOverviewStep
                            form={form}
                            selectboxResource={{
                                ...selectboxResource,
                                categories: props.categories || [],
                                skills: props.skills || [],
                            }}
                            salaryType={salaryType}
                            setSalaryType={setSalaryType}
                            selectedCategoryIds={selectedCategoryIds}
                            filteredSkills={filteredSkills}
                            serviceCategoriesAvailable={serviceCategoriesAvailable}
                            selectedCategoryServiceIds={selectedCategoryServiceIds}
                            servicesAvailable={servicesAvailable}
                        />
                    )
                }

                {stepIndex === 
                    JobAddFormUtils.getActiveStepIndex(
                        Constants.JOB_ADD_FORM.TAB.JOB_ADD_SCOPE_AND_BUDGET
                    ) && (
                    <JobScopeAndBudgetStep 
                        form={form} 
                        partnerId={props.partnerId} 
                    />
                )}

                {stepIndex === 
                    JobAddFormUtils.getActiveStepIndex(
                        Constants.JOB_ADD_FORM.TAB.JOB_ADD_CONFIRM_AND_REGISTER
                    ) && (
                        <JobConfirmAndRegisterStep
                            form={form}
                            selectboxResource={{
                                ...selectboxResource,
                                categories: props.categories || [],
                                skills: props.skills || [],
                                categoryServices: props.categoryServices || [],
                                services: props.services || [],
                            } as ExtendedJobSelectboxResource}
                            onAcceptConditionChange={setAcceptCondition}
                        />
                    )
                }

                {stepIndex === 
                    JobAddFormUtils.getActiveStepIndex(
                        Constants.JOB_ADD_FORM.TAB.JOB_ADD_REGISTERED_OPTIONS
                    ) && (
                    <JobRegisteredOptionsStep form={form} />
                )}

                {/* {!isRegisteredOptionsStep && ( */}
                    <JobFormNavigationButtons
                        partnerId={props.partnerId}
                        stepIndex={stepIndex}
                        totalSteps={steps.length}
                        onPrevious={handlePreviousStep}
                        onDraft={() => {}}
                        onNext={handleNextStep}
                        form={form}
                        nextButtonText={
                            isConfirmAndRegisterStep ? "Gửi công việc" : "Tiếp theo"
                        }
                        nextButtonLoading={isSubmittingJob}
                    />
                {/* )} */}
            </Form>
        );
    }

    return (
        <Modal
            style={{ top: 20 }}
            width={{
                xs: '95%',
                sm: '90%',
                md: '85%',
                lg: '80%',
                xl: '75%',
                xxl: '70%',
            }}
            centered
            open={isOpen}
            className={'applyJobModalContainer'}
            footer={null}
            onCancel={handleModalClose}
            maskClosable={false}
            destroyOnClose={false} // Prevent destroying modal content on close
        >
            <Typography.Paragraph
                className={'modalTitle'}
                style={{ textAlign: 'left', marginBottom: '24px' }}
            >
                Kết nối với Đối tác {props.parnerName}
            </Typography.Paragraph>

            {/* Step indicator */}
            <div
                className={'jobStepControlContainer'}
                style={{ paddingBottom: '30px' }}
            >
                <JobFormSteps stepIndex={stepIndex} steps={steps} partnerId={props.partnerId} />
            </div>

            {isLoading ? (
                <Row align={'middle'} justify={'center'} style={{ minHeight: '50vh' }}>
                    <Spin size={'large'} />
                </Row>
            ) : (
                renderForm()
            )}
        </Modal>
    );
});

PartnerConnectModalV3.displayName = 'PartnerConnectModalV3';

export default PartnerConnectModalV3;