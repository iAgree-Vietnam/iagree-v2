import { useEffect } from "react";
import { useRouter } from "next/router";

const useSetRouterPath = () => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      localStorage.setItem("PREVIOUS_PATH", router.pathname); // Lưu lại đường dẫn hiện tại vào localStorage
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);

    // Cleanup khi component unmount hoặc router pathname thay đổi
    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
    };
  }, [router.pathname]); // Chạy lại khi router.pathname thay đổi
};

export default useSetRouterPath;