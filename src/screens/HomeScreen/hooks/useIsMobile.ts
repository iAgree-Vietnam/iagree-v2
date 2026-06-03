import { useState, useEffect } from "react";

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= breakpoint);
    };

    // Thiết lập trạng thái ban đầu
    handleResize();

    // Thêm event listener để cập nhật khi cửa sổ thay đổi kích thước
    window.addEventListener("resize", handleResize);

    // Dọn dẹp event listener khi component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [breakpoint]);

  return isMobile;
};

export default useIsMobile;