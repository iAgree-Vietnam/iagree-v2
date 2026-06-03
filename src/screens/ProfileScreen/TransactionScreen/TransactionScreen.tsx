import React, { useCallback, useState } from 'react';
import RootLayout from '@/src/layouts/RootLayout';
import Head from 'next/head';
import {
    Breadcrumb,
    Button,
    Dropdown,
    Form,
    Input,
    Modal,
    Row,
    Space,
    Table,
    Tag,
    Tooltip,
} from 'antd';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
    DeleteOutlined,
    UndoOutlined,
    EyeOutlined,
    DownOutlined,
} from '@ant-design/icons';
// import Cookies from 'js-cookie';

import { ProfileContainer } from '@/src/components/ProfileContainer';
import usePaginatedTransactions from '@/src/screens/ProfileScreen/TransactionScreen/hooks/usePaginatedTransactions';
import { ConstantsHelper } from '@/src/constants/ConstantsHelper';
import PriceUtils from '@/src/utils/PriceUtils';
import Constants from '@/src/constants/Constants';
// import usePaymentConfirm from '@/src/screens/PaymentScreen/hooks/usePaymentConfirm';
import { TransactionResource } from '@/src/data/payment/models/transaction.types';
import DialogUtils from '@/src/utils/DialogUtils';
import AuthRouteUtils from '@/src/data/auth/utils/AuthRouteUtils';
import { useDeleteTransaction } from './hooks/useDeleteTransaction';
import PricingRouteUtils from '@/src/data/pricing/utils/PricingRouteUtils';
import TemplateRouteUtils from '@/src/data/template/utils/TemplateRouteUtils';
import { IconSvgLocal } from '@/src/components/icon-svg-local';

interface DeleteModalState {
    open: boolean;
    orderId: string | null;
}

const searchTypes = [
    { label: 'ID giao dịch', key: Constants.TRANSACTION_SEARCH_TYPE.ORDER_ID },
    { label: 'Tên giao dịch', key: Constants.TRANSACTION_SEARCH_TYPE.NAME },
];

