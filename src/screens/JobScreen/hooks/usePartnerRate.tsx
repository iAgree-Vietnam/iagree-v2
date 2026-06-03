import { useMutation, useQueryClient } from '@tanstack/react-query';
import JobServices from '@/src/data/job/services/JobServices';
import { AgreeJobResultParams } from '@/src/data/job/models/job.types';
import dialogUtils from '@/src/utils/DialogUtils';
import { message } from 'antd';
import { useRouter } from 'next/router';
import _ from 'lodash';

interface UsePartnerRateOptions {
    onSuccess: (data?: any, variables?: any, context?: any) => void;
}

export default function usePartnerRate(
    jobId: number,
    options: UsePartnerRateOptions
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['JOB_PARTNER_RATE', jobId],
        mutationFn: (variables: AgreeJobResultParams) =>
            new JobServices().onPartnerRate(jobId, variables),
        onSuccess: (data, variables, context) => {
            if (_.isFunction(options.onSuccess))
                options.onSuccess(data, variables, context);
            queryClient
                .invalidateQueries({ queryKey: ['JOB_DETAIL_SCREEN', jobId] })
                .then(() => null);

            message.success('Gửi đánh giá thành công').then(() => null);
        },
        onError: (error) =>
            dialogUtils.showResponseError(error, 'JOB_PARTNER_RATE'),
    });
}
