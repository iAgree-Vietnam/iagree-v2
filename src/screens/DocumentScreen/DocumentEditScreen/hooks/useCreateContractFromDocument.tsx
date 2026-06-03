import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import TemplateServices from '@/src/data/template/services/TemplateServices';
import { TemplateSaveParams } from '@/src/data/template/models/template.types';
import dialogUtils from '@/src/utils/DialogUtils';
import StringUtils from '@/src/utils/StringUtils';
import { ContractResource } from '@/src/data/contract/models/contract.types';
import useContractSave from '@/src/screens/ContractScreen/hooks/useContractSave';
import ContractRouteUtils from '@/src/data/contract/utils/ContractRouteUtils';

export default function useCreateContractFromDocument() {

    const router = useRouter();

    const contractSaveMutation = useContractSave({
        onSuccess: (data: ContractResource) => router.push(ContractRouteUtils.toScreen({})),
    });

    return useMutation({
        mutationKey: ['CREATE_CONTRACT_FROM_DOCUMENT'],
        mutationFn: (variables: TemplateSaveParams) => new TemplateServices().onDownload(variables),
        onSuccess: (data, variables) => {

            const fileName = `${StringUtils.normalizeDownloadFilename(variables.title)}.pdf`;
            //@ts-ignore
            contractSaveMutation.mutate({ name: variables.title, attachments: [{ originFileObj: new File([data as Blob], fileName) }] });
        },
        onError: (error) => dialogUtils.showResponseError(error, 'CREATE_CONTRACT_FROM_DOCUMENT'),
    });

}
