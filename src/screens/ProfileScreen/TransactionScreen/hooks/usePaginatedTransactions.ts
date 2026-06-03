import { useQuery } from '@tanstack/react-query';
import TransactionServices from '@/src/data/payment/services/TransactionServices';
import { DefinedUseQueryResult } from '@tanstack/react-query/src/types';
import { DatasResource } from '@/src/data/base/models/base.types';
import { TransactionResource } from '@/src/data/payment/models/transaction.types';

export default function usePaginatedTransactions(props: any): DefinedUseQueryResult<DatasResource<TransactionResource>> {

    const {
        filters = {},
        sort = '',
    } = props;

    return useQuery({
        queryKey: ['TRANSACTION_SCREEN', filters, sort],
        queryFn: () => {
            const queryParams = {
                per_page: 10,
                page: filters.page || null,
                order_id: filters.order_id || null,
                name: filters.name || null,
            };

            return new TransactionServices().get(queryParams);
        },
        initialData: () => ({
            items: [],
            total: 0,
        }),
    });

}
