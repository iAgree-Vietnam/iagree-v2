import React from 'react';
import UploadContractScreen from '@/src/screens/ContractScreen/UploadContractScreen/UploadContractScreen';
import { GetServerSidePropsContext } from 'next/types';
import CookieUtils from '@/src/utils/CookieUtils';
import { ContractParseUtils } from '@/src/data/contract/utils/ContractParseUtils';
import _ from 'lodash';

export const getServerSideProps = async(context: GetServerSidePropsContext) => {
    if (!CookieUtils.hasAccessToken(context)) {
        return {
            redirect: {
                destination: '/login',
                permanent: true,
            },
        };
    }

    let id = null;

    if (_.has(context.query, 'id') && !_.isEmpty(context.query)) {
        id = context.query.id as string;
    }

    return {
        props: {
            filters: ContractParseUtils.contractQueries(context.query),
            id,
        },
    };
};

function Component(props: any) {

    return (
        <UploadContractScreen
            {...props}
        />
    );
}

export default Component;
