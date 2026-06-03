import { useQuery } from '@tanstack/react-query';
import ContractServices from '@/src/data/contract/services/ContractServices';

export default function useContractPreviewConfirmMailSign(code: string) {

    return useQuery({
        queryKey: ['CONTRACT_PREVIEW_CONFIRM_MAIL_SIGN', code],
        queryFn: () => {
            return new ContractServices().onGetContractConfirmMailSign(code)
        },
        enabled: !!code,
    });

}
