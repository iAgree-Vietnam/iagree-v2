
import { GetServerSidePropsContext } from "next/types";
import CookieUtils from "@/src/utils/CookieUtils";

import DocumentScreen from "@/src/screens/DocumentScreen/DocumentScreen";
import Seo from "@/src/components/Seo";
import { ConstantConfig } from "@/src/constants/Config";

export const getServerSideProps = async (
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

function Component(props: any) {
  return (
    <>
      <Seo
        title={"Tài liệu của tôi"}
        description={
          "Quản lý và theo dõi tài liệu của bạn trên iAgree. Trang này yêu cầu đăng nhập."
        }
        canonicalPath="/documents"
        ogImage={ConstantConfig.DEFAULT_OG_IMAGE?.[0]?.url}
      />

      <DocumentScreen {...props} />
    </>
  );
}

export default Component;
