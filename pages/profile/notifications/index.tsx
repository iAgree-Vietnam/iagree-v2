import { GetServerSideProps, GetServerSidePropsContext } from 'next/types';

import { NotificationScreen } from '@/src/screens/ProfileScreen';
import CookieUtils from '@/src/utils/CookieUtils';

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

export default NotificationScreen;
