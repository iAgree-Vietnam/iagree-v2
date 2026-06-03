import React, { useCallback, useImperativeHandle, useState } from 'react';
import { Button, Form, Input, InputNumber, Modal, Row, Typography, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import useJobApply from '../JobDetailScreen/hooks/useJobApply';
import { FullJobResource } from '../../../data/job/models/job.types';
import AppInputNumber from '@/src/components/AppInputNumber';

type ApplyJobModalProps = {
    data: FullJobResource;
}

const ApplyJobModal = React.forwardRef((props: ApplyJobModalProps, ref) => {

    const [form] = Form.useForm();
    const [isOpen, setOpen] = useState(false);

    const open = useCallback(() => setOpen(true), []);
    const close = useCallback(() => setOpen(false), []);

    useImperativeHandle(ref, useCallback(() => ({ open, close }), [open, close]));

    const fullJobResource = props.data;
    const applyMutation = useJobApply(fullJobResource);

    return (
        <Modal
            title={'Ứng tuyển'}
            open={isOpen}
            className={'applyJobModalContainer'}
            footer={null}
            onCancel={close}
            width={'1000px'}
        >
            <Form
                form={form}
                layout={'vertical'}
                initialValues={{
                    letter: null,
                    negotiatePrice: null,
                    attachments: [],
                }}
                onFinish={applyMutation.mutate}
            >
                <Form.Item
                    label={'Thư ứng tuyển'}
                    name={'letter'}
                    rules={[{ required: true, message: 'Vui lòng nhập thư ứng tuyển' }]}
                >
                    <Input.TextArea
                        size={'large'}
                        placeholder={'Viết giới thiệu ngắn gọn về bản thân và nêu rõ lý do bạn ứng tuyển cho vị trí này'}
                        rows={4}
                    />
                </Form.Item>

                <Form.Item
                    label={'Giá đàm phán'}
                    name={'negotiatePrice'}
                    rules={[{ required: true, message: 'Vui lòng nhập giá đàm phán' }]}
                >
                    <AppInputNumber
                        size={'large'}
                        placeholder={'Nhập giá bạn muốn trả'}
                    />
                </Form.Item>

                <Form.Item
                    label={'File CV ứng tuyển'}
                    name={'attachments'}
                    rules={[{ required: true, message: 'Vui lòng upload tài liệu' }]}
                    valuePropName={'fileList'}
                    getValueFromEvent={(e) => e.fileList}
                >
                    <Upload
                        beforeUpload={(fileInfo, files) => {
                            form.setFieldValue('attachments', files);
                            return false;
                        }}
                        onRemove={() => form.setFieldValue('attachments', [])}
                        accept={['.doc', '.docx', '.pdf'].join(',')}
                        maxCount={5}
                        multiple={true}
                        className={'uploadFullWidth'}
                    >
                        <Row className={'uploadDropzoneContainer'} justify={'space-between'} align={'middle'}>
                            <Typography.Paragraph type={'secondary'} className={'nm-typo'}>
                                Hỗ trợ tệp PDF, CSV..
                            </Typography.Paragraph>

                            <Button size={'small'} icon={(<UploadOutlined />)}>
                                Tải file
                            </Button>
                        </Row>
                    </Upload>
                </Form.Item>

                <Typography.Paragraph type={'secondary'}>1. Viết ngắn gọn về bản thân (điểm mạnh, điểm yếu) và kinh nghiệm phù hợp với công việc này để gây ấn tượng với khách hàng sẽ nâng cao cơ hội cho bạn.</Typography.Paragraph>
                <Typography.Paragraph type={'secondary'}>2. Bạn có thể tải lên tối đa 5 tệp bao gồm CV, tài liệu, sản phẩm của mình để chứng minh năng lực.</Typography.Paragraph>
            </Form>
            <Row justify={'center'}>
                <Button
                    onClick={form.submit}
                    loading={applyMutation.isLoading}
                    disabled={applyMutation.isLoading}
                    type={'primary'}
                    style={{ marginTop: '20px', minWidth: '480px' }}
                >
                    {applyMutation.isLoading ? 'Đang nộp hồ sơ ứng tuyển' : 'Nộp hồ sơ ứng tuyển'}
                </Button>
            </Row>
        </Modal>
    );

});

ApplyJobModal.displayName = 'ApplyJobModal';

export default ApplyJobModal;
