import React from 'react';

import CookieUtils from '@/src/utils/CookieUtils';
import { GetServerSidePropsContext } from 'next';
import UserViolationPolicyScreen from '@/src/screens/UserViolationPolicyScreen/UserViolationPolicyScreen';

export const getServerSideProps = async(context: GetServerSidePropsContext) => {
    if (!CookieUtils.hasAccessToken(context)) {}

    return {
        props: {},
    };
};

function Component(props: any) {

    return (
        <UserViolationPolicyScreen
            {...props}
        />
    );
}

export default Component;
