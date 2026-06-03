import React, { useRef } from 'react';
import RootLayout from '@/src/layouts/RootLayout';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import {
    DocumentDetailInitResource,
    DocumentDirectPreviewParams,
    DocumentResource,
} from '@/src/data/document/models/document.types';
import { SampleDocumentResource } from '@/src/data/template/models/template.types';
import {
    Affix,
    Breadcrumb,
    Button,
    Col,
    Dropdown,
    Form,
    Image,
    List,
    Row,
    Space,
    Typography,
} from 'antd';
import { useAccountContext } from '@/src/contexts/AccountContext';
import useSaveAsTemplate from '@/src/screens/TemplateScreen/TemplateDetailScreen/hooks/useSaveAsTemplate';
import useTemplateDownload from '@/src/screens/TemplateScreen/TemplateDetailScreen/hooks/useTemplateDownload';
import {
    DeleteOutlined,
    DownloadOutlined,
    DownOutlined,
    EditOutlined,
    EyeOutlined,
    SaveOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import Images from '@/src/constants/Images';
import useUpdateDocument from '@/src/screens/DocumentScreen/DocumentEditScreen/hooks/useUpdateDocument';
import Constants from '@/src/constants/Constants';
import SideRight from '../DocumentSharedDetailsScreen/components/SideRight';
import useCreateContractFromDocument from '@/src/screens/DocumentScreen/DocumentEditScreen/hooks/useCreateContractFromDocument';
import DocumentShareModal, {
    DocumentShareModalizeHelperVisible,
} from './modals/DocumentShareModal';
import { IconSvgLocal } from '@/src/components/icon-svg-local';
import DocumentDeleteModal, {
    DocumentDeleteModalizeHelperVisible,
} from '../modals/DocumentDeteleModal';
import { withThemeRevert } from '@/theme';
import DocumentPreviewModal, {
    ModalizeDocumentPreviewHelperVisible,
} from './modals/DocumentPreviewModal';
import CommentInput from '../DocumentSharedDetailsScreen/components/CommentInput';
import useComments from '../DocumentSharedDetailsScreen/hooks/useComments';
import CommentGroup from '../DocumentSharedDetailsScreen/components/CommentGroup';
import CommentItemNew from '../DocumentSharedDetailsScreen/components/CommentItemNew';
import { useBreakpoint } from '@/src/hooks/useBreakpoint';

const TextEditor = dynamic(
    () => import('@/src/screens/EditorScreen/TextEditor'),
    {
        ssr: false,
    }
);

function DocumentEditScreen(props: any) {
    const { isDesktop } = useBreakpoint();
    const documentPreviewModalRef =
        useRef<ModalizeDocumentPreviewHelperVisible | null>(null);
    const ckeditorRef = useRef(null);
    const documentShareModalRef =
        useRef<DocumentShareModalizeHelperVisible | null>(null);
    const documentDeleteModalRef =
        useRef<DocumentDeleteModalizeHelperVisible | null>(null);

    const [form] = Form.useForm();
    const documentTitle = Form.useWatch('title', form);

    const documentEditInitResource: DocumentDetailInitResource = props.data;

    const { auth: fullProfileResource } = useAccountContext();
    const documentSaveMutation = useUpdateDocument();
    const templateSaveMutation = useSaveAsTemplate();
    const downloadMutation = useTemplateDownload();
    const createContractMutation = useCreateContractFromDocument();
    const commentsQuery = useComments(documentEditInitResource.documentId);

    function insertToEditor(item: SampleDocumentResource) {
        const editor: any = ckeditorRef.current;

        const viewFragment = editor.data.processor.toView(item.body);
        const modelFragment = editor.data.toModel(viewFragment);

        editor.model.insertContent(modelFragment);
        editor.editing.view.focus();
    }

    function getDropdownItems() {
        const items = [
            {
                label: 'Lưu văn bản',
                key: 'saveDocument',
                icon: <SaveOutlined />,
                onClick: () => {
                    const values = form.getFieldsValue();
                    documentSaveMutation.mutate({
                        ...values,
                        documentId: documentEditInitResource.documentId,
                    });
                },
            },
        ];

        if (fullProfileResource) {
            items.push({
                label: 'Lưu thành template',
                key: 'saveAsTemplate',
                icon: <SaveOutlined />,
                onClick: () => {
                    const values = form.getFieldsValue();

                    templateSaveMutation.mutate({
                        templateId: documentEditInitResource.templateId,
                        title: documentTitle,
                        body: values.body,
                    });
                },
            });
        }

        if (fullProfileResource) {
            items.push({
                label: 'Lưu thành hợp đồng',
                key: 'saveAsContract',
                icon: <SaveOutlined />,
                onClick: createContract,
            });
        }

        return items;
    }

    function createContract() {
        const values = form.getFieldsValue();

        createContractMutation.mutate({
            templateId: documentEditInitResource.templateId,
            title: documentTitle,
            body: values.body,
        });
    }

    function onShare(documentResource: DocumentResource) {
        documentShareModalRef.current?.open(documentResource);
    }

    return (
        <RootLayout styleLayoutContent={{ overflow: 'unset' }}>
            <Head>
                <title>{`Văn bản ${documentEditInitResource.name}`}</title>
                <link
                    rel={'stylesheet'}
                    type={'text/css'}
                    charSet={'UTF-8'}
                    href={
                        'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css'
                    }
                />
                <link
                    rel={'stylesheet'}
                    type={'text/css'}
                    href={
                        'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css'
                    }
                />
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
                            { title: <Link href={'/documents'}>Văn bản</Link> },
                            { title: documentTitle },
                        ]}
                    />
                </div>
            </section>

            <Form
                form={form}
                initialValues={{
                    title: documentEditInitResource.name,
                    body: documentEditInitResource.body,
                    documentId: documentEditInitResource.documentId,
                }}
            >
                <section className={'sectionContainer editorTitleWrapper'}>
                    <div className="contentWrapper">
                        <Row gutter={[40, 20]} align={'middle'}>
                            <Col xs={24} sm={24} md={24} lg={14} xl={14} xxl={14}>
                                <Typography.Title
                                    editable={{
                                        text: documentTitle,
                                        onChange: (value) => form.setFieldValue('title', value),
                                        icon: (
                                            <EditOutlined
                                                style={{ fontSize: '30px', color: '#25272D' }}
                                            />
                                        ),
                                    }}
                                    className={'title nm-typo'}
                                    level={1}
                                >
                                    {documentTitle}
                                </Typography.Title>
                            </Col>

                            <Col xs={24} sm={24} md={24} lg={10} xl={10} xxl={10}>
                                <div className={'editorTitleExtraContainer gridColToEnd'}>
                                    <Space size={10} wrap={!isDesktop ? true : false}>
                                        <Button
                                            icon={<DeleteOutlined />}
                                            onClick={() =>
                                                documentDeleteModalRef.current?.open(
                                                    documentEditInitResource
                                                )
                                            }
                                            danger
                                        >
                                            Xóa
                                        </Button>
                                        <Button
                                            icon={<EyeOutlined />}
                                            type={'default'}
                                            onClick={() => {
                                                const dataParams: DocumentDirectPreviewParams =
                                                    form.getFieldsValue();
                                                documentPreviewModalRef.current?.open(dataParams);
                                            }}
                                        >
                                            Xem trước
                                        </Button>

                                        <Dropdown
                                            trigger={['click']}
                                            menu={{
                                                items: getDropdownItems(),
                                            }}
                                        >
                                            <div>
                                                {withThemeRevert(
                                                    <Button type={'primary'}>
                                                        <SaveOutlined />
                                                        Lưu
                                                        <DownOutlined />
                                                    </Button>
                                                )}
                                            </div>
                                        </Dropdown>

                                        {!fullProfileResource
                                            ? null
                                            : withThemeRevert(
                                                <Button
                                                    type={'primary'}
                                                    icon={<DownloadOutlined />}
                                                    loading={downloadMutation.isLoading}
                                                    disabled={downloadMutation.isLoading}
                                                    onClick={() => {
                                                        const values = form.getFieldsValue();

                                                        downloadMutation.mutate({
                                                            templateId: documentEditInitResource.templateId,
                                                            title: documentTitle,
                                                            body: values.body,
                                                        });
                                                    }}
                                                >
                                                    Tải xuống PDF
                                                </Button>
                                            )}
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
                    <div className={'contentWrapper'}>
                        <div className="document-editor" style={{ position: 'relative' }}>
                            <div
                                className="document-editor__toolbar"
                                style={{
                                    position: 'sticky',
                                    top: Constants.HEADER.HEIGHT,
                                    zIndex: 90,
                                }}
                            ></div>

                            <div className="document-editor__editable-container">
                                {!fullProfileResource ? null : (
                                    <div className={'templateEditorWrapper'}>
                                        <List
                                            header={
                                                <h3 className={'templateEditorTitle'}>Mẫu văn bản</h3>
                                            }
                                            dataSource={documentEditInitResource.sampleDocuments}
                                            renderItem={(item) => {
                                                return (
                                                    <List
                                                        header={
                                                            <div className="templateEditorBoxTitle">
                                                                {item.name}
                                                            </div>
                                                        }
                                                        dataSource={item.documents}
                                                        renderItem={(item) => {
                                                            return (
                                                                <div className={'templateEditorItemContainer'}>
                                                                    <Image
                                                                        preview={false}
                                                                        src={item.previewUrl}
                                                                        fallback={Images.TEMPLATE_DEFAULT}
                                                                        alt={item.name}
                                                                        width={'100%'}
                                                                        onClick={() => insertToEditor(item)}
                                                                    />
                                                                </div>
                                                            );
                                                        }}
                                                        className={'templateEditorBoxContentContainer'}
                                                        rowKey={'sampleId'}
                                                        bordered={false}
                                                    />
                                                );
                                            }}
                                            rowKey={'categoryId'}
                                            className={'templateEditorBoxContainer'}
                                            bordered={false}
                                        />
                                    </div>
                                )}

                                <div className={'templateEditorContentWrapper'}>
                                    <Form.Item name={'documentId'} style={{ display: 'none' }} />
                                    <Form.Item name={'title'} style={{ display: 'none' }} />

                                    <Form.Item
                                        name={'body'}
                                        valuePropName={'data'}
                                        label={''}
                                        rules={[]}
                                    >
                                        <TextEditor
                                            ckeditorRef={ckeditorRef}
                                            onChange={(value: string) =>
                                                form.setFieldValue('body', value)
                                            }
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                        </div>
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
                                    <CommentInput
                                        documentId={documentEditInitResource.documentId}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </div>
                </section>
            </Form>

            <DocumentPreviewModal ref={documentPreviewModalRef} />
            <DocumentShareModal ref={documentShareModalRef} />
            <DocumentDeleteModal ref={documentDeleteModalRef} />
        </RootLayout>
    );
}

export default DocumentEditScreen;
