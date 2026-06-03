import React from 'react';

import CookieUtils from '@/src/utils/CookieUtils';
import { GetServerSidePropsContext } from 'next';
import CopyrightPolicyScreen from '@/src/screens/CopyrightPolicyScreen/CopyrightPolicyScreen';

export const getServerSideProps = async(context: GetServerSidePropsContext) => {
    if (!CookieUtils.hasAccessToken(context)) {}

    return {
        props: {},
    };
};

function Component(props: any) {

    return (
        <CopyrightPolicyScreen
            {...props}
        />
    );
}

export default Component;
