import { useEffect, useState } from "react";

const getMobileDetect = (userAgent: string) => {
  const isAndroid = (): boolean => Boolean(userAgent.match(/Android/i));
  const isIos = (): boolean => Boolean(userAgent.match(/iPhone|iPad|iPod/i));
  const isOpera = (): boolean => Boolean(userAgent.match(/Opera Mini/i));
  const isWindows = (): boolean => Boolean(userAgent.match(/IEMobile/i));
  const isSSR = (): boolean => Boolean(userAgent.match(/SSR/i));

  const isMobile = (): boolean =>
    Boolean(isAndroid() || isIos() || isOpera() || isWindows());
  const isDesktop = (): boolean => Boolean(!isMobile() && !isSSR());
  return {
    isMobile,
    isDesktop,
    isAndroid,
    isIos,
    isSSR,
  };
};

export default function useDetectDevice() {
  const userAgent =
    typeof navigator === "undefined" ? "SSR" : navigator.userAgent;

  return getMobileDetect(userAgent);
}

export function useDetectDeviceV2() {
  const [isMobile, setIsMobile] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const userAgent =
      typeof navigator === "undefined" ? "SSR" : navigator.userAgent;
    const mobileDetect = getMobileDetect(userAgent);

    setIsMobile(mobileDetect.isMobile());
    setIsDesktop(mobileDetect.isDesktop());

    const handleResize = () => {
      const isCurrentlyMobile = window.innerWidth <= 768;
      setIsMobile(isCurrentlyMobile);
      setIsDesktop(!isCurrentlyMobile);
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    isMobile,
    isDesktop,
  };
}
