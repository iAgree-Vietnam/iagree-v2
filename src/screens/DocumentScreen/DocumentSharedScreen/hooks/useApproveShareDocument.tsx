import { useMutation, useQueryClient } from '@tanstack/react-query';
import dialogUtils from '@/src/utils/DialogUtils';
import DocumentServices from '@/src/data/document/services/DocumentServices';
import { message } from 'antd';

export default function useApproveShareDocument() {

    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['DOCUMENT_APPROVE_SHARE'],
        mutationFn: (documentShareId: number) => new DocumentServices().onApproveShared(documentShareId),
        onSuccess: (data, variables, context) => {
            message.success('Đồng ý văn bản thành công').then(() => null);

            queryClient.invalidateQueries({ queryKey: ['DOCUMENT_SHARED_SCREEN', { type: 1 }], }).then(() => null);
        },
        onError: (error) => dialogUtils.showResponseError(error, 'DOCUMENT_APPROVE_SHARE'),
    });

}
