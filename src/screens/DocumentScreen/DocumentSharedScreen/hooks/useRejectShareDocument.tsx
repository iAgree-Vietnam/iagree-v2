import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import _ from 'lodash';

import DocumentServices from '@/src/data/document/services/DocumentServices';
import dialogUtils from '@/src/utils/DialogUtils';
import { DocumentSharedResource } from '@/src/data/document/models/document.types';

export default function useRejectShareDocument(mutationOptions: any) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['DOCUMENT_REJECT_SHARE'],
        mutationFn: (documentShare: DocumentSharedResource) =>
            new DocumentServices().onRejectShared(documentShare.documentShareId),
        onSuccess: (data, variables, context) => {
            message.success('Từ chối văn bản thành công').then(() => null);

            queryClient
                .invalidateQueries({
                    queryKey: ['DOCUMENT_SHARED_SCREEN', { type: 1 }],
                })
                .then(() => null);

            if (_.isFunction(mutationOptions.onSuccess))
                mutationOptions.onSuccess(data, variables, context);
        },
        onError: (error) =>
            dialogUtils.showResponseError(error, 'DOCUMENT_REJECT_SHARE'),
    });
}
