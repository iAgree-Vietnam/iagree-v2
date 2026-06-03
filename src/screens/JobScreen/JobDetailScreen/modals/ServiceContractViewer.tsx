import React, { useEffect, useState } from "react";

const CONTRACT_URL =
  "https://cms.iagree.asia/policy/serviceProvideContract.html";

export const ServiceContractViewer: React.FC = () => {
  const [html, setHtml] = useState<string>("<p>Đang tải nội dung...</p>");
  const [hasLoggedBottom, setHasLoggedBottom] = useState(false);

  useEffect(() => {
    // fetch thẳng HTML từ URL
    fetch(CONTRACT_URL)
      .then((res) => res.text())
      .then((data) => setHtml(data))
      .catch((err) => {
        console.error("Error loading contract html:", err);
        setHtml("<p>Không load được nội dung hợp đồng.</p>");
      });
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const { scrollTop, clientHeight, scrollHeight } = el;

    const isBottom = scrollTop + clientHeight >= scrollHeight - 1;

    if (isBottom && !hasLoggedBottom) {
      setHasLoggedBottom(true);
    }
  };

  return (
    <div className="w-full">
      <h3 className="mb-2 font-semibold">
        Hợp đồng cung cấp dịch vụ giữa Khách hàng và Đối tác
      </h3>

      <div
        onScroll={handleScroll}
        style={{
          maxHeight: 300,
          overflowY: "auto",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          padding: 12,
          background: "#fff",
        }}
        // chú ý: chỉ nên dùng cho HTML từ server mình kiểm soát
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};