// pages/your-form.tsx
"use client";
import { Form } from "antd";
import dynamic from "next/dynamic";
// import ReactQuill from "react-quill";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false }) as any;

export default function YourFormPage() {
  const [form] = Form.useForm();
  return (
    <Form form={form}>
      <Form.Item
        name="description"
        label="Mô tả công việc"
        rules={[{ required: true, message: "Vui lòng nhập mô tả công việc" }]}
      >
        <ReactQuill
          theme="snow"
          onChange={(v: string) => form.setFieldsValue({ description: v })}
        />
      </Form.Item>
    </Form>
  );
}
