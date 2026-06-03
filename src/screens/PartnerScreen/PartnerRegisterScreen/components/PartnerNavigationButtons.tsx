
import { Button, Row, Col, FormInstance } from "antd";

interface PartnerNavigationButtonsProps {
  stepIndex: number;
  handlePrevStep: () => void;
  handleNextStep: () => void;
  form: FormInstance;
}

export function PartnerNavigationButtons({
  stepIndex,
  handlePrevStep,
  handleNextStep,
  form,
}: PartnerNavigationButtonsProps) {
  const handleValidation = async () => {
    try {
      await form.validateFields();
      handleNextStep();
    } catch (error) {
      console.error("Form validation failed:", error);
    }
  };

  return (
    <>
      {stepIndex === 0 ? (
        <Row gutter={24} style={{ display: "flex", justifyContent: "center" }}>
          <Col xs={24} lg={12}>
            <Button
              size={"large"}
              block
              type={"primary"}
              onClick={handleValidation}
            >
              {"Tiếp theo"}
            </Button>
          </Col>
        </Row>
      ) : (
        <Row gutter={24}>
          <Col xs={24} lg={12}>
            <Button size={"large"} block onClick={handlePrevStep}>
              {"Quay lại"}
            </Button>
          </Col>

          <Col xs={24} lg={12}>
            {stepIndex === 3 ? (
              <Button
                size={"large"}
                block
                type={"primary"}
                onClick={() => form.submit()}
              >
                {"Hoàn tất"}
              </Button>
            ) : (
              <Button
                size={"large"}
                block
                type={"primary"}
                onClick={handleValidation}
              >
                {"Tiếp theo"}
              </Button>
            )}
          </Col>
        </Row>
      )}
    </>
  );
}
