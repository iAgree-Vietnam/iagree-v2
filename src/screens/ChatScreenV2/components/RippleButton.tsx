import { useState } from "react";
import type { ReactNode, CSSProperties, MouseEvent } from "react";

type Ripple = { x: number; y: number; id: number };

interface RippleButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "disagree" | "offer" | "waiting" | "agree";
  style?: CSSProperties;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
}

const RippleButton: React.FC<RippleButtonProps> = ({
  children,
  onClick,
  variant = "offer",
  style = {},
  disabled = false,
  loading = false,
  icon,
}) => {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const createRipple = (event: MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;

    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    const newRipple = { x, y, id: Date.now() };

    setRipples((prev) => [...prev, newRipple]);
    setTimeout(
      () => setRipples((prev) => prev.filter((r) => r.id !== newRipple.id)),
      600
    );
    onClick?.();
  };

  const baseStyle: CSSProperties = {
    position: "relative",
    overflow: "hidden",
    flex: 1,
    padding: "12px 16px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "500",
    cursor: disabled ? "not-allowed" : "pointer",
    outline: "none",
    userSelect: "none",
    border: "1px solid",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "all 0.3s ease",
    opacity: disabled ? 0.6 : 1,
    ...style,
  };

  const variantStyles: Record<string, CSSProperties> = {
    disagree: {
      backgroundColor: "#fff2f0",
      borderColor: "#ff4d4f",
      color: "#ff4d4f",
    },
    offer: {
      backgroundColor: "#e6f4ff",
      borderColor: "#1890ff",
      color: "#1890ff",
    },
    waiting: {
      backgroundColor: "#fff7e6",
      borderColor: "#faad14",
      color: "#faad14",
    },
    agree: {
      backgroundColor: "#f6ffed",
      borderColor: "#52c41a",
      color: "#52c41a",
    },
  };

  const hoverStyles: Record<string, CSSProperties> = {
    disagree: {
      backgroundColor: "#ffebee",
      transform: "translateY(-1px)",
      boxShadow: "0 4px 12px rgba(255, 77, 79, 0.15)",
    },
    offer: {
      backgroundColor: "#d6f2ff",
      transform: "translateY(-1px)",
      boxShadow: "0 4px 12px rgba(24, 144, 255, 0.15)",
    },
    waiting: {
      backgroundColor: "#fff1d6",
      transform: "translateY(-1px)",
      boxShadow: "0 4px 12px rgba(250, 173, 20, 0.15)",
    },
    agree: {
      backgroundColor: "#f0f9e8",
      transform: "translateY(-1px)",
      boxShadow: "0 4px 12px rgba(82, 196, 26, 0.15)",
    },
  };

  const pressedStyle: CSSProperties = {
    transform: "translateY(0) scale(0.98)",
  };

  const currentStyle = {
    ...baseStyle,
    ...variantStyles[variant],
    ...(isHovered && !disabled ? hoverStyles[variant] : {}),
    ...(isPressed ? pressedStyle : {}),
  };

  return (
    <button
      type="button"
      style={currentStyle}
      onClick={createRipple}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseOut={() => setIsPressed(false)}
      disabled={disabled}
    >
      {loading ? (
        <span style={{ fontSize: 12 }}>Loading...</span>
      ) : (
        <>
          {icon && (
            <span style={{ display: "flex", alignItems: "center" }}>
              {icon}
            </span>
          )}
          <span>{children}</span>
        </>
      )}

      {/* Ripple animation */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          style={{
            position: "absolute",
            top: ripple.y,
            left: ripple.x,
            width: 100,
            height: 100,
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            // backgroundColor:
            //   variant === "disagree"
            //     ? "rgba(255, 77, 79, 0.3)"
            //     : "rgba(82, 196, 26, 0.3)",
            transform: "scale(0)",
            animation: "ripple 0.6s linear",
            pointerEvents: "none",
          }}
        />
      ))}
    </button>
  );
};

export default RippleButton;
