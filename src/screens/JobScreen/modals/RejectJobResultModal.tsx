import React, { useCallback, useImperativeHandle, useState } from 'react';
import { Button, Form, Input, Modal, Row, Typography } from 'antd';
import { FullJobResource } from '../../../data/job/models/job.types';
import useRejectJobResult from '../hooks/useRejectJobResult';
import Constants from '@/src/constants/Constants';

const { Text } = Typography;

type RejectJobResultModalProps = {
    data: FullJobResource;
    onSubmit: (description: string) => void; 
    onRefetch?: () => Promise<any>;
    loading?: boolean;
}

const RejectJobResultModal = React.forwardRef((props: RejectJobResultModalProps, ref) => {
    const [form] = Form.useForm();
    const [isOpen, setOpen] = useState(false);

    const open = useCallback(() => {
        setOpen(true);
        form.resetFields();
    }, [form]);
    
    const close = useCallback(() => {
        setOpen(false);
        form.resetFields();
    }, [form]);

    useImperativeHandle(ref, useCallback(() => ({ open, close }), [open, close]));

    const handleSubmit = (values: any) => {        
        props.onSubmit(values.description);
        close();
    };

    const maxLength = Constants.REASON_MAX_LENGTH;
    const description = Form.useWatch("description", form);
    const currentLength = description ? description.length : 0;

    return (
        <Modal
            title={'Xác nhận từ chối nghiệm thu'}
            open={isOpen}
            className={'agreeJobModalContainer'}
            footer={null}
            onCancel={close}
            width={'672px'}
            maskClosable={!props.loading}
            closable={!props.loading}
        >
            <Form
                form={form}
                layout={'vertical'}
                initialValues={{
                    description: null,
                }}
                // onFinish={rejectMutation.mutate}
                onFinish={handleSubmit}
            >
                <Form.Item
                    label={'Lý do từ chối là gì? Hãy để lại yêu cầu điều chỉnh để Đối tác thực hiện lại bạn nhé!'}
                    name={'description'}
                    rules={[
                        { required: true, message: 'Vui lòng nhập lý do từ chối' },
                        {
                            max: maxLength,
                            message: `Lý do không được vượt quá ${maxLength} ký tự.`,
                        },
                    ]}
                    style={{marginTop: '22px'}}
                >
                    <Input.TextArea
                        size={'large'}
                        placeholder={'Nhập lý do từ chối nghiệm thu'}
                        rows={5}
                        disabled={props.loading}
                    />
                </Form.Item>

                <div style={{ textAlign: "right", marginTop: "-12px" }}>
                    <Text
                        type="secondary"
                        style={{
                            color: currentLength > maxLength ? "red" : undefined,
                        }}
                    >
                        ({`${currentLength} / ${maxLength}`})
                    </Text>
                </div>
            </Form>
            <Row justify={'center'}>
                <Button
                    onClick={form.submit}
                    loading={props.loading} 
                    disabled={props.loading}
                    type={'primary'}
                >
                    {props.loading ? 'Đang từ chối, xin đợi...' : 'Xác nhận từ chối nghiệm thu'}
                </Button>
            </Row>
        </Modal>
    );

});

RejectJobResultModal.displayName = 'RejectJobResultModal';

export default RejectJobResultModal;
