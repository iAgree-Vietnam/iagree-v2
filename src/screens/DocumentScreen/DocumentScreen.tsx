import React, { useRef, useState } from 'react';
import RootLayout from '@/src/layouts/RootLayout';
import Head from 'next/head';
import {
    Breadcrumb,
    Button,
    Col,
    Form,
    Input,
    Row,
    Space,
    Table,
    Typography,
} from 'antd';
import Constants from '@/src/constants/Constants';
import usePaginatedDocuments from '@/src/screens/DocumentScreen/hooks/usePaginatedDocuments';
import Link from 'next/link';
import {
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    ShareAltOutlined,
    UploadOutlined,
} from '@ant-design/icons';
import {
    DocumentFilterParams,
    DocumentResource,
} from '@/src/data/document/models/document.types';
import DocumentRouteUtils from '@/src/data/document/utils/DocumentRouteUtils';
import DocumentUploadModal, {
    DocumentUploadModalHelperVisible,
} from '@/src/screens/DocumentScreen/modals/DocumentUploadModal';
import DocumentShareModal, {
    DocumentShareModalizeHelperVisible,
} from './DocumentEditScreen/modals/DocumentShareModal';
import DocumentSidebarRoutes from './components/DocumentSidebarRoutes';
import { IconSvgLocal } from '@/src/components/icon-svg-local';
import DocumentDeleteModal, {
    DocumentDeleteModalizeHelperVisible,
} from './modals/DocumentDeteleModal';
import { useBreakpoint } from '@/src/hooks/useBreakpoint';

function DocumentScreen(props: any) {
    const { isDesktop } = useBreakpoint();
    const documentShareModalRef =
        useRef<DocumentShareModalizeHelperVisible | null>(null);
    const documentUploadModalRef =
        useRef<DocumentUploadModalHelperVisible | null>(null);
    const documentDeleteModalRef =
        useRef<DocumentDeleteModalizeHelperVisible | null>(null);

    const [search, setSearch] = useState<string | null>(null);
    const [filters, setFilters] = useState<DocumentFilterParams>({
        page: 1,
        search: null,
    });

    const documentQuery = usePaginatedDocuments({ filters });

    function goSearch() {
        setFilters((prevState) => ({ ...prevState, search: search }));
    }

    function onShare(documentResource: DocumentResource) {
        documentShareModalRef.current?.open(documentResource);
    }

    return (
        <RootLayout>
            <Head>
                <title>Văn bản của tôi</title>
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
                                title: 'Văn bản của tôi',
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
                                    statusId={Constants.TEMPLATE.STATUS.ALL}
                                />
                            </div>
                        </Col>

                        <Col xs={24} lg={18}>
                            <Space
                                size={40}
                                direction={'vertical'}
                                className={'jobListContainer d-flex'}
                            >
                                <Row
                                    justify={'space-between'}
                                    align={'middle'}
                                    gutter={[20, 20]}
                                >
                                    <Col>
                                        <Typography.Title level={3} className={'title nm-typo'}>
                                            Văn bản của tôi
                                        </Typography.Title>
                                    </Col>
                                    <Col span={!isDesktop ? 24 : 'auto'}>
                                        <Button
                                            size={'middle'}
                                            type={'default'}
                                            onClick={() => documentUploadModalRef.current?.open()}
                                            icon={<UploadOutlined />}
                                            block
                                        >
                                            Upload văn bản
                                        </Button>
                                    </Col>
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
                                            render: (value, documentResource: DocumentResource) => {
                                                return (
                                                    <Link
                                                        href={DocumentRouteUtils.toEditUrl(
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
                                            render: (value, documentResource: DocumentResource) => {
                                                return (
                                                    <Row justify={'end'}>
                                                        <Space size={'small'} align={'end'}>
                                                            <Link
                                                                href={DocumentRouteUtils.toEditUrl(
                                                                    documentResource
                                                                )}
                                                            >
                                                                <Button
                                                                    className={'btnAction'}
                                                                    icon={<EyeOutlined />}
                                                                />
                                                            </Link>

                                                            <Link
                                                                href={DocumentRouteUtils.toEditUrl(
                                                                    documentResource
                                                                )}
                                                            >
                                                                <Button
                                                                    icon={<EditOutlined />}
                                                                    className={'btnAction'}
                                                                />
                                                            </Link>

                                                            <Button
                                                                className={'btnAction'}
                                                                icon={<ShareAltOutlined />}
                                                                onClick={() => onShare(documentResource)}
                                                            />

                                                            <Button
                                                                className={'btnAction'}
                                                                icon={<DeleteOutlined />}
                                                                onClick={() =>
                                                                    documentDeleteModalRef.current?.open(
                                                                        documentResource
                                                                    )
                                                                }
                                                            />
                                                        </Space>
                                                    </Row>
                                                );
                                            },
                                        },
                                    ]}
                                    locale={{
                                        emptyText: (
                                            <Space
                                                direction={'vertical'}
                                                className={'d-flex'}
                                                size={30}
                                            >
                                                <Typography.Title
                                                    level={5}
                                                    className={'nm-typo text-center'}
                                                    style={{ marginTop: '14px' }}
                                                >
                                                    Bạn chưa tải lên văn bản nào.
                                                    <br />
                                                    Hãy bắt đầu bằng cách tải lên để sử dụng ngay!
                                                </Typography.Title>
                                            </Space>
                                        ),
                                    }}
                                    dataSource={documentQuery.data.items}
                                    loading={documentQuery.isFetching}
                                    pagination={{
                                        total: documentQuery.data.total,
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

            <>
                <DocumentUploadModal ref={documentUploadModalRef} />
                <DocumentShareModal ref={documentShareModalRef} />
                <DocumentDeleteModal ref={documentDeleteModalRef} />
            </>
        </RootLayout>
    );
}

export default DocumentScreen;
