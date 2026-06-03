import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { GetServerSidePropsContext } from "next/types";

import PartnersRulesScreen from "@/src/screens/PartnersTermsScreen/PartnersTermsScreen";
import Seo from "@/src/components/Seo";
import { ConstantConfig } from "@/src/constants/Config";

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  return {
    props: {},
  };
};

export default function Component(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const title = "Quy định và điều khoản dành cho Đối tác iAgree";
  const description =
    "Các quy định, điều khoản và nghĩa vụ dành cho đối tác khi tham gia nền tảng iAgree nhằm đảm bảo minh bạch và hợp tác lâu dài.";

  return (
    <>
      <Seo
        title={title}
        description={description}
        canonicalPath="/chinh-sach/doi-tac"
        ogImage={ConstantConfig.DEFAULT_OG_IMAGE?.[0]?.url}
      />

      <PartnersRulesScreen {...(props as any)} />
    </>
  );
}
