import SearchRouteUtils from "@/src/data/search/utils/SearchRouteUtils";
import { SkillResource } from "@/src/data/skill/models/skill.types";
import { Space, Tag, Typography } from "antd";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";

interface SkillsChipListProps {
  skills?: SkillResource[] | null;
  type: string;
}

export const SkillsChipList: React.FC<SkillsChipListProps> = ({
  skills,
  type,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const maxVisibleSkills = 5;

  const visibleSkills = isExpanded
    ? skills
    : skills?.slice(0, maxVisibleSkills);
  const remainingCount = (skills?.length ?? 5) - maxVisibleSkills;

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSkillClick = (skill: SkillResource) => {
    // Tạo queryParams cho kỹ năng
    const queryParams =
      type === "job"
        ? { type, job_skill_ids: [skill?.skillId] }
        : { type, partner_skill_ids: [skill?.skillId] };

    // Lưu queryParams vào localStorage
    localStorage.setItem("search_query_params", JSON.stringify(queryParams));

    // Xóa các bộ lọc cũ trong localStorage
    localStorage.removeItem("search_job_filters");
    localStorage.removeItem("search_partner_filters");

    // Điều hướng tới trang tìm kiếm với queryParams
    router.push({
      pathname: "/search",
      query: queryParams, // Truyền queryParams vào URL
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "16px",
      }}
    >
      {/* Tiêu đề cố định bên trái */}
      <Typography.Paragraph
        className={"infoTitle"}
        style={{
          minWidth: "50px",
          margin: 0,
          paddingTop: "3px",
          flexShrink: 0,
        }}
      >
        Kỹ năng
      </Typography.Paragraph>

      <Space size={[8, 8]} wrap style={{ flex: 1 }}>
        {visibleSkills?.map((skill, index) => {
          return (
            <Tag
              className="skillChip"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #059669",
                borderRadius: "4px",
                padding: "4px 10px",
                fontSize: "14px",
                color: "#059669",
                cursor: "pointer",
              }}
              onClick={() => handleSkillClick(skill)}
              key={index}
            >
              {skill.name}
            </Tag>
          );
        })}

        {!isExpanded && remainingCount > 0 && (
          <Tag
            className="remainingSkillsChip"
            onClick={handleToggleExpand}
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #d9d9d9",
              borderRadius: "16px",
              padding: "4px 10px",
              fontSize: "14px",
              color: "#666",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#09993E";
              e.currentTarget.style.color = "#FFFFFF";
              e.currentTarget.style.borderColor = "#09993E";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#FFFFFF";
              e.currentTarget.style.color = "#666";
              e.currentTarget.style.borderColor = "#d9d9d9";
            }}
          >
            +{remainingCount}
          </Tag>
        )}

        {isExpanded && (
          <Tag
            className="collapseSkillsChip"
            onClick={handleToggleExpand}
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #d9d9d9",
              borderRadius: "16px",
              padding: "4px 10px",
              fontSize: "14px",
              color: "#666",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#09993E";
              e.currentTarget.style.color = "#FFFFFF";
              e.currentTarget.style.borderColor = "#09993E";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#FFFFFF";
              e.currentTarget.style.color = "#666";
              e.currentTarget.style.borderColor = "#d9d9d9";
            }}
          >
            Thu gọn
          </Tag>
        )}
      </Space>
    </div>
  );
};