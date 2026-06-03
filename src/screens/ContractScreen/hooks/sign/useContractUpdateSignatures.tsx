import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ContractUpdateSignResource } from '@/src/data/contract/models/contract.types';
import ContractServices from '@/src/data/contract/services/ContractServices';
import dialogUtils from '@/src/utils/DialogUtils';

export default function useContractUpdateSignatures() {

    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['CONTRACT_UPDATE_SIGNATURES'],
        mutationFn: (variables: ContractUpdateSignResource) => new ContractServices().onUpdateSignatures(variables),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['CONTRACT_DETAIL_SCREEN', variables.contractId] }).then(() => null);
        },
        onError: (error) => dialogUtils.showResponseError(error, 'CONTRACT_UPDATE_SIGNATURES'),
    });

}
