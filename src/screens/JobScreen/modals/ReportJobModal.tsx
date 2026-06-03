import React, { useCallback, useImperativeHandle, useState } from 'react';
import { Button, Form, Input, message, Modal, Rate, Row, Typography, Upload } from 'antd';
import { FullJobResource } from '../../../data/job/models/job.types';
import useAgreeJobResult from '../hooks/useAgreeJobResult';
import { withThemeRevert } from '@/theme';
import { UploadOutlined } from '@ant-design/icons';
import Constants from '@/src/constants/Constants';
import type { UploadFile } from "antd/lib/upload/interface";
import { UploadIcon } from 'lucide-react';

const { Text } = Typography;

type ReportJobModalProps = {
    data: FullJobResource;
    onRefetch?: () => Promise<any>;
};

const ReportJobModal = React.forwardRef(
    (props: ReportJobModalProps, ref) => {
        const [form] = Form.useForm();
        const [isOpen, setOpen] = useState(false);

        const open = useCallback(() => setOpen(true), []);
        const close = useCallback(() => setOpen(false), []);

        useImperativeHandle(
            ref,
            useCallback(() => ({ open, close }), [open, close])
        );

        const fullJobResource = props.data;
        const agreeMutation = useAgreeJobResult(fullJobResource?.jobId, {
            // onSuccess: () => close(),
            onSuccess: async () => {
                close();
                await props.onRefetch?.();
            }
        });

        const handleBeforeUpload = (file: File) => {
            const maxFileSize = Constants.MAX_FILE_SIZE;

            const currentFiles: UploadFile[] = form.getFieldValue('attachment_files') || [];

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
            form.setFieldValue('attachment_files', updatedFiles);

            return false;
        }

        const maxLength = Constants.TEXT_MAX_LENGTH;
        const description = Form.useWatch("description", form);
        const currentDescriptionLength = description ? description.length : 0;

        return (
            <Modal
                title={'Báo cáo công việc'}
                open={isOpen}
                className={'agreeJobModalContainer'}
                footer={null}
                onCancel={close}
                width={'672px'}
            >
                <Form
                    form={form}
                    layout={'vertical'}
                    initialValues={{
                        rate: null,
                        description: null,
                    }}
                    onFinish={agreeMutation.mutate}
                >
                    <Form.Item
                        label={'Lý do báo cáo'}
                        name={'description'}
                        rules={[
                            { required: true, message: 'Vui lòng nhập lý do báo cáo' },
                            {
                                max: maxLength,
                                message: `Lý do báo cáo không được vượt quá ${maxLength} ký tự.`,
                            },
                        ]}
                    >
                        <Input.TextArea
                            size={'large'}
                            placeholder={'Hãy nhập lý do báo cáo của bạn'}
                            rows={5}
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

                    <Form.Item
                        label={'Tải tệp'}
                        name={'attachment_files'}
                        valuePropName={'fileList'}
                        getValueFromEvent={(e) => e.fileList}
                    >
                        <Upload
                            beforeUpload={(file) => handleBeforeUpload(file)}
                            onRemove={(file) => {
                                const currentFiles = form.getFieldValue('attachment_files') || [];
                                const updatedFiles = currentFiles.filter((f: any) => f.uid !== file.uid);
                                form.setFieldValue('attachment_files', updatedFiles);
                            }}
                            maxCount={5}
                            multiple={true}
                            className={'uploadFullWidth'}
                        >
                            <Row className={'uploadDropzoneContainer'} justify={'space-between'} align={'middle'}>
                                <Typography.Paragraph type={'secondary'} className={'nm-typo'}>
                                    Hỗ trợ tệp PDF, CSV..
                                </Typography.Paragraph>

                                <Button size={'small'} icon={(<UploadOutlined />)}>
                                    Tải tài liệu
                                </Button>
                            </Row>
                        </Upload>
                    </Form.Item>
                </Form>
                <Row justify={'center'}>
                    {withThemeRevert(
                        <Button
                            onClick={form.submit}
                            loading={agreeMutation.isPending}
                            disabled={agreeMutation.isPending}
                            type={'primary'}
                        >
                            {agreeMutation.isPending
                                ? 'Đang xác nhận, xin đợi...'
                                : 'Gửi báo cáo'}
                        </Button>
                    )}
                </Row>
            </Modal>
        );
    }
);

ReportJobModal.displayName = 'ReportJobModal';

export default ReportJobModal;
