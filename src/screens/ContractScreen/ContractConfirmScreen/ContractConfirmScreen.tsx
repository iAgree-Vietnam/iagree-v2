import React, { useRef } from 'react';
import RootLayout from '@/src/layouts/RootLayout';
import Head from 'next/head';
import { Breadcrumb, Button, Col, Form, Input, Radio, Row, Typography } from 'antd';
import { useRouter } from 'next/router';
import dialogUtils from '@/src/utils/DialogUtils';
import useContractConfirmMailSign from '@/src/screens/ContractScreen/hooks/flow/useContractConfirmMailSign';
import Constants from '@/src/constants/Constants';
import { IconSvgLocal } from '@/src/components/icon-svg-local';
import useContractPreviewConfirmMailSign from '../hooks/flow/useContractPreviewConfirmMailSign';
import dynamic from 'next/dynamic';
import ContractPreviewModal, { ModalizeContractPreviewHelperVisible } from './components/ContractPreviewModal';
import { useBreakpoint } from '@/src/hooks/useBreakpoint';

function ContractConfirmScreen(props: any) {

    const router = useRouter();
    const [form] = Form.useForm();

    const { isDesktop } = useBreakpoint();

    const confirmMailSignMutation = useContractConfirmMailSign();
    const { data: fileUrl } = useContractPreviewConfirmMailSign(router.query?.code as string);

    const contractPreviewModalRef =
        useRef<ModalizeContractPreviewHelperVisible | null>(null);

    return (
        <RootLayout>
            {/* <Head>
                <title>Xác nhận yêu cầu ký duyệt</title>
                <link
                    rel={'stylesheet'}
                    type={'text/css'}
                    charSet={'UTF-8'}
                    href={
                        'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css'
                    }
                />
                <link
                    rel={'stylesheet'}
                    type={'text/css'}
                    href={
                        'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css'
                    }
                />
            </Head> */}

            <section className={'breadcrumbContainer'}>
                <div className="contentWrapper">
                    <Breadcrumb
                        items={[
                            {
                                title: (
                                    <>
                                        <IconSvgLocal name={'IC_HOME'} />
                                        <span>Trang chủ</span>
                                    </>
                                ),
                                href: '/',
                            },
                            { title: 'Xác nhận yêu cầu ký duyệt' },
                        ]}
                    />
                </div>
            </section>

            <section className={'sectionContainer transactionContainer'}>
                <div className="contentWrapper">
                    <div className={'transactionContentContainer'}>
                        <Typography.Title
                            level={1}
                            className={'text-center transactionTitle'}
                            style={{ marginTop: 10, color: '#09993E' }}
                        >
                            Xác nhận yêu cầu ký duyệt
                        </Typography.Title>

                        <Typography.Paragraph strong={true} className={'text-center'} type={'secondary'}>
                            <span>Xác nhận yêu cầu ký duyệt</span>
                        </Typography.Paragraph>

                        <Form
                            form={form}
                            layout={'vertical'}
                            initialValues={{
                                code: router.query?.code,
                                identify: null,
                                status: Constants.CONTRACT.CONFIRM_MAIL_STATUS.DONG_Y,
                            }}
                            onFinish={confirmMailSignMutation.mutate}
                            style={{ width: isDesktop ? '50%' : '90%', margin: '0 auto' }}
                        >
                            <Form.Item
                                label={'Mã xác nhận'}
                                name={'code'}
                                rules={[{ required: true, message: 'Vui lòng nhập mã xác nhận' }]}
                            >
                                <Input
                                    disabled={true}
                                    placeholder={'Nhập mã xác nhận'}
                                />
                            </Form.Item>

                            <Form.Item
                                label={'MySign ID'}
                                name={'identify'}
                                rules={[{ required: true, message: 'Vui lòng nhập MySignID' }]}
                            >
                                <Input
                                    placeholder={'Nhập MySign ID'}
                                />
                            </Form.Item>

                            <Form.Item
                                label={''}
                                name={'status'}
                                rules={[{ required: true, message: 'Vui lòng chọn 1 trong 2 tùy chọn' }]}
                            >
                                <Radio.Group
                                    options={[
                                        { label: 'Đồng ý', value: Constants.CONTRACT.CONFIRM_MAIL_STATUS.DONG_Y },
                                        { label: 'Từ chối', value: Constants.CONTRACT.CONFIRM_MAIL_STATUS.TU_CHOI },
                                    ]}
                                />
                            </Form.Item>

                            <Row gutter={[16, 16]} align={'middle'}>
                                {fileUrl &&
                                    <Col xs={24} lg={12} >
                                        <Button block={true} type={'default'} onClick={() => contractPreviewModalRef.current?.open(fileUrl)}>Xem hợp đồng</Button>
                                    </Col>
                                }
                                <Col xs={24} lg={fileUrl ? 12 : 24}>
                                    <Button block={true} type={'primary'} onClick={() => dialogUtils.showConfirmDialog('Bạn chắc chứ ?').then(() => form.submit())}>Đồng ý</Button>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </div>
            </section>

            <ContractPreviewModal ref={contractPreviewModalRef} />

        </RootLayout>
    );
}

export default ContractConfirmScreen;
