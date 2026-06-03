import React from 'react';
import { Input, Button, Form, Row, Col } from 'antd';

import { ChangePasswordParams } from '@/src/data/auth/models/types';
import useChangePassword from '@/src/screens/PasswordScreen/hooks/useChangePassword';
import ValidatorUtils from '@/src/utils/ValidatorUtils';

export function ChangePasswordForm() {
  const [form] = Form.useForm();

  const resetForm = () => {
    form.setFieldValue('old_password', '');
    form.setFieldValue('new_password', '');
    form.setFieldValue('new_password_confirmation', '');
  };

  const changPasswordMutation = useChangePassword({ onSuccess: resetForm });

  return (
    <Form
      layout={'vertical'}
      name={'resetPasswordForm'}
      initialValues={
        {
          old_password: '',
          new_password: '',
          new_password_confirmation: '',
        } as ChangePasswordParams
      }
      onFinish={changPasswordMutation.mutate}
      form={form}
      autoComplete={'off'}
    >
      <Form.Item
        label={'Mật khẩu hiện tại'}
        name={'old_password'}
        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
      >
        <Input.Password
          size={'large'}
          placeholder={'Nhập mật khẩu hiện tại'}
          // iconRender={(visible) => <></>}
        />
      </Form.Item>

      <Form.Item
        label={'Mật khẩu mới'}
        name={'new_password'}
        rules={[
          { required: true, message: 'Vui lòng nhập mật khẩu mới' },
          { validator: ValidatorUtils.passwordValidator },
        ]}
      >
        <Input.Password
          size={'large'}
          placeholder={'Nhập mật khẩu mới'}
        />
      </Form.Item>

      <Form.Item
        label={'Nhập lại mật khẩu mới'}
        name={'new_password_confirmation'}
        dependencies={['new_password']}
        rules={[
          {
            required: true,
            message: 'Vui lòng nhập lại mật khẩu mới',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('new_password') === value)
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
          placeholder={'Nhập lại mật khẩu mới'}
        />
      </Form.Item>

      <Row style={{ paddingTop: '20px' }}>
        <Col xs={24} lg={5}>
          <Button
            type={'default'}
            htmlType={'submit'}
            block={true}
            size={'middle'}
            disabled={changPasswordMutation.isLoading}
            loading={changPasswordMutation.isLoading}
          >
            Đổi mật khẩu
          </Button>
        </Col>
      </Row>
    </Form>
  );
}
