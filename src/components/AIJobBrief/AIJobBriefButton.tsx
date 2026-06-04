"use client";

import React, { useState } from "react";
import {
  Button,
  Modal,
  Input,
  Form,
  Typography,
  Space,
  Alert,
  Spin,
  Tag,
} from "antd";
import { FormInstance } from "antd/lib/form/Form";
import axios from "axios";

const { TextArea } = Input;
const { Text, Title } = Typography;

interface JobBriefResult {
  title: string;
  category: string;
  skills: string[];
  scope: string;
  deliverables: string[];
  budget_min: number;
  budget_max: number;
  timeline_days: number;
  suggested_deadline: string;
}

interface AIJobBriefButtonProps {
  form: FormInstance;
  selectboxResource?: {
    categories?: Array<{ categoryId: number; name: string }>;
    skills?: Array<{ skillId: number; name: string }>;
  };
  onBriefApplied?: (brief: JobBriefResult) => void;
}

function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function AIJobBriefButton({
  form,
  selectboxResource,
  onBriefApplied,
}: AIJobBriefButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [brief, setBrief] = useState<JobBriefResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!description.trim() || description.trim().length < 10) {
      setError("Vui lòng mô tả công việc ít nhất 10 ký tự");
      return;
    }

    setLoading(true);
    setError(null);
    setBrief(null);

    try {
      const res = await axios.post("/api/ai/job-brief", { text: description });
      setBrief(res.data);
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        "Không thể tạo job brief. Vui lòng thử lại.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!brief) return;

    // Set form fields
    form.setFieldsValue({
      name: brief.title,
      description: brief.scope,
      price_min: brief.budget_min,
      price_max: brief.budget_max,
    });

    // Try to match category by name
    if (selectboxResource?.categories && brief.category) {
      const matchedCat = selectboxResource.categories.find(
        (c) =>
          c.name.toLowerCase().includes(brief.category.toLowerCase()) ||
          brief.category.toLowerCase().includes(c.name.toLowerCase())
      );
      if (matchedCat) {
        form.setFieldsValue({ category_project_ids: matchedCat.categoryId });
      }
    }

    if (onBriefApplied) {
      onBriefApplied(brief);
    }

    setOpen(false);
    setBrief(null);
    setDescription("");
  };

  const handleClose = () => {
    setOpen(false);
    setBrief(null);
    setDescription("");
    setError(null);
  };

  return (
    <>
      <Button
        type="default"
        onClick={() => setOpen(true)}
        style={{
          borderColor: "#7c3aed",
          color: "#7c3aed",
          fontWeight: 500,
        }}
        icon={<span style={{ marginRight: 4 }}>✨</span>}
      >
        Viết bởi AI
      </Button>

      <Modal
        title={
          <Space>
            <span>✨</span>
            <Title level={5} style={{ margin: 0 }}>
              Tạo mô tả công việc bằng AI
            </Title>
          </Space>
        }
        open={open}
        onCancel={handleClose}
        width={600}
        footer={
          brief
            ? [
                <Button key="back" onClick={() => setBrief(null)}>
                  Thử lại
                </Button>,
                <Button
                  key="apply"
                  type="primary"
                  onClick={handleApply}
                  style={{ background: "#7c3aed", borderColor: "#7c3aed" }}
                >
                  Áp dụng vào form
                </Button>,
              ]
            : [
                <Button key="cancel" onClick={handleClose}>
                  Hủy
                </Button>,
                <Button
                  key="generate"
                  type="primary"
                  onClick={handleGenerate}
                  loading={loading}
                  disabled={!description.trim()}
                  style={{ background: "#7c3aed", borderColor: "#7c3aed" }}
                >
                  Tạo Job Brief
                </Button>,
              ]
        }
      >
        {!brief ? (
          <Spin spinning={loading} tip="AI đang phân tích...">
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary" style={{ fontSize: 13 }}>
                Mô tả công việc của bạn bằng tiếng Việt. AI sẽ tự động tạo
                tiêu đề, phạm vi công việc, kỹ năng yêu cầu và ngân sách phù
                hợp.
              </Text>
            </div>

            {error && (
              <Alert
                message={error}
                type="error"
                showIcon
                style={{ marginBottom: 16 }}
              />
            )}

            <TextArea
              rows={6}
              placeholder="Ví dụ: Tôi cần thiết kế logo và bộ nhận diện thương hiệu cho công ty khởi nghiệp công nghệ. Logo cần hiện đại, chuyên nghiệp, phù hợp với lĩnh vực fintech. Bàn giao file AI, PNG, PDF..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              style={{ resize: "vertical" }}
            />
            <div
              style={{ textAlign: "right", marginTop: 4, color: "#999", fontSize: 12 }}
            >
              {description.length} ký tự
            </div>
          </Spin>
        ) : (
          <div>
            <Alert
              message="AI đã tạo job brief thành công! Xem lại và áp dụng vào form."
              type="success"
              showIcon
              style={{ marginBottom: 16 }}
            />

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <Text strong>Tiêu đề:</Text>
                <div
                  style={{
                    background: "#f5f5f5",
                    padding: "6px 10px",
                    borderRadius: 6,
                    marginTop: 4,
                  }}
                >
                  {brief.title}
                </div>
              </div>

              <div>
                <Text strong>Lĩnh vực:</Text>
                <div style={{ marginTop: 4 }}>
                  <Tag color="purple">{brief.category}</Tag>
                </div>
              </div>

              <div>
                <Text strong>Kỹ năng:</Text>
                <div style={{ marginTop: 4 }}>
                  {brief.skills.map((skill, i) => (
                    <Tag key={i} color="blue">
                      {skill}
                    </Tag>
                  ))}
                </div>
              </div>

              <div>
                <Text strong>Phạm vi công việc:</Text>
                <div
                  style={{
                    background: "#f5f5f5",
                    padding: "6px 10px",
                    borderRadius: 6,
                    marginTop: 4,
                    fontSize: 13,
                  }}
                >
                  {brief.scope}
                </div>
              </div>

              <div>
                <Text strong>Sản phẩm bàn giao:</Text>
                <ul style={{ margin: "4px 0 0 16px", padding: 0 }}>
                  {brief.deliverables.map((d, i) => (
                    <li key={i} style={{ fontSize: 13 }}>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>

              <div
                style={{ display: "flex", gap: 24, flexWrap: "wrap" }}
              >
                <div>
                  <Text strong>Ngân sách:</Text>
                  <div style={{ fontSize: 13, marginTop: 2 }}>
                    {formatVND(brief.budget_min)} –{" "}
                    {formatVND(brief.budget_max)}
                  </div>
                </div>
                <div>
                  <Text strong>Thời gian:</Text>
                  <div style={{ fontSize: 13, marginTop: 2 }}>
                    {brief.timeline_days} ngày
                  </div>
                </div>
                <div>
                  <Text strong>Deadline đề xuất:</Text>
                  <div style={{ fontSize: 13, marginTop: 2 }}>
                    {brief.suggested_deadline}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
