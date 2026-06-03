import { useQuery } from '@tanstack/react-query';
import ContractServices from '@/src/data/contract/services/ContractServices';
import { DefinedUseQueryResult } from '@tanstack/react-query/src/types';
import { DatasResource } from '@/src/data/base/models/base.types';
import { ContractFilterParams, ContractResource } from '@/src/data/contract/models/contract.types';
import Constants from '@/src/constants/Constants';
import { ContractRawResource } from '@/src/data/contract/models/contract.raw';
import { isNumber } from 'lodash';

interface usePaginatedContractsProps {
    filters: ContractFilterParams;
}

export function usePaginatedContracts(props: usePaginatedContractsProps): DefinedUseQueryResult<DatasResource<ContractResource>> {

    const {
        filters,
    } = props;

    return useQuery({
        queryKey: ['CONTRACT_SCREEN', filters],
        queryFn: async () => {
            const queryParams = {
                name: filters.search,
                page: filters.page,
                per_page: 10,
                status: isNumber(filters.statusId) ? filters.statusId.toString() : null,
            }
            const filteredContract = await new ContractServices().get(queryParams) as DatasResource<ContractRawResource>;

            return filteredContract;
        },
        initialData: () => ({
            items: [],
            total: 0,
        }),
    });

}
