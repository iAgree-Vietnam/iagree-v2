import { RawUserProjectBidResource, RawUserProjectDealResource } from "@/src/data/job/models/job.raw";
import { UserProjectBidResource } from "@/src/data/job/models/job.types";
import { useDetectDeviceV2 } from "@/src/hooks/useDetectDevice";
import { Modal, Descriptions, Typography, Tag } from "antd";
import moment from "moment";

type ApplyInfo = UserProjectBidResource;

interface ViewApplyInfoModalProps {
  open: boolean;
  onClose: () => void;
  info: ApplyInfo | null;
  // userInfo: any;
}

export function ViewApplyInfoModal({ open, onClose, info }: ViewApplyInfoModalProps) {
  const fmtDate = (d?: string | null, withTime = false) =>
    d ? moment(d).format(withTime ? "DD/MM/YYYY HH:mm" : "DD/MM/YYYY") : "—";

  const fmtMoney = (n?: number | null) =>
    typeof n === "number" ? `${n.toLocaleString("vi-VN")} đ` : "—";
    const isMobile = useDetectDeviceV2().isMobile;


  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      title={"Thông tin ứng tuyển"}
    >
      {!info ? null : (
        <>
          <Descriptions bordered column={isMobile ? 1 : 2} size="middle">
            {/* <Descriptions.Item label="ID" span={1}>
              {bid.id}
            </Descriptions.Item> */}

            <Descriptions.Item label="Ngày bắt đầu">
              {fmtDate(info.startDate)}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày kết thúc">
              {fmtDate(info.endDate)}
            </Descriptions.Item>

            <Descriptions.Item label="Giá thương lượng">
              {fmtMoney(info.negotiatePrice)}
            </Descriptions.Item>
            <Descriptions.Item label="Số lần nghiệm thu">
              {info.numberAccept ?? "—"}
            </Descriptions.Item>

            <Descriptions.Item label="Ngày ứng tuyển">
              {fmtDate(info.createdAt, true)}
            </Descriptions.Item>
            {/* <Descriptions.Item label="Cập nhật">
              {fmtDate(bid.updated_at, true)}
            </Descriptions.Item> */}

            <Descriptions.Item label="Trạng thái" span={1}>
              <Tag 
                color=
                  {
                    info.status === 0 ? "default" : "processing"
                  }
              >
                {info.status === 0 ? "Chờ phản hồi" : "Đã phản hồi"}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item label="Thư ứng tuyển" span={2}>
              {info?.applicationLetter ?? "—"}
            </Descriptions.Item>

            <Descriptions.Item label="Đề xuất" span={2}>
              {info.description ?? "—"}
            </Descriptions.Item>

            <Descriptions.Item label="File ứng tuyển" span={2}>
              {
                info.projectBidFiles &&
                  info.projectBidFiles.length > 0 ?
                  info.projectBidFiles.map(
                    (attachment, index) => {
                      return (
                        <a href={attachment.file} target="_blank" rel="noreferrer">
                          {attachment.file}
                        </a>
                      );
                    }
                  ) : "Không có dữ liệu"
              }
            </Descriptions.Item>

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