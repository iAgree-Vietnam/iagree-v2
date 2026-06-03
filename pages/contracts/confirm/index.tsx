import React from 'react';
import ContractsScreen from '../../../src/screens/ContractScreen/ContractScreen';
import { GetServerSidePropsContext } from 'next/types';
import CookieUtils from '@/src/utils/CookieUtils';

export const getServerSideProps = async(context: GetServerSidePropsContext) => {
    if (!CookieUtils.hasAccessToken(context)) {
        return {
            redirect: {
                destination: '/login',
                permanent: true,
            },
        };
    }

    return {
        props: {},
    };
};

function Component(props: any) {

    return (
        <ContractsScreen
            {...props}
        />
    );
}

export default Component;
