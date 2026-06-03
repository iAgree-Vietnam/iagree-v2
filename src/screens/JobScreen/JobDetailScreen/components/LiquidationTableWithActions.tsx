import React, { useMemo, useState } from "react";
import {
  Table,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Space,
  message,
  Typography,
  Card,
  Descriptions,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  RetweetOutlined,
  HistoryOutlined,
  InfoCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  CancelFlowService,
  NegotiationResponseType,
  ResponsesCancellationDetails,
  ComplaintListItem,
  ComplaintsListData,
  ComplaintType,
} from "@/src/data/cancel/CancelFlow.service";
import {
  first,
  includes,
  isArray,
  isEmpty,
  last,
  map,
  reverse,
  toNumber,
} from "lodash";
import useSWR from "swr";
import { JobDetailInitResource } from "@/src/data/job/models/job.types";
import moment from "moment";
import { ApiResponse } from "@/src/data/cancel/CancelFlow.service";
import ButtonComplainCancel from "./ButtonComplainCancel"; // 🟢 COMPONENT CON

const { Text, Title } = Typography;

// --- INTERFACES ---
interface LiquidationHistoryRecord {
  key: string;
  date: string;
  sender: string;
  message: string;
  suggestion: string;
  status: string;
}

type LiquidTableProps = {
  fullJobResource?: JobDetailInitResource;
  queryKey: number;
  refetch?: () => void;
};

