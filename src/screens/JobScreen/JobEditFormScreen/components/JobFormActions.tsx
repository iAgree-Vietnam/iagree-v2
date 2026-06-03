
import { Button, Col, Row } from "antd";
import _ from "lodash";

interface JobFormActionsProps {
  jobId?: number | null | undefined;
  isLoading: boolean;
  onSaveDraft: () => void;
  onRequestPost: () => void;
}

function JobFormActions(props: JobFormActionsProps) {
  const { jobId, isLoading, onSaveDraft, onRequestPost } = props;

  return (
    <Row
      className={"formSubmitter"}
      gutter={[20, 8]}
      align={"middle"}
      justify={"center"}
    >
      {!_.isNumber(jobId) && (
        <Col xs={24} lg={8}>
          <Button
            block
            size={"large"}
            type={"default"}
            loading={isLoading}
            disabled={isLoading}
            onClick={onSaveDraft}
          >
            Lưu nháp
          </Button>
        </Col>
      )}
      <Col xs={24} lg={8}>
        <Button
          block
          size={"large"}
          type={"primary"}
          loading={isLoading}
          disabled={isLoading}
          onClick={onRequestPost}
        >
          {!_.isNumber(jobId) ? "Yêu cầu đăng tuyển" : "Cập nhật công việc"}
        </Button>
      </Col>
    </Row>
  );
}

export default JobFormActions;
