import React from 'react';
import Head from 'next/head';
import AuthLayout from '@/src/layouts/AuthLayout';
import CompanyRegisterForm from './company/CompanyRegisterForm';

const CompanyRegisterScreenV2: React.FC = () => {
  return (
    <AuthLayout>
      <Head>
        <title>Đăng ký tài khoản doanh nghiệp</title>
      </Head>

      <div className="authContentWrapper">
        <div className="authContentContainer">
          <h1 className="authTitle">Đăng ký tài khoản doanh nghiệp</h1>
          <CompanyRegisterForm />
        </div>
      </div>
    </AuthLayout>
  );
};

export default CompanyRegisterScreenV2;