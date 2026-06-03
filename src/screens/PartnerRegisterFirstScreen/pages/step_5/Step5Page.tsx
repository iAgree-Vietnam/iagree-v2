"use client";

import React, { useCallback, useEffect } from "react";
import { Typography, Input, Divider, Button, Form, Space, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ProjectItemForm from "./sections/ProjectSectionForm";
import DraggableProjectItemForm from "./sections/DraggableProjectItemForm";

const { Title, Text } = Typography;

export interface UploadedFile {
  uid: string;
  name: string;
  url: string;
  type: "image" | "video" | "document";
  fileType: string;
  size: number;
  status: "uploading" | "done" | "error";
  progress: number;
}

export interface ProjectItem {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  role: string;
  achievements: string;
  projectUrl?: string;
  image?: File;
  files?: File[];
}

export interface Step5FormValues {
  featuredProjects: ProjectItem[];
}

interface Step5PageProps {
  value?: Step5FormValues;
  onChange?: (value: Step5FormValues) => void;
}

const MAX_PROJECTS = 5;

// Thêm interface cho form để TypeScript có thể nhận biết kiểu dữ liệu
interface MyFormValues {
  featuredProjects: ProjectItem[];
}

export const Step5Page: React.FC<Step5PageProps> = ({ value, onChange }) => {
  const [form] = Form.useForm<MyFormValues>();

  // useEffect(() => {
  //   form.setFieldsValue({ featuredProjects: value?.featuredProjects || [] });
  // }, [value, form]);

  useEffect(() => {
    form.setFieldValue("featuredProjects", value?.featuredProjects);
  }, [value, form]);

  const handleValuesChange = useCallback(
    (changedValues: any, allValues: MyFormValues) => {
      if (onChange) {
        onChange({ featuredProjects: allValues.featuredProjects });
      }
    },
    [onChange]
  );

  const handleAddProject = (add: (defaultValue: ProjectItem) => void) => {
    if (
      value?.featuredProjects &&
      value.featuredProjects.length >= MAX_PROJECTS
    ) {
      message.warning(`Bạn chỉ có thể thêm tối đa ${MAX_PROJECTS} dự án.`);
      return;
    }
    add({
      name: "",
      description: "",
      start_date: "",
      end_date: "",
      role: "",
      achievements: "",
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ padding: "0 0" }}>
        <div style={{ marginBottom: "15px" }}>
          <Title
            level={2}
            style={{ margin: 0, color: "#333", marginBottom: "10px" }}
          >
            Hãy giới thiệu các dự án nổi bật của bạn tới Khách hàng
          </Title>
          <Text style={{ color: "#09993E" }}>
            Chia sẻ các dự án đã thực hiện kèm theo tệp đính kèm (như bài viết,
            thiết kế, báo cáo, video,..) Điều này giúp Khách hàng hiểu rõ hơn về
            kinh nghiệm và giá trị bạn có thể mang lại.
          </Text>
        </div>

        {/* <Form
          form={form}
          name="projects-form"
          onValuesChange={handleValuesChange}
          initialValues={{
            featuredProjects: value?.featuredProjects || [],
          }}
          layout="vertical"
        > */}
        <Form.List name="featuredProjects">
          {(fields, { add, remove, move }) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => (
                <DraggableProjectItemForm
                  key={key}
                  index={index}
                  move={move}
                  remove={() => remove(index)}
                  fieldsLength={fields.length}
                >
                  <ProjectItemForm
                    name={name}
                    restField={restField}
                    remove={remove}
                    index={index}
                  />
                </DraggableProjectItemForm>
              ))}
              <Form.Item style={{ marginTop: 16 }}>
                <Button
                  type="dashed"
                  onClick={() => handleAddProject(add)}
                  block
                  icon={<PlusOutlined />}
                >
                  Thêm dự án
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        {/* </Form> */}
      </div>
    </DndProvider>
  );
};