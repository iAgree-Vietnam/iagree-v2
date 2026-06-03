

interface OverlayFunctionUnderDevelopmentProps {
  visible: boolean;
  text?: string;
  style?: React.CSSProperties;
}

const OverlayFunctionUnderDevelopment: React.FC<OverlayFunctionUnderDevelopmentProps> = ({
  visible,
  text = "Chức năng đang được phát triển",
  style = {},
}) => {
  if (!visible) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)", // bóng mờ đen trong suốt 50%
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontSize: 20,
        borderRadius: 12,
        fontWeight: "500",
        zIndex: 1,
        pointerEvents: "auto", // chặn click phía dưới
        ...style, // cho phép override style nếu cần
      }}
    >
      {text}
    </div>
  );
};

export default OverlayFunctionUnderDevelopment;
