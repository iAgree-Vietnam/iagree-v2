import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import dialogUtils from '@/src/utils/DialogUtils';
import ContractSignServices from '@/src/data/contract/services/ContractSignServices';
import { ContractResource, FullContractResource, SignUserResource } from '@/src/data/contract/models/contract.types';
import { message } from 'antd';
import _ from 'lodash';

export default function useContractSignSave(contractResource: ContractResource, options: UseMutationOptions) {

    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['CONTRACT_SIGN_SAVE'],
        mutationFn: (variables) => new ContractSignServices().onSave(contractResource, variables),
        onSuccess: (signUserResponse: SignUserResource, variables, context) => {
            message.success('Thành công').then(() => null);

            queryClient.setQueryData(['CONTRACT_DETAIL_SCREEN', contractResource.contractId], (prevState: FullContractResource | undefined): FullContractResource | undefined => {
                if (!prevState) return prevState;

                return {
                    ...prevState,
                    signUsers: _.uniqBy(prevState.signUsers.concat([signUserResponse]), 'signId'),
                };
            });
            queryClient.invalidateQueries({ queryKey: ['CONTRACT_SCREEN'] }).then(() => null);

            if (_.isFunction(options.onSuccess)) options.onSuccess(signUserResponse, variables, context);
        },
        onError: (error) => dialogUtils.showResponseError(error, 'CONTRACT_SIGN_SAVE'),
    });

}
