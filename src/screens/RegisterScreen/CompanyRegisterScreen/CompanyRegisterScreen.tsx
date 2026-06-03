/* eslint-disable import/no-unused-modules */

import React, { useEffect, useState } from 'react';
import AuthLayout from '@/src/layouts/AuthLayout';
import Head from 'next/head';
import {
    Button,
    Checkbox,
    Col,
    Divider,
    Form,
    Input,
    Row,
    Space,
    Typography,
} from 'antd';
import Link from 'next/link';
import useCompanyRegister from './hooks/useCompanyRegister';
import ValidatorUtils from '@/src/utils/ValidatorUtils';
import { signIn } from 'next-auth/react';
import TermOfUseRouteUtils from '@/src/data/term-of-use/utils/TermOfUseRouteUtils';
import PrivacyPolicyRouteUtils from '@/src/data/privacy-policy/utils/PrivacyPolicyRouteUtils';
import { IconSvgLocal } from '@/src/components/icon-svg-local';

function CompanyRegisterScreen(props: any) {
    const companyRegisterMutation = useCompanyRegister();
    const [form] = Form.useForm();
    const [useGeneratePassword, setUseGeneratePassword] = useState<{ generate: boolean }>({ generate: false });

    const handleRegister = async () => {
        const values = await form.validateFields();
        companyRegisterMutation.mutate(values);
    }

    const generatePassword = () => {
        const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
        const numberChars = '0123456789';
        const specialChars = '!@#$%^&*()_+{}[]:;<>,.?~-';

        // Ensure at least one of each required character type
        const password = [
            uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)],
            lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)],
            numberChars[Math.floor(Math.random() * numberChars.length)],
            specialChars[Math.floor(Math.random() * specialChars.length)]
        ];

        // Add additional random characters to reach minimum length of 8
        const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;
        while (password.length < 12) { // Using 12 for better security
            password.push(allChars[Math.floor(Math.random() * allChars.length)]);
        }

        // Shuffle the password array to randomize character positions
        for (let i = password.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [password[i], password[j]] = [password[j], password[i]];
        }

        return password.join('');
    };

    useEffect(() => {
        if (useGeneratePassword.generate) {
            const generatedPassword = generatePassword();
            form.setFieldsValue({ password: generatedPassword });
            form.setFieldsValue({ passwordConfirmation: generatedPassword });
        } else {
            form.setFieldsValue({ password: '' });
            form.setFieldsValue({ passwordConfirmation: '' });
        }
    }, [useGeneratePassword, form]);

    return (
        <AuthLayout>
            <Head>
                <title>Đăng ký tài khoản doanh nghiệp</title>
            </Head>

            <div className={'authContentWrapper'}>
                <div className={'authContentContainer'}>
                    <h1 className={'authTitle'}>Đăng ký tài khoản doanh nghiệp</h1>

                    <Form
                        form={form}
                        layout={'vertical'}
                        name={'authForm'}
                        initialValues={{
                            name: '',
                            email: '',
                            phone: '',
                            password: '',
                            passwordConfirmation: '',
                            acceptCondition: false,
                        }}
                        // onFinish={registerMutation.mutate}
                        // onFinish={(values) => {
                        //     console.log(values);
                        // }}
                        onFinishFailed={() => null}
                        autoComplete={'off'}
                    >
                        <Row gutter={[20, 0]}>
                            <Col xs={24} lg={24}>
                                <Form.Item
                                    label={'Tên doanh nghiệp'}
                                    name={'name'}
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập tên doanh nghiệp' },
                                    ]}
                                >
                                    <Input size={'large'} placeholder={'Tên doanh nghiệp'} />
                                </Form.Item>
                            </Col>

                            <Col xs={24} lg={12}>
                                <Form.Item
                                    label={'Mã số thuế'}
                                    name={'tax_code'}
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập mã số thuế' },
                                    ]}
                                >
                                    <Input size={'large'} placeholder={'Mã số thuế'} />
                                </Form.Item>
                            </Col>

                            <Col xs={24} lg={12}>
                                <Form.Item
                                    label={'Số điện thoại'}
                                    name={'phone'}
                                    normalize={(v) => v?.trim().replace(/\D/g, "")}
                                    rules={[
                                        // { required: true, message: 'Vui lòng nhập số điện thoại của bạn' },
                                        {
                                            pattern: /^[0-9]{10}$/,
                                            message: 'Số điện thoại không hợp lệ'
                                        }
                                    ]}
                                >
                                    <Input
                                        size={'large'} inputMode="numeric" placeholder={'Số điện thoại'} />
                                </Form.Item>
                            </Col>

                            <Col xs={24} lg={12}>
                                <Form.Item
                                    label={'Người đại diện'}
                                    name={'name_rep'}
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập tên người đại diện' },
                                    ]}
                                >
                                    <Input size={'large'} placeholder={'Người đại diện'} />
                                </Form.Item>
                            </Col>

                            <Col xs={24} lg={12}>
                                <Form.Item
                                    label={'Email doanh nghiệp'}
                                    name={'email'}
                                    rules={[{ required: true, message: 'Vui lòng nhập email của doanh nghiệp' }]}
                                >
                                    <Input size={'large'} placeholder={'Nhập email của doanh nghiệp'} />
                                </Form.Item>
                            </Col>

                            <Col xs={24} lg={12}>
                                <Form.Item
                                    label={'Mật khẩu'}
                                    name={'password'}
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập mật khẩu' },
                                        { validator: ValidatorUtils.passwordValidator },
                                    ]}
                                >
                                    <Input.Password
                                        size={'large'}
                                        placeholder={'Nhập mật khẩu'}
                                    />
                                </Form.Item>

                                <Checkbox
                                    checked={useGeneratePassword.generate}
                                    onChange={e => {
                                        setUseGeneratePassword({
                                            generate: e.target.checked
                                        });
                                    }}
                                >
                                    Đề xuất mật khẩu
                                </Checkbox>
                            </Col>

                            <Col xs={24} lg={12}>
                                <Form.Item
                                    label={'Xác nhận mật khẩu'}
                                    name={'passwordConfirmation'}
                                    dependencies={['password']}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập lại mật khẩu để xác nhận',
                                        },
                                        { validator: ValidatorUtils.passwordValidator },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('password') === value)
                                                    return Promise.resolve();

                                                return Promise.reject(
                                                    new Error('Mật khẩu bạn nhập đang không khớp')
                                                );
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password
                                        size={'large'}
                                        placeholder={'Nhập mật khẩu xác nhận'}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row justify={'center'}>
                            <Form.Item
                                name={'acceptCondition'}
                                valuePropName="checked"
                                rules={[
                                    {
                                        validator: async (_, checked) => {
                                            if (!checked) {
                                                return Promise.reject(
                                                    new Error(
                                                        'Bạn cần đồng ý với điều khoản dịch vụ và chính sách bảo mật của iAgree'
                                                    )
                                                );
                                            }
                                        },
                                    },
                                ]}
                            >
                                <Checkbox name={'acceptCondition'}>
                                    Tôi đã đọc và đồng ý với{' '}
                                    <Link
                                        target={'_blank'}
                                        href={TermOfUseRouteUtils.toScreen()}
                                        className={'termAndConditionLinkText link'}
                                    >
                                        Điều khoản dịch vụ
                                    </Link>{' '}
                                    và{' '}
                                    <Link
                                        target={'_blank'}
                                        href={PrivacyPolicyRouteUtils.toScreen()}
                                        className={'termAndConditionLinkText link'}
                                    >
                                        Chính sách bảo mật
                                    </Link>{' '}
                                    của iAgree
                                </Checkbox>
                            </Form.Item>
                        </Row>

                        <Row gutter={[20, 0]} style={{ display: 'flex', justifyContent: 'center' }}>
                            <Col xs={24} lg={12}>
                                <Form.Item>
                                    <Button
                                        type={'primary'}
                                        htmlType={'button'}
                                        block={true}
                                        size={'large'}
                                        // disabled={registerMutation.isLoading}
                                        onClick={handleRegister}
                                    >
                                        {companyRegisterMutation.isPending ? 'Đang đăng ký' : 'Đăng ký'}
                                        {/* {registerMutation.isLoading ? 'Đang đăng ký' : 'Xác thực qua email'} */}
                                    </Button>
                                </Form.Item>
                            </Col>
                            {/* <Col xs={24} lg={12}>
                                <Form.Item>
                                    <Button
                                        type={'default'}
                                        htmlType={'button'}
                                        block={true}
                                        size={'large'}
                                        className={'btnHasImageIcon'}
                                        onClick={() => signIn('google')}
                                    >
                                        Đăng ký bằng Google
                                    </Button>
                                </Form.Item>
                            </Col> */}
                        </Row>

                        <Divider>
                            Hoặc đăng ký bằng
                        </Divider>

                        <Row justify={'center'}>
                            <Button
                                type={'text'}
                                htmlType={'button'}
                                size={'large'}
                                icon={
                                    <IconSvgLocal name={'IC_GOOGLE'} width={40} height={40} />
                                }
                                className={'btnHasImageIcon'}
                                onClick={() => signIn('google')}
                            />
                        </Row>

                        <Row gutter={[10, 0]} justify={'center'}>
                            <Space size={'small'}>
                                <Typography.Paragraph className={'nm-typo'}>
                                    Đã có tài khoản?
                                </Typography.Paragraph>
                                <Link href={'/login'} className={'registerLinkText link'}>
                                    Đăng nhập ngay
                                </Link>
                            </Space>
                        </Row>
                    </Form>
                </div>
            </div>
        </AuthLayout>
    );
}

export default CompanyRegisterScreen;
