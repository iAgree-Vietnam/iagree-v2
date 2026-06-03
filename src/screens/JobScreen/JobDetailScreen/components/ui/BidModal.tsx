import { RawUserProjectBidResource, RawUserProjectDealResource } from "@/src/data/job/models/job.raw";
import { Modal, Descriptions, Typography, Tag } from "antd";
import moment from "moment";

type BidRow = RawUserProjectDealResource;

interface ViewBidModalProps {
  open: boolean;
  onClose: () => void;
  bid: BidRow | null; // record từ dataReal
  userInfo: any;
}

export function ViewBidModal({ open, onClose, bid }: ViewBidModalProps) {
  const fmtDate = (d?: string | null, withTime = false) =>
    d ? moment(d).format(withTime ? "DD/MM/YYYY HH:mm" : "DD/MM/YYYY") : "—";

  const fmtMoney = (n?: number | null) =>
    typeof n === "number" ? `${n.toLocaleString("vi-VN")} đ` : "—";


  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      title={"Chi tiết đề xuất"}
    >
      {!bid ? null : (
        <>
          <Descriptions bordered column={2} size="middle">
            {/* <Descriptions.Item label="ID" span={1}>
              {bid.id}
            </Descriptions.Item> */}

            <Descriptions.Item label="Ngày bắt đầu">
              {fmtDate(bid.start_date)}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày kết thúc">
              {fmtDate(bid.end_date)}
            </Descriptions.Item>

            <Descriptions.Item label="Giá thương lượng">
              {fmtMoney(bid.negotiate_price)}
            </Descriptions.Item>
            <Descriptions.Item label="Số lần nghiệm thu">
              {bid.number_accept ?? "—"}
            </Descriptions.Item>

            <Descriptions.Item label="Tạo lúc">
              {fmtDate(bid.created_at, true)}
            </Descriptions.Item>
            {/* <Descriptions.Item label="Cập nhật">
              {fmtDate(bid.updated_at, true)}
            </Descriptions.Item> */}

            <Descriptions.Item label="Trạng thái" span={1}>
              <Tag 
                color=
                  {
                    bid.status === 0 ? "default" : "processing"
                  }
              >
                {bid.status === 0 ? "Chờ phản hồi" : "Đã phản hồi"}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item label="Nội dung" span={2}>
              {bid.description ?? "—"}
            </Descriptions.Item>

            {/* <Descriptions.Item label="Project ID">
              {bid.project_id ?? "—"}
            </Descriptions.Item>

            <Descriptions.Item label="Tên người gửi">
              {"—"}
            </Descriptions.Item> */}

            {/* <Descriptions.Item label="File ứng tuyển" span={2}>
              {bid.application_file ? (
                <a href={bid.application_file} target="_blank" rel="noreferrer">
                  {bid.application_file}
                </a>
              ) : (
                "—"
              )}
            </Descriptions.Item> */}

            {/* <Descriptions.Item label="Đính kèm khác" span={2}>
              {bid.project_bid_files?.length ? (
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {bid.project_bid_files.map((f) => (
                    <li key={f.id}>
                      <Typography.Link href={f.file} target="_blank">
                        {f.file}
                      </Typography.Link>
                      <div style={{ fontSize: 12, color: "#666" }}>
                        ID: {f.id} · BidID: {f.user_project_bid_id} ·
                        Trạng thái: {f.status} · Tạo: {fmtDate(f.created_at, true)} ·
                        Cập nhật: {fmtDate(f.updated_at, true)}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                "—"
              )}
            </Descriptions.Item> */}
          </Descriptions>
        </>
      )}
    </Modal>
  );
}