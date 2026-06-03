import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RejectJobResultParams } from '../../../data/job/models/job.types';
import JobServices from '../../../data/job/services/JobServices';
import { message } from 'antd';
import dialogUtils from '../../../utils/DialogUtils';
import _ from 'lodash';

interface UseRejectJobResultOptions {
    onSuccess: (data?: any, variables?: any, context?: any) => void;
}

export default function useRejectJobResult(jobId: number, options: UseRejectJobResultOptions) {

    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['JOB_REJECT_RESULT', jobId],
        mutationFn: (variables: RejectJobResultParams) => new JobServices().onRejectResult(jobId, variables),
        onSuccess: (data, variables, context) => {
            if (_.isFunction(options.onSuccess)) options.onSuccess(data, variables, context);
            queryClient.invalidateQueries({ queryKey: ['JOB_DETAIL_SCREEN', jobId] }).then(() => null);
            
            message.success('Từ chối nghiệm thu thành công').then(() => null);

        },
        onError: (error) => dialogUtils.showResponseError(error, 'JOB_REJECT_RESULT'),
    });

}
