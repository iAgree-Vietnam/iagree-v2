import { useEffect } from "react";

export function useScrollTop(
  ref: React.RefObject<HTMLElement>,
  onReachTop: () => void
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleScroll = () => {
      if (el.scrollTop === 0) {
        onReachTop();
      }
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [ref, onReachTop]);
}