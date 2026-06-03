import { Button, ButtonProps } from "antd";

import styles from "./ButtonWithDottedLoadingIcon.module.css";

interface ButtonWithDottedLoadingIconProps extends ButtonProps {}

const DottedLoadingIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 50 50"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    fill="none"
  >
    <circle
      cx="25"
      cy="25"
      r="20"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeDasharray="4 12"
      opacity="1"
    />
  </svg>
);

export const ButtonWithDottedLoadingIcon = ({
  className = "",
  ...props
}: ButtonWithDottedLoadingIconProps) => {
  return (
    <Button
      className={`${styles.btnWithIcon} ${className}`}
      {...props}
      icon={
        <div className={styles.btnIconWrapper}>
          <div className={styles.btnIconContainer}>
            <div className={styles.icon}>
              <DottedLoadingIcon />
            </div>
          </div>
        </div>
      }
    />
  );
};
