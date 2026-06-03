import { GetServerSideProps, GetServerSidePropsContext } from "next/types";

import PartnerProfileScreen from "@/src/screens/PartnerScreen/PartnerProfileScreen/PartnerProfileScreen";
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
  const title = "Hồ sơ đối tác";
  const description =
    "Trang quản lý và cập nhật hồ sơ đối tác trên nền tảng iAgree.";

  return (
    <>
      <Seo
        title={title}
        description={description}
        canonicalPath="/partner/profile"
        ogImage={ConstantConfig.DEFAULT_OG_IMAGE?.[0]?.url}
      />

      <PartnerProfileScreen {...props} />
    </>
  );
}
