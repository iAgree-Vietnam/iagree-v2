import { GetServerSidePropsContext } from "next";

import OperationPolicyScreen from "@/src/screens/OperationPolicyScreen/OperationPolicyScreen";
import CookieUtils from "@/src/utils/CookieUtils";

import Seo from "@/src/components/Seo";
import { ConstantConfig } from "@/src/constants/Config";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  if (!CookieUtils.hasAccessToken(context)) {
  }

  return {
    props: {},
  };
};

export default function Component(props: any) {
  const title = "Chính sách vận hành nền tảng iAgree";
  const description =
    "Quy định và nguyên tắc vận hành nền tảng iAgree nhằm đảm bảo minh bạch, an toàn, công bằng giữa freelancer và doanh nghiệp.";

  return (
    <>
      <Seo
        title={title}
        description={description}
        canonicalPath="/chinh-sach/van-hanh"
        ogImage={ConstantConfig.DEFAULT_OG_IMAGE?.[0]?.url}
      />

      <OperationPolicyScreen {...props} />
    </>
  );
}
