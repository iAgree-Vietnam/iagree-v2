import { useMutation } from '@tanstack/react-query';
import JobServices from '../../../../data/job/services/JobServices';
import dialogUtils from '../../../../utils/DialogUtils';
import { message } from 'antd';
import { FullJobResource, JobUploadDocumentParams } from '../../../../data/job/models/job.types';
import { DefinedUseQueryResult } from '@tanstack/react-query/src/types';

export default function useJobUploadDocument(ref: any, fullJobResource: FullJobResource, jobQuery: DefinedUseQueryResult<FullJobResource>) {

    return useMutation({
        mutationKey: ['JOB_UPLOAD_DOCUMENT', fullJobResource?.jobId],
        mutationFn: (variables: JobUploadDocumentParams) => new JobServices().onUploadDocument(fullJobResource?.jobId, variables),
        onSuccess: () => {
            message.success('Upload tài liệu thành công').then(() => null);
            jobQuery.refetch().then(() => null);
            ref.current.close();
        },
        onError: (error) => dialogUtils.showResponseError(error, 'JOB_UPLOAD_DOCUMENT'),
    });

}
