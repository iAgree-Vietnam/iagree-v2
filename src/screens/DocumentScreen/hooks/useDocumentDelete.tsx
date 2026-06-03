import { useMutation, useQueryClient } from '@tanstack/react-query';
import dialogUtils from '@/src/utils/DialogUtils';
import { message } from 'antd';
import DocumentServices from '@/src/data/document/services/DocumentServices';
import { DocumentResource } from '@/src/data/document/models/document.types';
import { useRouter } from 'next/router';
import DocumentRouteUtils from '@/src/data/document/utils/DocumentRouteUtils';

export default function useDocumentDelete() {

    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['DOCUMENT_DELETE'],
        mutationFn: (variables: DocumentResource) => new DocumentServices().onDelete(variables),
        onSuccess: (data, variables) => {
            message.success('Xóa thành công').then(() => null);

            queryClient.getQueryCache().findAll(['DOCUMENT_SCREEN']).forEach(({ queryKey }) => {
                queryClient.setQueryData(queryKey, (tanStackPageData: any) => {
                    return {
                        ...tanStackPageData,
                        items: tanStackPageData.items.filter((dItem: DocumentResource) => dItem.documentId !== variables.documentId),
                    };
                });
            });

            router.push(DocumentRouteUtils.toScreen({}));
        },
        onError: (error) => dialogUtils.showResponseError(error, 'DOCUMENT_DELETE'),
    });

}
