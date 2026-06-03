import { useMutation, useQueryClient } from '@tanstack/react-query';
import JobServices from '../../../../data/job/services/JobServices';
import dialogUtils from '../../../../utils/DialogUtils';
import { message } from 'antd';
import Constants from '../../../../constants/Constants';
import _ from 'lodash';

interface UseJobSendResultOptions {
    onSuccess?: (data?: any, variables?: any, context?: any) => void;
}

export default function useJobSendResult(jobId: number, options: UseJobSendResultOptions) {

    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['JOB_SENT_RESULT', jobId],
        mutationFn: () => new JobServices().onSendResult(jobId),
        onSuccess: (data, variables, context) => {
            if (_.isFunction(options.onSuccess)) options.onSuccess(data, variables, context);
            message.success('Gửi kết quả thành công').then(() => null);

            queryClient.setQueryData(['JOB_DETAIL_SCREEN', jobId], (prevState: any) => {
                if (!prevState) return prevState;

                return { ...prevState, status: Constants.JOB.STATUS.CHO_NGHIEM_THU };
            });
        },
        onError: (error) => dialogUtils.showResponseError(error, 'JOB_SENT_RESULT'),
    });

}
