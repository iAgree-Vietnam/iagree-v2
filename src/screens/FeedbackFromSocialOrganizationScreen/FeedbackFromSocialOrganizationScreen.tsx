import React, { useCallback, useState, useEffect } from 'react';
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Typography,
  Breadcrumb,
  Upload,
  message,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Head from 'next/head';
import _ from 'lodash';

import RootLayout from '@/src/layouts/RootLayout';
import { IconSvgLocal } from '@/src/components/icon-svg-local';
import { useRouter } from 'next/router';
import { usePartnerComplain } from '../PartnerScreen/hooks/usePartnerComplain';
import { RcFile } from 'antd/es/upload';
import Constants from '@/src/constants/Constants';

export function FeedbackFromSocialOrganizationScreen() {
  const pageTitle = 'Tiếp nhận phản ánh của tổ chức xã hội';

  const router = useRouter();

  const complainMutation = usePartnerComplain({
    onSuccess: () => form.resetFields(),
  });

  const [file, setFile] = useState<string | null>(null);
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);

  // Load reCAPTCHA script
  useEffect(() => {
    const loadRecaptchaScript = () => {
      if (document.getElementById('recaptcha-script')) {
        setRecaptchaLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.id = 'recaptcha-script';
      script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.GOOGLE_RECAPTCHA_KEY}`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setRecaptchaLoaded(true);
      };
      script.onerror = () => {
        console.error('Failed to load reCAPTCHA script');
        message.error('Không thể tải reCAPTCHA. Vui lòng thử lại sau.');
      };
      document.head.appendChild(script);
    };

    loadRecaptchaScript();
  }, []);

  // Execute reCAPTCHA
  const executeRecaptcha = useCallback(async (): Promise<string | null> => {
    if (!recaptchaLoaded || !window.grecaptcha) {
      message.error('reCAPTCHA chưa được tải. Vui lòng thử lại.');
      return null;
    }

    try {
      const token = await window.grecaptcha.execute(process.env.GOOGLE_RECAPTCHA_KEY as string, {
        action: 'feedback_submission'
      });
      return token;
    } catch (error) {
      console.error('reCAPTCHA execution failed:', error);
      message.error('Xác thực reCAPTCHA thất bại. Vui lòng thử lại.');
      return null;
    }
  }, [recaptchaLoaded]);

  const getBase64 = useCallback(
    (file: RcFile) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
      }),
    []
  );

  const [form] = Form.useForm();

  const handleFormSubmit = async (values: any) => {
    const recaptchaToken = await executeRecaptcha();
    
    if (!recaptchaToken) {
      return;
    }

    // Data that will be submitted
    const submissionData = {
      name: values.organizationName,
      address: values.organizationAddress,
      body: values.contentFeedback,
      email: values.organizationEmail,
      partner_url: values.sellerUrl,
      phone: values.organizationPhoneNumber,
      subject: values.title,
      file,
      recaptcha_token: recaptchaToken,
    };


    // Submit form with reCAPTCHA token
    complainMutation.mutate(submissionData);
  };

  function renderView() {
    return (
      <div className={'contentWrapper'}>
        <Form
          name={'jobForm'}
          form={form}
          initialValues={{
            organizationName: '',
            organizationPhoneNumber: '',
            sellerUrl: '',
            organizationAddress: '',
            organizationEmail: '',
            title: '',
            contentFeedback: '',
            attachments: [],
          }}
          onFinish={handleFormSubmit}
          layout={'vertical'}
          className={'jobFormContainer'}
        >
          <div className={'jobFormTitleContainer'}>
            <Typography.Title className={'jobFormTitle'} level={3}>
              {pageTitle}
            </Typography.Title>
          </div>

          <div className={'formGroupContainer'}>
            <div className={'formGroupContentContainer'}>
              <Row gutter={[20, 10]} justify={'space-between'}>
                <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                  <Form.Item
                    label={'Tên của tổ chức xã hội'}
                    name={'organizationName'}
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập tên của tổ chức xã hội',
                      },
                    ]}
                  >
                    <Input
                      size={'large'}
                      placeholder={
                        'Nhập tên đầy đủ của cơ quan, tổ chức xã hội'
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    label={'Điện thoại'}
                    name={'organizationPhoneNumber'}
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập số điện thoại',
                      },
                      {
                        type: 'string',
                        min: 10,
                        pattern: /^\d+$/,
                        message: 'Vui lòng nhập số điện thoại hợp lệ',
                      },
                    ]}
                  >
                    <Input size={'large'} placeholder={'Nhập số điện thoại'} />
                  </Form.Item>

                  <Form.Item
                    label={'Link gian hàng/người bán'}
                    name={'sellerUrl'}
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập link gian hàng/người bán',
                      },
                    ]}
                  >
                    <Input
                      size={'large'}
                      placeholder={'Nhập link gian hàng/người bán'}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                  <Form.Item
                    label={'Địa chỉ'}
                    name={'organizationAddress'}
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập địa chỉ',
                      },
                    ]}
                  >
                    <Input size={'large'} placeholder={'Nhập địa chỉ'} />
                  </Form.Item>

                  <Form.Item
                    label={'Email liên hệ'}
                    name={'organizationEmail'}
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập email liên hệ',
                      },
                      { type: 'email', message: 'Vui lòng nhập email hợp lệ' },
                    ]}
                  >
                    <Input size={'large'} placeholder={'Nhập email liên hệ'} />
                  </Form.Item>

                  <Form.Item
                    label={'Tiêu đề'}
                    name={'title'}
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập tiêu đề',
                      },
                    ]}
                  >
                    <Input size={'large'} placeholder={'Nhập tiêu đề'} />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={24}>
                  <Form.Item
                    label={'Nội dung phản ánh'}
                    name={'contentFeedback'}
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập nội dung phản ánh',
                      },
                    ]}
                  >
                    <Input.TextArea
                      rows={4}
                      size={'large'}
                      placeholder={'Nhập nội dung phản ánh'}
                    />
                  </Form.Item>

                  <Form.Item
                    label={'File đính kèm (nếu có)'}
                    name={'attachments'}
                    valuePropName={'fileList'}
                    getValueFromEvent={(e) => e.fileList}
                  >
                    <Upload
                      beforeUpload={async (fileInfo, files) => {
                        form.setFieldValue('attachments', files);
                        const base64 = await getBase64(fileInfo);
                        setFile(base64 as string);
                        return false;
                      }}
                      onRemove={() => form.setFieldValue('attachments', [])}
                      accept={['.doc', '.docx', '.pdf'].join(',')}
                      maxCount={1}
                      className={'uploadFullWidth'}
                    >
                      <Row
                        className={'uploadDropzoneContainer'}
                        justify={'space-between'}
                        align={'middle'}
                      >
                        <Typography.Paragraph
                          type={'secondary'}
                          className={'nm-typo'}
                        >
                          Thêm file đính kèm hoặc gửi tài liệu chứng minh (nếu
                          có)
                          <br />
                          Hỗ trợ tệp PDF, CSV..
                        </Typography.Paragraph>

                        <Button size={'small'} icon={<UploadOutlined />}>
                          Tải file
                        </Button>
                      </Row>
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </div>

          <Button
            size={'large'}
            block
            type={'primary'}
            loading={complainMutation.isLoading}
            disabled={complainMutation.isLoading || !recaptchaLoaded}
            onClick={() => {
              form.submit();
            }}
          >
            {complainMutation.isLoading ? 'Đang gửi...' : 'Gửi'}
          </Button>

          {/* reCAPTCHA notice */}
          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
              Trang web này được bảo vệ bởi reCAPTCHA và áp dụng{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Chính sách Bảo mật
              </a>{' '}
              và{' '}
              <a
                href="https://policies.google.com/terms"
                target="_blank"
                rel="noopener noreferrer"
              >
                Điều khoản Dịch vụ
              </a>{' '}
              của Google.
            </Typography.Text>
          </div>
        </Form>
      </div>
    );
  }

  return (
    <RootLayout>
      <Head>
        <title>{`${pageTitle}`}</title>
      </Head>
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
              { title: pageTitle },
            ]}
          />
        </div>
      </section>
      <section className={'sectionContainer'}>
        <div className={'jobFormSectionContainer'}>{renderView()}</div>
      </section>
    </RootLayout>
  );
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    grecaptcha: {
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}