
import { Button, Space } from "antd";

interface PartnerRegisterNavigationProps {
  stepIndex: number;
  totalSteps: number;
  onChangeStepIndex: (index: number) => void;
  onNextClick: () => void;
  onSkipClick: () => void;
  disableNext: boolean;
  isSubmitting?: boolean;
  isStepOptional?: boolean;
}

export const PartnerRegisterNavigation: React.FC<
  PartnerRegisterNavigationProps
> = ({
  stepIndex,
  totalSteps,
  onChangeStepIndex,
  onNextClick,
  onSkipClick,
  disableNext,
  isSubmitting = false,
  isStepOptional = false,
}) => {
  const isLastStep = stepIndex === totalSteps - 1;

  const showSkipButton = isStepOptional && disableNext;

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexShrink: 0,
      }}
    >
      {stepIndex > 0 && (
        <Button
          type="default"
          onClick={() => onChangeStepIndex(stepIndex - 1)}
          disabled={isSubmitting}
          style={{ width: 120 }}
        >
          Quay lại
        </Button>
      )}
      <Space style={{ marginLeft: "auto" }}>
        {showSkipButton && (
          <Button
            type="text"
            onClick={onSkipClick}
            style={{ color: "#09993E" }}
          >
            Bỏ qua
          </Button>
        )}
        <Button
          type="primary"
          onClick={onNextClick}
          disabled={disableNext}
          loading={isSubmitting}
          style={{ width: isLastStep ? 160 : 130 }}
        >
          {isLastStep ? "Hoàn tất đăng ký" : "Tiếp theo"}
        </Button>
      </Space>
    </div>
  );
};
