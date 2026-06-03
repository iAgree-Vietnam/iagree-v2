// src/components/SectionDivider.tsx
"use client";


import styles from "./SectionDivider.module.css";

interface SectionDividerProps {
  isFullWidth?: boolean | null;
}

const SectionDivider: React.FC<SectionDividerProps> = (props) => {
  return props.isFullWidth !== undefined && props.isFullWidth ? (
    <div className={styles.dividerFullWidth} />
  ) : (
    <div className={styles.dividerHalfWidth} />
  );
};

export default SectionDivider;
