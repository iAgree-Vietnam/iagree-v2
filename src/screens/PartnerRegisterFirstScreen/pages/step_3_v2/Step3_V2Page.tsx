import React, { useState, useMemo, useCallback } from "react";
import {
  Typography,
  Input,
  Tag,
  Spin,
  message,
  AutoComplete,
  Divider,
} from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { usePartnerSelectBox } from "@/src/screens/PartnerScreen/hooks/usePartnerSelectBox";
import { PartnerSelectBoxResource } from "@/src/data/partner/models/partner.types";

export interface Step3V2FormValues {
  selectedSkillIds: number[];
}

interface Step3V2PageProps {
  categoryIds?: number[];
  value?: Step3V2FormValues;
  onChange?: (value: Step3V2FormValues) => void;
}

const MIN_SKILLS = 5;
const MAX_SKILLS = 15;

export const Step3V2Page: React.FC<Step3V2PageProps> = ({
  categoryIds = [],
  value = { selectedSkillIds: [] },
  onChange,
}) => {
  const selectboxQuery = usePartnerSelectBox();
  const selectboxResource = selectboxQuery.data as PartnerSelectBoxResource;
  const isLoading = selectboxQuery.isLoading;

  const [inputText, setInputText] = useState("");

  const suggestedSkills = useMemo(() => {
    if (!selectboxResource?.skills || categoryIds.length === 0) {
      return [];
    }
    return selectboxResource.skills.filter((skill) =>
      categoryIds.includes(skill.categoryProjectId ?? 0)
    );
  }, [selectboxResource?.skills, categoryIds]);

  const allSkills = useMemo(() => {
    return [...suggestedSkills];
  }, [suggestedSkills]);

  const triggerChange = useCallback(
    (newSkillIds: number[]) => {
      if (onChange) {
        onChange({ selectedSkillIds: newSkillIds.sort((a, b) => a - b) });
      }
    },
    [onChange]
  );

  const selectedSkills = useMemo(() => {
    return allSkills.filter((skill) =>
      value.selectedSkillIds.includes(skill.skillId)
    );
  }, [value.selectedSkillIds, allSkills]);

  const availableSuggestedSkills = useMemo(() => {
    return suggestedSkills.filter(
      (skill) => !value.selectedSkillIds.includes(skill.skillId)
    );
  }, [value.selectedSkillIds, suggestedSkills]);

  const handleAddSkill = useCallback(
    (skillId: number) => {
      if (value.selectedSkillIds.length >= MAX_SKILLS) {
        message.warning(`Bạn chỉ có thể chọn tối đa ${MAX_SKILLS} kỹ năng.`);
        return;
      }
      // if (
      //   inputText.trim() === "" &&
      //   value.selectedSkillIds.length < MIN_SKILLS
      // ) {
      //   message.warning(
      //     `Bạn cần chọn ít nhất ${MIN_SKILLS} kỹ năng trước khi tiếp tục.`
      //   );
      //   return;
      // }
      if (!value.selectedSkillIds.includes(skillId)) {
        triggerChange([...value.selectedSkillIds, skillId]);
      }
    },
    [value.selectedSkillIds, triggerChange, inputText]
  );

  const handleRemoveSkill = useCallback(
    (skillId: number) => {
      const newSkillIds = value.selectedSkillIds.filter((id) => id !== skillId);
      triggerChange(newSkillIds);
    },
    [value.selectedSkillIds, triggerChange]
  );

  const handleClearAll = useCallback(() => {
    triggerChange([]);
  }, [triggerChange]);

  const options = useMemo(() => {
    if (!inputText) return [];
    return availableSuggestedSkills
      .filter((skill) =>
        skill.name.toLowerCase().includes(inputText.toLowerCase())
      )
      .map((skill) => ({
        label: skill.name,
        value: String(skill.skillId),
      }));
  }, [inputText, availableSuggestedSkills]);

  const handleAutocompleteSelect = useCallback(
    (skillIdStr: string) => {
      const skillId = Number(skillIdStr);
      handleAddSkill(skillId);
      setInputText("");
    },
    [handleAddSkill]
  );

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" tip="Đang tải kỹ năng..." />
      </div>
    );
  }

  const isAtMinSkills = value.selectedSkillIds.length < MIN_SKILLS;
  const isAtMaxSkills = value.selectedSkillIds.length >= MAX_SKILLS;

  const searchSuffix = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
        transition: "background-color 0.3s ease",
      }}
    >
      <SearchOutlined style={{ color: "#000", fontSize: 16 }} />
    </div>
  );

  return (
    <div style={{ padding: "0 0" }}>
      <div style={{ marginBottom: "15px" }}>
        <Typography.Title
          level={2}
          style={{ margin: 0, color: "#333", marginBottom: "10px" }}
        >
          Tuyệt vời. Bây giờ, hãy thêm kỹ năng chuyên môn của bạn.
        </Typography.Title>
        <Typography.Text style={{ color: "#09993E" }}>
          Chọn các kỹ năng phù hợp nhất với bạn. Điều này sẽ giúp Khách hàng tìm
          thấy bạn dễ dàng hơn và giúp chúng tôi gợi ý các dự án phù hợp.
        </Typography.Text>
      </div>

      <Divider style={{ borderColor: "#D4D4D4", margin: "20px 0 20px 0" }} />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginTop: "20px",
        }}
      >
        <Typography.Title level={4} style={{ margin: 0 }}>
          Kỹ năng của bạn{" "}
          <span style={{ color: "#888", fontSize: "13px", marginLeft: "5px" }}>
            ({selectedSkills.length})
          </span>
        </Typography.Title>
        {selectedSkills?.length > 0 && (
          <a
            onClick={handleClearAll}
            style={{ color: "red", cursor: "pointer" }}
          >
            Bỏ chọn tất cả
          </a>
        )}
      </div>

      <div
        style={{ marginBottom: "10px", marginTop: "10px", minHeight: "32px" }}
      >
        {selectedSkills?.map((skill) => (
          <Tag
            key={skill.skillId}
            closable
            onClose={() => handleRemoveSkill(skill.skillId)}
            style={{
              marginBottom: "8px",
              marginRight: "4px",
              padding: "4px 10px",
              fontSize: "14px",
              borderRadius: "15px",
              background: "#09993E22",
              borderColor: "#09993E",
            }}
          >
            {skill.name}
          </Tag>
        ))}
        <div style={{ marginBottom: "0" }}>
          {isAtMinSkills && (
            <div
              style={{ color: "red", display: "flex", alignItems: "center" }}
            >
              <span style={{ marginRight: "5px" }}>ⓘ</span>
              Bạn cần chọn ít nhất 5 kỹ năng
            </div>
          )}
        </div>
      </div>

      <AutoComplete
        value={inputText}
        options={options}
        style={{ width: "100%" }}
        onSelect={handleAutocompleteSelect}
        onChange={(text) => setInputText(text)}
        onSearch={(text) => setInputText(text)}
        disabled={isAtMaxSkills}
        placeholder="Nhập kỹ năng của bạn ở đây"
        size="middle"
        onKeyDown={(e) => {
          if (e.key === "Enter" && value.selectedSkillIds.length < MIN_SKILLS) {
            e.preventDefault();
            message.warning(`Bạn cần chọn ít nhất ${MIN_SKILLS} kỹ năng.`);
          }
        }}
      >
        <Input size="middle" suffix={searchSuffix} />
      </AutoComplete>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          color: "#aaa",
          fontSize: "12px",
          marginTop: "5px",
        }}
      >
        <span>
          {selectedSkills.length}/{MAX_SKILLS} kỹ năng
        </span>
      </div>

      <Typography.Title level={4} style={{ marginTop: "20px" }}>
        Kỹ năng gợi ý{" "}
        <span style={{ color: "#888", fontSize: "13px", marginLeft: "5px" }}>
          ({availableSuggestedSkills.length})
        </span>
      </Typography.Title>
      <div style={{ display: "flex", maxHeight: 400, flexWrap: "wrap", gap: "8px" }}>
        {availableSuggestedSkills.map((skill) => (
          <Tag
            key={skill.skillId}
            onClick={() => handleAddSkill(skill.skillId)}
            style={{
              cursor: "pointer",
              marginBottom: "8px",
              padding: "4px 10px",
              fontSize: "14px",
              borderRadius: "15px",
              background: isAtMaxSkills ? "#f5f5f5" : "#fafafa",
              borderColor: isAtMaxSkills ? "#d9d9d9" : "#d9d9d9",
              color: isAtMaxSkills ? "#ccc" : "#000",
            }}
          >
            <PlusOutlined style={{ marginRight: "4px" }} />
            {skill.name}
          </Tag>
        ))}
      </div>
    </div>
  );
};
