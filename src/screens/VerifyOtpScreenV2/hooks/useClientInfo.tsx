import { useEffect, useState } from "react";

interface BrowserInfo {
  browser: string;
  os: string;
  userAgent: string;
}

interface ClientInfo {
  clientIp: string;
  browserInfo: BrowserInfo;
}

export function useClientInfo(): ClientInfo {
  const [clientIp, setClientIp] = useState<string>("");
  const [browserInfo, setBrowserInfo] = useState<BrowserInfo>({
    browser: "Unknown",
    os: "Unknown",
    userAgent: "",
  });

  // Hàm lấy IP
  async function getClientIp(): Promise<string> {
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      const data = await res.json();
      return data.ip;
    } catch (err) {
      console.error("Cannot get IP: ", err);
      return "";
    }
  }

  // Hàm lấy thông tin browser / OS
  function getBrowserInfo(): BrowserInfo {
    const ua = navigator.userAgent;
    let browser = "Unknown";
    if (ua.indexOf("Chrome") > -1 && ua.indexOf("Edg") === -1)
      browser = "Google Chrome";
    else if (ua.indexOf("Edg") > -1) browser = "Edge";
    else if (ua.indexOf("Firefox") > -1) browser = "Firefox";
    else if (ua.indexOf("Safari") > -1 && ua.indexOf("Chrome") === -1)
      browser = "Safari";

    let os = "Unknown";
    if (ua.indexOf("Win") > -1) os = "Windows";
    else if (ua.indexOf("Mac") > -1) os = "MacOS";
    else if (ua.indexOf("Linux") > -1) os = "Linux";
    else if (/Android/i.test(ua)) os = "Android";
    else if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";

    return { browser, os, userAgent: ua };
  }

  useEffect(() => {
    // lấy IP
    getClientIp().then((ip) => setClientIp(ip));
    // lấy browser info
    setBrowserInfo(getBrowserInfo());
  }, []);

  return { clientIp, browserInfo };
}