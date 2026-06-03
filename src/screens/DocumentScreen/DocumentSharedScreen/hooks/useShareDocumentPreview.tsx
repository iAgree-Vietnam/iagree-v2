import { useMutation } from '@tanstack/react-query';
import _ from 'lodash';

import dialogUtils from '@/src/utils/DialogUtils';
import DocumentServices from '@/src/data/document/services/DocumentServices';

interface UseDocumentPreviewOptions {
    onSuccess: (fileUrl: string) => void;
}

export default function useShareDocumentPreview(options: UseDocumentPreviewOptions) {

    return useMutation({
        mutationKey: ['DOCUMENT_SHARE_PREVIEW'],
        mutationFn: (documentShareId: number) => new DocumentServices().getSharePreview(documentShareId),
        onSuccess: (data, variables, context) => {
            if (_.isFunction(options.onSuccess)) options.onSuccess(data as string);
        },
        onError: (error) => dialogUtils.showResponseError(error, 'DOCUMENT_SHARE_PREVIEW'),
    });
}

