import { GetServerSideProps, GetServerSidePropsContext } from "next/types";

import PartnerProfileReviewsScreen from "@/src/screens/PartnerScreen/PartnerProfileReviewsScreen/PartnerProfileReviewsScreen";
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
  const title = "Đánh giá đối tác";
  const description =
    "Trang xem và quản lý đánh giá đối tác trên nền tảng iAgree.";

  return (
    <>
      <Seo
        title={title}
        description={description}
        canonicalPath="/partner/profile/reviews"
        ogImage={ConstantConfig.DEFAULT_OG_IMAGE?.[0]?.url}
      />

      <PartnerProfileReviewsScreen {...props} />
    </>
  );
}
