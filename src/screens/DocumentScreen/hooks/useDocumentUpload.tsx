import { useMutation, useQueryClient } from '@tanstack/react-query';
import dialogUtils from '@/src/utils/DialogUtils';
import { DocumentUploadParams } from '@/src/data/document/models/document.types';
import DocumentServices from '@/src/data/document/services/DocumentServices';
import { message } from 'antd';
import _ from 'lodash';

export default function useDocumentUpload(mutationOptions: any) {

    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['DOCUMENT_UPLOAD'],
        mutationFn: (variables: DocumentUploadParams) => new DocumentServices().onUpload(variables),
        onSuccess: (data, variables, context) => {
            message.success('Tải lên thành công').then(() => null);

            queryClient.invalidateQueries({ queryKey: ['DOCUMENT_SCREEN'] }).then(() => null);

            if (_.isFunction(mutationOptions.onSuccess)) mutationOptions.onSuccess(data, variables, context);
        },
        onError: (error) => dialogUtils.showResponseError(error, 'DOCUMENT_UPLOAD'),
    });

}
