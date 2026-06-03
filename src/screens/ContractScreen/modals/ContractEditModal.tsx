import React, { useCallback, useImperativeHandle, useState } from 'react';
import { Button, Form, Input, Modal, Radio, Row } from 'antd';
import AppDatePicker from '@/src/components/date/DatePicker';
import useContractUpdate from '@/src/screens/ContractScreen/hooks/useContractUpdate';
import { FullContractResource } from '@/src/data/contract/models/contract.types';
import datetimeUtils from '@/src/utils/DatetimeUtils';
import Constants from '../../../constants/Constants';
import moment from 'moment';
import { withThemeRevert } from '@/theme';

export interface ContractEditModalizeHelperVisible {
    open: (contractResource: FullContractResource) => void;
    close: () => void;
}

const ContractEditModal = React.forwardRef((_, ref) => {

    const [form] = Form.useForm();
    const [contractResource, setContractResource] = useState<FullContractResource | null>(null);

    const open = useCallback((contractResource: FullContractResource) => setContractResource(contractResource), []);
    const close = useCallback(() => setContractResource(null), []);

    useImperativeHandle(ref, useCallback(() => ({ open, close }), [open, close]));

    const updateMutation = useContractUpdate({ onSuccess: close });

    return (
        <Modal
            title={'Sửa thông tin hợp đồng'}
            open={Boolean(contractResource)}
            className={'applyJobModalContainer'}
            okText={updateMutation.isLoading ? 'Đang cập nhật, xin đợi...' : 'Xác nhận'}
            footer={null}
            onCancel={close}
            width={500}
        >
            <Form
                form={form}
                layout={'vertical'}
                initialValues={{
                    name: contractResource?.name,
                    userName: contractResource?.userName,
                    lastModifiedDate: datetimeUtils.getMoment(contractResource?.lastModifiedDate || ''),
                    signType: contractResource?.signType,
                }}
                onFinish={(values) => {
                    const time = moment().format(datetimeUtils.LOCAL_TIME);
                    updateMutation.mutate({
                        ...contractResource,
                        ...values,
                        lastModifiedDate: moment(`${values.lastModifiedDate.format(datetimeUtils.LOCAL_DATE)} ${time}`, datetimeUtils.LOCAL_DATE_TIME).toISOString(),
                    });
                }}
            >
                <Form.Item
                    label={'Tên hợp đồng'}
                    name={'name'}
                    rules={[{ required: true, message: 'Vui lòng nhập tên hợp đồng' }]}
                >
                    <Input
                        placeholder={'Nhập tên hợp đồng'}
                    />
                </Form.Item>

                <Form.Item
                    label={'Tên người tạo hợp đồng'}
                    name={'userName'}
                    rules={[{ required: true, message: 'Vui lòng nhập tên người tạo hợp đồng' }]}
                >
                    <Input
                        placeholder={'Nhập tên người tạo hợp đồng'}
                    />
                </Form.Item>

                <Form.Item
                    label={'Ngày tạo'}
                    name={'lastModifiedDate'}
                    rules={[{ required: true, message: 'Vui lòng chọn ngày tạo hợp đồng' }]}
                >
                    <AppDatePicker
                        format={datetimeUtils.LOCAL_DATE}
                        placeholder={'Chọn ngày tạo hợp đồng'}
                        className={'full-width'}
                    />
                </Form.Item>

                <Form.Item
                    label={'Cách thức ký'}
                    name={'signType'}
                    rules={[{ required: true, message: 'Vui lòng chọn cách thức ký' }]}
                >
                    <Radio.Group
                        options={[
                            { value: Constants.CONTRACT.SIGN_TYPE.LAN_LUOT, label: 'Ký lần lượt' },
                            { value: Constants.CONTRACT.SIGN_TYPE.SONG_SONG, label: 'Ký song song' },
                        ]}
                    />
                </Form.Item>
            </Form>
            <Row justify={'center'}>
                {withThemeRevert(
                    <Button
                        onClick={form.submit}
                        loading={updateMutation.isLoading}
                        disabled={updateMutation.isLoading}
                        type={'primary'}
                        style={{ width: '120px' }}
                    >
                        {updateMutation.isLoading ? 'Đang lưu...' : 'Lưu'}
                    </Button>
                )}
            </Row>
        </Modal>
    );
});

ContractEditModal.displayName = 'ContractEditModal';

export default ContractEditModal;
