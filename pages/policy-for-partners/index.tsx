import { GetServerSidePropsContext } from "next";

import PolicyForPartnersScreen from "@/src/screens/PolicyForPartnersScreen/PolicyForPartnersScreen";
import Seo from "@/src/components/Seo";
import { ConstantConfig } from "@/src/constants/Config";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  return {
    props: {},
  };
};

export default function Component(props: any) {
  const title = "Chính sách dành cho Đối tác";
  const description =
    "Chính sách dành cho Đối tác iAgree quy định quyền, nghĩa vụ, trách nhiệm và các điều khoản áp dụng cho đối tác khi tham gia nền tảng.";

  return (
    <>
      <Seo
        title={title}
        description={description}
        canonicalPath="/chinh-sach-doi-tac"
        ogImage={ConstantConfig.DEFAULT_OG_IMAGE?.[0]?.url}
      />

      <PolicyForPartnersScreen {...props} />
    </>
  );
}