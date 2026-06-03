import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import _ from 'lodash';

import dialogUtils from '@/src/utils/DialogUtils';
import DocumentServices from '@/src/data/document/services/DocumentServices';
import { DocumentSharedParams } from '@/src/data/document/models/document.types';

export default function useShareDocument(mutationOptions: any) {

    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['DOCUMENT_SHARE'],
        mutationFn: (params: DocumentSharedParams) => new DocumentServices().onShare(params),
        onSuccess: (data, variables, context) => {
            message.success('Chia sẻ văn bản thành công').then(() => null);

            queryClient.invalidateQueries({ queryKey: ['DOCUMENT_SHARED_USERS'], }).then(() => null);

            if (_.isFunction(mutationOptions.onSuccess))
                mutationOptions.onSuccess(data, variables, context);
        },
        onError: (error) => dialogUtils.showResponseError(error, 'DOCUMENT_SHARE'),
    });

}
