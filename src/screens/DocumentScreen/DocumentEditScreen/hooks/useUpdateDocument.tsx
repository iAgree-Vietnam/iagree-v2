import { useMutation } from '@tanstack/react-query';
import { message } from 'antd';
import dialogUtils from '@/src/utils/DialogUtils';
import { DocumentUpdateParams } from '@/src/data/document/models/document.types';
import DocumentServices from '@/src/data/document/services/DocumentServices';

export default function useUpdateDocument() {

    return useMutation({
        mutationKey: ['DOCUMENT_UPDATE'],
        mutationFn: (variables: DocumentUpdateParams) => new DocumentServices().onUpdate(variables),
        onSuccess: (data, variables) => {
            message.success('Cập nhật thành công').then(() => null);
        },
        onError: (error) => dialogUtils.showResponseError(error, 'DOCUMENT_UPDATE'),
    });

}
