import React, { useMemo, useState } from "react";
import {
  Button,
  Checkbox,
  Col,
  Divider,
  Radio,
  RadioChangeEvent,
  Row,
  Space,
  Spin,
  Table,
  Tag,
  Tooltip,
  Typography,
  Image,
  Descriptions,
} from "antd";
import {
  FullJobResource,
  PlatformFeeResponseResource,
  ProjectTransactionHistory,
} from "../../../../data/job/models/job.types";
import { JobDetailComponentProps } from "../JobDetailScreen";
import _ from "lodash";
import PriceUtils from "@/src/utils/PriceUtils";
import Constants from "@/src/constants/Constants";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import PrivacyPolicyRouteUtils from "@/src/data/privacy-policy/utils/PrivacyPolicyRouteUtils";
import TermOfUseRouteUtils from "@/src/data/term-of-use/utils/TermOfUseRouteUtils";
import Link from "next/link";
import { PrepayResource } from "@/src/data/payment/models/payment.types";
import usePaymentConfirm from "@/src/screens/PaymentScreen/hooks/usePaymentConfirm";
import Cookies from "js-cookie";
import AuthRouteUtils from "@/src/data/auth/utils/AuthRouteUtils";
import {
  DeleteOutlined,
  UndoOutlined,
  EyeOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { useDeleteTransaction } from "@/src/screens/ProfileScreen/TransactionScreen/hooks/useDeleteTransaction";
import { TransactionResource } from "@/src/data/payment/models/transaction.types";
import PricingRouteUtils from "@/src/data/pricing/utils/PricingRouteUtils";
import { useRouter } from "next/router";
import Images from "@/src/constants/Images";

// interface PaymentOverviewData {
//     type: number;
//     totalAmount: string;
//     totalAmountSuccess: string;
//     totalAmountPending: string;
// }

interface JobPaymentProps extends JobDetailComponentProps {
  payment?: PrepayResource | null;
  totalPayment: PlatformFeeResponseResource | null;
  isLoadingPayment?: boolean;
}

function JobPayment(props: JobPaymentProps) {
  const router = useRouter();
  const { jobQuery, isCreated, auth: fullProfileResource } = props;
  const fullJobResource: FullJobResource | undefined = jobQuery.data;


  function onReconfirmPay(transaction: TransactionResource) {
    return router.push(PricingRouteUtils.toPaymentJobsUrl(transaction));
  }

  const getPlatformFeeFromData = (
    transactionHistory: ProjectTransactionHistory[] | null | undefined
  ) => {
    if (!transactionHistory || transactionHistory.length === 0) return 0;
    return transactionHistory[0]?.platformfeePercentage || 0;
  };

  const platformfeePercentageValue = getPlatformFeeFromData(
    fullJobResource?.projectTransactionHistory
  );

  const createDescriptionItems = (transaction: ProjectTransactionHistory) => {
    const isSuccess = transaction.status === Constants.PAYMENT.STATUS.COMPLETE;
    let payDate = "-";
    if (isSuccess) {
      payDate = transaction.updatedAt;
    }

    return [
      {
        key: "orderId",
        label: "ID giao dịch",
        children: (
          <div style={{ wordBreak: "break-all" }}>
            {transaction.orderId.toUpperCase()}
          </div>
        ),
        span: 1,
      },
      {
        key: "name",
        label: "Sản phẩm/Dịch vụ",
        children: (
          <div style={{ wordBreak: "break-word" }}>{transaction.name}</div>
        ),
        span: 2,
      },
      {
        key: "createdAt",
        label: "Ngày tạo",
        children: transaction.createdAt,
        span: 1,
      },
      {
        key: "updatedAt",
        label: "Ngày thanh toán",
        children: payDate,
        span: 2,
      },
      {
        key: "transactionAmount",
        label: "Đơn giá",
        children: PriceUtils.display(transaction.transactionAmount),
        span: 1,
      },
      {
        key: "platformfee",
        label: `Phí nền tảng (${platformfeePercentageValue}%)`,
        children: PriceUtils.display(transaction.platformfee),
        span: 1,
      },
      {
        key: "productSubTotal",
        label: "Tổng tiền",
        children: PriceUtils.display(transaction.productSubTotal),
        span: 1,
      },
      {
        key: "status",
        label: "Trạng thái",
        children: (
          <Tag
            color={isSuccess ? "#09993E" : "#979797"}
            style={{
              marginInlineEnd: 0,
              width: "88px",
              textAlign: "center",
            }}
          >
            {isSuccess ? "Thành công" : "Chưa hoàn tất"}
          </Tag>
        ),
        span: 3,
      },
    ];
  };

  return (
    <div>
      {isCreated &&
        fullJobResource?.status ===
        Constants.JOB.STATUS.CHO_PARTNER_XAC_NHAN && (
          <div className={"jobPartContainer"}>
            <Row
              className="jobPartTitleContainer"
              align={"middle"}
              justify={"space-between"}
            >
              <div className="jobPartTitle">Xác nhận thực hiện công việc</div>
            </Row>

            <div
              className="jobPartContentContainer"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
                minHeight: "100px",
              }}
            >
              <p style={{ marginBottom: "16px", fontSize: "16px" }}>
                Bạn đã thanh toán tạm giữ cho iAgree thành công. Vui lòng chờ
                đối tác xác nhận thực hiện để bắt đầu công việc.
              </p>
            </div>
          </div>
        )}

      {fullJobResource?.projectTransactionHistory &&
        fullJobResource.projectTransactionHistory.length > 0 && (
          <div className={"jobPartContainer"}>
            <Row
              className="jobPartTitleContainer"
              align={"middle"}
              justify={"space-between"}
            >
              <div className="jobPartTitle">Chi tiết giao dịch</div>
            </Row>

            <div>
              <Space
                direction="vertical"
                size="large"
                style={{ width: "100%" }}
              >
                {fullJobResource.projectTransactionHistory.map(
                  (transaction) => (
                    <Descriptions
                      key={transaction.transactionId}
                      column={{ xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 3 }}
                      items={createDescriptionItems(transaction)}
                      size="small"
                    />
                  )
                )}
              </Space>

              <Row gutter={[32, 24]} style={{ marginTop: 24 }}>
                <Col xs={24}>
                  <Row justify="center">
                    <Col>
                      <Button
                        type="primary"
                        size="large"
                        block={false}
                        onClick={() => {
                          const incompleteTransaction =
                            fullJobResource.projectTransactionHistory?.find(
                              (t) =>
                                t.status ===
                                Constants.PAYMENT.STATUS.INCOMPLETE ||
                                Constants.PAYMENT.STATUS.REJECT
                            );

                          if (incompleteTransaction) {
                            onReconfirmPay(
                              incompleteTransaction as unknown as TransactionResource
                            );
                          }
                        }}
                        disabled={fullJobResource.projectTransactionHistory?.some(
                          (t) => t.status === Constants.PAYMENT.STATUS.COMPLETE
                        )}
                      >
                        {fullJobResource.projectTransactionHistory?.some(
                          (t) => t.status === Constants.PAYMENT.STATUS.COMPLETE
                        )
                          ? "Đã thanh toán"
                          : "Thanh toán"}
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </div>
        )}

      <div
        style={{
          marginTop: "2.5rem",
          height: "60vh",
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        <img
          alt=""
          title=""
          src={"/assets/img/payment_png.png"}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            borderRadius: 16,
            position: "relative",
            backgroundColor: "#207a42",
          }}
        />
      </div>
    </div>
  );
}

export default JobPayment;
