import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "@/lib/shim/next-auth-react";

import { AccountProvider } from "./AccountContext";
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

interface ProvidersProps {
  children: React.ReactNode;
  nextAuthSession?: any;
}

function Providers({ children, nextAuthSession }: ProvidersProps) {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        
          <AccountProvider>{children}</AccountProvider>
        
      </QueryClientProvider>
    </ReduxProvider>
  );
}

export default Providers;
