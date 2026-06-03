import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next/types";

import CookieUtils from "@/src/utils/CookieUtils";
import VerifyOtpResendScreenV2 from "@/src/screens/VerifyOtpScreenV2/VerifyOtpScreenV2";

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
      destination: "/",
      permanent: true,
    },
  };
};

export default function Component(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  return <VerifyOtpResendScreenV2 {...props} />;
}
