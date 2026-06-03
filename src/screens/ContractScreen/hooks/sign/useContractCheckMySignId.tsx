import { useMutation } from '@tanstack/react-query';
import dialogUtils from '@/src/utils/DialogUtils';
import ContractServices from '@/src/data/contract/services/ContractServices';
import { ContractCheckMySignIdParams } from '@/src/data/contract/models/contract.types';
import _ from 'lodash';

export default function useContractCheckMySignId() {

    return useMutation({
        mutationKey: ['CONTRACT_CHECK_MY_SIGN_ID'],
        mutationFn: (variables: ContractCheckMySignIdParams) => new ContractServices().onCheckMySignId(variables),
    });

}
