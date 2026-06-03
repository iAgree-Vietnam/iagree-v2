import { ContractResource, SignUserResource } from '@/src/data/contract/models/contract.types';
import URLUtils from '@/src/utils/URLUtils';
import EndpointConfig from '@/src/constants/EndpointConfig';
import apiUtils from '@/src/utils/APIUtils';
import _ from 'lodash';
import { RcFile } from 'antd/es/upload/interface';
import { ContractParseUtils } from '@/src/data/contract/utils/ContractParseUtils';

export default class ContractSignServices {

    onSave(contractResource: ContractResource, dataParams: any): Promise<SignUserResource> {
        return new Promise((resolve, reject) => {
            const attachmentResource = _.get(dataParams, 'attachments.0', null) as RcFile;
            const endpointUrl = URLUtils.bindUrl(EndpointConfig.CONTRACT_SIGN_ADD, { ':contractId': contractResource.contractId });

            const formDatas = new FormData();
            formDatas.append('email', dataParams.email);
            formDatas.append('identify', dataParams.mySignId);
            if(attachmentResource){
                formDatas.append('image', _.get(attachmentResource, 'originFileObj') as any, attachmentResource.name);
            }

            apiUtils.post(endpointUrl, formDatas, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then((apiRes) => {
                    const dataResponse = apiRes.data.data;
                    resolve(ContractParseUtils.signUserItem(dataResponse));
                })
                .catch(reject);
        });
    }

    onDelete(dataParams: SignUserResource) {
        return new Promise((resolve, reject) => {
            const endpointUrl = URLUtils.bindUrl(EndpointConfig.CONTRACT_SIGN_DELETE, { ':signId': dataParams.signId });

            apiUtils.delete(endpointUrl)
                .then((apiRes) => resolve(apiRes.data))
                .catch(reject);
        });
    }

}
