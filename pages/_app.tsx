import { AuthProvider } from '@/lib/auth-context'
// import "nprogress/nprogress.css";
// import "@/src/styles/tailwind.css"; // 👈 để cao nhất có thể
import dynamic from "next/dynamic";
import withTheme from "../theme";
import Providers from "../src/contexts/Providers";
// import BackendAuthServices from "@/src/data/auth/services/BackendAuthServices";
// import CookieUtils from "@/src/utils/CookieUtils";
import { FullProfileResource } from "@/src/data/auth/models/types";
import { AppProps } from "next/app";
// import HomeServices from "@/src/data/home/services/HomeServices";
// import { HomeInitResource } from "@/src/data/home/models/home.types";
import { SettingResource } from "@/src/data/setting/models/setting.types";
// import Script from "next/script";
// import { AxiosError } from "axios";
// import Constants from "@/src/constants/Constants";
import "react-quill/dist/quill.snow.css";
import GtagAuthHandler from "@/src/components/google-analytics/GtagAuthHandler";
// import { isEmpty } from "lodash";
// import SettingServices from "@/src/data/setting/services/SettingServices";
// import "@ant-design/v5-patch-for-react-19";
const TopProgressBar = dynamic(
  () => import("@/src/components/TopProgressBar"),
  { ssr: false }
);

function App({
  Component,
  pageProps,
}: // accessToken,
// profile,
// setting,
AppProps & {
  accessToken: string;
  profile: FullProfileResource | null;
  setting: SettingResource;
}) {
  return withTheme(
    <Providers
      // account={{
      //     profile: profile,
      //     accessToken: accessToken,
      //     setting: setting,
      // }}
      nextAuthSession={pageProps?.session}
    >
      <TopProgressBar />
      <GtagAuthHandler><AuthProvider>
        <Component {...pageProps} />
      </AuthProvider></GtagAuthHandler>
    </Providers>
  );
}

// App.getInitialProps = async ({ Component, ctx: context }: any) => {
//     const accessToken = CookieUtils.getAccessTokenFromServerContext(context);
//     let fullProfileResource = null;

//     try {
//         if (!isEmpty(accessToken)) {
//             fullProfileResource = await new BackendAuthServices(context).getFullInfo();
//         }
//     } catch (error) {
//         if (error instanceof AxiosError && error.response?.status === 401) {
//             // ✅ Clear NextAuth cookies when backend token is invalid
//             if (context.res) {
//                 const nextAuthCookies = [
//                     'next-auth.session-token',
//                     '__Secure-next-auth.session-token',
//                     'next-auth.csrf-token',
//                     '__Host-next-auth.csrf-token',
//                     'next-auth.callback-url',
//                     '__Secure-next-auth.callback-url'
//                 ];

//                 nextAuthCookies.forEach(cookieName => {
//                     context.res.setHeader(
//                         'Set-Cookie',
//                         `${cookieName}=; Max-Age=0; Path=/; HttpOnly; SameSite=lax`
//                     );
//                 });

//                 // Clear access token
//                 context.res.setHeader(
//                     'Set-Cookie',
//                     `${Constants.KEY_ACCESS_TOKEN}=; Max-Age=0; Path=/; HttpOnly`
//                 );
//             }
//         }
//     }

//     // const homeResource = (await new HomeServices(context).get({})) as HomeInitResource;
//     const settingResource = (await new SettingServices(context).get({})) as HomeInitResource;

//     return {
//         profile: fullProfileResource || null,
//         accessToken: accessToken || null, // Ensure null if cleared
//         setting: settingResource.setting,
//     };
// };

export default App;
