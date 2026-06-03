import React from 'react';
import UserJobsScreen from '../../../../src/screens/UserScreen/UserJobsScreen/UserJobsScreen';
import Constants from '../../../../src/constants/Constants';
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

export default function Component(props: any) {

    return (
        <UserJobsScreen
            {...props}
            hideAddButton={true}
            type={Constants.JOB.TYPE.APPLY}
            statusId={Constants.JOB.ROUTE_COMMON_STATUS.HOAN_THANH}
        />
    );
}
