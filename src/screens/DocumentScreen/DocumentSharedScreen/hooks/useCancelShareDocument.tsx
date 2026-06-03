import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';

import DocumentServices from '@/src/data/document/services/DocumentServices';
import dialogUtils from '@/src/utils/DialogUtils';
import { DocumentSharedResource } from '@/src/data/document/models/document.types';

export default function useCancelShareDocument() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['DOCUMENT_CANCEL_SHARE'],
        mutationFn: (documentShare: DocumentSharedResource) =>
            new DocumentServices().onCancelShared(documentShare.documentShareId),
        onSuccess: (data, variables, context) => {
            message.success('Huỷ chia sẻ văn bản thành công').then(() => null);

            queryClient
                .invalidateQueries({
                    queryKey: ['DOCUMENT_SHARED_USERS'],
                })
                .then(() => null);
        },
        onError: (error) =>
            dialogUtils.showResponseError(error, 'DOCUMENT_CANCEL_SHARE'),
    });
}
