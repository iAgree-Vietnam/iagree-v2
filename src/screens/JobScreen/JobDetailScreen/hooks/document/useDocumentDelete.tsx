import { useMutation, useQueryClient } from '@tanstack/react-query';
import JobServices from '../../../../../data/job/services/JobServices';
import dialogUtils from '../../../../../utils/DialogUtils';
import { message } from 'antd';
import { FullJobResource, JobDeleteDocumentParams, JobResource, JobResultResource } from '../../../../../data/job/models/job.types';

export default function useDocumentDelete() {

    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['JOB_DOCUMENT_DELETE'],
        mutationFn: (variables: JobDeleteDocumentParams) => new JobServices().onDocumentDelete(variables.jobId, variables.resultId),
        onSuccess: (data, variables) => {
            message.success('Xóa thành công').then(() => null);

            queryClient.getQueryCache().findAll(['JOB_DETAIL_SCREEN', variables.jobId]).forEach(({ queryKey }) => {
                queryClient.setQueryData(queryKey, (tanStackPageData: any): FullJobResource => {
                    return {
                        ...tanStackPageData,
                        results: tanStackPageData.results.filter((rItem: JobResultResource) => rItem.resultId !== variables.resultId),
                    };
                });
            });
        },
        onError: (error) => dialogUtils.showResponseError(error, 'JOB_DOCUMENT_DELETE'),
    });

}
