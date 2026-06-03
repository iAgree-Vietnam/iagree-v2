import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ContractResource, FullContractResource, SignUserResource } from '@/src/data/contract/models/contract.types';
import ContractSignServices from '@/src/data/contract/services/ContractSignServices';
import dialogUtils from '@/src/utils/DialogUtils';
import { message } from 'antd';

export default function useContractSignDelete(contractResource: ContractResource) {

    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['CONTRACT_SIGN_DELETE'],
        mutationFn: (variables: SignUserResource) => new ContractSignServices().onDelete(variables),
        onSuccess: (data, variables: SignUserResource, context) => {
            message.success('Xóa thành công').then(() => null);

            queryClient.setQueryData(['CONTRACT_DETAIL_SCREEN', contractResource.contractId], (prevState: FullContractResource | undefined): FullContractResource | undefined => {
                if (!prevState) return prevState;

                return {
                    ...prevState,
                    signUsers: prevState.signUsers.filter((sItem) => sItem.signId !== variables.signId),
                };
            });
            queryClient.invalidateQueries({ queryKey: ['CONTRACT_SCREEN'] }).then(() => null);
        },
        onError: (error) => dialogUtils.showResponseError(error, 'CONTRACT_SIGN_DELETE'),
    });

}
