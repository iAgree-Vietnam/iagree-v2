import { useMutation } from '@tanstack/react-query';
import ContractServices from '@/src/data/contract/services/ContractServices';
import { ContractResource } from '@/src/data/contract/models/contract.types';
import dialogUtils from '@/src/utils/DialogUtils';

export default function useContractRequestSignOnMySign() {

    return useMutation({
        mutationKey: ['CONTRACT_REQUEST_SIGN_ON_MYSIGN'],
        mutationFn: (variables: ContractResource) => new ContractServices().onRequestSignOnMySign(variables),
        onSuccess: () => {

        },
        onError: (error) => dialogUtils.showResponseError(error, 'CONTRACT_REQUEST_SIGN_ON_MYSIGN'),
    });

}
