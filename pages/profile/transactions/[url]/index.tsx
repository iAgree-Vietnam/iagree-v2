import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { GetServerSidePropsContext } from 'next/types';

import TransactionDetailsScreen from '@/src/screens/ProfileScreen/TransactionScreen/TransactionDetailsScreen';
import CookieUtils from '@/src/utils/CookieUtils';

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
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

export default function Component(props: InferGetServerSidePropsType<typeof getServerSideProps>) {

    return (
        <TransactionDetailsScreen
            {...props}
        />
    );
}
