import { useMutation, useQueryClient } from '@tanstack/react-query';
import ContractServices from '@/src/data/contract/services/ContractServices';
import { ContractUpdateResource } from '@/src/data/contract/models/contract.types';
import dialogUtils from '@/src/utils/DialogUtils';
import { UseMutationOptions } from '@tanstack/react-query/src/types';
import _ from 'lodash';
import moment from 'moment';
import datetimeUtils from '@/src/utils/DatetimeUtils';

export default function useContractUpdate(options: UseMutationOptions) {

    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['CONTRACT_UPDATE'],
        mutationFn: (variables: ContractUpdateResource) => new ContractServices().onUpdate(variables),
        onSuccess: (data, variables: ContractUpdateResource, context) => {
            queryClient.setQueryData(['CONTRACT_DETAIL_SCREEN', variables.contractId], (prevState: any) => {
                if (!prevState) return prevState;

                return { ...prevState, ...variables, lastModifiedDate: moment(variables.lastModifiedDate).format(datetimeUtils.BACKEND_DATE_TIME) };
            });
            queryClient.invalidateQueries({ queryKey: ['CONTRACT_SCREEN'] }).then(() => null);

            if (_.isFunction(options.onSuccess)) options.onSuccess(data, variables as any, context);
        },
        onError: (error) => dialogUtils.showResponseError(error, 'CONTRACT_UPDATE'),
    });

}
