import {
  RawUserProjectBidResource,
  RawUserProjectDealResource,
} from "@/src/data/job/models/job.raw";
import { Button, Space, Table, Tag, Tooltip, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import moment from "moment";
import { useMemo, useState } from "react";
import useSelectedJob from "../hooks/useSelectedJob";
import SendOfferToPartnerModalV2 from "../modals/ModalOfferV2";
import { useAccountContext } from "@/src/contexts/AccountContext";
import { EyeOutlined } from "@ant-design/icons";
import { ViewApplyInfoModal } from "./ui/ApplyInfoModal";
import Constants from "@/src/constants/Constants";
import { useJob } from "@/src/hooks/useJobs";
import { UserProjectBidResource } from "@/src/data/job/models/job.types";

export interface TableApplyInfoType {
  title: string;
  jobQuery?: ReturnType<typeof useSelectedJob> | undefined;
}

export default function ApplyInfoTable({
  title,
  jobQuery,
}: TableApplyInfoType) {
  const { auth: userInfo } = useAccountContext();

  const applyInfo = useMemo(() => {
    return (
      jobQuery?.data?.userProjectBids?.filter(
        (it) => it?.userId === userInfo?.userId
      ) || []
    );
  }, [jobQuery?.data?.userProjectBids, userInfo?.userId]);

  const [appliedInfo, setAppliedInfo] = useState<UserProjectBidResource | null>(
    null
  );
  const [viewOpen, setViewOpen] = useState(false);

  const columns: ColumnsType<UserProjectBidResource> = [
    {
      title: "Thư ứng tuyển",
      dataIndex: "applicationLetter",
      key: "applicationLetter",
      render: (text) => (
        <Tooltip title={text}>
          <div
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "300px",
              minWidth: "100px",
            }}
          >
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Đề xuất",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <Tooltip title={text}>
          <div
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "300px",
              minWidth: "150px",
            }}
          >
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (value) => moment(value).format("DD/MM/YYYY"),
    },

    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      render: (value) => moment(value).format("DD/MM/YYYY"),
    },
    {
      title: "Giá thương lượng",
      dataIndex: "negotiatePrice",
      key: "negotiatePrice",
      render: (value) => value.toLocaleString("vi-VN") + " đ",
    },
    {
      title: "Số lần nghiệm thu",
      dataIndex: "numberAccept",
      key: "numberAccept",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (value: number) => {
        const getStatusInfo = (status: number) => {
          switch (status) {
            case Constants.PARTNER.STATUS_APPLY_KEY.APPLIED:
              return {
                text: "Đã ứng tuyển",
                color: "rgba(5, 150, 105, 1)",
                colorBlur: "rgba(5, 150, 105, 0.5)",
              };
            case Constants.PARTNER.STATUS_APPLY_KEY.SELECTED:
              return {
                text: "Được chọn",
                color: "rgba(0, 123, 255, 1)",
                colorBlur: "rgba(0, 123, 255, 0.5)",
              };
            case Constants.PARTNER.STATUS_APPLY_KEY.DEAL:
              return {
                text: "Thương lượng",
                color: "rgba(255, 193, 7, 1)",
                colorBlur: "rgba(255, 193, 7, 0.5)",
              };
            case Constants.PARTNER.STATUS_APPLY_KEY.REJECTED:
              return {
                text: "Từ chối",
                color: "rgba(220, 53, 69, 1)",
                colorBlur: "rgba(220, 53, 69, 0.5)",
              };
            default:
              return { text: "Không xác định", color: "default" };
          }
        };

        const statusInfo = getStatusInfo(value);
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      },
    },
    {
      title: "Ngày ứng tuyển",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value: string) =>
        value ? moment(value).format("DD/MM/YYYY HH:mm") : "Chưa xác định",
    },
    {
      title: "Thao tác",
      key: "action",
      fixed: "right",
      width: 80,
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => {
              setAppliedInfo(record);
              setViewOpen(true);
            }}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          overflowX: "auto",
        }}
      >
        <Typography.Text
          className={""}
          style={{
            color: "#25272D",
            fontSize: "24px",
            fontWeight: 500,
            lineHeight: "normal",
            margin: "16px 0",
          }}
        >
          {title}
        </Typography.Text>
      </div>

      <Table
        style={{ marginTop: "12px", 
        // minWidth: "500px",
         overflow: "auto" }}
        rowKey="id"
        columns={columns}
        pagination={false}
        dataSource={applyInfo || []}
        locale={{
          emptyText: (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <Typography.Text type="secondary">
                Không có dữ liệu
              </Typography.Text>
            </div>
          ),
        }}
      />

      <ViewApplyInfoModal
        open={viewOpen}
        onClose={() => {
          setViewOpen(false);
          setAppliedInfo(null);
        }}
        info={appliedInfo}
      />
    </>
  );
}
