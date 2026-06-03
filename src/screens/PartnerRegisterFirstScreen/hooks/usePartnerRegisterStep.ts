import { useState, useMemo } from "react";
import PartnerRegisterFormUtils, {
  partnerRegisterFormSteps,
} from "../utils/PartnerRegisterFormUtils";
import { PARTNER_REGISTER_FORM } from "../constants/PartnerRegisterConstants";

export default function usePartnerRegisterStep() {
  const [stepName, setStepName] = useState(PARTNER_REGISTER_FORM.TAB.STEP_1_V2);
  const [currentStepIndex, setCurrentStepIndex] = useState(
    PartnerRegisterFormUtils.getActiveStepIndex(
      PARTNER_REGISTER_FORM.TAB.STEP_1_V2
    )
  );

  const totalSteps = useMemo(() => partnerRegisterFormSteps.length, []);

  function onChangeStepIndex(newIndex: number) {
    if (newIndex >= totalSteps || newIndex < 0) {
      return;
    }

    const newStepName = PartnerRegisterFormUtils.getActiveStepName(newIndex);
    setStepName(newStepName);
    setCurrentStepIndex(newIndex);
  }

  return {
    stepIndex: currentStepIndex,
    onChangeStepIndex,
    stepName,
    totalSteps,
  };
}
