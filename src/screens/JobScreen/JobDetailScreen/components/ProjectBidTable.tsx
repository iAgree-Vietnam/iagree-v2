import {
  RawUserProjectBidResource,
  RawUserProjectDealResource,
} from "@/src/data/job/models/job.raw";
import {
  Button,
  Descriptions,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import moment from "moment";
import { useState } from "react";
import useSelectedJob from "../hooks/useSelectedJob";
import SendOfferToPartnerModalV2 from "../modals/ModalOfferV2";
import { useAccountContext } from "@/src/contexts/AccountContext";
import { EyeOutlined } from "@ant-design/icons";
import { ViewBidModal } from "./ui/BidModal";
import Constants from "@/src/constants/Constants";
import { useJob } from "@/src/hooks/useJobs";
import { truncate } from "lodash";
import useIsMobile from "@/src/screens/HomeScreen/hooks/useIsMobile";

export interface TableSuggestType {
  title: string;
  jobQuery?: ReturnType<typeof useSelectedJob> | undefined;
  jobRefetch?: ReturnType<typeof useSelectedJob>;
  isDisplayResponse: boolean;
}

export default function ProjectBidTable({
  title,
  jobQuery,
  jobRefetch,
  isDisplayResponse
}: TableSuggestType) {
  // const [open, setOpen] = useState(false);
  const { auth: userInfo } = useAccountContext();
  const [open, setOpen] = useState<boolean>(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedBid, setSelectedBid] =
    useState<RawUserProjectDealResource | null>(null);

  const { dataReal, showOfferButton, latestDeal, canSendOffer } = useJob(
    jobQuery?.data,
    userInfo
  );

  const bidStatus = jobQuery?.data?.userProjectBids?.[0].status;

  const getOfferButtonText = () => {
    if (bidStatus !== Constants.PARTNER.STATUS_APPLY_KEY.DEAL) {
      return "Không được phản hồi";
    }

    if (!latestDeal) return "Gửi đề xuất";

    if (latestDeal.deal_status === Constants.JOB.OFFER.DEAL_STATUS.ACCEPTED) {
      return "Đã đồng ý";
    }
    return "Phản hồi";
  };

  const columns: ColumnsType<RawUserProjectDealResource> = [
    {
      title: "Đề xuất",
      dataIndex: "description",
      key: "description",
      render: (text: string) => {
        return <span>{truncate(text, { length: 60, omission: "..." })}</span>;
      },
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "start_date",
      key: "start_date",
      render: (value) => moment(value).format("DD/MM/YYYY"),
    },

    {
      title: "Ngày kết thúc",
      dataIndex: "end_date",
      key: "end_date",
      render: (value) => moment(value).format("DD/MM/YYYY"),
    },
    {
      title: "Giá thương lượng",
      dataIndex: "negotiate_price",
      key: "negotiate_price",
      render: (value) => value.toLocaleString("vi-VN") + " đ",
    },
    {
      title: "Số lần nghiệm thu",
      dataIndex: "number_accept",
      key: "number_accept",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: number) => {
        const isReplied = status === Constants.JOB.OFFER.STATUS.RESPONSED;

        return (
          <Tag
            color={isReplied ? "#09993E" : "#979797"}
            style={{ marginInlineEnd: 0, width: "88px", textAlign: "center" }}
          >
            {isReplied ? "Đã phản hồi" : "Chờ phản hồi"}
          </Tag>
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      fixed: "right",
      width: 80,
      render: (_, record, index) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedBid(record);
              setViewOpen(true);
            }}
          />

          {index === 0 && showOfferButton && isDisplayResponse && (
            <Button
              type="primary"
              size="small"
              onClick={() => setOpen(true)}
              disabled={!canSendOffer || bidStatus !== Constants.PARTNER.STATUS_APPLY_KEY.DEAL}
            >
              {getOfferButtonText()}
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const isTablet = useIsMobile(768);
  const isMobile = useIsMobile(450);
  const buttonSize = isTablet ? (isMobile ? "small" : "middle") : "middle";

  if (isTablet) {
    return (
      <>
        <ViewBidModal
          open={viewOpen}
          bid={selectedBid}
          userInfo={userInfo}
          onClose={() => setViewOpen(false)}
        />
        {
          <SendOfferToPartnerModalV2
            open={open}
            job={jobQuery?.data}
            latestDeal={latestDeal}
            title={title}
            setOpen={setOpen}
            onSuccess={() => {
              jobRefetch?.refetch?.();
            }}
          />
        }
        <div style={{ marginTop: "20px" }}>
          <Typography.Title level={4}>{title}</Typography.Title>
          {[...dataReal].map((bid, index) => (
            <div key={bid.id}>
              <Descriptions bordered column={1} size={buttonSize}>
                <Descriptions.Item label="Đề xuất">
                  {bid.description ?? "—"}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày bắt đầu">
                  {moment(bid.start_date).format("DD/MM/YYYY")}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày kết thúc">
                  {moment(bid.end_date).format("DD/MM/YYYY")}
                </Descriptions.Item>
                <Descriptions.Item label="Giá thương lượng">
                  {bid.negotiate_price.toLocaleString("vi-VN")} đ
                </Descriptions.Item>
                <Descriptions.Item label="Số lần nghiệm thu">
                  {bid.number_accept ?? "—"}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái" span={1}>
                  <Tag
                    color={
                      bid.status === Constants.JOB.OFFER.STATUS.RESPONSED
                        ? "#09993E"
                        : "#979797"
                    }
                  >
                    {bid.status === Constants.JOB.OFFER.STATUS.RESPONSED
                      ? "Đã phản hồi"
                      : "Chờ phản hồi"}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Thời gian tạo đề xuất">
                  {moment(bid.created_at).format("HH:mm:ss, DD/MM/YYYY")}
                </Descriptions.Item>
                {dataReal[0]?.id === bid.id && showOfferButton && (
                  <Descriptions.Item label="Hành động">
                    <div>
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => setOpen(true)}
                        disabled={!canSendOffer || bidStatus !== Constants.PARTNER.STATUS_APPLY_KEY.DEAL}
                      >
                        {getOfferButtonText()}
                      </Button>
                    </div>
                  </Descriptions.Item>
                )}
              </Descriptions>

              {index !== dataReal.length - 1 && (
                <div
                  style={{
                    marginBottom: "15px",
                    paddingBottom: "15px",
                    marginInline: "10px",
                    borderBottom: "0.5px solid #d9d9d9",
                    background: "#fff",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <ViewBidModal
        open={viewOpen}
        bid={selectedBid}
        userInfo={userInfo}
        onClose={() => setViewOpen(false)}
      />
      {
        <SendOfferToPartnerModalV2
          open={open}
          job={jobQuery?.data}
          latestDeal={latestDeal}
          title={title}
          setOpen={setOpen}
          onSuccess={() => {
            jobRefetch?.refetch?.();
          }}
        />
      }
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
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
        style={{ marginTop: "12px", minWidth: "500px" }}
        rowKey="id"
        columns={columns}
        dataSource={dataReal}
        // footer={false}
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
    </>
  );
}
