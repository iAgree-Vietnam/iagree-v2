import React, { useCallback, useImperativeHandle, useState } from 'react';
import { Button, Form, Input, message, Modal, Row, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const UploadContractModal = React.forwardRef((props, ref) => {

    const [isOpen, setOpen] = useState(false);

    const open = useCallback(() => setOpen(true), []);
    const close = useCallback(() => setOpen(false), []);

    useImperativeHandle(ref, useCallback(() => ({open, close}), [open, close]));

    return (
        <Modal
            title={'Upload hợp đồng đã ký'}
            open={isOpen}
            className={'applyJobModalContainer'}
            okText={'Xác nhận'}
            cancelText={'Trở lại'}
            onOk={() => message.success('OK')}
            onCancel={close}
        >
            <Form
                layout={'vertical'}
            >
                <Form.Item
                    label={'Hợp đồng số'}
                    name={'contractNo'}
                    rules={[{required: true, message: 'Vui lòng nhập số hợp đồng'}]}
                >
                    <Input
                        size={'large'}
                        placeholder={'Nhập số hợp đồng'}
                    />
                </Form.Item>

                <Form.Item
                    label={'Tên hợp đồng'}
                    name={'contractName'}
                    rules={[{required: true, message: 'Vui lòng nhập tên hợp đồng'}]}
                >
                    <Input
                        size={'large'}
                        placeholder={'Nhập tên hợp đồng'}
                    />
                </Form.Item>

                <Form.Item
                    label={'Tên tài liệu'}
                    name={'documentName'}
                    rules={[{required: true, message: 'Vui lòng nhập tên tài liệu'}]}
                >
                    <Input
                        size={'large'}
                        placeholder={'Nhập tên tài liệu'}
                    />
                </Form.Item>

                <Form.Item
                    label={''}
                    name={'attachments'}
                    rules={[{required: true, message: 'Vui lòng upload tài liệu'}]}
                >

                    <Row className={'uploadDropzoneContainer'} justify={'space-between'} align={'middle'}>
                        <Typography.Paragraph type={'secondary'} className={'nm-typo'}>
                            Hỗ trợ tệp PDF, CSV..
                        </Typography.Paragraph>

                        <Button size={'small'} icon={(<UploadOutlined/>)}>
                            Tải file
                        </Button>
                    </Row>
                </Form.Item>
            </Form>
        </Modal>
    );
});

UploadContractModal.displayName = 'UploadContractModal';

export default UploadContractModal;
