import { GetServerSideProps, GetServerSidePropsContext } from "next/types";

import { PartnerRegisterScreen } from "@/src/screens/PartnerScreen/PartnerRegisterScreen/PartnerRegisterScreen";
import CookieUtils from "@/src/utils/CookieUtils";

import Seo from "@/src/components/Seo";
import { ConstantConfig } from "@/src/constants/Config";

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  if (!CookieUtils.hasAccessToken(context)) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default function Component(props: any) {
  const title = "Đăng ký đối tác";
  const description = "Trang đăng ký đối tác trên nền tảng iAgree.";

  return (
    <>
      <Seo
        title={title}
        description={description}
        canonicalPath="/partner/register"
        ogImage={ConstantConfig.DEFAULT_OG_IMAGE?.[0]?.url}
      />

      <PartnerRegisterScreen {...props} />
    </>
  );
}
