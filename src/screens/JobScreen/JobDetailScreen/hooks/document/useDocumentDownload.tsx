import { useMutation } from '@tanstack/react-query';
import JobServices from '../../../../../data/job/services/JobServices';
import { JobDownloadDocumentParams } from '../../../../../data/job/models/job.types';
import dialogUtils from '../../../../../utils/DialogUtils';
import FileUtils from '../../../../../utils/FileUtils';
import StringUtils from '@/src/utils/StringUtils';

export default function useDocumentDownload() {

    return useMutation({
        mutationKey: ['JOB_DOCUMENT_DOWNLOAD'],
        mutationFn: (variables: JobDownloadDocumentParams) => new JobServices().onDocumentDownload(variables.jobId, variables.resultId),
        onSuccess: (data, variables: JobDownloadDocumentParams) => {
            const fileResource = variables.file;

            const fileName = StringUtils.normalizeDownloadFilename(fileResource.name);
            const fileExt = FileUtils.getFileExtension(fileResource.fileUrl);

            FileUtils.downloadBlob(data as Blob, `${fileName}.${fileExt}`);
        },
        onError: (error) => dialogUtils.showResponseError(error, 'JOB_DOCUMENT_DELETE'),
    });

}
