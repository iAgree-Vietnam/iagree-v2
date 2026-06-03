
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Breadcrumb,
  Button,
  Col,
  Divider,
  Image,
  Row,
  Space,
  Typography,
} from "antd";
import _ from "lodash";
import Cookies from "js-cookie";

import RootLayout from "@/src/layouts/RootLayout";
import Images from "@/src/constants/Images";
import PriceUtils from "@/src/utils/PriceUtils";
import { ProfileContainer } from "@/src/components/ProfileContainer";
import AuthRouteUtils from "@/src/data/auth/utils/AuthRouteUtils";
import { ConstantsHelper } from "@/src/constants/ConstantsHelper";
import { TransactionDetailsResource } from "@/src/data/payment/models/transaction.types";
import usePaymentConfirm from "@/src/screens/PaymentScreen/hooks/usePaymentConfirm";
import Constants from "@/src/constants/Constants";
import useSelectedTransaction from "./hooks/useSelectedTransaction";
import { IconSvgLocal } from "@/src/components/icon-svg-local";

function TransactionDetailsScreen() {
  const router = useRouter();
  const slug = router?.query?.url as string;
  const slugList: string[] = slug.split(".");
  const orderId = slugList.length > 1 ? slugList[1] : "";

  const { data: transactionDetails } = useSelectedTransaction(orderId);
  const submitMutation = usePaymentConfirm();

  function onReconfirmPay(transaction: TransactionDetailsResource) {
    Cookies.remove(Constants.KEY_PAYMENT_TYPE);
    submitMutation.mutate({
      productId: transaction.orderInfo?.typeId,
      productType: transaction.orderInfo?.type,
      methodCode: transaction.orderInfo?.paymentMethod || "",
      clientIp: "",
    });
  }

  return (
    <RootLayout>
      <Head>
        <title>Chi tiết giao dịch</title>
      </Head>

      <section className={"breadcrumbContainer"}>
        <div className="contentWrapper">
          <Breadcrumb
            items={[
              {
                title: (
                  <>
                    <IconSvgLocal name={"IC_HOME"} />
                    <span>Trang chủ</span>
                  </>
                ),
                href: "/",
              },
              {
                title: (
                  <Link href={AuthRouteUtils.toTransaction()}>
                    Quản lý giao dịch
                  </Link>
                ),
              },
              { title: "Chi tiết giao dịch" },
            ]}
          />
        </div>
      </section>

      <ProfileContainer>
        <h1 className={"pageHeaderTitle"}>Chi tiết giao dịch</h1>

        <div className={"contentWrapper"}>
          <Row gutter={[32, 24]}>
            <Col xs={24}>
              <div className={"paymentProductsContainer"}>
                <Typography.Title level={5} className={"paymentSectionTitle"}>
                  Sản phẩm
                </Typography.Title>

                <Space size={"large"} align={"start"}>
                  <Image
                    preview={false}
                    src={transactionDetails?.productInfo?.productPhoto}
                    alt={transactionDetails?.productInfo?.productName}
                    className={"templateImg"}
                    width={"160px"}
                    height={"80px"}
                    fallback={Images.TEMPLATE_DEFAULT}
                  />

                  <div className={"paymentTemplateContentContainer"}>
                    <Typography.Title level={4}>
                      {transactionDetails?.productInfo?.productName ||
                        transactionDetails?.orderInfo?.name}
                    </Typography.Title>
                    {transactionDetails?.productInfo?.productPrice !== 0 ? (
                      <Typography.Paragraph
                        className={"templateSalaryText text-center"}
                      >
                        {PriceUtils.display(
                          transactionDetails?.productInfo?.productPrice ||
                            transactionDetails?.orderInfo?.amount
                        )}
                      </Typography.Paragraph>
                    ) : (
                      <div className={"templateLabel templateFreeLabel"}>
                        Miễn phí
                      </div>
                    )}
                  </div>
                </Space>
              </div>
            </Col>
            <Col xs={24}>
              <Space direction={"vertical"} size={"large"} className={"d-flex"}>
                <Typography.Title level={5} className={"nm-typo"}>
                  2. Chi tiết đơn hàng
                </Typography.Title>
                <Space direction={"vertical"} className={"d-flex"}>
                  <Row align={"middle"} justify={"space-between"}>
                    <Typography.Text className={"nm-typo"}>
                      ID giao dịch
                    </Typography.Text>

                    <Typography.Paragraph
                      className={"templateSalaryText nm-typo"}
                    >
                      {transactionDetails?.orderInfo?.orderId}
                    </Typography.Paragraph>
                  </Row>

                  <Row align={"middle"} justify={"space-between"}>
                    <Typography.Text className={"nm-typo"}>
                      Sản phẩm/dịch vụ
                    </Typography.Text>

                    <Typography.Paragraph
                      className={"templateSalaryText nm-typo"}
                    >
                      {transactionDetails?.orderInfo?.name}
                    </Typography.Paragraph>
                  </Row>

                  <Row align={"middle"} justify={"space-between"}>
                    <Typography.Text className={"nm-typo"}>
                      Loại
                    </Typography.Text>

                    <Typography.Paragraph
                      className={"templateSalaryText nm-typo"}
                    >
                      {ConstantsHelper.getPaymentType(
                        transactionDetails?.orderInfo.type as number
                      )}
                    </Typography.Paragraph>
                  </Row>

                  {transactionDetails?.orderInfo?.bankNumber && (
                    <Row align={"middle"} justify={"space-between"}>
                      <Typography.Text className={"nm-typo"}>
                        Số thẻ
                      </Typography.Text>

                      <Typography.Paragraph
                        className={"templateSalaryText nm-typo"}
                      >
                        {transactionDetails?.orderInfo?.bankNumber}
                      </Typography.Paragraph>
                    </Row>
                  )}

                  {transactionDetails?.orderInfo?.bankAccountName && (
                    <Row align={"middle"} justify={"space-between"}>
                      <Typography.Text className={"nm-typo"}>
                        Tên chủ thẻ
                      </Typography.Text>

                      <Typography.Paragraph
                        className={"templateSalaryText nm-typo"}
                      >
                        {transactionDetails?.orderInfo?.bankAccountName}
                      </Typography.Paragraph>
                    </Row>
                  )}

                  <Row align={"middle"} justify={"space-between"}>
                    <Typography.Text className={"nm-typo"}>
                      Ngày tạo giao dịch
                    </Typography.Text>

                    <Typography.Paragraph
                      className={"templateSalaryText nm-typo"}
                    >
                      {transactionDetails?.orderInfo?.createdDate}
                    </Typography.Paragraph>
                  </Row>

                  <Row align={"middle"} justify={"space-between"}>
                    <Typography.Text className={"nm-typo"}>
                      Ngày thanh toán
                    </Typography.Text>

                    <Typography.Paragraph
                      className={"templateSalaryText nm-typo"}
                    >
                      {transactionDetails?.orderInfo?.date}
                    </Typography.Paragraph>
                  </Row>

                  <Divider plain={true} style={{ marginTop: 8 }} />

                  <Row align={"middle"} justify={"space-between"}>
                    <Typography.Text className={"nm-typo"}>
                      Tổng tiền
                    </Typography.Text>

                    <Typography.Paragraph
                      className={"templateSalaryText nm-typo"}
                    >
                      {PriceUtils.display(
                        transactionDetails?.orderInfo?.amount
                      )}
                    </Typography.Paragraph>
                  </Row>
                  {transactionDetails?.orderInfo?.status ===
                    Constants.PAYMENT.STATUS.INCOMPLETE && (
                    <Button
                      type={"primary"}
                      block={true}
                      size={"large"}
                      onClick={() => {
                        if (transactionDetails)
                          onReconfirmPay(transactionDetails);
                      }}
                      disabled={
                        _.isEmpty(
                          transactionDetails?.orderInfo?.paymentMethod
                        ) || submitMutation.isLoading
                      }
                    >
                      {submitMutation.isLoading
                        ? "Xin đợi..."
                        : "Tiếp tục thanh toán"}
                    </Button>
                  )}
                </Space>
              </Space>
            </Col>
          </Row>
        </div>
      </ProfileContainer>
    </RootLayout>
  );
}

export default TransactionDetailsScreen;
