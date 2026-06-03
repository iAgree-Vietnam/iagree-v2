import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { FullJobResource, JobFormParams, JobSubmitResponseResource } from '../../../../data/job/models/job.types';
import JobServices from '../../../../data/job/services/JobServices';
import { message } from 'antd';
import Constants from '../../../../constants/Constants';
import AuthJobRouteUtils from '../../../../data/auth/utils/AuthJobRouteUtils';
import JobRouteUtils from '../../../../data/job/utils/JobRouteUtils';
import dialogUtils from '../../../../utils/DialogUtils';

export default function useJobUpdate(fullJobResource: FullJobResource) {

    const router = useRouter();

    return useMutation({
        mutationKey: ['JOB_UPDATE', fullJobResource?.jobId],
        mutationFn: (variables: JobFormParams) => new JobServices().onUpdate(fullJobResource?.jobId, variables),
        onSuccess: (data: JobSubmitResponseResource, variables: JobFormParams) => {
            let redirectUrl = JobRouteUtils.toDetailUrl(fullJobResource);
            let successMessage = 'Công việc của bạn đã được chuyển đến iAgree xử lý';

            if (variables.status === Constants.JOB.STATUS.LUU_NHAP) {
                redirectUrl = AuthJobRouteUtils.toManagementUrl();
                successMessage = 'Lưu nháp thành công';
            }

            router.push(redirectUrl).then(() => null);
            message.success(successMessage).then(() => null);
        },
        onError: (error) => dialogUtils.showResponseError(error, 'JOB_UPDATE'),
    });

}
