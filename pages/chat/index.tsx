import { GetServerSideProps, GetServerSidePropsContext } from 'next/types';

import CookieUtils from '@/src/utils/CookieUtils';
import ChatScreenV2 from '@/src/screens/ChatScreenV2/ChatScreenV2';

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
export default function Component() {
  return <ChatScreenV2 />;
}

