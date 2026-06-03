// src/utils/PartnerRegisterFormUtils.ts

import { PARTNER_REGISTER_FORM } from "../constants/PartnerRegisterConstants";
export const partnerRegisterFormSteps = [
  {
    stepName: PARTNER_REGISTER_FORM.TAB.STEP_1_V2,
    title: "Thông tin cá nhân",
    description: "Chọn các lĩnh vực và dịch vụ bạn cung cấp.",
  },
  {
    stepName: PARTNER_REGISTER_FORM.TAB.STEP_2_V2,
    title: "Chuyên môn",
    description: "Chọn các kỹ năng chuyên môn của bạn.",
  },
  {
    stepName: PARTNER_REGISTER_FORM.TAB.STEP_3_V2,
    title: "Kỹ năng",
    description: "Mô tả vai trò chuyên nghiệp của bạn.",
  },
  {
    stepName: PARTNER_REGISTER_FORM.TAB.STEP_4,
    title: "Kinh nghiệm làm việc",
    description: "Mô tả kinh nghiệm của bạn",
  },
  {
    stepName: PARTNER_REGISTER_FORM.TAB.STEP_5,
    title: "Bước 5",
    description: "Mô tả bước 5.",
  },
  {
    stepName: PARTNER_REGISTER_FORM.TAB.STEP_6,
    title: "Bước 6",
    description: "Mô tả bước 6.",
  },
  {
    stepName: PARTNER_REGISTER_FORM.TAB.STEP_7,
    title: "Bước 7",
    description: "Mô tả bước 7.",
  },
  {
    stepName: PARTNER_REGISTER_FORM.TAB.STEP_8,
    title: "Bước 8",
    description: "Mô tả bước 8.",
  },
  {
    stepName: PARTNER_REGISTER_FORM.TAB.STEP_9,
    title: "Bước 9",
    description: "Mô tả bước 9.",
  },
  {
    stepName: PARTNER_REGISTER_FORM.TAB.STEP_10,
    title: "Bước 10",
    description: "Mô tả bước 10.",
  },
  {
    stepName: PARTNER_REGISTER_FORM.TAB.STEP_11,
    title: "Bước 11",
    description: "Mô tả bước 11.",
  },
  {
    stepName: PARTNER_REGISTER_FORM.TAB.STEP_12,
    title: "Bước 12",
    description: "Mô tả bước 12.",
  },
];
export default class PartnerRegisterFormUtils {
  static getActiveStepIndex(stepName: string): number {
    return partnerRegisterFormSteps.findIndex(
      (step) => step.stepName === stepName
    );
  }

  static getActiveStepName(index: number): string {
    const step = partnerRegisterFormSteps[index];
    return step ? step.stepName : partnerRegisterFormSteps[0].stepName;
  }
}
