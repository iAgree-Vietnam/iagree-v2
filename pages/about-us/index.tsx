import { GetServerSidePropsContext } from "next";
import IntroduceServices from "@/src/data/introduce/services/IntroduceServices";
import { AboutUsScreenV2 } from "@/src/screens/AboutUsScreenV2/AboutUsScreenV2";
import Seo from "@/src/components/Seo";
import { ConstantConfig } from "@/src/constants/Config";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const apiRes = await new IntroduceServices().introduce();

  return {
    props: {
      data: apiRes,
    },
  };
};

export default function Component(props: any) {
  return (
    <>
      <Seo
        title="Về chúng tôi"
        description="Tìm hiểu về iAgree: câu chuyện sáng lập, sứ mệnh và giải pháp toàn diện dành cho Khách hàng & Đối tác."
        canonicalPath="/ve-chung-toi"
        jsonLd={ConstantConfig.ABOUT_JSONLD()}
        jsonLdId="jsonld-about"
      />
      <AboutUsScreenV2 {...props} />
    </>
  );
}
