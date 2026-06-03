import { useMutation, useQueryClient } from '@tanstack/react-query';
import JobServices from '@/src/data/job/services/JobServices';
import dialogUtils from '@/src/utils/DialogUtils';
import { message } from 'antd';
import { JobDeleteParams, JobResource } from '@/src/data/job/models/job.types';

export default function useDeleteJob() {

    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['JOB_DELETE'],
        mutationFn: (variables: JobDeleteParams) => new JobServices().onDelete(variables.jobId),
        onSuccess: (data, variables) => {
            message.success('Xóa thành công').then(() => null);

            queryClient.getQueryCache().findAll(['JOBS_SCREEN']).forEach(({ queryKey }) => {
                queryClient.setQueryData(queryKey, (tanStackPageData: any) => {
                    return {
                        ...tanStackPageData,
                        items: tanStackPageData.items.filter((jItem: JobResource) => jItem.jobId !== variables.jobId),
                    };
                });
            });
        },
        onError: (error) => dialogUtils.showResponseError(error, 'JOB_DELETE'),
    });

}
