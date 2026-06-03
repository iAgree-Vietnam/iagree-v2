import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ContractResource } from '@/src/data/contract/models/contract.types';
import ContractServices from '@/src/data/contract/services/ContractServices';
import { message } from 'antd';
import dialogUtils from '@/src/utils/DialogUtils';
import { useRouter } from 'next/router';
import ContractRouteUtils from '@/src/data/contract/utils/ContractRouteUtils';

export default function useContractDelete(isDetails: boolean) {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['CONTRACT_DELETE'],
        mutationFn: (variables: ContractResource) =>
            new ContractServices().onDelete(variables),
        onSuccess: () => {
            message.success('Xóa hợp đồng thành công').then(() => null);
            queryClient.invalidateQueries(['CONTRACT_SCREEN']).then(() => null);
            if (isDetails) router.push(ContractRouteUtils.toScreen({}));
        },
        onError: (error) => dialogUtils.showResponseError(error, 'CONTRACT_DELETE'),
    });
}
