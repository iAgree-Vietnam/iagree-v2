
import { GetServerSidePropsContext } from "next/types";

import ServiceScreen from "@/src/screens/ServiceScreen/ServiceScreen";
import BackendPricingServices from "@/src/data/pricing/services/BackendPricingServices";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const pricingService = new BackendPricingServices(context);

  // Chạy song song cả 2 API call
  const [res, res2] = await Promise.all([
    pricingService.get(),
    pricingService.checkCitizenIdStatus(),
  ]);

  return {
    props: { data: res, statusCode: res2.status.code },
  };
};

function Component(props: any) {
  return <ServiceScreen {...props} />;
}

export default Component;
