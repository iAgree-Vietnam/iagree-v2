import { ContractRawResource, FullContractRawResource, RawSignUserResource } from '@/src/data/contract/models/contract.raw';
import { ContractFilterParams, ContractResource, FullContractResource, SignUserResource } from '@/src/data/contract/models/contract.types';
import NumberUtils from '@/src/utils/NumberUtils';
import _ from 'lodash';
import { ParsedUrlQuery } from 'querystring';

export const ContractParseUtils = {

    item(dataItem: ContractRawResource): ContractResource {
        return {
            contractId: dataItem.id,
            userId: dataItem.user_id,
            userName: dataItem.user_name,
            name: dataItem.name,
            fileUrl: dataItem.file,
            lastModifiedDate: dataItem.last_modified,
            releaseDate: dataItem.release_date,
            signType: dataItem.sign_type,
            status: dataItem.status,
            createdDate: dataItem.created_at,
            updatedDate: dataItem.updated_at,
            signUsers: dataItem.sign_users?.map((item) => ContractParseUtils.signUserItem(item)),
        };
    },

    fullInfo(dataItem: FullContractRawResource): FullContractResource {
        return {
            ...this.item(dataItem),
        };
    },

    signUserItem(dataItem: RawSignUserResource): SignUserResource {
        return {
            signId: dataItem.id,
            userContractId: dataItem.user_contract_id,
            email: dataItem.email,
            signName: dataItem.sign_name,
            imageUrl: dataItem.image,
            identify: dataItem.identify,
            credentialId: dataItem.credential_id,
            address: dataItem.address,
            lastModifiedDate: dataItem.last_modified,
            status: dataItem.status,
            top: dataItem.top,
            left: dataItem.left,
            pageNumber: dataItem.page_number,
            appMysignDescription: dataItem.app_mysign_description,
        };
    },

    getFilterInitialState(): ContractFilterParams {
        return {
            statusId: null,
            search: null,
            page: 1,
        };
    },

    contractQueries(urlQuery: ParsedUrlQuery): ContractFilterParams {
        const filterParams = this.getFilterInitialState();

        if (_.has(urlQuery, 'statusId') && NumberUtils.isNumber(urlQuery.statusId)) {
            filterParams.statusId = Number(urlQuery.statusId);
        }

        if (_.has(urlQuery, 'search') && !_.isEmpty(urlQuery.search)) {
            filterParams.search = urlQuery.search as string;
        }

        return filterParams;
    },

};
