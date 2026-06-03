import { useMutation } from '@tanstack/react-query';
import ContractServices from '@/src/data/contract/services/ContractServices';
import { ContractUpdatePDFParams } from '@/src/data/contract/models/contract.raw';
import dialogUtils from '@/src/utils/DialogUtils';
import { UseMutationOptions } from '@tanstack/react-query/src/types';
import _ from 'lodash';

export default function useContractUpdatePDF(options?: UseMutationOptions) {

    return useMutation({
        mutationKey: ['CONTRACT_UPDATE_PDF'],
        mutationFn: (variables: ContractUpdatePDFParams) => new ContractServices().onUpdatePDF(variables),
        onSuccess: (data, variables, context) => {
            if (_.isFunction(options?.onSuccess)) options?.onSuccess(data, variables as any, context);
        },
        onError: (error) => dialogUtils.showResponseError(error, 'CONTRACT_UPDATE_PDF'),
    });

}
