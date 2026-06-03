import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';

import dialogUtils from '@/src/utils/DialogUtils';
import TransactionServices from '@/src/data/payment/services/TransactionServices';
import { TransactionResource } from '@/src/data/payment/models/transaction.types';

export function useDeleteTransaction() {

    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['TRANSACTION_DELETE'],
        mutationFn: (orderId: string) => new TransactionServices().delete(orderId),
        onSuccess: (data, orderId: string) => {
            message.success('Xóa thành công').then(() => null);
            queryClient.invalidateQueries({ queryKey: ['TRANSACTION_SCREEN'] });

            queryClient.getQueryCache().findAll(['TRANSACTION_SCREEN']).forEach(({ queryKey }) => {
                queryClient.setQueryData(queryKey, (tanStackPageData: any) => {
                    return {
                        ...tanStackPageData,
                        items: tanStackPageData.items.filter((nItem: TransactionResource) => nItem.orderId !== orderId),
                    };
                });
            });
        },
        onError: (error) => dialogUtils.showResponseError(error, 'TRANSACTION_DELETE'),
    });

}
