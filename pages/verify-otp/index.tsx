import {
    GetServerSideProps,
    GetServerSidePropsContext,
    InferGetServerSidePropsType,
} from 'next/types';
  
import VerifyOtpScreen from '@/src/screens/VerifyOtpScreen/VerifyOtpScreen';
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
    return <VerifyOtpScreen {...props} />;
}
  