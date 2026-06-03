/* eslint-disable import/no-unused-modules */
import React, { useCallback, useImperativeHandle, useMemo, useState } from 'react';
import { Form, Input, Modal, Typography } from 'antd';

import { PackageItem } from '@/src/data/pricing/models/pricing.types';
import { useAllUserSuspend } from '../hooks/useAllUserSuspend';
import { useRouter } from 'next/router';
import { useAccountContext } from '@/src/contexts/AccountContext';
import Constants from '@/src/constants/Constants';
import AuthRouteUtils from '@/src/data/auth/utils/AuthRouteUtils';

type AllUserSuspendModalProps = {
    packageItem: PackageItem;
};

const AllUserSuspendModal = React.forwardRef(
    (props: AllUserSuspendModalProps, ref) => {
        const router = useRouter()
        const { auth: userInfo } = useAccountContext();

        const [form] = Form.useForm();
        const [isOpen, setOpen] = useState(false);

        const { packageItem } = props;

        const open = useCallback(() => setOpen(true), []);
        const close = useCallback(() => setOpen(false), []);

        useImperativeHandle(
            ref,
            useCallback(() => ({ open, close }), [open, close])
        );

        const { mutate: mutateConnect, isLoading } = useAllUserSuspend({
            onSuccess: () => {
                close();
                form.resetFields();
                router.reload();
            },
            // onError: () => close(),
        });

        const okText = useMemo(() => {
            if (userInfo?.accountTypeCreated === Constants.ACCOUNT_TYPE_CREATED.GOOGLE) {
                return 'Thiết lập mật khẩu mới';
            }
            else {
                return isLoading ? 'Đang thực hiện, xin đợi...' : 'Xác nhận';
            }
        }, [userInfo, isLoading]);

        const onOk = useCallback(() => {
            if (userInfo?.accountTypeCreated === Constants.ACCOUNT_TYPE_CREATED.GOOGLE) {
                router.push(AuthRouteUtils.toForgotPassword());
            }
            else {
                form.submit();
            }
        }, [userInfo, form, router]);

        return (
            <Modal
                title={`Hủy gói dịch vụ ${packageItem.name}`}
                open={isOpen}
                className={'applyJobModalContainer'}
                okText={okText}
                cancelText={'Trở lại'}
                okButtonProps={{
                    disabled: isLoading,
                    loading: isLoading,
                }}
                onOk={onOk}
                onCancel={close}
            >
                {userInfo && userInfo.accountTypeCreated === Constants.ACCOUNT_TYPE_CREATED.EMAIL &&
                    <Form
                        form={form}
                        layout={'vertical'}
                        initialValues={{
                            package_id: packageItem.packageId,
                            password: null,
                        }}
                        onFinish={mutateConnect}
                    >
                        <Form.Item name={'package_id'} style={{ height: 0, margin: 0 }} />
                        <Form.Item
                            label={'Để xác nhận, vui lòng nhập mật khẩu vào ô bên dưới'}
                            name={'password'}
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                        >
                            <Input.Password
                                size={'large'}
                                placeholder={'Nhập mật khẩu của bạn'}
                            />
                        </Form.Item>
                    </Form>
                }
                {userInfo && userInfo.accountTypeCreated === Constants.ACCOUNT_TYPE_CREATED.GOOGLE &&
                    <Typography style={{ margin: '24px 0px' }}>Để hủy gói dịch vụ, vui lòng thiết lập mật khẩu mới cho tài khoản của bạn.</Typography>
                }
            </Modal>
        );
    }
);

AllUserSuspendModal.displayName = 'AllUserSuspendModal';

export default AllUserSuspendModal;