// --- COMPONENT CHÍNH ---
const LiquidationTableWithActions = (props: LiquidTableProps) => {
  const { fullJobResource, queryKey } = props;

  // --- STATES ---
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentAction, setCurrentAction] = useState<NegotiationResponseType>(
    NegotiationResponseType.ACCEPT
  );
  // lưu id của yêu cầu thanh lý chính
  const [mainRequestId, setMainRequestId] = useState<string | null>(null);
  const [currentSuggestion, setCurrentSuggestion] = useState<string>("");

  const [negotiationUnit, setNegotiationUnit] = useState<"percent" | "vnd">(
    "percent"
  );
  const [form] = Form.useForm();

  // --- DATA: DANH SÁCH YÊU CẦU HỦY / THANH LÝ ---
  const { data: dataListCancel, isLoading: isLoadingCancelStatus } = useSWR(
    fullJobResource?.jobId
      ? ["cancellations", fullJobResource.jobId, queryKey]
      : null,
    () =>
      fullJobResource?.jobId
        ? new CancelFlowService().getCancellationsList(fullJobResource.jobId)
        : undefined,
    {
      dedupingInterval: 10000,
    }
  );

  // --- DATA: DANH SÁCH KHIẾU NẠI LIÊN QUAN ---
  const { data: complaintsRes, isLoading: isLoadingComplaints } = useSWR<
    ApiResponse<ComplaintsListData> | undefined
  >(
    fullJobResource?.jobId ? ["complaints", fullJobResource.jobId] : null,
    () => new CancelFlowService().getComplaintsList(),
    {
      dedupingInterval: 10000,
    }
  );

  const relatedComplaints: ComplaintListItem[] = useMemo(() => {
    if (!complaintsRes?.data?.data || !fullJobResource?.jobId) return [];
    return complaintsRes.data.data.filter(
      (c) => c.project_id === fullJobResource.jobId
    );
  }, [complaintsRes?.data, fullJobResource?.jobId]);

  // --- DATA PROCESSING ---

  // 1. Thông tin yêu cầu thanh lý chính
  const mainRequest = useMemo(() => {
    const rawData = first(dataListCancel?.data);
    if (!rawData) return null;

    return {
      id: rawData.id,
      requester: rawData.requested_by?.name,
      date: moment(rawData.created_at).format("DD/MM/YYYY HH:mm"),
      status: rawData.status,
      reason: rawData.reason,
      refundPercentage: toNumber(rawData.refund_percentage),
      currentSuggestion: rawData.responses?.length
        ? toNumber(last(rawData.responses)?.counter_refund_percentage)
        : toNumber(rawData.refund_percentage),
    };
  }, [dataListCancel?.data]);

  // 2. Lịch sử phản hồi thanh lý
  const tableData = useMemo(() => {
    const responses = first(dataListCancel?.data)?.responses;
    if (!isArray(responses)) return [];

    return map(responses, (it: ResponsesCancellationDetails, index) => ({
      key: `${it.cancellation_id}_${index}`,
      date: moment(it.created_at).format("DD/MM/YYYY HH:mm"),
      sender: it.responded_by?.name,
      message: it.message,
      suggestion: it.counter_refund_percentage
        ? `${toNumber(it.counter_refund_percentage)}%`
        : "-",
      status: it.response_type,
    }));
  }, [dataListCancel?.data]);

  // --- ACTIONS ---

  const showModal = (action: NegotiationResponseType) => {
    if (!mainRequest) return;

    setCurrentAction(action);
    setMainRequestId(String(mainRequest.id));
    setCurrentSuggestion(`${mainRequest.currentSuggestion}%`);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentAction(NegotiationResponseType.ACCEPT);
    setMainRequestId(null);
  };

  const handleSubmit = async (values: any) => {
    if (!mainRequestId) return;

    const res = await new CancelFlowService().respondToCancellation(
      toNumber(mainRequestId),
      {
        response_type: currentAction,
        message: values?.message,
        ...(includes(currentAction, NegotiationResponseType.NEGOTIATE)
          ? { counter_refund_percentage: values?.amount }
          : {}),
      }
    );

    if (res.success) {
      message.success(`Đã gửi phản hồi thành công`);
      if (props.refetch) props.refetch();
    } else {
      message.error(`Đã gửi yêu cầu thất bại`);
    }

    handleCancel();
  };

  // 🟢 HÀM XỬ LÝ KHIẾU NẠI (GỌI TỪ COMPONENT CON)
  const handleNewActionSubmit = async (description: string) => {
    try {
      const result = await new CancelFlowService().fileCancellationComplaint(
        fullJobResource?.jobId || 0,
        {
          description,
          // Mặc định là Tranh chấp nghiệm thu trong bối cảnh này
          complaint_type: ComplaintType.AcceptanceDispute,
        }
      );
      if (result.success) {
        message.success("Gửi khiếu nại thành công");
      } else {
        message.error("Gửi khiếu nại thất bại");
      }

      if (props.refetch) props.refetch();
    } catch (error) {
      message.error("Gửi khiếu nại thất bại");
    }
  };

  // --- HELPER RENDER ---

  const renderStatusTag = (status: string) => {
    let color: "success" | "error" | "processing" | "default" = "default";
    if (includes(status, "ACCEPT") || status === "APPROVED") color = "success";
    if (includes(status, "REJECT") || status === "REJECTED") color = "error";
    if (includes(status, "NEGOTIATE") || status === "PENDING")
      color = "processing";

    return <Tag color={color}>{status}</Tag>;
  };

  const renderComplaintStatusTag = (status: string) => {
    // pending_payment | under_review | resolved | closed
    let color: "warning" | "processing" | "success" | "default" | "error" =
      "default";
    switch (status) {
      case "pending_payment":
        color = "warning";
        break;
      case "under_review":
        color = "processing";
        break;
      case "resolved":
        color = "success";
        break;
      case "closed":
        color = "default";
        break;
      default:
        color = "default";
    }

    return <Tag color={color}>{status}</Tag>;
  };

  const getModalTitle = (action: typeof currentAction) => {
    switch (action) {
      case "accept":
        return "Xác nhận Đồng ý Thanh lý";
      case "reject":
        return "Xác nhận Từ chối Thanh lý";
      case "negotiate":
        return "Đề xuất Thương lượng lại";
      default:
        return "Hành động";
    }
  };

  // --- COLUMNS: LỊCH SỬ THANH LÝ (GIỮ NGUYÊN) ---
  const columns: ColumnsType<LiquidationHistoryRecord> = [
    {
      title: "Ngày phản hồi",
      dataIndex: "date",
      key: "date",
      width: 150,
    },
    {
      title: "Người phản hồi",
      dataIndex: "sender",
      key: "sender",
      width: 150,
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Nội dung / Tin nhắn",
      dataIndex: "message",
      key: "message",
      width: 300,
    },
    {
      title: "Đề xuất (%)",
      dataIndex: "suggestion",
      key: "suggestion",
      width: 120,
      align: "center",
      render: (text) => (text !== "-" ? <Tag color="blue">{text}</Tag> : text),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status) => renderStatusTag(status),
    },
  ];

  // --- COLUMNS: DANH SÁCH KHIẾU NẠI (GIỮ NGUYÊN) ---
  const complaintColumns: ColumnsType<ComplaintListItem> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
    },
    {
      title: "Loại khiếu nại",
      dataIndex: "complaint_type",
      key: "complaint_type",
      width: 160,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 150,
      // render: (status: string) => renderComplaintStatusTag(status),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Phí khiếu nại",
      dataIndex: "fee_amount",
      key: "fee_amount",
      width: 140,
      render: (fee: string) => (
        <Text strong>{Number(fee || 0).toLocaleString("vi-VN")} đ</Text>
      ),
    },
    {
      title: "Thanh toán",
      dataIndex: "fee_paid",
      key: "fee_paid",
      width: 120,
      render: (paid: boolean) => (paid ? "Đã thanh toán" : "Chưa thanh toán"),
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      width: 180,
      render: (date: string) => moment(date).format("DD/MM/YYYY HH:mm") || "-",
    },
  ];

  // --- XỬ LÝ DỮ LIỆU ĐỂ RENDER ---

  const hasLiquidationData = !!mainRequest;
  const hasHistoryData = !isEmpty(tableData);
  const hasComplaintData = !isEmpty(relatedComplaints);
  const isAnyLoading = isLoadingCancelStatus || isLoadingComplaints;

  // 🟢 ĐIỀU KIỆN RENDER TỔNG THỂ
  if (!hasLiquidationData && !hasComplaintData && !isAnyLoading) {
    return (
      <div style={{ padding: 20, textAlign: "center", color: "#999" }}>
        Chưa có yêu cầu thanh lý hoặc khiếu nại nào liên quan.
      </div>
    );
  }

  // --- RENDER UI ---

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="large">
      {/* 1. MAIN INFO BOARD (Thông tin yêu cầu thanh lý chính) */}
      {(hasLiquidationData || isAnyLoading) && (
        <Card
          loading={isLoadingCancelStatus}
          title={
            <Space>
              <InfoCircleOutlined /> Thông tin Yêu cầu Thanh lý
            </Space>
          }
          bordered={false}
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
        >
          <Descriptions
            bordered
            column={{ xxl: 4, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}
          >
            <Descriptions.Item label="Người yêu cầu">
              {mainRequest?.requester}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {mainRequest?.date}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {renderStatusTag(mainRequest?.status || "")}
            </Descriptions.Item>
            <Descriptions.Item label="Đề xuất hoàn tiền gốc">
              <Text strong style={{ color: "#1890ff", fontSize: 16 }}>
                {mainRequest?.refundPercentage}%
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="Lý do thanh lý" span={2}>
              {mainRequest?.reason}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      {/* 2. HISTORY TABLE (Lịch sử trao đổi/Phản hồi) */}
      {(hasHistoryData || isAnyLoading) && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Title level={5} style={{ marginBottom: 16 }}>
              <HistoryOutlined /> Lịch sử trao đổi & Thương lượng
            </Title>

            {
              // 🟢 GỘP 4 NÚT HÀNH ĐỘNG CẤP CAO VÀO EXTRA
              <Space>
                <Button
                  icon={<CheckCircleOutlined />}
                  onClick={() => showModal(NegotiationResponseType.ACCEPT)}
                  type="primary"
                >
                  Đồng ý
                </Button>
                <Button
                  icon={<CloseCircleOutlined />}
                  onClick={() => showModal(NegotiationResponseType.REJECT)}
                  danger
                >
                  Từ chối
                </Button>
                <Button
                  icon={<RetweetOutlined />}
                  onClick={() => showModal(NegotiationResponseType.NEGOTIATE)}
                >
                  Thương lượng
                </Button>
                {/* NÚT KHIẾU NẠI (SỬ DỤNG COMPONENT CON) */}
                <ButtonComplainCancel onActionSubmit={handleNewActionSubmit}>
                  <Button
                    size="middle"
                    type="primary"
                    icon={<WarningOutlined />}
                    danger
                  >
                    Khiếu nại
                  </Button>
                </ButtonComplainCancel>
              </Space>
            }
            {/* 🛑 XÓA CẤU TRÚC FLEXBOX VÀ BUTTONCOMPLAINCANCEL Ở ĐÂY */}
          </div>
          <Table
            columns={columns}
            dataSource={reverse(tableData)}
            pagination={false}
            loading={isLoadingCancelStatus}
            rowKey="key"
            bordered
            size="middle"
            locale={{ emptyText: "Chưa có phản hồi nào" }}
          />
        </>
      )}

      {/* 3. COMPLAINTS LIST (Danh sách khiếu nại liên quan) */}
      {(hasComplaintData || isAnyLoading) && (
        <div>
          <Title level={5} style={{ margin: "24px 0 16px" }}>
            <WarningOutlined /> Danh sách khiếu nại liên quan
          </Title>
          <Table
            columns={complaintColumns}
            dataSource={relatedComplaints}
            pagination={false}
            loading={isLoadingComplaints}
            rowKey={(item) => String(item.id)}
            bordered
            size="middle"
            locale={{ emptyText: "Chưa có khiếu nại nào cho công việc này" }}
          />
        </div>
      )}

      {/* 4. MODAL PHẢN HỒI THANH LÝ (Giữ nguyên) */}
      <Modal
        title={getModalTitle(currentAction)}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {currentAction === NegotiationResponseType.ACCEPT && (
            <p>
              Bạn đang <b>Đồng ý</b> với đề xuất thanh lý. Vui lòng xác nhận.
            </p>
          )}
          {currentAction === NegotiationResponseType.REJECT && (
            <p>
              Bạn đang <b>Từ chối</b> đề xuất thanh lý. Vui lòng nhập lý do.
            </p>
          )}

          {(currentAction === NegotiationResponseType.ACCEPT ||
            currentAction === NegotiationResponseType.REJECT) && (
            <Form.Item
              name="message"
              label="Tin nhắn / Lý do"
              rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
            >
              <Input.TextArea rows={4} placeholder="Nhập nội dung..." />
            </Form.Item>
          )}

          {currentAction === NegotiationResponseType.NEGOTIATE && (
            <>
              <p>
                Đề xuất hiện tại đang là: <b>{currentSuggestion}</b>
              </p>

              <Form.Item
                name="unit"
                label="Đơn vị"
                initialValue={negotiationUnit}
              >
                <Button.Group>
                  <Button
                    onClick={() => setNegotiationUnit("percent")}
                    type={negotiationUnit === "percent" ? "primary" : "default"}
                  >
                    %
                  </Button>
                </Button.Group>
              </Form.Item>

              <Form.Item
                name="amount"
                label="Số lượng đề xuất mới"
                rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
              >
                <InputNumber
                  min={0}
                  max={negotiationUnit === "percent" ? 100 : undefined}
                  style={{ width: "100%" }}
                  addonAfter="%"
                />
              </Form.Item>

              <Form.Item
                name="message"
                label="Tin nhắn thương lượng"
                rules={[{ required: true, message: "Vui lòng nhập tin nhắn!" }]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Nhập nội dung thương lượng..."
                />
              </Form.Item>
            </>
          )}

          <Form.Item
            style={{
              marginTop: 24,
              textAlign: "right",
              marginBottom: 0,
            }}
          >
            <Space>
              <Button onClick={handleCancel}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                Gửi xác nhận
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
};

export default LiquidationTableWithActions;
