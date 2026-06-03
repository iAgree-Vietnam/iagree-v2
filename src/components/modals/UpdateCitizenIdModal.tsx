import React, { useCallback, useImperativeHandle, useState } from 'react';
import {
    Button,
    Col,
    Form,
    Input,
    message,
    Modal,
    Row,
    Space,
    Typography,
} from 'antd';

import { useMutationCitizenId } from '@/src/screens/ProfileScreen/hooks/useMutationCitizenId';
import { useQueryClient } from '@tanstack/react-query';
import PrivacyPolicyRouteUtils from '@/src/data/privacy-policy/utils/PrivacyPolicyRouteUtils';
import Link from 'next/link';
import { withThemeRevert } from '@/theme';
import AuthRouteUtils from '@/src/data/auth/utils/AuthRouteUtils';
import { useRouter } from 'next/router';

type UpdateCitizenIdModalProps = {
    title: string;
    okText: string;
    subTitle: React.ReactNode;
    onSuccess?: () => void;
};

const UpdateCitizenIdModal = React.forwardRef(
    ({ title, okText, subTitle, onSuccess }: UpdateCitizenIdModalProps, ref) => {
        // const queryClient = useQueryClient();

        // const [form] = Form.useForm();
        const router = useRouter();
        const [isOpen, setOpen] = useState(false);

        const open = useCallback(() => setOpen(true), []);
        const close = useCallback(() => setOpen(false), []);

        useImperativeHandle(
            ref,
            useCallback(() => ({ open, close }), [open, close])
        );

        // const { mutateAsync, isLoading } = useMutationCitizenId();

        // const onFormFinish = async (formData: any) => {
        //     try {
        //         await mutateAsync(formData.citizenId);

        //         await queryClient.invalidateQueries(['AUTH_FETCH_PROFILE']);
        //         message
        //             .success('Cập nhật thông tin tài khoản thành công')
        //             .then(() => { });
        //         close();
        //         form.resetFields();
        //         onSuccess?.();
        //     } catch (error) {
        //         close();
        //     }
        // };

        return (
            <Modal
                title={title}
                open={isOpen}
                className={'updateCitizenIdModalContainer'}
                onCancel={close}
                footer={null}
                width={'652px'}
            >
                <Row justify={'center'} gutter={[30, 30]}>
                    <Col span={24}>
                        <Typography.Paragraph
                            className={'modalSubtitle'}
                            style={{ marginBottom: '40px' }}
                        >
                            {subTitle}
                        </Typography.Paragraph>
                        {/* <Form
                            form={form}
                            layout={'vertical'}
                            initialValues={{
                                citizenId: '',
                            }}
                            onFinish={onFormFinish}
                        >
                            <Form.Item
                                label={'MySignID (Số CCCD)'}
                                name={'citizenId'}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập MySignID / Số CCCD',
                                    },
                                    {
                                        min: 10,
                                        message: 'Vui lòng nhập MySignID / Số CCCD hợp lệ',
                                    },
                                    {
                                        max: 12,
                                        message: 'Vui lòng nhập MySignID / Số CCCD hợp lệ',
                                    },
                                ]}
                            >
                                <Input
                                    size={'large'}
                                    placeholder={
                                        'Nhập MySignID'
                                    }
                                />
                            </Form.Item>
                            <Space
                                direction={'vertical'}
                                className={'mySignSupport d-flex'}
                                size={10}
                            >
                                <Space size={'small'}>
                                    <Typography.Paragraph className={'nm-typo'}>
                                        Nếu bạn chưa có MySign ID, hãy đăng ký ngay
                                    </Typography.Paragraph>
                                    <Link
                                        href={PrivacyPolicyRouteUtils.toMySignSupport()}
                                        className={'registerLinkText link'}
                                    >
                                        tại đây
                                    </Link>
                                </Space>
                                <Typography.Paragraph className={'nm-typo'}>
                                    Đăng ký MySignID ngay hôm nay để xác thực chỉ trong vài phút và bắt đầu khám phá những 
                                    tiện ích trên iAgree một cách nhanh chóng và thuận tiện hơn bao giờ hết!
                                </Typography.Paragraph>
                            </Space>
                        </Form> */}
                    </Col>
                    {withThemeRevert(
                        <Button
                            // onClick={form.submit}
                            onClick={() => (router.push(AuthRouteUtils.toProfile()))}
                            type={'primary'}
                            // disabled={isLoading}
                            // loading={isLoading}
                        >
                            {/* {isLoading ? 'Đang thực hiện, xin đợi...' : okText} */}
                            { okText }
                        </Button>
                    )}
                </Row>
            </Modal>
        );
    }
);

UpdateCitizenIdModal.displayName = 'UpdateCitizenIdModal';

export default UpdateCitizenIdModal;
