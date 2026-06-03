import React, { useCallback, useImperativeHandle, useState, useEffect } from 'react';
import { Button, Checkbox, Form, Input, Modal, Radio, Row, Typography, Col } from 'antd';
import { withThemeRevert } from '@/theme';

const { TextArea } = Input;

interface ContractConfirmResource {
    id: number;
    job: {
        id: number;
        name: string;
        price: number;
        description: string;
        suggestion: string;
        suggest_price: number;
    };
    partner: {
        id: number;
        name: string;
    };
    messages: Array<{
        id: number;
        side: 'left' | 'right';
        text: string;
    }>                                                                                                                                                                                                                                                                                      ;
}

export interface ClientConfirmContractModalizeHelperVisible {
    open: (contractConfirm: ContractConfirmResource) => void;
    close: () => void;
}

const ClientConfirmContractModal = React.forwardRef((_, ref) => {

    const [form] = Form.useForm();
    const [contractConfirmResource, setContractConfirmResource] = useState<ContractConfirmResource | null>(null);
    const [autoFillSuggestPrice, setAutoFillSuggestPrice] = useState<{suggest: boolean}>({suggest: false});
    const [autoFillPrice, setAutoFillPrice] = useState<{suggest: boolean}>({suggest: false});

    const open = useCallback((contractConfirmResource: ContractConfirmResource) => {
        setContractConfirmResource(contractConfirmResource);
    }, []);
    // const close = useCallback(() => setContractConfirmResource(null), []);
    const close = useCallback(() => {
        setContractConfirmResource(null);
        form.resetFields();
        setAutoFillSuggestPrice({suggest: false});
        setAutoFillPrice({suggest: false});
    }, [form]);

    useImperativeHandle(ref, useCallback(() => ({ open, close }), [open, close]));

    useEffect(() => {
        if (contractConfirmResource) {
            form.setFieldsValue({
                jobName: contractConfirmResource.job.name,
                jobDescription: contractConfirmResource.job.description,
                partnerName: contractConfirmResource.partner.name,
                jobSuggestion: contractConfirmResource.job.suggestion,
            })
        }
    }, [contractConfirmResource, form])

    useEffect(() => {
        if (autoFillSuggestPrice.suggest && contractConfirmResource?.job.suggest_price) {
            form.setFieldsValue({ price: contractConfirmResource.job.suggest_price });
        }
        if (autoFillPrice.suggest && contractConfirmResource?.job.price) {
            form.setFieldsValue({ price: contractConfirmResource.job.price });
        }
    }, [autoFillSuggestPrice, autoFillPrice, contractConfirmResource, form]);

    // const updateMutation = useContractUpdate({ onSuccess: close });

    return (
        <Modal
            title={'Xác nhận hợp đồng'}
            open={Boolean(contractConfirmResource)}
            className={'applyJobModalContainer'}
            // okText={updateMutation.isLoading ? 'Đang cập nhật, xin đợi...' : 'Xác nhận'}
            footer={null}
            onCancel={close}
            // width={500}
        >
            <Form
                form={form}
                layout={'vertical'}
                // initialValues={{
                //     jobName: contractConfirmResource?.job.name,
                //     jobDescription: contractConfirmResource?.job.description,
                //     partnerName: contractConfirmResource?.partner.name,
                //     jobSuggestion: contractConfirmResource?.job.suggestion,
                // }}
                // onFinish={(values) => {
                //     const time = moment().format(datetimeUtils.LOCAL_TIME);
                //     updateMutation.mutate({
                //         ...contractResource,
                //         ...values,
                //         lastModifiedDate: moment(`${values.lastModifiedDate.format(datetimeUtils.LOCAL_DATE)} ${time}`, datetimeUtils.LOCAL_DATE_TIME).toISOString(),
                //     });
                // }}
            >
                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label={'Tên công việc'}
                            name={'jobName'}
                        >
                            <Input disabled />
                        </Form.Item>

                        <Form.Item
                            label={'Partner name'}
                            name={'partnerName'}
                        >
                            <Input disabled />
                        </Form.Item>
                        
                        <Form.Item
                            label={'Price'}
                            name={'price'}
                        >
                            <Input type="number" />
                        </Form.Item>

                        <Form.Item>
                            <Checkbox
                                checked={autoFillSuggestPrice.suggest}
                                onChange={e => {
                                    setAutoFillSuggestPrice({
                                        suggest: e.target.checked
                                    });
                                    if (e.target.checked) {
                                        setAutoFillPrice({ suggest: false });
                                    }
                                }}
                            >
                                Sử dụng giá đề xuất ({contractConfirmResource?.job.suggest_price})
                            </Checkbox>

                            <Checkbox
                                checked={autoFillPrice.suggest}
                                onChange={e => {
                                    setAutoFillPrice({
                                        suggest: e.target.checked
                                    });
                                    if (e.target.checked) {
                                        setAutoFillSuggestPrice({ suggest: false });
                                    }
                                }}
                            >
                                Sử dụng giá ban đầu ({contractConfirmResource?.job.price})
                            </Checkbox>
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            label={'Mô tả công việc'}
                            name={'jobDescription'}
                        >
                            <TextArea rows={5} disabled />
                        </Form.Item>

                        <Form.Item
                            label={'Đề xuất của đối tác'}
                            name={'jobSuggestion'}
                        >
                            <TextArea rows={5} disabled />
                        </Form.Item>
                    </Col>
                </Row>
                {/* <Form.Item
                    label={'Nội dung công việc'}
                    name={'jobSuggestion'}
                >
                    <TextArea rows={4} />
                </Form.Item> */}
            </Form>

            <Row justify={'center'}>
                <Button onClick={close} style={{ marginRight: 8 }}>
                    Hủy
                </Button>
                {withThemeRevert(
                    <Button
                        onClick={form.submit}
                        // loading={updateMutation.isLoading}
                        // disabled={updateMutation.isLoading}
                        type={'primary'}
                        style={{ width: '120px' }}
                    >
                        {/* {updateMutation.isLoading ? 'Đang lưu...' : 'Lưu'} */}
                        Xác nhận
                    </Button>
                )}
            </Row>
        </Modal>
    );
});

ClientConfirmContractModal.displayName = 'ClientConfirmContractModal';

export default ClientConfirmContractModal;
