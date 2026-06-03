import { useQuery } from '@tanstack/react-query';
import ContractServices from '@/src/data/contract/services/ContractServices';
import { UseQueryResult } from '@tanstack/react-query/src/types';
import { FullContractResource } from '@/src/data/contract/models/contract.types';

export default function useSelectedContract(contractId: number | undefined | null): UseQueryResult<FullContractResource> {

    return useQuery({
        queryKey: ['CONTRACT_DETAIL_SCREEN', contractId],
        queryFn: () => new ContractServices().getFullInfo(contractId as number),
        enabled: Number.isInteger(contractId),
    });

}
