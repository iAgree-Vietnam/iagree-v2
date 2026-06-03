import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import ContractServices from '@/src/data/contract/services/ContractServices';
import dialogUtils from '@/src/utils/DialogUtils';
import { ContractResource } from '@/src/data/contract/models/contract.types';
import _ from 'lodash';
import { message } from 'antd';

export default function useContractRequestMailToSign(options: UseMutationOptions) {
    
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['CONTRACT_REQUEST_SIGN'],
        mutationFn: (variables: ContractResource) => new ContractServices().onRequestMailToSign(variables),
        onSuccess: (data, variables, context) => {
            // message.success('Đã gửi email yêu cầu ký thành công').then(() => null);

            queryClient.invalidateQueries({ queryKey: ['CONTRACT_SCREEN'] }).then(() => null);
            queryClient.invalidateQueries({ queryKey: ['CONTRACT_DETAIL_SCREEN', variables.contractId] }).then(() => null);
            if (_.isFunction(options.onSuccess)) options.onSuccess(data, variables as any, context);
        },
        onError: (error) => dialogUtils.showResponseError(error, 'CONTRACT_REQUEST_SIGN'),
    });

}
