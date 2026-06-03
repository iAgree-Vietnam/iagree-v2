import React, { useCallback, useImperativeHandle, useState } from 'react';
import { Button, Form, Input, Modal, Row, Typography, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import useContractSave from '@/src/screens/ContractScreen/hooks/useContractSave';
import { ContractResource } from '@/src/data/contract/models/contract.types';
import { withThemeRevert } from '@/theme';

type ContractUploadModalProps = {
    onView: (contractResource: ContractResource) => void;
}

const ContractUploadModal = React.forwardRef((props: ContractUploadModalProps, ref) => {

    const onView = props.onView;

    const [form] = Form.useForm();
    const [isOpen, setOpen] = useState(false);

    const open = useCallback(() => setOpen(true), []);
    const close = useCallback(() => setOpen(false), []);

    useImperativeHandle(ref, useCallback(() => ({ open, close }), [open, close]));

    const onContractSaveSuccess = useCallback((data: ContractResource) => {
        close();
        onView(data);
        form.resetFields();
    }, [close, onView]);

    const contractSaveMutation = useContractSave({
        onSuccess: onContractSaveSuccess,
    });

    return (
        <Modal
            title={'Upload file ký'}
            open={isOpen}
            className={'applyJobModalContainer'}
            footer={null}
            onCancel={close}
        >
            <Form
                form={form}
                layout={'vertical'}
                initialValues={{
                    name: null,
                    attachments: [],
                }}
                onFinish={contractSaveMutation.mutate}
            >
                <Form.Item
                    label={'Tên hợp đồng'}
                    name={'name'}
                    rules={[{ required: true, message: 'Vui lòng nhập tên hợp đồng' }]}
                >
                    <Input
                        size={'large'}
                        placeholder={'Nhập tên hợp đồng'}
                    />
                </Form.Item>

                <Form.Item
                    label={''}
                    name={'attachments'}
                    rules={[{ required: true, message: 'Vui lòng upload hợp đồng' }]}
                    valuePropName={'fileList'}
                    getValueFromEvent={(e) => e.fileList}
                >
                    <Upload
                        beforeUpload={(fileInfo, files) => {
                            form.setFieldValue('attachments', files);
                            return false;
                        }}
                        onRemove={() => form.setFieldValue('attachments', [])}
                        accept={['.pdf'].join(',')}
                        maxCount={5}
                        multiple={true}
                        className={'uploadFullWidth'}
                    >
                        <Row className={'uploadDropzoneContainer'} justify={'space-between'} align={'middle'}>
                            <Typography.Paragraph type={'secondary'} className={'nm-typo'}>
                                Vui lòng tải lên tệp PDF
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
                        loading={contractSaveMutation.isLoading}
                        disabled={contractSaveMutation.isLoading}
                        type={'primary'}
                        style={{ width: '150px' }}
                    >
                        {contractSaveMutation.isLoading ? 'Đang tải...' : 'Tải file'}
                    </Button>
                )}
            </Row>
        </Modal>
    );

});

ContractUploadModal.displayName = 'ContractUploadModal';

export default ContractUploadModal;
