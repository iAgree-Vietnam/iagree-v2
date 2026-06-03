import apiUtils from '@/src/utils/APIUtils';
import EndpointConfig from '@/src/constants/EndpointConfig';
import { DatasResource } from '@/src/data/base/models/base.types';
import { ContractRawResource, ContractSaveParams, ContractUpdatePDFParams, FullContractRawResource } from '@/src/data/contract/models/contract.raw';
import { ContractParseUtils } from '@/src/data/contract/utils/ContractParseUtils';
import _ from 'lodash';
import { RcFile } from 'antd/es/upload/interface';
import moment from 'moment';
import URLUtils from '@/src/utils/URLUtils';
import { ContractCheckMySignIdParams, ContractResource, ContractUpdateResource, ContractUpdateSignResource, SignUserResource } from '@/src/data/contract/models/contract.types';
import datetimeUtils from '@/src/utils/DatetimeUtils';

export default class ContractServices {

    get(queryParams: any) {
        return new Promise((resolve, reject) => {
            apiUtils.get(EndpointConfig.CONTRACT_LIST, {
                params: queryParams,
            })
                .then((apiRes) => {
                    const dataResponse: DatasResource<ContractRawResource> = apiRes.data;

                    resolve({
                        items: dataResponse.items.map(ContractParseUtils.item),
                        total: dataResponse.total,
                    });
                })
                .catch(reject);
        });
    }

    getFullInfo(contractId: number) {
        return new Promise((resolve, reject) => {
            const endpointUrl = URLUtils.bindUrl(EndpointConfig.CONTRACT_FULL_INFO, { ':contractId': contractId });

            apiUtils.get(endpointUrl)
                .then((apiRes) => resolve(ContractParseUtils.fullInfo(apiRes.data as FullContractRawResource)))
                .catch(reject);
        });
    }

