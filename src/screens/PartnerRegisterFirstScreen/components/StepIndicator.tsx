
import { Typography } from "antd";

interface StepIndicatorProps {
  stepIndex: number;
  totalSteps: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  stepIndex,
  totalSteps,
}) => {
  return (
    <div
      style={{
        marginBottom: 15,
        textAlign: "left",
        color: "#000000",
        fontWeight: "400",
      }}
    >
      {/* Display current step out of total steps */}
      <Typography.Text style={{ color: "inherit" }}>
        {`${stepIndex + 1} / ${totalSteps}`}
      </Typography.Text>
    </div>
  );
};
