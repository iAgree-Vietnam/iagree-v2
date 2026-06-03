"use client"

import React, { useCallback, useImperativeHandle, useState, useEffect } from "react"
import { Button, Checkbox, Form, Input, Modal, Row, Typography, Col, InputNumber, DatePicker } from "antd"
import { withThemeRevert } from "@/theme"
import dayjs from "dayjs"
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

export interface ClientConfirmOfferModalHelperVisible {
  // open: (chatJob: ChatJob) => void
  open: (chatReceiverInfo: RoomInfoDetailResource) => void
  close: () => void
}

const ClientConfirmOfferModal = React.forwardRef((_, ref) => {
  const [form] = Form.useForm()
  const [chatJob, setChatJob] = useState<ChatJob | null>(null)
  const [autoFillSuggestPrice, setAutoFillSuggestPrice] = useState<{ suggest: boolean }>({ suggest: false })
  const [autoFillPrice, setAutoFillPrice] = useState<{ suggest: boolean }>({ suggest: false })

  const open = useCallback((chatJob: ChatJob) => {
    setChatJob(chatJob)
  }, [])

  const close = useCallback(() => {
    setChatJob(null)
    form.resetFields()
    setAutoFillSuggestPrice({ suggest: false })
    setAutoFillPrice({ suggest: false })
  }, [form])

  useImperativeHandle(
    ref,
    useCallback(() => ({ open, close }), [open, close]),
  )

  useEffect(() => {
    if (chatJob) {
      const startDate = dayjs()
      const endDate = null
      form.setFieldsValue({
        jobName: chatJob.job.name,
        jobDescription: chatJob.job.description,
        partnerName: chatJob.partner.name,
        jobSuggestion: chatJob.job.suggestion,
        startDate: startDate,
        endDate: endDate,
      })
    }
  }, [chatJob, form])

  useEffect(() => {
    if (autoFillSuggestPrice.suggest && chatJob?.job.suggestPrice) {
      // Set giá trị số, không phải string đã format
      form.setFieldsValue({ price: chatJob.job.suggestPrice })
    }
    if (autoFillPrice.suggest && chatJob?.job.price) {
      // Set giá trị số, không phải string đã format
      form.setFieldsValue({ price: chatJob.job.price })
    }
  }, [autoFillSuggestPrice, autoFillPrice, chatJob, form])

  // Hàm xử lý khi giá thay đổi thủ công
  const handlePriceChange = useCallback((value: number | null) => {
    // Nếu người dùng thay đổi giá thủ công, bỏ chọn cả hai checkbox
    if (autoFillSuggestPrice.suggest || autoFillPrice.suggest) {
      setAutoFillSuggestPrice({ suggest: false })
      setAutoFillPrice({ suggest: false })
    }
  }, [autoFillSuggestPrice.suggest, autoFillPrice.suggest])

  const handleSubmit = useCallback(() => {
    form
      .validateFields()
      .then((values) => {
        // Thực hiện logic xác nhận hợp đồng ở đây
        // updateMutation.mutate(values);
        close()
      })
      .catch((error) => {
        console.error("Validation failed:", error)
      })
  }, [form, close])

  return (
    <Modal
      title={"Xác nhận công việc"}
      open={Boolean(chatJob)}
      className={"applyJobModalContainer"}
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

        {/* Thời gian thực hiện */}
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label={"Ngày bắt đầu"}
              name={"startDate"}
              rules={[
                { required: true, message: "Vui lòng chọn ngày bắt đầu" },
                {
                  validator: (_, value) => {
                    if (!value) {
                      return Promise.resolve()
                    }
                    const today = dayjs().startOf("day")
                    const startDate = dayjs(value).startOf("day")
                    const endDate = form.getFieldValue("endDate")
                    // Kiểm tra ngày bắt đầu không được nhỏ hơn ngày hiện tại
                    if (startDate.isBefore(today)) {
                      return Promise.reject(new Error("Ngày bắt đầu không được nhỏ hơn ngày hiện tại"))
                    }
                    // Kiểm tra ngày bắt đầu không được lớn hơn ngày kết thúc
                    if (endDate && dayjs(endDate).isValid()) {
                      const endDateParsed = dayjs(endDate).startOf("day")
                      if (startDate.isAfter(endDateParsed)) {
                        return Promise.reject(new Error("Ngày bắt đầu không được lớn hơn ngày kết thúc"))
                      }
                    }
                    return Promise.resolve()
                  },
                },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                placeholder="Chọn ngày bắt đầu"
                onChange={() => {
                  // Trigger validation cho endDate khi startDate thay đổi
                  form.validateFields(["endDate"]).catch(() => {})
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label={"Ngày kết thúc"}
              name={"endDate"}
              rules={[
                { required: true, message: "Vui lòng chọn ngày kết thúc" },
                {
                  validator: (_, value) => {
                    if (!value) {
                      return Promise.resolve()
                    }
                    const today = dayjs().startOf("day")
                    const endDate = dayjs(value).startOf("day")
                    const startDate = form.getFieldValue("startDate")
                    // Kiểm tra ngày kết thúc không được nhỏ hơn ngày hiện tại
                    if (endDate.isBefore(today)) {
                      return Promise.reject(new Error("Ngày kết thúc không được nhỏ hơn ngày hiện tại"))
                    }
                    // Kiểm tra ngày kết thúc không được nhỏ hơn hoặc bằng ngày bắt đầu
                    if (startDate && dayjs(startDate).isValid()) {
                      const startDateParsed = dayjs(startDate).startOf("day")
                      if (endDate.isSame(startDateParsed) || endDate.isBefore(startDateParsed)) {
                        return Promise.reject(new Error("Ngày kết thúc phải lớn hơn ngày bắt đầu"))
                      }
                    }
                    return Promise.resolve()
                  },
                },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                placeholder="Chọn ngày kết thúc"
                onChange={() => {
                  // Trigger validation cho startDate khi endDate thay đổi
                  form.validateFields(["startDate"]).catch(() => {})
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Giá - chiếm toàn bộ chiều rộng */}
        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              label={"Giá (VNĐ)"}
              name={"price"}
              rules={[
                { required: true, message: "" },
                {
                  validator: (_, value) => {
                    if (value === undefined || value === null) {
                      return Promise.reject(new Error("Vui lòng nhập giá"))
                    }
                    if (value < 0) {
                      return Promise.reject(new Error("Giá không được âm!"))
                    }
                    return Promise.resolve()
                  },
                },
              ]}
            >
              <InputNumber<number>
                min={0}
                style={{ width: "100%" }}
                onChange={handlePriceChange}
                formatter={(value) => {
                  if (value === undefined || value === null || value === 0) {
                    return "0 VNĐ"
                  }
                  return `${PriceUtils.displayVND(Number(value))}`
                }}
                parser={(value) => {
                  if (!value) return 0
                  // Loại bỏ tất cả ký tự không phải số, chỉ giữ lại số và dấu thập phân
                  const numericValue = value.replace(/[^\d.]/g, "")
                  const parsedValue = Number(numericValue) || 0
                  return parsedValue
                }}
                placeholder="0 VNĐ"
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Tùy chọn giá - hiển thị phía dưới */}
        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <Checkbox
                  checked={autoFillSuggestPrice.suggest}
                  onChange={(e) => {
                    setAutoFillSuggestPrice({
                      suggest: e.target.checked,
                    })
                    if (e.target.checked) {
                      setAutoFillPrice({ suggest: false })
                    }
                  }}
                >
                  Sử dụng giá đề xuất ({PriceUtils.display(chatJob?.job.suggestPrice)})
                </Checkbox>
                <Checkbox
                  checked={autoFillPrice.suggest}
                  onChange={(e) => {
                    setAutoFillPrice({
                      suggest: e.target.checked,
                    })
                    if (e.target.checked) {
                      setAutoFillSuggestPrice({ suggest: false })
                    }
                  }}
                >
                  Sử dụng giá ban đầu ({PriceUtils.display(chatJob?.job.price)})
                </Checkbox>
              </div>
            </Form.Item>
          </Col>
        </Row>

        {/* Mô tả công việc */}
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item label={"Đề xuất của đối tác"} name={"jobSuggestion"}>
              <TextArea rows={5} disabled />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label={"Mô tả công việc"}
              name={"jobDescription"}
              rules={[{ required: true, message: "Vui lòng nhập mô tả công việc" }]}
            >
              <TextArea rows={5} placeholder="Nhập mô tả chi tiết công việc..." showCount maxLength={1000} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Typography.Text type="secondary" style={{ fontSize: "12px", color: "#ff0000" }}>
              Lưu ý: Vui lòng kiểm tra và điều chỉnh thông tin để đảm bảo tính chính xác.
            </Typography.Text>
          </Col>
        </Row>
      </Form>

      <Row justify={"center"} style={{ marginTop: "24px" }}>
        <Button onClick={close} size="large" style={{ marginRight: 12, minWidth: "100px" }}>
          Hủy
        </Button>
        {withThemeRevert(
          <Button onClick={handleSubmit} type={"primary"} size="large" style={{ minWidth: "120px" }}>
            Xác nhận
          </Button>,
        )}
      </Row>
    </Modal>
  )
})

ClientConfirmOfferModal.displayName = "ClientConfirmOfferModal"

export default ClientConfirmOfferModal