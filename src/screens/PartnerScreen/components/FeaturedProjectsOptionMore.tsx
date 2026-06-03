import React, { useState } from "react";
import { Popover, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

interface EllipsisIconProps {
  hovered: boolean;
}

const EllipsisIcon = ({ hovered }: EllipsisIconProps) => (
  <svg width="22" height="22">
    <circle cx="11" cy="11" r="11" fill={hovered ? "#222" : "#fff"} />
    <circle cx="7" cy="11" r="1.5" fill={hovered ? "#fff" : "#222"} />
    <circle cx="11" cy="11" r="1.5" fill={hovered ? "#fff" : "#222"} />
    <circle cx="15" cy="11" r="1.5" fill={hovered ? "#fff" : "#222"} />
  </svg>
);

interface ProjectMoreActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function ProjectMoreActions({
  onEdit,
  onDelete,
}: ProjectMoreActionsProps) {
  const [hovered, setHovered] = useState(false);

  const content = (
    <div style={{ minWidth: 50 }}>
      <Button
        type="text"
        icon={<EditOutlined />}
        onClick={onEdit}
        style={{ display: "flex", alignItems: "center", width: "100%" }}
      >
        Chỉnh sửa
      </Button>
      <Button
        type="text"
        icon={<DeleteOutlined />}
        danger
        onClick={onDelete}
        style={{ display: "flex", alignItems: "center", width: "100%" }}
      >
        Xoá dự án
      </Button>
    </div>
  );

  return (
    <Popover
      content={content}
      trigger="hover"
      placement="bottomRight"
      onOpenChange={setHovered}
      overlayStyle={{ padding: 0 }}
    >
      <div
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 2,
          width: 32,
          height: 32,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "background 0.3s",
        }}
      >
        <EllipsisIcon hovered={hovered} />
      </div>
    </Popover>
  );
}
