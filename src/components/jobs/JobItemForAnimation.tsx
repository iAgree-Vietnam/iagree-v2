"use client";

import { useState } from "react";
import { Button, Typography, Tag } from "antd";
import Link from "next/link";
import { HeartFilled, HeartOutlined, LoadingOutlined } from "@ant-design/icons";
import type { FullJobResource, JobResource } from "@/src/data/job/models/job.types";
import JobRouteUtils from "@/src/data/job/utils/JobRouteUtils";
import useJobReaction from "@/src/screens/JobScreen/hooks/useJobReaction";
import { JobParseUtils } from "@/src/data/job/utils/JobParseUtils";
import { IconSvgLocal } from "../icon-svg-local";

type JobItemProps = {
  data: FullJobResource;
  onReactionSuccess?: () => void;
};

const JobStatus = {
  ACTIVE: "Đang tuyển",
  CLOSED: "Đã đóng",
  PENDING: "Đang chờ duyệt",
};

const renderStatusTag = (status: string) => {
  let color = "#108ee9";
  switch (status) {
    case JobStatus.ACTIVE:
      color = "#09993E";
      break;
    case JobStatus.CLOSED:
      color = "#c31b1eff";
      break;
    case JobStatus.PENDING:
      color = "#FAAD14";
      break;
  }
  return (
    <Tag
      style={{
        color: "#fff",
        background: color,
        border: "none",
        borderRadius: "3px",
      }}
    >
      {status}
    </Tag>
  );
};

function JobItemForAnimation(props: JobItemProps) {
  const [jobResource, setJobResource] = useState(props.data);
  const reactionMutation = useJobReaction({
    onSuccess: () => {
      setJobResource((prev) => ({ ...prev, isLiked: !prev.isLiked }));
      props.onReactionSuccess?.();
    },
  });

  // Dữ liệu mock-up
  const daysRemaining = 5;
  const jobStatus = JobStatus.ACTIVE;
  const applicantsCount = 15;
  const hiredCount = 2;
  const requiredCount = 5;

  return (
    <div
      style={{
        paddingBlock: "1.2rem", // Sử dụng rem cho khoảng cách linh hoạt
        paddingInline: "1.5rem",
        border: "1px solid transparent",
        background: "linear-gradient(to bottom right, #FBF6F5, #F1F6FF)",
        borderRadius: 12,
        minWidth: "22rem", // Chuyển đổi từ px sang rem (~352px)
        width: "auto",
        transition: "all 0.3s linear",
      }}
    >
      <Link href={JobRouteUtils.toDetailUrl(jobResource)}>
        <div>
          {/* ... (Các phần còn lại của component không thay đổi) ... */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
              {renderStatusTag(jobStatus)}
              <Typography.Text style={{ fontSize: "13px", color: "#666" }}>
                Còn {daysRemaining} ngày
              </Typography.Text>
            </div>
            <Button
              type="text"
              style={{
                width: "40px",
                height: "40px",
                flexShrink: 0,
                alignSelf: "flex-start",
              }}
              disabled={reactionMutation.isPending}
              onClick={(e) => {
                e.preventDefault();
                reactionMutation.mutate({ jobId: jobResource.jobId });
              }}
            >
              {!reactionMutation.isPending ? (
                <>
                  {jobResource.isLiked ? (
                    <HeartFilled style={{ color: "#09993E", fontSize: 24 }} />
                  ) : (
                    <HeartOutlined style={{ fontSize: 24, color: "#979797" }} />
                  )}
                </>
              ) : (
                <LoadingOutlined style={{ color: "#979797", fontSize: 24 }} />
              )}
            </Button>
          </div>

          {/* Job title */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "24px",
              marginBottom: "12px",
            }}
          >
            <Typography.Title
              level={3}
              style={{
                flex: 1,
                minWidth: 0,
                color: "#2c2c2c",
                fontWeight: "600",
                fontSize: "20px",
                lineHeight: "1.2",
                marginBottom: 0,
                marginTop: 0,
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                wordBreak: "break-word",
                height: `calc(1.2em * 2)`,
              }}
              ellipsis={{
                rows: 2,
                tooltip: jobResource.name,
              }}
              title={jobResource.name}
            >
              {jobResource.name}
            </Typography.Title>
          </div>

          {/* Job description with fixed height */}
          <Typography.Paragraph
            style={{
              color: "#666",
              fontSize: "15px",
              height: `calc(1.6em * 2)`,
              overflow: "hidden",
              textOverflow: "ellipsis",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
            ellipsis={{ rows: 2 }}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: jobResource.description,
              }}
            />
          </Typography.Paragraph>

          {/* Salary and Duration row */}
          <div
            style={{
              display: "flex",
              gap: "24px",
              marginBottom: "12px",
              marginTop: "20px",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <IconSvgLocal
                  name={"IC_MONEY"}
                  width={20}
                  height={20}
                  fill={"#09993E"}
                />
                <Typography.Text
                  style={{ fontSize: "12px", color: "#666", fontWeight: "500" }}
                >
                  Thù lao cố định
                </Typography.Text>
              </div>
              <Typography.Text style={{ fontSize: "14px", color: "#2c2c2c" }}>
                {JobParseUtils.renderSalaryText(jobResource)}
              </Typography.Text>
            </div>

            {/* Vertical divider */}
            <div
              style={{
                width: "1px",
                height: "40px",
                backgroundColor: "#d9d9d9",
              }}
            ></div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <IconSvgLocal
                  name={"IC_CLOCK"}
                  width={20}
                  height={20}
                  fill={"none"}
                  stroke={"#09993E"}
                />
                <Typography.Text
                  style={{ fontSize: "12px", color: "#666", fontWeight: "500" }}
                >
                  Hạn hoàn thành
                </Typography.Text>
              </div>
              <Typography.Text style={{ fontSize: "14px", color: "#2c2c2c" }}>
                03 tuần
              </Typography.Text>
            </div>
          </div>

          {/* Skills tags: Tối ưu cho animation, không có cuộn nội bộ */}
          <div
            style={{
              display: "flex",
              flexWrap: "nowrap",
              overflowX: "hidden", // Không cho phép cuộn nội bộ
              gap: "5px",
              marginBottom: "10px",
              height: "40px",
            }}
          >
            {jobResource.skills?.map((skill, index) => (
              <Tag
                key={index}
                style={{
                  flexShrink: 0,
                  padding: "3px 8px",
                  fontSize: "12px",
                  color: "#666",
                  fontWeight: "500",
                  marginBottom: 0,
                }}
              >
                {skill.name}
              </Tag>
            ))}
          </div>

          {/* Applicants Count and Hired Count */}
          <Typography.Text
            style={{
              color: "#666",
              fontSize: "13px",
              opacity: 0.8,
              marginTop: "12px",
            }}
          >
            Cần{" "}
            <span style={{ fontWeight: "bold", color: "#09993E" }}>
              11 Cơ Hội{" "}
            </span>
            để ứng tuyển
          </Typography.Text>
          <br />
          {/* <Typography.Text
            style={{
              color: "#666",
              fontSize: "13px",
              opacity: 0.8,
              marginTop: "12px",
            }}
          >
            <span style={{ fontWeight: "bold", color: "#000" }}>
              {applicantsCount}
            </span>{" "}
            người đang ứng tuyển
          </Typography.Text> */}
        </div>
      </Link>
    </div>
  );
}

export default JobItemForAnimation;
