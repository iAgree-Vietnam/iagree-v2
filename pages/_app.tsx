import { AuthProvider } from '@/lib/auth-context'
import dynamic from "next/dynamic";
import withTheme from "../theme";
import Providers from "../src/contexts/Providers";
import { FullProfileResource } from "@/src/data/auth/models/types";
import { AppProps } from "next/app";
import { SettingResource } from "@/src/data/setting/models/setting.types";
import "react-quill/dist/quill.snow.css";

const TopProgressBar = dynamic(
  () => import("@/src/components/TopProgressBar"),
  { ssr: false }
);

function App({
  Component,
  pageProps,
}: AppProps & {
  accessToken?: string;
  profile?: FullProfileResource | null;
  setting?: SettingResource;
}) {
  return withTheme(
    <AuthProvider>
      <Providers nextAuthSession={pageProps?.session}>
        <TopProgressBar />
        <Component {...pageProps} />
      </Providers>
    </AuthProvider>
  );
}

export default App;