function TransactionScreen(props: any) {
    const router = useRouter();
    const [filters, setFilters] = useState({ page: 1 });

    const [deleteModal, setDeleteModal] = useState<DeleteModalState>({
        open: false,
        orderId: null,
    });
    const [search, setSearch] = useState<string | null>(null);
    const [searchType, setSearchType] = useState<string>(
        Constants.TRANSACTION_SEARCH_TYPE.NAME.toString()
    );

    const transactionQuery = usePaginatedTransactions({ filters });

    // const submitMutation = usePaymentConfirm();
    const deleteMutation = useDeleteTransaction();

    function onReconfirmPay(transaction: TransactionResource) {
        // Cookies.remove(Constants.KEY_PAYMENT_TYPE);
        // submitMutation.mutate({
        //     productId: transaction.typeId,
        //     productType: transaction.type,
        //     methodCode: transaction.paymentMethod || '',
        //     clientIp: '',
        // });

        switch (transaction.type) {
            case Constants.PAYMENT.TYPE.ACCOUNT_SERVICE: {
                //@ts-ignore
                return router.push(PricingRouteUtils.toPaymentUpgradeAccountUrl({ name: transaction.name, packageId: transaction.typeId }));
            }
            case Constants.PAYMENT.TYPE.E_SIGNATURE: {
                //@ts-ignore
                return router.push(PricingRouteUtils.toPaymentESignatureUrl({ name: transaction.name, packageId: transaction.typeId }));
            }
            case Constants.PAYMENT.TYPE.JOB: {
                return router.push(PricingRouteUtils.toPaymentJobsUrl(transaction));
            }
            case Constants.PAYMENT.TYPE.CONNECT: {
                //@ts-ignore
                return router.push(PricingRouteUtils.toPaymentConnectsUrl({ name: transaction.name, packageId: transaction.typeId }));
            }
            default: {
                return router.push(TemplateRouteUtils.toPaymentUrl({ name: transaction.name, templateId: transaction.typeId }))
            }
        }
    }

    const handleOpenDeleteModal = useCallback(
        (orderId: string) => setDeleteModal({ open: true, orderId }),
        []
    );

    const onDeleteTransaction = useCallback(async () => {
        if (deleteModal.orderId) {
            await deleteMutation.mutateAsync(deleteModal.orderId);
            setDeleteModal({ open: false, orderId: null });
        } else DialogUtils.showResponseError({}, 'TRANSACTION_DELETE');
    }, [deleteModal.orderId, deleteMutation]);

    const goSearch = useCallback(async () => {
        setFilters((prevState: any) => {
            const newState = {
                ...prevState,
                name: search,
                order_id: search,
                page: 1,
            };
            if (searchType === Constants.TRANSACTION_SEARCH_TYPE.NAME.toString()) {
                delete newState.order_id;
            }
            if (
                searchType === Constants.TRANSACTION_SEARCH_TYPE.ORDER_ID.toString()
            ) {
                delete newState.name;
            }
            return newState;
        });
    }, [search, searchType]);

    return (
        <RootLayout>
            <Head>
                <title>Quản lý giao dịch</title>
            </Head>

            <section className={'breadcrumbContainer'}>
                <div className="contentWrapper">
                    <Breadcrumb
                        items={[
                            {
                                title: (
                                    <>
                                        <IconSvgLocal name={'IC_HOME'} />
                                        <span>Trang chủ</span>
                                    </>
                                ),
                                href: '/',
                            },
                            { title: 'Quản lý giao dịch' },
                        ]}
                    />
                </div>
            </section>
            <ProfileContainer>
                <h1 className={'pageHeaderTitle'}>Quản lý giao dịch</h1>
                <div className={'searchContainer'} style={{ marginBottom: '40px' }}>
                    <Form.Item label={'Tìm giao dịch'} layout={'vertical'}>
                        <Input
                            value={search || ''}
                            onChange={(e) => setSearch(e.target.value)}
                            onPressEnter={() => goSearch()}
                            size={'large'}
                            placeholder={'Nhập từ khóa tìm kiếm'}
                            suffix={
                                <IconSvgLocal
                                    name={'IC_SEARCH'}
                                    width={20}
                                    height={20}
                                    onClick={goSearch}
                                    fill={'#25272D'}
                                />
                            }
                            prefix={
                                <Dropdown trigger={['click']} menu={{ items: searchTypes, selectedKeys: [searchType], onClick: ({ key }) => setSearchType(key) }}>
                                    <Space style={{ width: '124px', paddingLeft: '4px', cursor: 'pointer' }}>
                                        {searchTypes.find((item) => item.key.toString() === searchType)?.label}
                                        <DownOutlined style={{ fontSize: '12px' }} />
                                    </Space>
                                </Dropdown>
                            }
                        />
                    </Form.Item>
                </div>
                <Table
                    columns={[
                        {
                            key: 'orderId',
                            dataIndex: 'orderId',
                            title: 'ID giao dịch',
                            render: (orderId: string) => (
                                <div style={{ wordBreak: 'break-all' }}>
                                    {orderId.toUpperCase()}
                                </div>
                            ),
                            width: '160px',
                        },
                        {
                            key: 'name',
                            dataIndex: 'name',
                            title: 'Sản phẩm/dịch vụ',
                        },
                        {
                            key: 'type',
                            dataIndex: 'type',
                            title: 'Loại',
                            align: 'center',
                            render: (type: number) => ConstantsHelper.getPaymentType(type),
                        },
                        {
                            key: 'productSubTotal',
                            dataIndex: 'productSubTotal',
                            title: 'Đơn giá',
                            render: (productSubTotal: number) => PriceUtils.display(productSubTotal),
                            align: 'right',
                            width: '120px',
                        },
                        {
                            key: 'status',
                            dataIndex: 'status',
                            title: 'Trạng thái',
                            align: 'center',
                            render: (statusId: number) => {

                                const isSuccess = statusId === Constants.PAYMENT.STATUS.COMPLETE

                                return (
                                    <Tag color={isSuccess ? '#09993E' : '#979797'} style={{ marginInlineEnd: 0, width: '88px', textAlign: 'center' }}>
                                        {isSuccess ? 'Thành công' : 'Chưa hoàn tất'}
                                    </Tag>
                                );
                            },
                        },
                        {
                            key: 'createdDate',
                            dataIndex: 'createdDate',
                            title: 'Ngày tạo giao dịch',
                            align: 'center',
                        },
                        {
                            key: 'date',
                            dataIndex: 'date',
                            title: 'Ngày thanh toán',
                            align: 'center',
                        },
                        {
                            key: 'actions',
                            dataIndex: 'actions', 
                            title: 'Hành động',
                            fixed: 'right',
                            align: 'right',
                            render: (value, record) => {
                                return (
                                    <Row justify={'end'}>
                                        <Space size={'small'} align={'end'}>
                                            {record.status === Constants.PAYMENT.STATUS.INCOMPLETE 
                                                || record.status === Constants.PAYMENT.STATUS.REJECT ? (
                                                <>
                                                    <Tooltip title="Chuyển đến trang thanh toán">
                                                        <Button
                                                            className={'btnAction'}
                                                            icon={<UndoOutlined />}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onReconfirmPay(record);
                                                            }}
                                                        />
                                                    </Tooltip>

                                                    {record.type !== Constants.PAYMENT.TYPE.JOB && (
                                                        <Button
                                                            className={'btnAction'}
                                                            icon={<DeleteOutlined />}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleOpenDeleteModal(record.orderId);
                                                            }}
                                                        />
                                                    )}
                                                </>
                                            ) : (
                                                <Link
                                                    href={AuthRouteUtils.toTransactionDetails(record)}
                                                >
                                                    <Button icon={<EyeOutlined />} className={'btnAction'} />
                                                </Link>
                                            )}
                                        </Space>
                                    </Row>
                                );
                            },
                        },
                    ]}
                    dataSource={transactionQuery.data.items}
                    onRow={(record) => ({
                        onClick: () =>
                            router.push(AuthRouteUtils.toTransactionDetails(record)),
                        style: { cursor: 'pointer' },
                    })}
                    rowKey={'orderId'}
                    loading={transactionQuery.isFetching}
                    size={'small'}
                    pagination={{
                        size: 'default',
                        current: filters.page,
                        pageSize: 10,
                        total: transactionQuery.data.total,
                        showSizeChanger: false,
                        hideOnSinglePage: true,
                        position: ['bottomCenter'],
                        onChange: (pageNumber) =>
                            setFilters((prevState) => ({ ...prevState, page: pageNumber })),
                    }}
                    scroll={{ x: 'max-content' }}
                />
            </ProfileContainer>
            <Modal
                title={'Xóa giao dịch'}
                open={deleteModal.open}
                cancelText={'Đóng'}
                onCancel={() => setDeleteModal({ open: false, orderId: null })}
                okText={'Xóa'}
                onOk={onDeleteTransaction}
                centered={true}
            >
                Bạn có chắc chắn muốn xóa giao dịch này
            </Modal>
        </RootLayout>
    );
}

export default TransactionScreen;
