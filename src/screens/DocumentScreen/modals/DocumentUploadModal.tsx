import React, { useCallback, useImperativeHandle, useState } from 'react';
import { Button, Form, Input, Modal, Row, Typography, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import useDocumentUpload from '@/src/screens/DocumentScreen/hooks/useDocumentUpload';
import { withThemeRevert } from '@/theme';

export type DocumentUploadModalHelperVisible = {
    open: () => void,
    close: () => void,
}

const DocumentUploadModal = React.forwardRef((props, ref) => {

    const [form] = Form.useForm();
    const [isOpen, setOpen] = useState(false);

    const open = useCallback(() => setOpen(true), []);
    const close = useCallback(() => setOpen(false), []);

    useImperativeHandle(ref, useCallback(() => ({ open, close }), [open, close]));

    const uploadMutation = useDocumentUpload({
        onSuccess: () => close(),
    });

    return (
        <Modal
            title={'Upload văn bản'}
            open={isOpen}
            className={'applyJobModalContainer'}
            footer={null}
            width={'500px'}
            centered={true}
            onCancel={close}
        >
            <Form
                form={form}
                layout={'vertical'}
                initialValues={{
                    title: null,
                    attachments: [],
                }}
                onFinish={uploadMutation.mutate}
            >
                <Form.Item
                    label={'Tên văn bản'}
                    name={'title'}
                    rules={[{ required: true, message: 'Vui lòng nhập tên văn bản' }]}
                >
                    <Input
                        size={'large'}
                        placeholder={'Nhập tên văn bản'}
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
                        beforeUpload={(fileInfo) => {
                            form.setFieldValue('attachments', [fileInfo]);
                            return false;
                        }}
                        onRemove={() => form.setFieldValue('attachments', [])}
                        accept={['.doc', '.docx'].join(',')}
                        maxCount={5}
                        multiple={true}
                        className={'uploadFullWidth'}
                    >
                        <Row className={'uploadDropzoneContainer'} justify={'space-between'} align={'middle'}>
                            <Typography.Paragraph type={'secondary'} className={'nm-typo'}>
                                Hỗ trợ tệp DOC, DOCX..
                            </Typography.Paragraph>

                            <Button size={'small'} icon={(<UploadOutlined />)}>
                                Tải file
                            </Button>
                        </Row>
                    </Upload>
                </Form.Item>
            </Form>
            <Row justify={'center'}>
                {withThemeRevert(
                    <Button
                        onClick={form.submit}
                        loading={uploadMutation.isLoading}
                        disabled={uploadMutation.isLoading}
                        type={'primary'}
                        style={{ width: '120px' }}
                    >
                        {uploadMutation.isLoading ? 'Đang tải...' : 'Tải file'}
                    </Button>
                )}
            </Row>
        </Modal>
    );

});

DocumentUploadModal.displayName = 'DocumentUploadModal';

export default DocumentUploadModal;
