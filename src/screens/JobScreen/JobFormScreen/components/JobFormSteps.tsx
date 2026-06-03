
import {  Steps, StepsProps, Typography } from "antd";

interface JobAddFormHeaderProps {
  stepIndex: number;
  steps: StepsProps[];
  partnerId: number | null | undefined;
}

export function JobFormSteps({ stepIndex, steps, partnerId }: JobAddFormHeaderProps) {
  return (
    <>
      <div
        className={"jobFormTitleContainer"}
        style={{
          border: "none",
          marginBottom: 0,
        }}
      >
        <Typography.Title className={"jobFormTitle"} level={3}>
          {partnerId === 0 ? 'Đăng công việc mới' : ''}
        </Typography.Title>
      </div>
      <div className={"jobStepControlContainer"} style={{ marginBottom: 15 }}>
        <Steps
          current={stepIndex}
          size={"small"}
          labelPlacement="vertical"
          items={steps as any}
          className={"jobSteps"}
        />
      </div>
    </>
  );
}
