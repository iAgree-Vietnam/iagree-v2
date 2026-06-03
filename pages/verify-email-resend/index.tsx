import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next/types';

import VerifyEmailResendScreen from '@/src/screens/VerifyEmailResendScreen/VerifyEmailResendScreen';
import CookieUtils from '@/src/utils/CookieUtils';

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const verifyEmail = CookieUtils.getVerifyEmailFromServerContext(context);
  if (verifyEmail) {
    return {
      props: { data: verifyEmail },
    };
  }
  return {
    redirect: {
      destination: '/',
      permanent: true,
    },
  };
};

export default function Component(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  return <VerifyEmailResendScreen {...props} />;
}
