
import { FormInstance } from "antd/lib/form/Form";

import { JobSelectboxResource } from "@/src/data/job/models/job.types";
import JobFormSummaryStep from "./JobForSummaryStep"; // Import JobFormSummaryStep

interface JobConfirmAndRegisterStepsProps {
  form: FormInstance;
  selectboxResource: JobSelectboxResource;
  onAcceptConditionChange: (accepted: boolean) => void;
}

function JobConfirmAndRegisterStep(props: JobConfirmAndRegisterStepsProps) {
  const { form, selectboxResource, onAcceptConditionChange } = props;

  return (
    <>
      <div
        className={"formGroupContainer"}
        style={{ borderBottom: "0px solid #D4D4D4" }}
      >
        <div className={"formGroupContentContainer"}>
          <JobFormSummaryStep
            form={form}
            selectboxResource={selectboxResource}
            onAcceptConditionChange={onAcceptConditionChange} // Pass the handler down
          />
        </div>
      </div>
    </>
  );
}

export default JobConfirmAndRegisterStep;
