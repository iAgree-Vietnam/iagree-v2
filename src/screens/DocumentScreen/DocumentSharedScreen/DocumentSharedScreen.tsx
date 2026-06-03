import React, { useRef, useState } from 'react';
import RootLayout from '@/src/layouts/RootLayout';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
    Breadcrumb,
    Button,
    Col,
    Form,
    Input,
    Row,
    Space,
    Table,
    Tooltip,
    Typography,
} from 'antd';
import { EyeOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';

import Constants from '@/src/constants/Constants';
import usePaginatedSharedDocuments from '@/src/screens/DocumentScreen/DocumentSharedScreen/hooks/usePaginatedSharedDocuments';
import useApproveShareDocument from '@/src/screens/DocumentScreen/DocumentSharedScreen/hooks/useApproveShareDocument';
import {
    DocumentFilterParams,
    DocumentSharedResource,
} from '@/src/data/document/models/document.types';
import DocumentRouteUtils from '@/src/data/document/utils/DocumentRouteUtils';
import DocumentSharedRejectModal, {
    DocumentSharedRejectModalizeHelperVisible,
} from './modals/DocumentSharedRejectModal';
import DocumentSidebarRoutes from '../components/DocumentSidebarRoutes';
import { IconSvgLocal } from '@/src/components/icon-svg-local';
import TemplateRouteUtils from '@/src/data/template/utils/TemplateRouteUtils';

function DocumentSharedScreen(props: any) {
    const router = useRouter();

    const documentSharedRejectModalRef =
        useRef<DocumentSharedRejectModalizeHelperVisible | null>(null);

    const [search, setSearch] = useState<string | null>(null);
    const [filters, setFilters] = useState<DocumentFilterParams>({
        page: 1,
        search: null,
    });

    const documentQuery = usePaginatedSharedDocuments();

    const approveShareMutation = useApproveShareDocument();

    function goSearch() {
        setFilters((prevState) => ({ ...prevState, search: search }));
    }

    const dataSource = documentQuery.data.filter(
        (i) =>
            i.status === Constants.DOCUMENT.SHARE_STATUS.APPROVED ||
            i.status === Constants.DOCUMENT.SHARE_STATUS.SHARE
    );

    return (
        <RootLayout>
            <Head>
                <title>Văn bản được chia sẻ</title>
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
                            {
                                title: 'Văn bản được chia sẻ',
                            },
                        ]}
                    />
                </div>
            </section>

            <section className={'sectionContainer jobManage'}>
                <div className="contentWrapper">
                    <Row gutter={[60, 24]}>
                        <Col xs={24} lg={6}>
                            <div className={'desktopFilterContainer'}>
                                <DocumentSidebarRoutes
                                    statusId={Constants.TEMPLATE.STATUS.PAID}
                                />
                            </div>
                        </Col>

                        <Col xs={24} lg={18}>
                            <Space
                                size={40}
                                direction={'vertical'}
                                className={'jobListContainer d-flex'}
                            >
                                <Row justify={'space-between'} align={'middle'}>
                                    <Typography.Title level={3} className={'title nm-typo'}>
                                        Văn bản được chia sẻ
                                    </Typography.Title>
                                </Row>

                                <div className={'searchContainer'}>
                                    <Form.Item label={'Tìm văn bản'} layout={'vertical'}>
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
                                                    onClick={() => goSearch()}
                                                    fill={'#25272D'}
                                                />
                                            }
                                        />
                                    </Form.Item>
                                </div>

                                <Table
                                    rowKey={'documentId'}
                                    columns={[
                                        {
                                            key: 'index',
                                            dataIndex: 'index',
                                            title: 'STT',
                                            width: 60,
                                            render: (value, record, index) => index + 1,
                                        },
                                        {
                                            key: 'name',
                                            dataIndex: 'name',
                                            title: 'Tên văn bản',
                                            render: (
                                                value,
                                                documentResource: DocumentSharedResource
                                            ) => {
                                                return documentResource.status ===
                                                    Constants.DOCUMENT.SHARE_STATUS.APPROVED ? (
                                                    <Link
                                                        href={DocumentRouteUtils.toSharedDetailsUrl(
                                                            documentResource
                                                        )}
                                                    >
                                                        <Typography.Paragraph
                                                            strong={true}
                                                            className={'nm-typo'}
                                                            ellipsis={{ rows: 2, tooltip: value }}
                                                        >
                                                            {value}
                                                        </Typography.Paragraph>
                                                    </Link>
                                                ) : (
                                                    <Typography.Paragraph
                                                        strong={true}
                                                        className={'nm-typo'}
                                                        ellipsis={{ rows: 2, tooltip: value }}
                                                    >
                                                        {value}
                                                    </Typography.Paragraph>
                                                );
                                            },
                                        },
                                        {
                                            key: 'updatedDate',
                                            dataIndex: 'updatedDate',
                                            title: 'Lần sửa cuối',
                                            width: 180,
                                        },
                                        {
                                            key: 'actions',
                                            dataIndex: 'actions',
                                            title: 'Hành động',
                                            fixed: 'right',
                                            align: 'right',
                                            width: 180,
                                            render: (
                                                value,
                                                documentResource: DocumentSharedResource
                                            ) => {
                                                return (
                                                    <Row justify={'end'}>
                                                        <Space size={'small'} align={'end'}>
                                                            {documentResource.status ===
                                                                Constants.DOCUMENT.SHARE_STATUS.APPROVED && (
                                                                    <Tooltip title="Xem văn bản">
                                                                        <Button
                                                                            className={'btnAction'}
                                                                            icon={<EyeOutlined />}
                                                                            onClick={() =>
                                                                                router.push(
                                                                                    DocumentRouteUtils.toSharedDetailsUrl(
                                                                                        documentResource
                                                                                    )
                                                                                )
                                                                            }
                                                                        />
                                                                    </Tooltip>
                                                                )}

                                                            {documentResource.status ===
                                                                Constants.DOCUMENT.SHARE_STATUS.SHARE && (
                                                                    <Tooltip title="Đồng ý văn bản">
                                                                        <Button
                                                                            className={'btnAction'}
                                                                            icon={<CheckOutlined />}
                                                                            onClick={() =>
                                                                                approveShareMutation.mutate(
                                                                                    documentResource.documentShareId
                                                                                )
                                                                            }
                                                                        />
                                                                    </Tooltip>
                                                                )}
                                                            {documentResource.status !==
                                                                Constants.DOCUMENT.SHARE_STATUS.REJECTED && (
                                                                    <Tooltip title="Từ chối văn bản">
                                                                        <Button
                                                                            className={'btnAction'}
                                                                            icon={<CloseOutlined />}
                                                                            onClick={() => {
                                                                                documentSharedRejectModalRef.current?.open(
                                                                                    { documentResource }
                                                                                );
                                                                            }}
                                                                        />
                                                                    </Tooltip>
                                                                )}
                                                        </Space>
                                                    </Row>
                                                );
                                            },
                                        },
                                    ]}
                                    dataSource={dataSource}
                                    loading={documentQuery.isFetching}
                                    locale={{
                                        emptyText: (
                                            <Space direction={'vertical'} className={'d-flex'} size={30}>
                                                <Typography.Title level={5} className={'nm-typo text-center'} style={{ marginTop: '14px' }}>
                                                    Bạn chưa được chia sẻ văn bản nào.
                                                    <br />
                                                    Khám phá kho văn bản chuyên nghiệp của chúng tôi để tìm
                                                    những tài liệu phù hợp với nhu cầu của bạn!
                                                </Typography.Title>
                                                <Link href={TemplateRouteUtils.toScreen({})}>
                                                    <Button type={'primary'} size={'large'}>Tìm văn bản ngay</Button>
                                                </Link>
                                            </Space>
                                        ),
                                    }}
                                    pagination={{
                                        total: dataSource.length,
                                        current: filters.page,
                                        pageSize: 10,
                                        hideOnSinglePage: true,
                                        showSizeChanger: false,
                                        position: ['bottomCenter'],
                                        onChange: (pageNumber) =>
                                            setFilters((prevState) => ({
                                                ...prevState,
                                                page: pageNumber,
                                            })),
                                    }}
                                    scroll={{ x: 'max-content' }}
                                />
                            </Space>
                        </Col>
                    </Row>
                </div>
            </section>

            <DocumentSharedRejectModal ref={documentSharedRejectModalRef} />
        </RootLayout>
    );
}

export default DocumentSharedScreen;
