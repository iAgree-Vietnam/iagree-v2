import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Button } from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  CloseOutlined,
} from "@ant-design/icons";

interface DraggableProjectItemFormProps {
  index: number;
  fieldsLength: number;
  move: (from: number, to: number) => void;
  remove: () => void;
  children: React.ReactNode;
}

const DraggableProjectItemForm: React.FC<DraggableProjectItemFormProps> = ({
  index,
  children,
  move,
  remove,
  fieldsLength,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const itemType = "form-list-item";

  const [, drop] = useDrop({
    accept: itemType,
    hover(item: any, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) {
        return;
      }
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      move(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: itemType,
    item: () => ({ index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
        marginBottom: 24,
        padding:16,
        border: "1px solid #d9d9d9",
        borderRadius: 8,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          display: "flex",
          gap: 8,
        }}
      >
        <Button
          type="text"
          icon={<ArrowUpOutlined />}
          onClick={() => move(index, index - 1)}
          disabled={index === 0}
        />
        <Button
          type="text"
          icon={<ArrowDownOutlined />}
          onClick={() => move(index, index + 1)}
          disabled={index === fieldsLength - 1}
        />
        <Button type={"text"} icon={<CloseOutlined />} onClick={remove} />
      </div>
      {children}
    </div>
  );
};

export default DraggableProjectItemForm;
