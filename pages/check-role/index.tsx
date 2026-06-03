// pages/register-become-partner.tsx
import type { GetServerSideProps, NextPage } from "next";
import Constants from "@/src/constants/Constants";
import CheckRoleScreen from "@/src/screens/CheckRoleScreen/CheckRoleScreenV2";
// import RegisterBecomePartnerScreen from "../register-become-partner";

interface RegisterBecomePartnerPageProps {
  // sau này nếu cần truyền thêm props từ server thì nhét vào đây
  fromServer?: string;
}

const RegisterBecomePartnerPage: NextPage<RegisterBecomePartnerPageProps> = (
  props
) => {
  return <CheckRoleScreen {...props} />;
};

export const getServerSideProps: GetServerSideProps<
  RegisterBecomePartnerPageProps
> = async (ctx) => {
  // Ví dụ: nếu đã có access token thì redirect về trang chủ
  const token = ctx.req.cookies[Constants.KEY_ACCESS_TOKEN] ?? null;

  if (token) {
    return {
      redirect: {
        destination: "/", // hoặc "/dashboard" tùy flow
        permanent: false,
      },
    };
  }

  // Có thể fetch thêm data từ API ở đây nếu cần
  return {
    props: {
      fromServer: "hello-from-ssr",
    },
  };
};

export default RegisterBecomePartnerPage;