import React from 'react';
import Head from 'next/head';
import AuthLayout from '@/src/layouts/AuthLayout';
import PersonalRegisterForm from './components/PersonalRegiserForm';

const PersonalRegisterScreenv2: React.FC = () => {
  return (
    <AuthLayout>
      <Head>
        <title>Đăng ký tài khoản</title>
      </Head>

      <div className="authContentWrapper">
        <div className="authContentContainer">
          <h1 className="authTitle">Đăng ký tài khoản</h1>
          <PersonalRegisterForm />
        </div>
      </div>
    </AuthLayout>
  );
};

export default PersonalRegisterScreenv2;