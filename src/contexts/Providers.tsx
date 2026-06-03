
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

import { AccountProvider } from "./AccountContext";
import { FullProfileResource } from "@/src/data/auth/models/types";
import { SettingResource } from "../data/setting/models/setting.types";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "../store/store";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      initialData: null,
      retry: false,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});

// interface ProvidersProps {
//   account: {
//     profile: FullProfileResource | null;
//     accessToken: string | null;
//     setting: SettingResource | null;
//   };
//   children: React.ReactNode;
//   nextAuthSession: Session;
// }
interface ProvidersProps {
  children: React.ReactNode;
  nextAuthSession?: Session | null;
}



function Providers({ children, nextAuthSession }: ProvidersProps) {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <SessionProvider session={nextAuthSession}>
          <AccountProvider>{children}</AccountProvider>
        </SessionProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}


export default Providers;
