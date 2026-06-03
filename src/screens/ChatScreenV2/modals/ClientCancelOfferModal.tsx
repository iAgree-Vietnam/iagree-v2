"use client"

import React, { useCallback, useImperativeHandle, useState, useEffect } from "react"
import { Button, Form, Input, Modal, Row, Typography, Col, Select, message } from "antd"
import { withThemeRevert } from "@/theme"
import PriceUtils from "@/src/utils/PriceUtils"
import { RoomInfoDetailResource } from "@/src/data/message/models/message.types"

const { TextArea } = Input

interface Message {
  id: number
  side: string
  text: string
  userId: number | null
  timestamp: string
}

interface Job {
  id: number
  name: string
  price: number
  description: string
  suggestion: string
  suggestPrice: number
  startDate: string
  endDate: string
}

interface Partner {
  id: number
  name: string
  location: string
  joinDate: string
  language: string
  sellerLevel: string
  responseRate: string
  jobPosition: string
  role: string
  rating: number
  reviewCount: number
}

interface User {
  id: number
  name: string
}

interface ChatJob {
  id: number
  job: Job
  partner: Partner
  user: User
  messages: Message[]
  lastSeen: string
  isOnline: boolean
}

export interface ClientCancelOfferModalHelperVisible {
  // open: (chatJob: ChatJob) => void
  open: (chatReceiverInfo: RoomInfoDetailResource) => void
  close: () => void
}

const ClientCancelOfferModal = React.forwardRef((_, ref) => {
  const [form] = Form.useForm()
  // const [chatJob, setChatJob] = useState<ChatJob | null>(null)
  const [chatReceiverInfo, setChatReceiverInfo] = useState<RoomInfoDetailResource | null>(null);

  // const open = useCallback((chatJob: ChatJob) => {
  //   setChatJob(chatJob)
  // }, [])
  const open = useCallback((chatReceiverInfo: RoomInfoDetailResource) => {
    setChatReceiverInfo(chatReceiverInfo)
  }, [])

  const close = useCallback(() => {
    // setChatJob(null)
    setChatReceiverInfo(null)
    form.resetFields()
  }, [form])

  useImperativeHandle(
    ref,
    useCallback(() => ({ open, close }), [open, close]),
  )

  // useEffect(() => {
  //   if (chatJob) {
  //     form.setFieldsValue({
  //       jobName: chatJob.job.name,
  //       partnerName: chatJob.partner.name,
  //       jobDescription: chatJob.job.description,
  //       suggestPrice: PriceUtils.displayVND(chatJob.job.suggestPrice), // Format với PriceUtils
  //       price: PriceUtils.displayVND(chatJob.job.price), // Format với PriceUtils
  //       startDate: chatJob.job.startDate,
  //       endDate: chatJob.job.endDate,
  //     })
  //   }
  // }, [chatJob, form])

  useEffect(() => {
    if (chatReceiverInfo) {
      form.setFieldsValue({
        jobName: chatReceiverInfo.projectName,
        partnerName: chatReceiverInfo.partnerName,
        jobDescription: chatReceiverInfo.projectDes,
        suggestPrice: 0,
        price: PriceUtils.displayVND(chatReceiverInfo.price),
        
      })
    }
  })

  const handleSubmit = useCallback(() => {
    form
      .validateFields()
      .then((values) => {
        // Thực hiện logic hủy công việc ở đây
        // cancelMutation.mutate(values);
        message.success("Huỷ công việc thành công!")
        close()
      })
      .catch((error) => {
        console.error("Validation failed:", error)
      })
  }, [form, close])

  const cancelReasons = [
    { label: "Đối tác không phù hợp", value: "partner_not_suitable" },
    { label: "Giá cả không thỏa thuận được", value: "price_disagreement" },
    { label: "Thời gian không phù hợp", value: "time_not_suitable" },
    { label: "Yêu cầu công việc thay đổi", value: "job_requirements_changed" },
    { label: "Tìm được đối tác khác tốt hơn", value: "found_better_partner" },
    { label: "Không còn nhu cầu", value: "no_longer_needed" },
    { label: "Khác", value: "other" },
  ]

  return (
    <Modal
      title={"Hủy công việc"}
      // open={Boolean(chatJob)}
      open={Boolean(chatReceiverInfo)}
      className={"cancelContractModalContainer"}
      footer={null}
      onCancel={close}
      width={900}
    >
      <Form form={form} layout={"vertical"}>
        {/* Thông tin cơ bản */}
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item label={"Tên công việc"} name={"jobName"}>
              <Input disabled />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label={"Tên đối tác"} name={"partnerName"}>
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item label={"Giá đề xuất (VNĐ)"} name={"suggestPrice"}>
              <Input disabled />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label={"Giá ban đầu (VNĐ)"} name={"price"}>
              <Input disabled />
            </Form.Item>
          </Col>
         
        </Row>

        <Row gutter={16}>
            <Col xs={24} md={12}>
            <Form.Item label={"Ngày bắt đầu"} name={"startDate"}>
              <Input disabled />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label={"Ngày kết thúc"} name={"endDate"}>
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={"Mô tả công việc"} name={"jobDescription"}>
              <TextArea rows={3} disabled />
            </Form.Item>
          </Col>
        </Row>

        {/* Lý do hủy */}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label={"Lý do hủy công việc"}
              name={"cancelReason"}
              rules={[{ required: true, message: "Vui lòng chọn lý do hủy công việc!" }]}
            >
              <Select placeholder="Chọn lý do hủy công việc" options={cancelReasons} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Typography.Text type="secondary" style={{ fontSize: "12px", color: "#ff0000" }}>
              Lưu ý: Hành động hủy công việc có thể ảnh hưởng đến uy tín của bạn. Vui lòng cân nhắc kỹ trước khi quyết
              định.
            </Typography.Text>
          </Col>
        </Row>
      </Form>

      <Row justify={"center"} style={{ marginTop: "24px" }}>
        <Button onClick={close} size="large" style={{ marginRight: 12, minWidth: "100px" }}>
          Quay lại
        </Button>
        {withThemeRevert(
          <Button onClick={handleSubmit} size="large" type={"primary"} danger style={{ minWidth: "100px" }}>
            Hủy công việc
          </Button>,
        )}
      </Row>
    </Modal>
  )
})

ClientCancelOfferModal.displayName = "ClientCancelOfferModal"

export default ClientCancelOfferModal
