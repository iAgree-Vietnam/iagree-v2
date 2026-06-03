import { GetServerSideProps, GetServerSidePropsContext } from 'next/types';

import CookieUtils from '@/src/utils/CookieUtils';
import PartnerFormScreen from '@/src/screens/PartnerScreen/PartnerFormScreen/PartnerFormScreen';

export const getServerSideProps: GetServerSideProps = async (
    context: GetServerSidePropsContext
) => {
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

export default PartnerFormScreen;
