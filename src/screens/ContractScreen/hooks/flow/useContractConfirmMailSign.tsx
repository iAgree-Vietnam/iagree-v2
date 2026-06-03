import { useMutation } from '@tanstack/react-query';
import ContractServices from '@/src/data/contract/services/ContractServices';
import dialogUtils from '@/src/utils/DialogUtils';
import { useRouter } from 'next/router';
import { message } from 'antd';
import ContractRouteUtils from '@/src/data/contract/utils/ContractRouteUtils';

export default function useContractConfirmMailSign() {

    const router = useRouter();

    return useMutation({
        mutationKey: ['CONTRACT_CONFIRM_MAIL_SIGN'],
        mutationFn: (variables: any) => new ContractServices().onConfirmMailSign(variables),
        onSuccess: () => {
            message.success('Xác nhận thành công').then(() => null);
            router.push(ContractRouteUtils.toScreen({})).then(() => null);
        },
        onError: (error) => dialogUtils.showResponseError(error, 'CONTRACT_CONFIRM_MAIL_SIGN'),
    });

}
