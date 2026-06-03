import Constants from "@/src/constants/Constants";
import { StepsProps } from "antd";
import { useMemo, useState } from "react";
import PartnerRegisterUtils from "../utils/PartnerRegisterUtils";

const partnerRegisterSteps = [
    {
        title: 'Thông tin chung',
        description: '',
    },
    {
        title: 'Xác thực danh tính',
        description: '',
    },
    {
        title: 'Thiết lập thanh toán',
        description: '',
    },
    {
        // title: 'Xác nhận hoàn tất',
        title: 'Xác nhận thông tin',
        description: '',
    }
];

export default function usePartnerRegisterStep() {
    const [stepName, setStepName] = useState(Constants.PARTNER.TAB.REGISTER_INFO);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const steps: StepsProps[] = useMemo(() => {
        return partnerRegisterSteps.map((step, index) => {
            let status: StepsProps['status'] = 'process';
            if (index < currentStepIndex) status = 'finish';
            if (index > currentStepIndex) status = 'wait';
            return { ...step, status };
        })
    }, [currentStepIndex]);

    function getStepIndex() {
        return PartnerRegisterUtils.getActiveStepIndex(stepName);
    }

    function onChangeStepIndex(indexValue: number) {
        if (indexValue > currentStepIndex) return;

        let localActiveName = '';
        switch (indexValue) {
            case 0: {
                localActiveName = Constants.PARTNER.TAB.REGISTER_INFO;
                break;
            }

            case 1: {
                localActiveName = Constants.PARTNER.TAB.REGISTER_VERIFY;
                break;
            }

            case 2: {
                localActiveName = Constants.PARTNER.TAB.REGISTER_PAYMENT;
                break;
            }

            case 3: {
                localActiveName = Constants.PARTNER.TAB.REGISTER_CONFIRM;
                break;
            }
        }

        return setStepName(localActiveName);
    }

    return {
        stepIndex: getStepIndex(),
        onChangeStepIndex,

        stepName,
        setStepName,

        setCurrentStepIndex,

        steps
    };
}