    onSave(dataParams: ContractSaveParams) {
        return new Promise<ContractResource>((resolve, reject) => {
            const attachmentResource = _.get(dataParams, 'attachments.0', null) as RcFile;

            const formDatas = new FormData();
            formDatas.append('name', dataParams.name);
            formDatas.append('last_modified', moment().format('YYYY-MM-DD'));
            formDatas.append('file', _.get(attachmentResource, 'originFileObj') as any, attachmentResource.name);


            apiUtils.post(EndpointConfig.CONTRACT_SAVE, formDatas, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then((apiRes) => resolve(ContractParseUtils.item(apiRes.data.data)))
                .catch(reject);
        });
    }

    onUpdateSignatures(fullContractResource: ContractUpdateSignResource) {
        return new Promise((resolve, reject) => {
            const endpointUrl = URLUtils.bindUrl(EndpointConfig.CONTRACT_UPDATE_SIGN, { ':contractId': fullContractResource.contractId });

            const formDatas = {
                signs: fullContractResource.signatures.map((itemResource) => ({
                    id: itemResource.signId,
                    page_number: itemResource.pageNumber,
                    top: itemResource.y,
                    left: itemResource.x,
                })),
            };

            apiUtils.post(endpointUrl, formDatas)
                .then((apiRes) => resolve(apiRes.data))
                .catch(reject);
        });
    }

    onUpdate(fullContractResource: ContractUpdateResource) {
        return new Promise((resolve, reject) => {
            const endpointUrl = URLUtils.bindUrl(EndpointConfig.CONTRACT_UPDATE, { ':contractId': fullContractResource.contractId });

            const formDatas = {
                name: fullContractResource.name,
                user_name: fullContractResource.userName as string,
                last_modified: moment(fullContractResource.lastModifiedDate).format(datetimeUtils.BACKEND_DATE_TIME),
                sign_type: fullContractResource.signType,
                signs: fullContractResource.signatures?.map((itemResource) => ({
                    id: itemResource.signId,
                    page_number: itemResource.pageNumber,
                    top: itemResource.y,
                    left: itemResource.x,
                })),
            };

            apiUtils.post(endpointUrl, formDatas)
                .then((apiRes) => resolve(apiRes.data))
                .catch(reject);
        });
    }

    onUpdatePDF(dataParams: ContractUpdatePDFParams) {
        return new Promise<ContractResource>((resolve, reject) => {

            const formDatas = new FormData();
            formDatas.append('last_modified', moment().format('YYYY-MM-DD'));
            formDatas.append('file', dataParams.pdfFile);

            const endpointUrl = URLUtils.bindUrl(EndpointConfig.CONTRACT_UPDATE_PDF, { ':contractId': dataParams.contractId });

            apiUtils.post(endpointUrl, formDatas, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then((apiRes) => resolve(apiRes.data))
                .catch(reject);
        });
    }

    onCancel(contractResource: ContractResource) {
        return new Promise((resolve, reject) => {
            const endpointUrl = URLUtils.bindUrl(EndpointConfig.CONTRACT_CANCEL, { ':contractId': contractResource.contractId });

            apiUtils.post(endpointUrl)
                .then((apiRes) => resolve(apiRes.data))
                .catch(reject);
        });
    }

    onDelete(contractResource: ContractResource) {
        return new Promise((resolve, reject) => {
            const endpointUrl = URLUtils.bindUrl(EndpointConfig.CONTRACT_DELETE, { ':contractId': contractResource.contractId });

            apiUtils.delete(endpointUrl)
                .then((apiRes) => resolve(apiRes.data))
                .catch(reject);
        });
    }

    onRequestMailToSign(contractResource: ContractResource) {
        return new Promise((resolve, reject) => {
            const endpointUrl = URLUtils.bindUrl(EndpointConfig.CONTRACT_REQUEST_MAIL_TO_SIGN, { ':contractId': contractResource.contractId });

            apiUtils.post(endpointUrl)
                .then((apiRes) => resolve(apiRes.data))
                .catch(reject);
        });
    }

    onConfirmMailSign(formDatas: any) {
        return new Promise((resolve, reject) => {
            const endpointUrl = URLUtils.bindUrl(EndpointConfig.CONTRACT_CONFIRM_MAIL_SIGN, { ':code': formDatas.code });
            delete formDatas.code;

            apiUtils.post(endpointUrl, formDatas)
                .then((apiRes) => resolve(apiRes.data))
                .catch(reject);
        });
    }

    onGetContractConfirmMailSign(code: string) {
        return new Promise<string>((resolve, reject) => {
            const endpointUrl = URLUtils.bindUrl(EndpointConfig.CONTRACT_CONFIRM_MAIL_SIGN, { ':code': code });
            apiUtils.get(endpointUrl)
                .then((apiRes) => {
                    const byteCharacters = atob(apiRes.data.contract_content);
                    const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
                    const byteArray = new Uint8Array(byteNumbers);
                    resolve(URL.createObjectURL(new Blob([byteArray], { type: 'application/pdf' })))
                }

                )
                .catch(reject);
        });
    }

    onRequestSignOnMySign(contractResource: ContractResource) {
        return new Promise((resolve, reject) => {
            const endpointUrl = URLUtils.bindUrl(EndpointConfig.CONTRACT_REQUEST_SIGN_ON_MYSIGN, { ':contractId': contractResource.contractId });

            apiUtils.post(endpointUrl)
                .then((apiRes) => resolve(apiRes.data))
                .catch(reject);
        });
    }

    onCheckSignOnMySign(signUserResource: SignUserResource) {
        return new Promise((resolve, reject) => {
            const endpointUrl = URLUtils.bindUrl(EndpointConfig.CONTRACT_CHECK_SIGN_ON_MYSIGN, { ':signId': signUserResource.signId });

            apiUtils.post(endpointUrl)
                .then((apiRes) => resolve(apiRes.data))
                .catch(reject);
        });
    }

    onCheckMySignId(params: ContractCheckMySignIdParams) {
        return new Promise((resolve, reject) => {

            apiUtils.post(EndpointConfig.CONTRACT_CHECK_MY_SIGN_ID, params)
                .then((apiRes) => resolve(apiRes.data))
                .catch((err) => reject(err));
        });
    }

    onResendSignRequest(signUserResource: SignUserResource) {
        return new Promise((resolve, reject) => {

            apiUtils.post(EndpointConfig.CONTRACT_RESEND_SIGN_REQUEST, { id: signUserResource.signId.toString() })
                .then((apiRes) => resolve(apiRes.data))
                .catch(reject);
        });
    }


}
