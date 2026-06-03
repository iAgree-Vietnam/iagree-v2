
import { GetServerSidePropsContext } from "next/types";

import JobAddFormScreenV2 from "@/src/screens/JobScreen/JobFormScreen/JobAddFormScreenV2";
import Seo from "@/src/components/Seo";
import { ConstantConfig } from "@/src/constants/Config";
// import CookieUtils from "@/src/utils/CookieUtils";

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  // Nếu sau này bật auth thì mở lại
  // if (!CookieUtils.hasAccessToken(ctx)) {
  //   return {
  //     redirect: {
  //       destination: "/login",
  //       permanent: false,
  //     },
  //   };
  // }

  return {
    props: {},
  };
};

export default function Component(props: any) {
  const title = "Đăng công việc";
  const description =
    "Trang tạo và đăng công việc mới dành cho doanh nghiệp trên nền tảng iAgree.";

  return (
    <>
      <Seo
        title={title}
        description={description}
        canonicalPath="/jobs/add"
        ogImage={ConstantConfig.DEFAULT_OG_IMAGE?.[0]?.url}
        
      />

      <JobAddFormScreenV2 {...props} />
    </>
  );
}