import React, { useState, useEffect } from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

interface ServiceCategoryImageProps {
  src?: string;
  alt: string;
  fallbackSrc?: string;
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
}

const defaultFallbackImage =
  "https://cdn.prod.website-files.com/65aeef01ceab5a488ee1a755/65bae5dca22bad4391e32bad_category-green-bg-1200x630.jpg";

const ServiceCategoryImage: React.FC<ServiceCategoryImageProps> = ({
  src,
  alt,
  fallbackSrc = defaultFallbackImage,
  width = "100%",
  height = "200px",
  style,
}) => {
  const [loading, setLoading] = useState(true);
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);
  const [errorCount, setErrorCount] = useState(0);

  useEffect(() => {
    setCurrentSrc(src || fallbackSrc);
    setLoading(true);
    setErrorCount(0);
  }, [src, fallbackSrc]);

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    if (errorCount < 1 && src && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setErrorCount(1);
    } else {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: width,
        height: height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
        ...style,
      }}
    >
      {loading && (
        <div
          style={{
            flex: 1,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1,
          }}
        >
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </div>
      )}
      <img
        src={currentSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: loading ? "none" : "block",
        }}
      />
    </div>
  );
};

export default ServiceCategoryImage;
