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
        mutationFn: async (params: JobFormParams) => {
            await new JobServices().onUpdate(fullJobResource?.jobId, params);
            const redirectUrl = JobRouteUtils.toDetailUrl(fullJobResource);
            return redirectUrl;
        },
        onSuccess: (redirectUrl: string, params: JobFormParams) => {},
        onError: (error) => dialogUtils.showResponseError(error, 'JOB_UPDATE'),
    });

}
