import React, { useCallback, useImperativeHandle, useState } from 'react';
import { Alert, Button, Form, Input, Modal, Row, Space, Typography, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import useContractSignSave from '@/src/screens/ContractScreen/hooks/sign/useContractSignSave';
import { ContractMySignInfo, FullContractResource } from '@/src/data/contract/models/contract.types';
import useContractCheckMySignId from '@/src/screens/ContractScreen/hooks/sign/useContractCheckMySignId';
import { withThemeRevert } from '@/theme';

interface ContractSignModalProps {
    data: FullContractResource,
}

const ContractSignModal = React.forwardRef((props: ContractSignModalProps, ref) => {

    const fullContractResource = props.data;

    const [form] = Form.useForm();
    const [isOpen, setOpen] = useState(false);
    const [mySignInfo, setMySignInfo] = useState<ContractMySignInfo>();

    const open = useCallback(() => setOpen(true), []);
    const close = useCallback(() => setOpen(false), []);

    useImperativeHandle(ref, useCallback(() => ({ open, close }), [open, close]));

    const contractSignSaveSuccess = useCallback(() => {
        close();
        setTimeout(() => {
            form.resetFields();
            setMySignInfo(undefined);
        }, 300);
    }, [form, close]);

    const saveMutation = useContractSignSave(fullContractResource, {
        onSuccess: contractSignSaveSuccess,
    });

    const checkMySignIdMutation = useContractCheckMySignId();

    return (
        <Modal
            title={'Thêm người ký'}
            open={isOpen}
            className={'applyJobModalContainer'}
            footer={null}
            onCancel={close}
            width={500}
        >
            <Form
                form={form}
                layout={'vertical'}
                initialValues={{
                    mySignId: null,
                    email: null,
                    attachments: [],
                }}
                onFinish={saveMutation.mutate}
            >
                <Form.Item
                    label={'MySign ID'}
                    name={'mySignId'}
                    required
                    rules={[{
                        validator(_, value,) {
                            setMySignInfo(undefined);
                            if (value) {
                                return new Promise(async (resolve, reject) => {
                                    try {
                                        const res = await checkMySignIdMutation.mutateAsync({ identify: value });
                                        setMySignInfo(res as ContractMySignInfo);
                                        return resolve(res);
                                    } catch (err: any) {
                                        return reject(new Error(err?.response?.data?.message || 'Chưa tồn tại thuê bao My Sign'));
                                    }
                                });
                            }
                            else return Promise.reject(new Error('Vui lòng nhập MySign ID'));
                        },
                    }]}
                    validateTrigger={'onBlur'}
                    validateStatus={form.isFieldValidating('mySignId') ? 'validating' : undefined}
                    hasFeedback={form.isFieldValidating('mySignId')}
                >
                    <Space direction={'vertical'} size={'middle'} className={'d-flex'}>
                        <Input
                            placeholder={'Nhập MySign ID'}
                        />
                        {mySignInfo &&
                            <Alert
                                message={`Họ tên: ${mySignInfo.signName}`}
                                description={`Địa chỉ: ${mySignInfo.address}`}
                                type={'success'}
                                showIcon
                                className={'mySignIdAlert'}
                            />
                        }
                    </Space>
                </Form.Item>

                <Form.Item
                    label={'Email'}
                    name={'email'}
                    rules={[{ required: true, message: 'Vui lòng nhập email' }]}
                >
                    <Input
                        placeholder={'Nhập email người ký'}
                    />
                </Form.Item>

                <Form.Item
                    label={'Chữ ký'}
                    name={'attachments'}
                    valuePropName={'fileList'}
                    getValueFromEvent={(e) => e.fileList}
                >
                    <Upload
                        beforeUpload={(fileInfo, files) => {
                            form.setFieldValue('attachments', files);
                            return false;
                        }}
                        onRemove={() => form.setFieldValue('attachments', [])}
                        accept={['.jpg', '.jpeg', '.png'].join(',')}
                        maxCount={1}
                        className={'uploadFullWidth'}
                        listType={'picture'}
                    >
                        <Row className={'uploadDropzoneContainer'} justify={'space-between'} align={'middle'}>
                            <Typography.Paragraph type={'secondary'} className={'nm-typo'}>
                                Hỗ trợ tệp JPG, JPEG, PNG
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
                        loading={saveMutation.isLoading}
                        disabled={saveMutation.isLoading}
                        type={'primary'}
                    >
                        {saveMutation.isLoading ? 'Đang thêm người ký...' : 'Thêm người ký'}
                    </Button>
                )}
            </Row>
        </Modal>
    );
});

ContractSignModal.displayName = 'ContractSignModal';

export default ContractSignModal;
