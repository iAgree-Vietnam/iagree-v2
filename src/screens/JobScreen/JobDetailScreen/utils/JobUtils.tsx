import { FullJobResource } from '@/src/data/job/models/job.types';
import Constants from '@/src/constants/Constants';
import _ from 'lodash';

export default class JobUtils {

    static getPartnerActiveStepIndex(stepName: string) {
        let stepIndex = 0;
        switch (stepName) {
            case Constants.JOB.TAB.JOB_INFO: {
                stepIndex = 0;
                break;
            }

            case Constants.JOB.TAB.JOB_SIGN: {
                stepIndex = 1;
                break;
            }

            case Constants.JOB.TAB.JOB_REPORT: {
                stepIndex = 2;
                break;
            }

            // case Constants.JOB.TAB.JOB_REVIEW: {
            //     stepIndex = 4;
            //     break;
            // }

            case Constants.JOB.TAB.JOB_RATE: {
                stepIndex = 3;
                break;
            }

            case Constants.JOB.TAB.JOB_RESULT: {
                stepIndex = 4;
                break;
            }
        }

        return stepIndex;
    }

    static getCreateActiveStepIndex(stepName: string) {
        let stepIndex = 0;

        switch (stepName) {
            case Constants.JOB.TAB.JOB_INFO: {
                stepIndex = 0;
                break;
            }

            case Constants.JOB.TAB.JOB_PARTNER: {
                stepIndex = 1;
                break;
            }

            case Constants.JOB.TAB.JOB_SIGN: {
                stepIndex = 2;
                break;
            }

            case Constants.JOB.TAB.JOB_PAYMENT: {
                stepIndex = 3;
                break;
            }

            // case Constants.JOB.TAB.JOB_PROCESSING: {
            //     stepIndex = 4;
            //     break;
            // }

            case Constants.JOB.TAB.JOB_REVIEW: {
                stepIndex = 4;
                break;
            }

            case Constants.JOB.TAB.JOB_RESULT: {
                stepIndex = 5;
                break;
            }
        }

        return stepIndex;
    }


    static getPartnerActiveStepName(fullJobResource: FullJobResource) {
        let activeStepIndex = Constants.JOB.TAB.JOB_INFO;

        switch (fullJobResource.status) {
            case Constants.JOB.STATUS.TAM_UNG_THANH_TOAN:
            case Constants.JOB.STATUS.CHO_PARTNER_XAC_NHAN:
                {
                    activeStepIndex = Constants.JOB.TAB.JOB_SIGN;
                    break;
                }

            case Constants.JOB.STATUS.CHO_NGHIEM_THU:
            case Constants.JOB.STATUS.DA_KY_HOP_DONG: {
                activeStepIndex = Constants.JOB.TAB.JOB_REPORT;
                break;
            }

            case Constants.JOB.STATUS.DA_NGHIEM_THU: {
                activeStepIndex = Constants.JOB.TAB.JOB_RATE;
                break;
            }

            case Constants.JOB.STATUS.DUYET_HOAN_THANH_CV: {
                activeStepIndex = Constants.JOB.TAB.JOB_RESULT;
                break;
            }
        }

        return activeStepIndex;
    }

    static getCreateActiveStepName(fullJobResource: FullJobResource) {
        let activeStepIndex = Constants.JOB.TAB.JOB_INFO;

        switch (fullJobResource.status) {
            case Constants.JOB.STATUS.CHO_UNG_TUYEN: {
                activeStepIndex = Constants.JOB.TAB.JOB_PARTNER;
                break;
            }

            case Constants.JOB.STATUS.CHO_KY_HOP_DONG: {
                activeStepIndex = Constants.JOB.TAB.JOB_SIGN;
                break;
            }

            case Constants.JOB.STATUS.TAM_UNG_THANH_TOAN:
            case Constants.JOB.STATUS.CHO_PARTNER_XAC_NHAN: {
                activeStepIndex = Constants.JOB.TAB.JOB_PAYMENT;
                break;
            }

            case Constants.JOB.STATUS.CHO_NGHIEM_THU:
            case Constants.JOB.STATUS.DA_KY_HOP_DONG: {
                // activeStepIndex = _.isEmpty(fullJobResource.histories) ? Constants.JOB.TAB.JOB_SIGN: Constants.JOB.TAB.JOB_REVIEW;
                activeStepIndex = Constants.JOB.TAB.JOB_REVIEW;
                break;
            }

            // case Constants.JOB.STATUS.DA_NGHIEM_THU:
            // case Constants.JOB.STATUS.CHO_NGHIEM_THU: {
            //     activeStepIndex = Constants.JOB.TAB.JOB_REVIEW;
            //     break;
            // }

            // case Constants.JOB.STATUS.THANH_TOAN_PARTNER:
            // case Constants.JOB.STATUS.CHO_TAT_TOAN: {
            //     activeStepIndex = Constants.JOB.TAB.JOB_SETTLEMENT;
            //     break;
            // }

            case Constants.JOB.STATUS.DA_NGHIEM_THU:
            case Constants.JOB.STATUS.DUYET_HOAN_THANH_CV: {
                activeStepIndex = Constants.JOB.TAB.JOB_RESULT;
                break;
            }
        }

        return activeStepIndex;
    }

}
