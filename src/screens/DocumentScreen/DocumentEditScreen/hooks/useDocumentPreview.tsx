import { useMutation } from '@tanstack/react-query';
import TemplateServices from '@/src/data/template/services/TemplateServices';
import _ from 'lodash';
import dialogUtils from '@/src/utils/DialogUtils';
import Constants from '../../../../constants/Constants';
import { DocumentResource } from '@/src/data/document/models/document.types';

interface UseDocumentPreviewOptions {
    onSuccess: (fileUrl: string) => void;
}

export default function useDocumentPreview(options: UseDocumentPreviewOptions) {

    return useMutation({
        mutationKey: ['DOCUMENT_PREVIEW'],
        mutationFn: (variables: DocumentResource) => new TemplateServices().onPreview(Constants.TEMPLATE.PREVIEW_TYPE.DOCUMENT, variables.documentId),
        onSuccess: (data, variables, context) => {
            if (_.isFunction(options.onSuccess)) options.onSuccess(data as unknown as string);
        },
        onError: (error) => dialogUtils.showResponseError(error, 'DOCUMENT_PREVIEW'),
    });
}

