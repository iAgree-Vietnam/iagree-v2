
import { Typography, Steps, StepsProps } from "antd";

interface PartnerRegisterHeaderProps {
  pageTitle: string;
  stepIndex: number;
  steps: StepsProps[];
  onChangeStepIndex: (current: number) => void;
}

export function PartnerRegisterHeader({
  pageTitle,
  stepIndex,
  steps,
  onChangeStepIndex,
}: PartnerRegisterHeaderProps) {
  return (
    <>
      <div className={"jobFormTitleContainer"}>
        <Typography.Title className={"jobFormTitle"} level={3}>
          {pageTitle}
        </Typography.Title>
      </div>

      <div className={"jobStepControlContainer"} style={{ marginBottom: 15 }}>
        <Steps
          current={stepIndex}
          onChange={onChangeStepIndex}
          size={"small"}
          labelPlacement="vertical"
          items={steps as any}
          className={"jobSteps"}
          key={"title"}
        />
      </div>
    </>
  );
}
