import { useMutation } from '@tanstack/react-query';
import JobServices from '../../../../data/job/services/JobServices';
import dialogUtils from '../../../../utils/DialogUtils';
import { message } from 'antd';
import { JobFormParams, JobSubmitResponseResource } from '../../../../data/job/models/job.types';
import { useRouter } from 'next/router';
import AuthJobRouteUtils from '../../../../data/auth/utils/AuthJobRouteUtils';
import Constants from '../../../../constants/Constants';
import JobRouteUtils from '../../../../data/job/utils/JobRouteUtils';

export default function useJobAdd() {

    const router = useRouter();

    return useMutation({
        mutationKey: ['JOB_SUBMIT'],
        mutationFn: async (params: JobFormParams) => {
            const data = await new JobServices().onCreate(params);
            const redirectUrl = JobRouteUtils.toDetailUrl(data);
            return redirectUrl;
        },
        onSuccess: (redirectUrl: string, params: JobFormParams) => {},
        onError: (error) => dialogUtils.showResponseError(error, 'JOB_SUBMIT'),
    });

}
