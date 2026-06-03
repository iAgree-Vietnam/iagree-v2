// src/components/cancel-flow/ButtonComplainCancel.tsx

import React, { useState } from "react";
import { Button, Modal, Form, Input, Space, message } from "antd";

// --- INTERFACE ---
interface ButtonComplainCancelProps {
  // Hàm này sẽ được gọi khi form submit thành công
  onActionSubmit: (description: string) => void;
  // 🟢 THÊM PROPS ĐỂ TRUYỀN NÚT KHIẾU NẠI VÀO
  children: React.ReactNode; 
}

// --- COMPONENT CON ---
const ButtonComplainCancel: React.FC<ButtonComplainCancelProps> = ({
  onActionSubmit,
  children, // 🟢 Nhận nút từ component cha
}) => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOpenModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = (values: { description: string }) => {
    onActionSubmit(values.description);
    handleCloseModal();
  };

  return (
    <>
      {/* 1. NÚT TRIGGER: SỬ DỤNG CHILDREN ĐỂ HIỂN THỊ NÚT ĐƯỢC TRUYỀN VÀO */}
      <span onClick={handleOpenModal}>{children}</span> 

      {/* 2. MODAL CHO KHIẾU NẠI (Giữ nguyên logic form) */}
      <Modal
        title="Tạo Đơn Khiếu nại"
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ description: "" }}
        >
          <Form.Item
            name="description"
            label="Nội dung Khiếu nại"
            rules={[
              { required: true, message: "Vui lòng nhập nội dung khiếu nại!" },
              { max: 500, message: "Nội dung không được vượt quá 500 ký tự." },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Giải thích chi tiết về vấn đề bạn đang khiếu nại..."
            />
          </Form.Item>

          <Form.Item
            style={{
              marginTop: 24,
              textAlign: "right",
              marginBottom: 0,
            }}
          >
            <Space>
              <Button onClick={handleCloseModal}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                Gửi Khiếu nại
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ButtonComplainCancel;