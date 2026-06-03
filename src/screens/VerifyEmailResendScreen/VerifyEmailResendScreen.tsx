import React from 'react';
import Head from 'next/head';
import { Button, Form, Input, Space, Typography } from 'antd';
import { CheckCircleTwoTone } from '@ant-design/icons';

import AuthLayout from '@/src/layouts/AuthLayout';
import useVerifyEmailResend from './hooks/useVerifyEmailResend';
import { VerifyEmailResendParams } from '@/src/data/auth/models/types';

function VerifyEmailResendScreen(props: any) {
  const { data: email } = props;

  const { mutate, isLoading } = useVerifyEmailResend();

  return (
    <AuthLayout>
      <Head>
        <title>Xác thực tài khoản</title>
      </Head>

      <div className={'authContentaaWrapper'}>
        <div className={'authContentContainer'}>
          <h1 className={'authTitle'}>Xác thực tài khoản</h1>
          <Typography.Paragraph className={'authDesc'}>
            Xác thực tài khoản để hoàn tất quá trình đăng ký
          </Typography.Paragraph>
          <Space
            size={'middle'}
            align={'center'}
            className={'successMessageWrapper'}
          >
            <CheckCircleTwoTone
              twoToneColor="#52c41a"
              className={'successIcon'}
            />
            <Typography.Paragraph className={'successMessage'}>
              Hãy kiểm tra email của bạn. Sau đó nhấn vào link trong hộp thư để
              xác thực tài khoản.
            </Typography.Paragraph>
          </Space>
          <Form
            layout={'vertical'}
            name={'resetPasswordForm'}
            initialValues={
              {
                email: email,
              } as VerifyEmailResendParams
            }
            onFinish={mutate}
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
                placeholder={'name@company.com'}
                disabled
              />
            </Form.Item>
            <Typography.Paragraph className={'successMessage d-inline-block'}>
              Bạn không nhận được email xác thực?
            </Typography.Paragraph>
            <Button
              className={'d-inline-block resend-verify-email'}
              type={'link'}
              htmlType={'submit'}
              size={'large'}
              disabled={isLoading}
            >
              Gửi lại
            </Button>
          </Form>
        </div>
      </div>
    </AuthLayout>
  );
}

export default VerifyEmailResendScreen;
