import React, { useCallback, useImperativeHandle, useRef, useState } from 'react';
import { Button, Card, Col, List, message, Modal, Row, Tag, Typography } from 'antd';
import { FullJobResource, HistoryJobResultResource, JobResultResource } from '@/src/data/job/models/job.types';
import { ConstantsHelper } from '@/src/constants/ConstantsHelper';
import {
    DownloadOutlined,
    FileWordOutlined,
    FileExcelOutlined,
    FilePdfOutlined,
    FilePptOutlined,
    FileImageOutlined,
    FileZipOutlined,
    FileOutlined
} from '@ant-design/icons';
import useDocumentDownload from '../hooks/document/useDocumentDownload';
import { useDetectDeviceV2 } from '@/src/hooks/useDetectDevice';

const { Text, Title, Paragraph } = Typography;

export interface ViewResultHistoryModalizeHelperVisible {
    open: (jobResource: FullJobResource, historyResource: HistoryJobResultResource) => void;
    close: () => void;
}

const ViewResultHistoryModal = React.forwardRef((_, ref) => {
    const [jobResource, setJobResource] = useState<FullJobResource | null>(null);
    const [historyResource, setHistoryResource] = useState<HistoryJobResultResource | null>(null);
    const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);
    const [loadingRowId, setLoadingRowId] = useState<number | null>(null);
    const documentDownloadMutation = useDocumentDownload();

    const open = useCallback(
        (jobResource: FullJobResource, historyResource: HistoryJobResultResource) => {
            setJobResource(jobResource);
            setHistoryResource(historyResource);
            setSelectedFileIndex(0);
        },
        []
    );

    const close = useCallback(() => {
        setJobResource(null);
        setHistoryResource(null);
        setSelectedFileIndex(0);
    }, []);

    useImperativeHandle(
        ref,
        useCallback(() => ({ open, close }), [open, close])
    );

    const getFileExtension = (fileUrl: string): string => {
        return fileUrl.split('.').pop()?.toLowerCase() || '';
    };

    const getFileIcon = (extension: string) => {
        const iconStyle = { fontSize: '20px', marginRight: '8px' };

        switch (extension) {
            case 'doc':
            case 'docx':
                return <FileWordOutlined style={{ ...iconStyle, color: '#2b5797' }} />;
            case 'xls':
            case 'xlsx':
            case 'csv':
                return <FileExcelOutlined style={{ ...iconStyle, color: '#217346' }} />;
            case 'pdf':
                return <FilePdfOutlined style={{ ...iconStyle, color: '#d83b01' }} />;
            case 'ppt':
            case 'pptx':
                return <FilePptOutlined style={{ ...iconStyle, color: '#d24726' }} />;
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'svg':
            case 'raw':
            case 'gif':
            case 'webp':
                return <FileImageOutlined style={{ ...iconStyle, color: '#722ed1' }} />;
            case 'zip':
                return <FileZipOutlined style={{ ...iconStyle, color: '#faad14' }} />;
            default:
                return <FileOutlined style={{ ...iconStyle, color: '#1890ff' }} />;
        }
    };

    const handleDownloadButton = async (record: JobResultResource) => {
        setLoadingRowId(record.resultId);
    };

    const applicationFiles = historyResource?.applicationFile || [];
    const selectedFile = applicationFiles[selectedFileIndex];

    const renderFilePreview = (fileUrl: string, applicationName: string) => {
        if (!fileUrl) {
            return <Text>Không có file để hiển thị</Text>;
        }

        const fileExtension = getFileExtension(fileUrl);

        if (fileExtension === 'pdf') {
            return (
                <iframe
                    src={`${fileUrl}#toolbar=0&navpanes=0&view=FitH`}
                    style={{
                        width: '100%',
                        height: '500px',
                        border: '1px solid #d9d9d9',
                        borderRadius: '4px'
                    }}
                    title={`PDF Preview - ${applicationName}`}
                />
            )
        }

        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension || '')) {
            return (
                <img
                    src={fileUrl}
                    alt={applicationName}
                    style={{
                        maxWidth: '100%',
                        height: 'auto',
                        border: '1px solid #d9d9d9',
                        borderRadius: '4px'
                    }}
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                    }}
                />
            );
        }

        return (
            <div style={{
                padding: '40px',
                textAlign: 'center',
                border: '1px dashed #d9d9d9',
                borderRadius: '4px',
                backgroundColor: '#fafafa'
            }}>
                <div style={{ marginBottom: '20px' }}>
                    {getFileIcon(fileExtension || '')}
                </div>
                <Text strong style={{ display: 'block', marginBottom: '8px', fontSize: '16px' }}>
                    {applicationName}
                </Text>
                <Text type="secondary" style={{ display: 'block', marginBottom: '20px' }}>
                    Loại file: {fileExtension?.toUpperCase()}
                </Text>
                <Paragraph type="secondary">
                    Không thể hiển thị "{applicationName}". Hãy tải xuống để xem kết quả này.
                </Paragraph>
                <br />
                <Button
                    icon={<DownloadOutlined />}
                    className={"btnAction"}
                    disabled={documentDownloadMutation.isPending}
                    onClick={() => {
                        documentDownloadMutation.mutate(
                            {
                                jobId: selectedFile.projectId!,
                                resultId: selectedFile.resultId,
                                file: selectedFile,
                            },
                            {
                                onSuccess: () => {
                                    setLoadingRowId(null);
                                    message.success("Tải tệp kết quả thành công");
                                },
                                onError: () => {
                                    setLoadingRowId(null);
                                    message.success("Tải tệp kết quả thất bại");
                                },
                                onSettled: () => {
                                    setLoadingRowId(null);
                                },
                            }
                        );
                    }}
                >
                    Tải xuống file
                </Button>
            </div>
        );
    }


    const isMobile = useDetectDeviceV2().isMobile;


    return (
        <Modal
            open={!!jobResource && !!historyResource}
            className={'jobDeleteModalContainer'}
            onCancel={close}
            width={800}
            title={`Lần nghiệm thu thứ: ${historyResource?.round} - ${ConstantsHelper.getJobResultStatusTitle(historyResource?.status!)}`}
            footer={[
                <Button key="close" onClick={close}>
                    Đóng
                </Button>
            ]}
        >
            {historyResource && (
                <div>
                    <div style={{ marginBottom: 24 }}>
                        <Row gutter={16}>
                            <Col span={isMobile ? 12 : 6}>
                                <Text strong>Ngày gửi:</Text>
                            </Col>
                            <Col span={isMobile ? 12 : 6}>
                                <Text>{historyResource.createdDate}</Text>
                            </Col>
                            <Col span={isMobile ? 12 :6}>
                                <Text strong>Ngày duyệt:</Text>
                            </Col>
                            <Col span={isMobile ? 12 :6}>
                                <Text>{historyResource.updatedDate || '-'}</Text>
                            </Col>
                        </Row>

                        <Row gutter={16} style={{ marginTop: 8 }}>
                            <Col span={24}>
                                <Text strong>Ghi chú:</Text>{' '}
                                <Text>{historyResource.note || '-'}</Text>
                            </Col>
                        </Row>

                        {applicationFiles.length > 0 && (
                            <Row gutter={16} style={{ marginTop: 8 }}>
                                {/* Cột trái - Danh sách files */}
                                <Col span={ isMobile ? 24 : 8}>
                                    <Title level={5}>Danh sách kết quả ({applicationFiles.length} kết quả)</Title>
                                    <div
                                        style={{
                                            maxHeight: "500px",
                                            overflowY: "auto",
                                            padding: "8px"
                                        }}
                                    >
                                    <List
                                        dataSource={applicationFiles}
                                        renderItem={(item, index) => {
                                            const statusText = () => {
                                                switch (item.status) {
                                                    case 0: return 'Chờ duyệt';
                                                    case 1: return 'Đồng ý';
                                                    case 2: return 'Đã từ chối';
                                                    default: return 'Chờ duyệt';
                                                }
                                            }

                                            const statusColor = () => {
                                                switch (item.status) {
                                                    case 1: return "#09993E";
                                                    case 2: return "#ff4d4f";
                                                    default: return "#faad14";
                                                }
                                            }

                                            const statusBackgroundColor = () => {
                                                switch (item.status) {
                                                    case 1: return "#f3fcf6";
                                                    case 2: return "#fdf6f3";
                                                    default: return "#fff4dfff";
                                                }
                                            }

                                            return (
                                                <List.Item
                                                    style={{
                                                        cursor: 'pointer',
                                                        padding: '12px',
                                                        backgroundColor: selectedFileIndex === index ? `${statusBackgroundColor()}` : 'transparent',
                                                        border: selectedFileIndex === index ? `1px solid ${statusColor()}` : '1px solid #f0f0f0',
                                                        borderRadius: '4px',
                                                        marginBottom: '8px',
                                                    }}
                                                    onClick={() => setSelectedFileIndex(index)}
                                                >
                                                    <div style={{ width: '100%' }}>
                                                        <Text strong style={{
                                                            color: selectedFileIndex === index ? `${statusColor()}` : 'inherit'
                                                        }}>
                                                            {item.name}
                                                        </Text>
                                                        <br />
                                                        <Paragraph 
                                                            type="secondary"
                                                            style={{ fontSize: 12, lineHeight: 1.5, margin: 0 }} 
                                                            ellipsis={{ rows: 2 }}
                                                        >
                                                            {item.description}
                                                        </Paragraph>
                                                        <br />
                                                        <Text type="secondary" style={{ fontSize: '12px' }}>
                                                            {item.createdDate}
                                                        </Text>
                                                        <br />
                                                        <Tag
                                                            color={statusColor()}
                                                            style={{
                                                                marginInlineEnd: 0,
                                                                width: "88px",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            {statusText()}
                                                        </Tag>
                                                    </div>
                                                </List.Item>
                                            )
                                        }}
                                    />
                                    </div>
                                </Col>

                                {/* Cột phải - Preview file */}
                                <Col span={isMobile ? 24 : 16}>                                    
                                    {selectedFile && (
                                        <Card>
                                            {renderFilePreview(selectedFile.fileUrl, selectedFile.name)}
                                        </Card>
                                    )}
                                </Col>
                            </Row>
                        )}

                        {/* Thông báo nếu không có files */}
                        {applicationFiles.length === 0 && (
                            <div style={{
                                textAlign: 'center',
                                padding: '40px',
                                border: '1px dashed #d9d9d9',
                                borderRadius: '4px',
                                backgroundColor: '#fafafa'
                            }}>
                                <Text type="secondary">Không có file kết quả để hiển thị</Text>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Modal>
    );
});

ViewResultHistoryModal.displayName = 'ViewResultHistoryModal';

export default ViewResultHistoryModal;
