import { GetServerSideProps, GetServerSidePropsContext } from 'next/types';

import CookieUtils from '@/src/utils/CookieUtils';
import FavoriteScreen from '@/src/screens/ProfileScreen/FavoriteScreen';

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

export default FavoriteScreen;