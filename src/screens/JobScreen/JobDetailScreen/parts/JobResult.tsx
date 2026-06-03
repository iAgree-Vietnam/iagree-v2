import {
  Col,
  Descriptions,
  Row,
  Space,
  Tag,
} from "antd";
import {
  FullJobResource,
  JobContractResource,
  ProjectTransactionHistory,
} from "@/src/data/job/models/job.types";
import { JobDetailComponentProps } from "../JobDetailScreen";
import _ from "lodash";
import Constants from "@/src/constants/Constants";
import PriceUtils from "@/src/utils/PriceUtils";
import JobDocuments from "./components/JobDocuments";
import JobHistories from "./components/JobHistories";
import { useBreakpoint } from "@/src/hooks/useBreakpoint";
import { JobReviewItem } from "../components/JobReviewItem";



function JobResult(props: JobDetailComponentProps) {
  const { isMobile } = useBreakpoint();
  const { jobQuery, isCreated, isPartner } = props;
  const fullJobResource: FullJobResource | undefined = jobQuery.data;

  

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

  const clientReview = fullJobResource?.reviews?.find(
    (review) => review.type === Constants.JOB.REVIEW.TYPE.CLIENT
  );
  const partnerReview = fullJobResource?.reviews?.find(
    (review) => review.type === Constants.JOB.REVIEW.TYPE.PARTNER
  );

  return (
    <div>
      {/* <div className={'jobPartContainer'}>
                <Row
                    className="jobPartTitleContainer"
                    align={'middle'}
                    justify={'space-between'}
                >
                    <div className="jobPartTitle">Thông tin hợp đồng</div>

                    <div />
                </Row>

                <Table
                    columns={[
                        {
                            dataIndex: 'contractNo',
                            key: 'contractNo',
                            title: 'Hợp đồng số',
                            render: (value, contractResource: JobContractResource) =>
                                contractResource.body,
                        },
                        {
                            dataIndex: 'contractName',
                            key: 'contractName',
                            title: 'Tên hợp đồng',
                            render: (value, contractResource: JobContractResource) =>
                                contractResource.name,
                        },
                        {
                            dataIndex: 'signDate',
                            key: 'signDate',
                            title: 'Ngày ký',
                            render: (value, contractResource: JobContractResource) =>
                                contractResource.updatedDate,
                        },
                        {
                            dataIndex: 'jobTime',
                            key: 'jobTime',
                            title: 'Thời gian dự án',
                            render: () => fullJobResource?.time?.name,
                        },
                        {
                            dataIndex: 'actions',
                            key: 'actions',
                            title: 'Hành động',
                            align: 'right',
                            fixed: 'right',
                            render: (value, contractResource) => (
                                <Row justify={'end'}>
                                    <Space size={'small'}>
                                        <Button
                                            onClick={() => {
                                                setContract(contractResource);
                                                setShowContractModal(true);
                                            }}
                                            icon={<EyeOutlined />}
                                            className={'btnAction'}
                                        />
                                    </Space>
                                </Row>
                            ),
                        },
                    ]}
                    locale={{ emptyText: 'Không có dữ liệu' }}
                    dataSource={contractResources}
                    pagination={false}
                    size={'small'}
                    scroll={{ x: 'max-content' }}
                />

                <Modal
                    title={contract?.name || 'Chi tiết hợp đồng'}
                    open={showContractModal}
                    onCancel={() => setShowContractModal(false)}
                    width={'1200px'}
                    footer={false}
                >
                    <div>
                        {!_.isEmpty(contract?.fileUrl) ? (
                            <>
                                {!isPdfExtension ? (
                                    <iframe
                                        className={'jobContractPreview'}
                                        frameBorder={0}
                                        src={`https://view.officeapps.live.com/op/embed.aspx?src=${contract?.fileUrl}`}
                                    />
                                ) : (
                                    <PDFViewer
                                        fileUrl={contract?.fileUrl as string}
                                        pageProps={{ width: !isDesktop ? 400 : 875 }}
                                    />
                                )}
                            </>
                        ) : (
                            <Empty description={'Chưa có dữ liệu hợp đồng, xin đợi...'} />
                        )}
                    </div>
                </Modal>
            </div> */}

      <div className={"jobPartContainer"}>
        <Row gutter={16}>
          {isCreated && clientReview && (
            <Col span={12}>
              <Row
                className="jobPartTitleContainer"
                align={"middle"}
                justify={"space-between"}
              >
                <div className="jobPartTitle">Đánh giá của bạn</div>
              </Row>

              <div>
                <Space
                  direction="vertical"
                  size="large"
                  style={{ width: "100%" }}
                >
                  <JobReviewItem reviewData={clientReview} />
                </Space>
              </div>
            </Col>
          )}

          {isPartner && partnerReview && (
            <Col span={isMobile ? 24:12}>
              <Row
                className="jobPartTitleContainer"
                align={"middle"}
                justify={"space-between"}
              >
                <div className="jobPartTitle">Đánh giá của bạn</div>
              </Row>

              <div>
                <Space
                  direction="vertical"
                  size="large"
                  style={{ width: "100%" }}
                >
                  <JobReviewItem reviewData={partnerReview} />
                </Space>
              </div>
            </Col>
          )}
        </Row>
      </div>

      {props.isCreated && (
        <div className={"jobPartContainer"}>
          <Row
            className="jobPartTitleContainer"
            align={"middle"}
            justify={"space-between"}
          >
            <div className="jobPartTitle">Chi tiết giao dịch</div>
          </Row>

          <div>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              {fullJobResource!?.projectTransactionHistory?.map(
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
          </div>
        </div>
      )}

      <div className={"jobPartContainer"}>
        <Row
          align={"middle"}
          justify={"space-between"}
          className={"jobPartTitleContainer"}
        >
          <div className="jobPartTitle">Kết quả công việc gần nhất</div>
        </Row>

        <div className="jobPartContent">
          <JobDocuments
            {...props}
            job={fullJobResource!}
            data={
              [
                Constants.JOB.STATUS.CHO_NGHIEM_THU,
                Constants.JOB.STATUS.DA_NGHIEM_THU,
                Constants.JOB.STATUS.CHO_TAT_TOAN,
                Constants.JOB.STATUS.THANH_TOAN_PARTNER,
                Constants.JOB.STATUS.DUYET_HOAN_THANH_CV,
              ].includes(fullJobResource!?.status)
                ? fullJobResource!?.results
                : []
            }
            loading={jobQuery.isFetching}
            canDownload={true}
            canEdit={false}
            canDelete={false}
          />
        </div>
      </div>

      <div className={"jobPartContainer"}>
        <div className={"jobPartTitleContainer"}>
          <div className="jobPartTitle">Lịch sử nghiệm thu</div>
        </div>

        <div className="jobPartContent">
          <JobHistories job={fullJobResource!} />
        </div>
      </div>

      {/* {props.isCreated && (
                <div className={'jobPartContainer'}>
                    <Row
                        className="jobPartTitleContainer"
                        align={'middle'}
                        justify={'space-between'}
                    >
                        <div className="jobPartTitle">Thông tin thanh toán</div>
                    </Row>

                    <div>
                        <Table
                            columns={[
                                {
                                    dataIndex: 'type',
                                    key: 'type',
                                    title: 'Loại thanh toán',
                                    render: (value, record) =>
                                        record.type === Constants.JOB.PAYMENT_TYPE.TOTAL ? (
                                            <Typography.Text type={'danger'}>
                                                {typeLabel[value]}
                                            </Typography.Text>
                                        ) : (
                                            typeLabel[value]
                                        ),
                                },
                                {
                                    dataIndex: 'totalAmount',
                                    key: 'totalAmount',
                                    title: 'Tổng tiền chờ thanh toán',
                                    align: 'right',
                                    render: (value, record) =>
                                        record.type === Constants.JOB.PAYMENT_TYPE.TOTAL ? (
                                            <Typography.Text type={'danger'}>{value}</Typography.Text>
                                        ) : (
                                            value
                                        ),
                                },
                                {
                                    dataIndex: 'totalAmountSuccess',
                                    key: 'totalAmountSuccess',
                                    title: 'Tổng tiền đã thanh toán',
                                    align: 'right',
                                    render: (value, record) =>
                                        record.type === Constants.JOB.PAYMENT_TYPE.TOTAL ? (
                                            <Typography.Text type={'danger'}>{value}</Typography.Text>
                                        ) : (
                                            value
                                        ),
                                },
                                {
                                    dataIndex: 'totalAmountPending',
                                    key: 'totalAmountPending',
                                    title: 'Tổng số tiền còn thiếu',
                                    align: 'right',
                                    render: (value, record) =>
                                        record.type === Constants.JOB.PAYMENT_TYPE.TOTAL ? (
                                            <Typography.Text type={'danger'}>{value}</Typography.Text>
                                        ) : (
                                            value
                                        ),
                                },
                            ]}
                            locale={{ emptyText: 'Không có dữ liệu' }}
                            dataSource={paymentOverview}
                            rowKey={'type'}
                            pagination={false}
                            size={'small'}
                            scroll={{ x: 'max-content' }}
                        />
                    </div>
                </div>
            )} */}

      {/* {props.isCreated && (
                <div className={'jobPartContainer'}>
                    <Row
                        className="jobPartTitleContainer"
                        align={'middle'}
                        justify={'space-between'}
                    >
                        <div className="jobPartTitle">Lịch sử thanh toán</div>
                    </Row>

                    <div>
                        <Table
                            columns={[
                                {
                                    dataIndex: 'paymentType',
                                    key: 'paymentType',
                                    title: 'Loại thanh toán',
                                },
                                {
                                    dataIndex: 'price',
                                    key: 'price',
                                    title: 'Số tiền',
                                    render: (value) => PriceUtils.display(value),
                                    align: 'right',
                                },
                                {
                                    dataIndex: 'status',
                                    key: 'status',
                                    title: 'Trạng thái',
                                    align: 'center',
                                },
                                {
                                    dataIndex: 'createdAt',
                                    key: 'createdAt',
                                    title: 'Ngày lập',
                                    align: 'center',
                                },
                                {
                                    dataIndex: 'updatedAt',
                                    key: 'updatedAt',
                                    title: 'Ngày thanh toán',
                                    render: (value) => value || '...',
                                    align: 'center',
                                },
                            ]}
                            locale={{ emptyText: 'Không có dữ liệu' }}
                            dataSource={fullJobResource?.projectTransactionHistory || []}
                            rowKey={'id'}
                            pagination={false}
                            size={'small'}
                            scroll={{ x: 'max-content' }}
                        />
                    </div>
                </div>
            )} */}
    </div>
  );
}

export default JobResult;
