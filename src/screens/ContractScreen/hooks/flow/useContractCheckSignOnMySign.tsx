import { useMutation, useQueryClient } from '@tanstack/react-query';
import dialogUtils from '@/src/utils/DialogUtils';
import ContractServices from '@/src/data/contract/services/ContractServices';
import { SignUserResource } from '@/src/data/contract/models/contract.types';
import { message } from 'antd';

export default function useContractCheckSignOnMySign() {

    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['CONTRACT_CHECK_SIGN_ON_MYSIGN'],
        mutationFn: (variables: SignUserResource) => new ContractServices().onCheckSignOnMySign(variables),
        onSuccess: (data, variables) => {
            message.success('Thành công');
            queryClient.invalidateQueries(['CONTRACT_DETAIL_SCREEN', variables.userContractId]).then(() => null);
        },
        onError: (error) => dialogUtils.showResponseError(error, 'CONTRACT_CHECK_SIGN_ON_MYSIGN'),
    });

}
