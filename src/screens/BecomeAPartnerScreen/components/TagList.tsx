import React, { useState } from "react";
import { Tag, Typography } from "antd";
import styles from "./TeamModal.module.css";

interface TagListProps {
  title: string;
  items: { name: string }[] | undefined | null;
}

const TagList: React.FC<TagListProps> = ({ title, items }) => {
  // Move useState to the top level, before any conditional returns
  const [isExpanded, setIsExpanded] = useState(false);

  if (!items || items.length === 0) {
    return null;
  }

  const displayLimit = 10;
  const hasMoreItems = items.length > displayLimit;
  const displayedItems = isExpanded ? items : items.slice(0, displayLimit);
  const remainingCount = items.length - displayLimit;

  return (
    <div className={styles.modalSection}>
      <Typography.Title level={4} className={styles.sectionTitle}>
        {title}
      </Typography.Title>
      <div className={styles.tagListContainer}>
        {displayedItems.map((item, i) => (
          <Tag key={i} className={styles.partnerTag}>
            {item.name}
          </Tag>
        ))}
        {hasMoreItems && (
          <Tag
            className={`${styles.partnerTag} ${styles.expandableTag}`}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Thu gọn" : `+${remainingCount}`}
          </Tag>
        )}
      </div>
    </div>
  );
};

export default TagList;