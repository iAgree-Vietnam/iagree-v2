import React, { useCallback, useImperativeHandle, useState } from 'react';
import { Button, Form, Input, message, Modal, Row, Typography, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { FullJobResource, JobResultResource } from '../../../data/job/models/job.types';
import useJobUploadDocument from '../JobDetailScreen/hooks/useJobUploadDocument';
import { DefinedUseQueryResult } from '@tanstack/react-query/src/types';
import { withThemeRevert } from '@/theme';
import Constants from '@/src/constants/Constants';
import { UploadFile } from 'antd/lib/upload/interface';

const { Text } = Typography;

interface UploadDocumentModalProps {
    jobQuery: DefinedUseQueryResult<FullJobResource>;
    data: FullJobResource;
}

export type JobDocumentModalizeHelperVisible = {
    open: (resultResource: JobResultResource | null) => void,
    close: () => void,
}

const UploadDocumentModal = React.forwardRef((props: UploadDocumentModalProps, ref: any) => {
    const [form] = Form.useForm();
    const [isOpen, setOpen] = useState(false);
    const [documentResult, setDocumentResult] = useState<JobResultResource | null>(null);

    const open = useCallback((resultResource: JobResultResource | null) => {
        setOpen(true);
        setDocumentResult(resultResource);
    }, []);

    const close = useCallback(() => setOpen(false), []);

    useImperativeHandle(ref, useCallback(() => ({ open, close }), [open, close]));

    const fullJobResource = props.data;
    const uploadDocumentMutation = useJobUploadDocument(ref, fullJobResource, props.jobQuery);

    const handleBeforeUpload = (file: File) => {
        const maxFileSize = Constants.MAX_FILE_SIZE;
        const currentFiles: UploadFile[] = form.getFieldValue('attachments') || [];

        const allowedExtensions = [
            '.doc', '.docx', '.xls', '.xlsx', '.csv', 
            '.ppt', '.pptx', '.pdf', '.jpg', '.jpeg', 
            '.png', '.svg', '.raw', '.zip'
        ];

        const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));

        if (!allowedExtensions.includes(fileExtension)) {
            message.error(`Định dạng ${fileExtension} không được hỗ trợ.`);
            return Upload.LIST_IGNORE;
        }

        const isDuplicate = currentFiles.some(
            (existingFile) =>
                existingFile.name === file.name &&
                existingFile.size === file.size
        );

        if (isDuplicate) {
            message.warning(`Tệp ${file.name} đã tồn tại!`);
            return Upload.LIST_IGNORE;
        }

        if (file.size > maxFileSize) {
            message.error(`File ${file.name} vượt quá ${maxFileSize / 1024 / 1024} MB`);
            return Upload.LIST_IGNORE;
        }

        const updatedFiles = [...currentFiles, file];
        form.setFieldValue('attachments', updatedFiles);

        return false;
    }

    const maxLength = Constants.TEXT_MAX_LENGTH;
    const description = Form.useWatch("description", form);
    const currentDescriptionLength = description ? description.length : 0;

    return (
        <Modal
            title={'Tải kết quả'}
            open={isOpen}
            className={'applyJobModalContainer'}
            footer={null}
            onCancel={close}
            destroyOnClose={true}
        >
            <Form
                form={form}
                layout={'vertical'}
                initialValues={{
                    resultId: documentResult?.resultId,
                    documentName: documentResult?.name || '',
                    attachments: [],
                    description: documentResult?.description,
                }}
                preserve={false}
                onFinish={(values) => uploadDocumentMutation.mutate({ ...values, resultId: documentResult?.resultId })}
            >
                <Form.Item
                    label={'Tên tài liệu'}
                    name={'documentName'}
                    rules={[{ required: true, message: 'Vui lòng nhập tên tài liệu' }]}
                >
                    <Input
                        size={'large'}
                        placeholder={'Nhập tên tài liệu'}
                    />
                </Form.Item>

                <Form.Item
                    label={''}
                    name={'attachments'}
                    rules={[{ required: true, message: 'Vui lòng upload tài liệu' }]}
                    valuePropName={'fileList'}
                    getValueFromEvent={(e) => e.fileList}
                >
                    <Upload
                        // beforeUpload={(fileInfo) => {
                        //     form.setFieldValue('attachments', [fileInfo]);
                        //     return false;
                        // }}
                        beforeUpload={(fileInfo) => handleBeforeUpload(fileInfo)}
                        onRemove={() => form.setFieldValue('attachments', [])}
                        accept={[
                            '.doc', '.docx',
                            '.xls', '.xlsx',
                            '.csv',
                            '.ppt', '.pptx',
                            '.pdf',
                            '.jpg', '.jpeg', '.png', '.svg', '.raw',
                            '.zip'
                        ].join(',')}
                        maxCount={0}
                        multiple={false}
                        className={'uploadFullWidth'}
                    >
                        <Row className={'uploadDropzoneContainer'} justify={'space-between'} align={'middle'}>
                            <Typography.Paragraph type={'secondary'} className={'nm-typo'}>
                                Hỗ trợ tệp: DOC, DOCX, XLS, XLSX, CSV, PPT, PPTX, PDF, JPG, JPEG, PNG, SVG, RAW, ZIP
                            </Typography.Paragraph>

                            <Button size={'small'} icon={(<UploadOutlined />)}>
                                Tải tài liệu
                            </Button>
                        </Row>
                    </Upload>
                </Form.Item>

                <Form.Item
                    label={"Mô tả"}
                    name={"description"}
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập mô tả cho tài liệu",
                        },
                        {
                            max: maxLength,
                            message: `Mô tả không được vượt quá ${maxLength} ký tự.`,
                        },
                    ]}
                >
                    <Input.TextArea
                        size={"large"}
                        placeholder={"Nhập mô tả cho tài liệu"}
                        rows={4}
                    />
                </Form.Item>

                <div style={{ textAlign: "right", marginTop: -12 }}>
                    <Text
                        type="secondary"
                        style={{
                            color: currentDescriptionLength > maxLength ? "red" : undefined,
                        }}
                    >
                        ({`${currentDescriptionLength} / ${maxLength}`})
                    </Text>
                </div>

                <div style={{ textAlign: "left", marginTop: 10 }}>
                    <Text
                        type="secondary"
                        style={{
                        color: "red",
                        }}
                    >
                        {"Mỗi kết quả chỉ đính kèm 1 tệp, đảm bảo tên và nội dung tệp trùng khớp với mô tả để quá trình nghiệm thu diễn ra nhanh chóng và chính xác."}
                    </Text>
                </div>
            </Form>
            <Row justify={'center'}>
                {withThemeRevert(
                    <Button
                        onClick={form.submit}
                        loading={uploadDocumentMutation.isLoading}
                        disabled={uploadDocumentMutation.isLoading}
                        type={'primary'}
                        style={{ width: '120px' }}
                    >
                        {uploadDocumentMutation.isLoading ? 'Đang tải...' : 'Tải file'}
                    </Button>
                )}
            </Row>
        </Modal>
    );

});

UploadDocumentModal.displayName = 'UploadDocumentModal';

export default UploadDocumentModal;
