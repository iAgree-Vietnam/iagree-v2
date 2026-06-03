import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next/types';

import { SubscriptionScreen } from '@/src/screens/ProfileScreen';
import CookieUtils from '@/src/utils/CookieUtils';
import BackendPricingServices from '@/src/data/pricing/services/BackendPricingServices';
import { PricingResource } from '@/src/data/pricing/models/pricing.types';

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

  try {
    const allServiceResource = await new BackendPricingServices(context).get();

    const userServices = (allServiceResource as PricingResource).users;
    const eSignPackageData = (allServiceResource as PricingResource).signatures
      .allPackages;

    return {
      props: {
        userServices,
        eSignPackageData,
      },
    };
  } catch (error) {
    return {
      props: {},
    };
  }
};

export default function Component(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  return <SubscriptionScreen {...props} />;
}
