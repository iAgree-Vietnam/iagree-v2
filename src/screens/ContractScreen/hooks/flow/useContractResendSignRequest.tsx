import { useMutation, useQueryClient } from '@tanstack/react-query';
import dialogUtils from '@/src/utils/DialogUtils';
import ContractServices from '@/src/data/contract/services/ContractServices';
import { SignUserResource } from '@/src/data/contract/models/contract.types';
import { message } from 'antd';

export default function useContractResendSignRequest() {

    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['CONTRACT_RESEND_SIGN_REQUEST'],
        mutationFn: (variables: SignUserResource) => new ContractServices().onResendSignRequest(variables),
        onSuccess: (data, variables) => {
            message.success('Thành công');
            queryClient.invalidateQueries(['CONTRACT_DETAIL_SCREEN', variables.userContractId]).then(() => null);
            queryClient.invalidateQueries({ queryKey: ['CONTRACT_SCREEN'] }).then(() => null);
        },
        onError: (error) => dialogUtils.showResponseError(error, 'CONTRACT_RESEND_SIGN_REQUEST'),
    });

}
