
import { Typography } from "antd";

interface CustomCheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (e: { target: { checked: boolean } }) => void;
  label?: string;
}

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  checked,
  indeterminate,
  onChange,
  label,
}) => {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        userSelect: "none",
        gap: 8,
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange({ target: { checked: e.target.checked } })}
        style={{
          opacity: 0,
          position: "absolute",
          width: 0,
          height: 0,
          margin: 0,
          padding: 0,
        }}
      />
      <span
        aria-hidden="true"
        style={{
          display: "inline-flex",
          width: 20,
          height: 20,
          borderRadius: 2,
          border: checked || indeterminate ? "none" : "1px solid #d9d9d9",
          backgroundColor: checked
            ? "#09993E"
            : indeterminate
            ? "#09993E90"
            : "transparent",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "background-color 0.2s, border 0.2s",
        }}
      >
        {checked && (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
        {indeterminate && !checked && (
          <div
            style={{
              width: 12,
              height: 2,
              backgroundColor: "#fff",
            }}
          />
        )}
      </span>
      {label && <Typography.Text>{label}</Typography.Text>}
    </label>
  );
};
