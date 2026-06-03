import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Button, Form, Input, Typography } from 'antd';

import AuthLayout from '@/src/layouts/AuthLayout';
import useResetPassword from './hooks/useResetPassword';
import { ResetPasswordParams } from '@/src/data/auth/models/types';
import ValidatorUtils from '@/src/utils/ValidatorUtils';

function ResetPasswordScreen(props: any) {
  const { query, isReady } = useRouter();
  const { email, token } = query;

  const resetPasswordMutation = useResetPassword(token as string);

  if (!isReady) {
    return;
  }

  return (
    <AuthLayout>
      <Head>
        <title>Đặt lại mật khẩu</title>
      </Head>

      <div className={'authContentWrapper'}>
        <div className={'authContentContainer'}>
          <h1 className={'authTitle'}>Đặt lại mật khẩu</h1>
          <Typography.Paragraph className={'authDesc'}>
            Thiết lập mật khẩu mới cho tài khoản của bạn
          </Typography.Paragraph>

          <Form
            layout={'vertical'}
            name={'resetPasswordForm'}
            initialValues={
              {
                email: email,
                password: '',
                password_confirmation: '',
              } as ResetPasswordParams
            }
            onFinish={resetPasswordMutation.mutate}
            onFinishFailed={() => null}
            autoComplete={'off'}
          >
            <Form.Item
              label={'Email'}
              name={'email'}
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Vui lòng nhập email hợp lệ' },
              ]}
            >
              <Input
                size={'large'}
                placeholder={'Nhập email'}
                disabled
              />
            </Form.Item>

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

            <Form.Item
              label={'Nhập lại mật khẩu'}
              name={'password_confirmation'}
              dependencies={['password']}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập lại mật khẩu',
                },
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
                placeholder={'Nhập lại mật khẩu'}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type={'primary'}
                htmlType={'submit'}
                block={true}
                size={'large'}
                disabled={resetPasswordMutation.isLoading}
                loading={resetPasswordMutation.isLoading}
              >
                Đặt lại mật khẩu
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </AuthLayout>
  );
}

export default ResetPasswordScreen;
