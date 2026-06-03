import { GetServerSideProps, GetServerSidePropsContext } from 'next/types';

import { ChangePasswordScreen } from '@/src/screens/PasswordScreen/ChangePasswordScreen/ChangePasswordScreen';
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

// export default ChangePasswordScreen;


export default function ChangePasswordPage() {
  return <ChangePasswordScreen/>;
}
