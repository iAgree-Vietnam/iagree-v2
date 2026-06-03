
import { GetServerSidePropsContext } from "next/types";
import { PartnerRegisterGetStartScreen } from "@/src/screens/PartnerRegisterFirstScreen/PartnerRegisterGetStartScreen";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  return {
    props: {},
  };
};

function Component(props: any) {
  return <PartnerRegisterGetStartScreen {...props} />;
}

export default Component;
