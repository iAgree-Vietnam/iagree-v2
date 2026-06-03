import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
    Breadcrumb,
    Button,
    Col,
    List,
    Row,
    Space,
    Spin,
    Typography,
} from 'antd';
import { CloseOutlined } from '@ant-design/icons';

import RootLayout from '@/src/layouts/RootLayout';
import DocumentRouteUtils from '@/src/data/document/utils/DocumentRouteUtils';
import DocumentSharedRejectModal, {
    DocumentSharedRejectModalizeHelperVisible,
} from '../DocumentSharedScreen/modals/DocumentSharedRejectModal';
import useShareDocumentPreview from '../DocumentSharedScreen/hooks/useShareDocumentPreview';
import usePaginatedSharedDocuments from '../DocumentSharedScreen/hooks/usePaginatedSharedDocuments';
import { IconSvgLocal } from '@/src/components/icon-svg-local';
import CommentInput from './components/CommentInput';
import CommentItemNew from './components/CommentItemNew';
import useComments from './hooks/useComments';
import dynamic from 'next/dynamic';
import { useBreakpoint } from '@/src/hooks/useBreakpoint';

const PDFViewer = dynamic(
    () => import('@/src/components/pdf-viewer/PDFViewer'),
    {
        ssr: false,
    }
);

function DocumentSharedDetailsScreen(props: any) {
    const documentShareId = props.data.documentShareId;

    const { isDesktop } = useBreakpoint();

    const [fileUrl, setFileUrl] = useState<string | null>(null);

    const router = useRouter();

    const documentQuery = usePaginatedSharedDocuments();

    const previewMutation = useShareDocumentPreview({
        onSuccess: (data) => setFileUrl(data),
    });

    useEffect(() => {
        if (documentShareId) previewMutation.mutate(documentShareId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [documentShareId]);

    function renderView() {
        if (previewMutation.isLoading || !fileUrl) {
            return (
                <div className={'templatePreviewLoading'}>
                    <div className={'templatePreviewLoadingSpin'}>
                        <Spin size={'small'} />
                    </div>

                    <Typography.Paragraph>
                        Đang tải bản xem trước, xin đợi...
                    </Typography.Paragraph>
                </div>
            );
        }

        return (
            <PDFViewer
                fileUrl={fileUrl as string}
                pageProps={{ width: !isDesktop ? 400 : 875 }}
            />
        );
    }

    const documentSharedRejectModalRef =
        useRef<DocumentSharedRejectModalizeHelperVisible | null>(null);

    const documentShareResource = documentQuery.data.find(
        (i) => i.documentShareId == documentShareId
    );

    const commentsQuery = useComments(documentShareResource?.documentId);

    return (
        <RootLayout>
            <Head>
                <title>{`Văn bản ${documentShareResource?.name || 'được chia sẻ'
                    }`}</title>
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
                                title: (
                                    <Link href={DocumentRouteUtils.toSharedScreen({})}>
                                        Văn bản được chia sẻ
                                    </Link>
                                ),
                            },
                            { title: documentShareResource?.name },
                        ]}
                    />
                </div>
            </section>

            <div>
                <section className={'sectionContainer editorTitleWrapper'}>
                    <div className="contentWrapper">
                        <Row gutter={[10, 0]}>
                            <Col xs={24} sm={24} md={24} lg={18} xl={18} xxl={18}>
                                <Typography.Title className={'title'} level={1}>
                                    {documentShareResource?.name}
                                </Typography.Title>
                            </Col>

                            <Col xs={24} sm={24} md={24} lg={6} xl={6} xxl={6}>
                                <div className={'editorTitleExtraContainer'}>
                                    <Space size={'middle'}>
                                        <Button
                                            type={'default'}
                                            icon={<CloseOutlined />}
                                            onClick={() => {
                                                if (documentShareResource) {
                                                    documentSharedRejectModalRef.current?.open({
                                                        documentResource: documentShareResource,
                                                        successCallback: () =>
                                                            router.push(
                                                                DocumentRouteUtils.toSharedScreen({})
                                                            ),
                                                    });
                                                }
                                            }}
                                            danger
                                        >
                                            Từ chối văn bản
                                        </Button>
                                    </Space>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </section>

                <section
                    className={
                        'sectionContainer editorWrapper documentSharedDetailsContainer'
                    }
                >
                    <div className={'contentWrapper documentSharedWrapper'}>
                        <div className="previewWrapper">{renderView()}</div>
                    </div>
                </section>
                <section className={'sectionContainer'}>
                    <div className="contentWrapper">
                        <Row gutter={[40, 40]}>
                            <Col xs={24} lg={16}>
                                <div
                                    style={{
                                        padding: '40px',
                                        borderRadius: '20px',
                                        border: '1px solid #D4D4D4',
                                    }}
                                >
                                    <Typography.Title level={3} style={{ marginBottom: '16px' }}>
                                        Bình luận ({commentsQuery?.data?.length || 0})
                                    </Typography.Title>
                                    <List
                                        grid={{ column: 1 }}
                                        loading={commentsQuery.isFetching}
                                        dataSource={commentsQuery.data}
                                        locale={{ emptyText: 'Không có dữ liệu' }}
                                        renderItem={(comment, index) => {
                                            const isLastItem =
                                                commentsQuery?.data?.length === index + 1;
                                            return (
                                                <List.Item>
                                                    <div
                                                        style={{
                                                            borderBottom: isLastItem
                                                                ? 'none'
                                                                : '1px solid #EFF0F3',
                                                            paddingBottom: isLastItem ? 0 : '20px',
                                                        }}
                                                    >
                                                        <CommentItemNew comment={comment} />
                                                    </div>
                                                </List.Item>
                                            );
                                        }}
                                    />
                                </div>
                            </Col>
                            <Col xs={24} lg={8}>
                                <div
                                    style={{
                                        padding: '30px',
                                        borderRadius: '20px',
                                        border: '1px solid #D4D4D4',
                                    }}
                                >
                                    <Typography.Title level={4} style={{ marginBottom: '20px' }}>
                                        Viết bình luận
                                    </Typography.Title>
                                    <CommentInput documentId={documentShareId} />
                                </div>
                            </Col>
                        </Row>
                    </div>
                </section>
            </div>

            <DocumentSharedRejectModal ref={documentSharedRejectModalRef} />
        </RootLayout>
    );
}

export default DocumentSharedDetailsScreen;
