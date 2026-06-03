import { useMutation } from '@tanstack/react-query';
import JobServices from '../../../../data/job/services/JobServices';
import { FullJobResource, JobApplyParams } from '../../../../data/job/models/job.types';
import { message } from 'antd';
import { useRouter } from 'next/router';
import dialogUtils from '../../../../utils/DialogUtils';
import JobRouteUtils from '@/src/data/job/utils/JobRouteUtils';

export default function useJobApply(jobResource: FullJobResource) {

    const router = useRouter();

    return useMutation({
        mutationKey: ['JOB_APPLY', jobResource?.jobId],
        mutationFn: (variables: JobApplyParams) => new JobServices().onApply(jobResource.jobId, variables),
        onSuccess: () => {
            message.success('Ứng tuyển thành công').then(() => null);
            router.push(JobRouteUtils.toDetailUrl(jobResource));
        },
        onError: (error) => dialogUtils.showResponseError(error, 'JOB_APPLY'),
    });

}
