import { useMutation, useQueryClient } from '@tanstack/react-query';
import _ from 'lodash';

import dialogUtils from '@/src/utils/DialogUtils';
import DocumentServices from '@/src/data/document/services/DocumentServices';
import { DocumentCommentParams } from '@/src/data/document/models/document.types';

export default function useCreateComment(mutationOptions: any) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['CREATE_COMMENT'],
        mutationFn: (params: DocumentCommentParams) =>
            new DocumentServices().onComment(params),
        onSuccess: (data, variables, context) => {
            queryClient
                .invalidateQueries({
                    queryKey: ['DOCUMENT_COMMENT_LIST', variables.documentId],
                })
                .then(() => null);

            if (_.isFunction(mutationOptions.onSuccess))
                mutationOptions.onSuccess(data, variables, context);
        },
        onError: (error) => dialogUtils.showResponseError(error, 'CREATE_COMMENT'),
    });
}
