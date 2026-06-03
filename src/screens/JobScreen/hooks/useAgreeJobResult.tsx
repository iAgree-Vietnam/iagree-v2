import { useMutation, useQueryClient } from '@tanstack/react-query';
import JobServices from '@/src/data/job/services/JobServices';
import { AgreeJobResultParams } from '@/src/data/job/models/job.types';
import dialogUtils from '@/src/utils/DialogUtils';
import { message } from 'antd';
import { useRouter } from 'next/router';
import _ from 'lodash';

interface UseAgreeJobResultOptions {
    onSuccess: (data?: any, variables?: any, context?: any) => void;
}

export default function useAgreeJobResult(
    jobId: number,
    options: UseAgreeJobResultOptions
) {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['JOB_AGREE_RESULT', jobId],
        mutationFn: (variables: AgreeJobResultParams) =>
            new JobServices().onAgreeResult(jobId, variables),
        onSuccess: (data, variables, context) => {
            if (_.isFunction(options.onSuccess))
                options.onSuccess(data, variables, context);
            queryClient
                .invalidateQueries({ queryKey: ['JOB_DETAIL_SCREEN', jobId] })
                .then(() => null);

            message.success('Đồng ý nghiệm thu thành công').then(() => null);
        },
        onError: (error) =>
            dialogUtils.showResponseError(error, 'JOB_AGREE_RESULT'),
    });
}
