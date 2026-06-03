import React from 'react';
import Head from 'next/head';
import { Breadcrumb, Button } from 'antd';

import RootLayout from '@/src/layouts/RootLayout';
import { ProfileContainer } from '@/src/components/ProfileContainer';
import { useAccountContext } from '@/src/contexts/AccountContext';
import { ChangePasswordForm } from './ChangePasswordForm';
import Constants from '@/src/constants/Constants';
import { useRouter } from 'next/router';
import AuthRouteUtils from '@/src/data/auth/utils/AuthRouteUtils';
import { IconSvgLocal } from '@/src/components/icon-svg-local';

export function ChangePasswordScreen() {
  const router = useRouter();
  const { auth: userInfo } = useAccountContext();


  return (
    <RootLayout>
      <Head>
        <title>Đổi mật khẩu</title>
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
              { title: 'Đổi mật khẩu' },
            ]}
          />
        </div>
      </section>
      <ProfileContainer>
        <h1 className={'pageHeaderTitle'}>Đổi mật khẩu</h1>
        {userInfo && userInfo.accountTypeCreated === Constants.ACCOUNT_TYPE_CREATED.EMAIL && <ChangePasswordForm />}
        {userInfo && userInfo.accountTypeCreated === Constants.ACCOUNT_TYPE_CREATED.GOOGLE && (
          <Button type={'default'} size={'large'} style={{ marginTop: '24px' }} onClick={() => router.push(AuthRouteUtils.toForgotPassword())}>
            Thiết lập mật khẩu mới cho tài khoản của bạn
          </Button>
        )}
      </ProfileContainer>
    </RootLayout>
  );
}
