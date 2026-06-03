import Constants from "@/src/constants/Constants";
import datetimeUtils from "@/src/utils/DatetimeUtils";

export default class PartnerRegisterUtils {
    static getActiveStepIndex(stepName: string) {
        let stepIndex = 0;
        switch (stepName) {
            case Constants.PARTNER.TAB.REGISTER_INFO: {
                stepIndex = 0;
                break;
            }

            case Constants.PARTNER.TAB.REGISTER_VERIFY: {
                stepIndex = 1;
                break;
            }

            case Constants.PARTNER.TAB.REGISTER_PAYMENT: {
                stepIndex = 2;
                break;
            }

            case Constants.PARTNER.TAB.REGISTER_CONFIRM: {
                stepIndex = 3;
                break;
            }
        }

        return stepIndex;
    }

    static getActiveStepName(stepIndex: number) {
        let activeStepIndex = Constants.PARTNER.TAB.REGISTER_INFO;

        switch (stepIndex) {
            case 0: {
                activeStepIndex = Constants.PARTNER.TAB.REGISTER_INFO;
                break;
            }

            case 1: {
                activeStepIndex = Constants.PARTNER.TAB.REGISTER_VERIFY;
                break;
            }

            case 2: {
                activeStepIndex = Constants.PARTNER.TAB.REGISTER_PAYMENT;
                break;
            }

            case 3: {
                activeStepIndex = Constants.PARTNER.TAB.REGISTER_CONFIRM;
                break;
            }
        }

        return activeStepIndex;
    }

    static prepareFormDataForSubmission = (values: any, avatarFile: File | null) => {
        const formData = new FormData();
      
        /* ===================== BASIC ===================== */
        values?.categoryProjectIds?.forEach((id: number) => {
          formData.append("category_project_ids[]", id.toString());
        });
      
        values?.languageIds?.forEach((id: number, idx: number) => {
          formData.append(`languages[${idx}]`, id.toString());
        });
      
        values?.locationIds?.forEach((id: number, idx: number) => {
          formData.append(`location_ids[${idx}]`, id.toString());
        });
      
        formData.append("position", values?.position || "");
        formData.append("work_experience_id", values?.experienceId?.toString() || "");
        formData.append("description", values?.description || "");
      
        /* ===================== EDUCATIONS ===================== */
        values?.partnerEducations?.forEach((education: any, idx: number) => {
          formData.append(`educations[${idx}][name]`, education?.name || "");
          formData.append(`educations[${idx}][degree]`, education?.degree || "");
          formData.append(`educations[${idx}][majors]`, education?.majors || "");
      
          if (education?.start_date) {
            formData.append(
              `educations[${idx}][start_date]`,
              datetimeUtils.normalizeToBackendDateTime00(education.start_date)
            );
          }
      
          if (education?.end_date) {
            formData.append(
              `educations[${idx}][end_date]`,
              datetimeUtils.normalizeToBackendDateTime00(education.end_date)
            );
          }
      
          formData.append(`educations[${idx}][grade]`, education?.grade || "");
          formData.append(
            `educations[${idx}][description]`,
            education?.description || ""
          );
        });
      
        /* ===================== WORK HISTORIES ===================== */
        values?.workHistories?.forEach((workHistory: any, idx: number) => {
          formData.append(
            `workHistories[${idx}][name]`,
            workHistory?.name || ""
          );
          formData.append(
            `workHistories[${idx}][position]`,
            workHistory?.position || ""
          );
      
          if (workHistory?.start_date) {
            formData.append(
              `workHistories[${idx}][start_date]`,
              datetimeUtils.normalizeToBackendDateTime00(workHistory.start_date)
            );
          }
      
          if (workHistory?.end_date) {
            formData.append(
              `workHistories[${idx}][end_date]`,
              datetimeUtils.normalizeToBackendDateTime00(workHistory.end_date)
            );
          }
      
          formData.append(
            `workHistories[${idx}][description]`,
            workHistory?.description || ""
          );
        });
      
        /* ===================== SKILLS / SERVICES ===================== */
        values?.skillIds?.forEach((id: number) => {
          formData.append("main_skills[]", id.toString());
        });
      
        values?.categoryServiceIds?.forEach((id: number) => {
          formData.append("category_service_ids[]", id.toString());
        });
      
        values?.serviceIds?.forEach((id: number) => {
          formData.append("service_ids[]", id.toString());
        });
      
        /* ===================== TYPICAL PROJECTS ===================== */
        values?.typicalProjects?.forEach((project: any, index: number) => {
          if (project?.id) {
            formData.append(`typicalProjects[${index}][id]`, String(project.id));
          }
      
          formData.append(
            `typicalProjects[${index}][name]`,
            project?.name || ""
          );
          formData.append(
            `typicalProjects[${index}][role]`,
            project?.role || ""
          );
      
          if (project?.start_date) {
            formData.append(
              `typicalProjects[${index}][start_date]`,
              datetimeUtils.normalizeToBackendDateTime00(project.start_date)
            );
          }
      
          if (project?.end_date) {
            formData.append(
              `typicalProjects[${index}][end_date]`,
              datetimeUtils.normalizeToBackendDateTime00(project.end_date)
            );
          }
      
          formData.append(
            `typicalProjects[${index}][description]`,
            project?.description || ""
          );
          formData.append(
            `typicalProjects[${index}][achievements]`,
            project?.achievements || ""
          );
      
          if (project?.image instanceof File) {
            formData.append(`typicalProjects[${index}][image]`, project.image);
          }
      
          project?.files?.forEach((file: File, fileIndex: number) => {
            if (file instanceof File) {
              formData.append(
                `typicalProjects[${index}][files][${fileIndex}]`,
                file
              );
            }
          });
        });
      
        /* ===================== AVATAR ===================== */
        if (avatarFile) {
            formData.append("avatar", avatarFile);
          }
        return formData;
      };
      
}