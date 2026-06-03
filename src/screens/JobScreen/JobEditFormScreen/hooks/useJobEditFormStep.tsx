import Constants from "@/src/constants/Constants";
// import { StepsProps } from "antd";
import { useMemo, useState } from "react";
import JobEditFormUtils from "../utils/JobEditFormUtils";

const jobEditFormSteps = [
  {
    title: "Thông tin tổng quan",
    description: "",
  },
  {
    title: "Phạm vi & ngân sách",
    description: "",
  },
  {
    title: "Xác nhận & đăng",
    description: "",
  },
];

const optionalLastStep = [
  {
    title: "Tuỳ chọn sau khi đăng",
    description: "",
  },
];

export default function useJobEditFormStep(
  partnerId: string | null | undefined
) {
  const filteredSteps = useMemo(() => {
    const steps = [...jobEditFormSteps];
    if (!partnerId || partnerId === "" || partnerId === "0") {
      steps.push(...optionalLastStep);
    }
    return steps;
  }, [partnerId]);

  // Initialize with the first step's name
  const [stepName, setStepName] = useState(
    Constants.JOB_ADD_FORM.TAB.JOB_ADD_OVERVIEW
  );

  // Initialize with the first step's index
  const [currentStepIndex, setCurrentStepIndex] = useState(
    JobEditFormUtils.getActiveStepIndex(
      Constants.JOB_ADD_FORM.TAB.JOB_ADD_OVERVIEW
    )
  );

  const steps = useMemo(() => {
    return filteredSteps?.map((step, index) => {
      let status = "process";
      if (index < currentStepIndex) status = "finish";
      if (index > currentStepIndex) status = "wait";
      return { ...step, status };
    });
  }, [currentStepIndex, filteredSteps]);

  // This function will now be the primary way to change steps
  function onChangeStepIndex(newIndex: number) {
    // Prevent going past the total steps
    if (newIndex >= filteredSteps.length || newIndex < 0) return;

    // Determine the stepName based on the newIndex
    const newStepName = JobEditFormUtils.getActiveStepName(newIndex);

    // Update both state variables
    setStepName(newStepName);
    setCurrentStepIndex(newIndex);
  }

  return {
    stepIndex: currentStepIndex,
    onChangeStepIndex,
    stepName,
    steps,
  };
}
