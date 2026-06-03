import { useEffect, useState } from "react";

export function useDomain() {
  const [domain, setDomain] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDomain(window.location.origin);
    }
  }, []);

  return domain;
}
