import { FullJobResource } from "@/src/data/job/models/job.types";
import { useMemo, useState, useEffect } from "react";
import JobUtils from "@/src/screens/JobScreen/JobDetailScreen/utils/JobUtils";
import { FullProfileResource } from "@/src/data/auth/models/types";
import Constants from "../../../../constants/Constants";
// import { StepsProps } from "antd";
import { includes, toString } from "lodash";

const partnerSteps = [
  {
    title: "Ứng tuyển",
    description: "",
  },
  {
    title: "Xác nhận công việc",
    description: "",
  },
  // {
  //   title: "Đang thực hiện công việc",
  //   description: "",
  // },
  {
    title: "Thực hiện và nghiệm thu",
    description: "",
  },
  {
    title: "Đánh giá",
    description: "",
  },
  {
    title: "Hoàn thành",
    description: "",
  },
];

const createdSteps = [
  {
    title: "Đăng tuyển",
    description: "",
  },
  {
    title: "Tìm đối tác",
    description: "",
  },
  {
    title: "Xác nhận đối tác",
    description: "",
  },
  {
    title: "Thanh toán",
    description: "",
  },
  // {
  //   title: "Thực hiện công việc",
  //   description: "",
  // },
  {
    title: "Thực hiện và nghiệm thu",
    description: "",
  },
  {
    title: "Hoàn thành",
    description: "",
  },
];

export default function useJobStep(
  fullProfileResource: Partial<FullProfileResource> | null,
  fullJobResource: FullJobResource
) {

  const [stepName, setStepName] = useState(Constants.JOB.TAB.JOB_INFO);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const isCreated = useMemo(
    () => fullJobResource?.createdByUserId === fullProfileResource?.userId,
    [fullJobResource, fullProfileResource]
  );

  const isPartner = useMemo(
    // () => fullJobResource?.partnerUserId === fullProfileResource?.userId,
    () => fullJobResource?.isApply?.userId === fullProfileResource?.userId,
    [fullJobResource, fullProfileResource]
  );

  const isSelectedPartner = useMemo(
    () => fullJobResource?.isApply?.userId === fullProfileResource?.userId,
    [fullJobResource, fullProfileResource]
  );

  useEffect(() => {
    if (!fullJobResource || !fullProfileResource) return;

    let newStepName = Constants.JOB.TAB.JOB_INFO;
    let newStepIndex = 0;

    if (isCreated) {

      newStepName = JobUtils.getCreateActiveStepName(fullJobResource);
      newStepIndex = JobUtils.getCreateActiveStepIndex(newStepName);

    } else if (isPartner) {

      newStepName = JobUtils.getPartnerActiveStepName(fullJobResource);
      newStepIndex = JobUtils.getPartnerActiveStepIndex(newStepName);
    } else if (isSelectedPartner) {

      newStepName = JobUtils.getPartnerActiveStepName(fullJobResource);
      newStepIndex = JobUtils.getPartnerActiveStepIndex(newStepName);
    }

    if (newStepName !== stepName) setStepName(newStepName);

    if (newStepIndex !== currentStepIndex) setCurrentStepIndex(newStepIndex);
  }, [fullJobResource?.status, fullJobResource?.jobId, isCreated, isPartner, isSelectedPartner]);

  const steps = useMemo(() => {
    const buildSteps = (steps: typeof createdSteps | typeof partnerSteps) =>
      steps.map((step, index) => {
        let status = "process";
        // if (index < currentStepIndex) status = "finish";
        // if (index > currentStepIndex) status = "wait";

        if (index < currentStepIndex) {
          status = "finish";
        } else if (index === currentStepIndex) {
          status = currentStepIndex === steps.length - 1 ? "finish" : "process";
        } else {
          status = "wait";
        }

        return { ...step, status };
      });

    if (isCreated) {
      return buildSteps(createdSteps);
    }

    if (isSelectedPartner) {
      return buildSteps(partnerSteps);
    }

    if (
      includes(
        toString(Constants.JOB.STATUS.CHO_UNG_TUYEN),
        toString(fullJobResource?.status)
      )
    ) {
      return buildSteps(partnerSteps) || buildSteps(createdSteps);
    }

    if (isPartner) {
      return buildSteps(partnerSteps);
    }

    return [];
  }, [
    fullJobResource?.status,
    fullProfileResource,
    isPartner,
    isCreated,
    isSelectedPartner,
    currentStepIndex,
  ]);

  function getStepIndex() {
    if (isCreated) return JobUtils.getCreateActiveStepIndex(stepName);
    if (isPartner || isSelectedPartner) return JobUtils.getPartnerActiveStepIndex(stepName);

    return 0;
  }

  function onChangeStepIndex(indexValue: number) {
    if (indexValue > currentStepIndex) return;

    if (isCreated) {
      let localActiveName = "";

      switch (indexValue) {
        case 0: {
          localActiveName = Constants.JOB.TAB.JOB_INFO;
          break;
        }

        case 1: {
          localActiveName = Constants.JOB.TAB.JOB_PARTNER;
          break;
        }

        case 2: {
          localActiveName = Constants.JOB.TAB.JOB_SIGN;
          break;
        }

        case 3: {
          localActiveName = Constants.JOB.TAB.JOB_PAYMENT;
          break;
        }

        // case 4: {
        //   localActiveName = Constants.JOB.TAB.JOB_PROCESSING;
        //   break;
        // }

        case 4: {
          localActiveName = Constants.JOB.TAB.JOB_REVIEW;
          // localActiveName = Constants.JOB.TAB.JOB_SETTLEMENT;
          break;
        }

        case 5: {
          localActiveName = Constants.JOB.TAB.JOB_RESULT;
          break;
        }
      }

      return setStepName(localActiveName);
    }

    if (isPartner || isSelectedPartner) {
      let localActiveName = "";

      switch (indexValue) {
        case 0: {
          localActiveName = Constants.JOB.TAB.JOB_INFO;
          break;
        }

        case 1: {
          localActiveName = Constants.JOB.TAB.JOB_SIGN;
          break;
        }

        case 2: {
          localActiveName = Constants.JOB.TAB.JOB_REPORT;
          break;
        }

        case 3: {
          localActiveName = Constants.JOB.TAB.JOB_RATE;
          break;
        }

        case 4: {
          localActiveName = Constants.JOB.TAB.JOB_RESULT;
          break;
        }
      }

      return setStepName(localActiveName);
    }

    return setStepName(Constants.JOB.TAB.JOB_INFO);
  }

  return {
    stepIndex: getStepIndex(),
    onChangeStepIndex,

    stepName,
    setStepName,

    setCurrentStepIndex,

    steps,

    isCreated,
    isPartner,
  };
}
