import { useMutation, useQueryClient } from '@tanstack/react-query';
import ContractServices from '@/src/data/contract/services/ContractServices';
import { message } from 'antd';
import dialogUtils from '@/src/utils/DialogUtils';
import { ContractResource } from '@/src/data/contract/models/contract.types';

export default function useContractCancel() {

    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['CONTRACT_CANCEL'],
        mutationFn: (variables: ContractResource) => new ContractServices().onCancel(variables),
        onSuccess: (_, variables) => {
            message.success('Hủy hợp đồng thành công').then(() => null);

            queryClient.invalidateQueries(['CONTRACT_SCREEN']).then(() => null);
            queryClient.invalidateQueries({ queryKey: ['CONTRACT_DETAIL_SCREEN', variables.contractId] }).then(() => null);
        },
        onError: (error) => dialogUtils.showResponseError(error, 'CONTRACT_CANCEL'),
    });

}
