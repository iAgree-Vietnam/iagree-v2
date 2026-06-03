import React, { useCallback, useImperativeHandle, useRef, useState } from 'react';
import { Button, Card, Col, Modal, Row, Typography } from 'antd';
import { FullJobResource, JobResultResource } from '@/src/data/job/models/job.types';
import useDeleteJob from '@/src/screens/UserScreen/UserJobsScreen/hooks/useDeleteJob';
import { IconSvgLocal } from '@/src/components/icon-svg-local';
import { 
  FileWordOutlined, 
  FileExcelOutlined, 
  FilePdfOutlined,
  FilePptOutlined,
  FileImageOutlined,
  FileZipOutlined,
  FileOutlined,
  DownloadOutlined 
} from '@ant-design/icons';
import Constants from '@/src/constants/Constants';

const { Text, Title, Paragraph } = Typography;

export interface ViewResultFileModalProps {
    onAccept: (resultId: number) => void;
    onRequestEdit: (resultId: number) => void;
}

export interface ViewResultFileModalizeHelperVisible {
    open: (jobResource: FullJobResource, resultResource: JobResultResource, isCreated: boolean) => void;
    close: () => void;
}

const ViewResultFileModal = React.forwardRef<
    ViewResultFileModalizeHelperVisible, 
    ViewResultFileModalProps
>(({ onAccept, onRequestEdit }, ref) => {
    const [jobResource, setJobResource] = useState<FullJobResource | null>(null);
    const [resultResource, setResultResource] = useState<JobResultResource | null>(null);
    const [isCreated, setIsCreated] = useState<boolean>(false);

    const open = useCallback(
        (jobResource: FullJobResource, resultResource: JobResultResource, isCreatedParam: boolean) => {
            setJobResource(jobResource);
            setResultResource(resultResource);
            setIsCreated(isCreatedParam);
        },
        []
    );

    const close = useCallback(() => {
        setJobResource(null);
        setResultResource(null);
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

    const renderFileContent = () => {
        if (!resultResource?.fileUrl) return null;

        const fileExtension = getFileExtension(resultResource.fileUrl);
        const fileName = resultResource.name || 'Unknown file';

        if (fileExtension === 'pdf') {
            return (
                <iframe
                    src={`${resultResource.fileUrl}#toolbar=0&navpanes=0&view=FitH`}
                    style={{
                        width: '100%',
                        height: '500px',
                        border: '1px solid #d9d9d9',
                        borderRadius: '4px'
                    }}
                    title={`PDF Preview - ${fileName}`}
                />
            )
        }

        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileExtension)) {
            return (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <img
                        src={resultResource.fileUrl}
                        alt={fileName}
                        style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }}
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                </div>
            );
        }

        return (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ marginBottom: '20px' }}>
                    {getFileIcon(fileExtension)}
                </div>
                <Text strong style={{ display: 'block', marginBottom: '8px', fontSize: '16px' }}>
                    {fileName}
                </Text>
                <Text type="secondary" style={{ display: 'block', marginBottom: '20px' }}>
                    Loại file: {fileExtension.toUpperCase()}
                </Text>
                <Paragraph type="secondary">
                    Không thể hiển thị "{fileName}". Hãy tải xuống để xem kết quả này.
                </Paragraph>
                <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    href={resultResource.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Tải xuống file
                </Button>
            </div>
        );
    };

    const showActionButtons = isCreated && jobResource?.status === Constants.JOB.STATUS.CHO_NGHIEM_THU;
    
    return (
        <Modal
            open={!!jobResource && !!resultResource}
            className={'jobDeleteModalContainer'}
            onCancel={close}
            width={800}
            title={"Xem tài liệu"}
            footer={
                showActionButtons
                    ? [
                        <Button 
                            key="accept" 
                            type="primary" 
                            onClick={() => { 
                                if (resultResource) onAccept(resultResource.resultId);
                                close(); 
                            }}
                        >
                            Chấp nhận
                        </Button>,
                        <Button 
                            key="edit" 
                            onClick={() => { 
                                if (resultResource) onRequestEdit(resultResource.resultId);
                                close(); 
                            }}
                        >
                            Cần chỉnh sửa
                        </Button>
                    ] : [
                        <Button key="close" onClick={close}>
                            Đóng
                        </Button>
                    ]
            }
        >
            {resultResource && (
                <>
                    <Row gutter={16} style={{ marginBottom: 16 }}>
                        <Col xs={24}>
                            <Title level={4}>{resultResource.name}</Title>
                            <Paragraph>
                                <strong>Mô tả:</strong> {resultResource.description}
                            </Paragraph>
                            <Paragraph>
                                <strong>Ngày tạo:</strong> {resultResource.createdDate}
                            </Paragraph>
                        </Col>
                    </Row>

                    {resultResource.fileUrl && (
                        <Card>
                            {renderFileContent()}
                        </Card>
                    )}
                </>
            )}
        </Modal>
    );
});

ViewResultFileModal.displayName = 'ViewResultFileModal';

export default ViewResultFileModal;