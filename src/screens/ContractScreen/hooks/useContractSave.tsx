import { useMutation, useQueryClient } from '@tanstack/react-query';
import ContractServices from '@/src/data/contract/services/ContractServices';
import { ContractSaveParams } from '@/src/data/contract/models/contract.raw';
import { ContractResource } from '@/src/data/contract/models/contract.types';
import dialogUtils from '@/src/utils/DialogUtils';
import { message } from 'antd';
import { UseMutationOptions } from '@tanstack/react-query/src/types';
import _ from 'lodash';

export default function useContractSave(options: UseMutationOptions<ContractResource>) {

    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['CONTRACT_SAVE'],
        mutationFn: (variables: ContractSaveParams) => new ContractServices().onSave(variables),
        onSuccess: (data, variables, context) => {
            message.success('Thành công').then(() => null);
            queryClient.invalidateQueries({ queryKey: ['CONTRACT_SCREEN'] }).then(() => null);

            if (_.isFunction(options.onSuccess)) options.onSuccess(data, variables as any, context);
        },
        onError: (error) => dialogUtils.showResponseError(error, 'CONTRACT_SAVE'),
    });

}
