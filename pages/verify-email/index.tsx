import React, { useEffect } from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { GetServerSidePropsContext } from 'next/types';
import Head from 'next/head';
import { Breadcrumb, Typography } from 'antd';

import BackendAuthServices from '@/src/data/auth/services/BackendAuthServices';
import RootLayout from '@/src/layouts/RootLayout';
import Cookies from 'js-cookie';
import Constants from '@/src/constants/Constants';
import { useQueryClient } from '@tanstack/react-query';
import { useAccountContext } from '@/src/contexts/AccountContext';
import { useRouter } from 'next/router';
import { IconSvgLocal } from '@/src/components/icon-svg-local';

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const confirmation_code: string | any =
    context?.query?.confirmation_code || '';
  try {
    const apiRes = await new BackendAuthServices(context).verifyEmail({
      confirmation_code,
    }) as any;

    return {
      props: { token: apiRes?.data?.token },
    };

    // redirect to login page and show message verify email success
    // return {
    //   redirect: {
    //     destination: `/login?callback=${StringUtils.encodeValue(Constants.KEY_VERIFY_EMAIL)}`,
    //     permanent: true,
    //   },
    // };
  } catch (error) {
    return {
      props: { error },
    };
  }
};

export default function Component(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { error, token } = props;

  const router = useRouter();
  const queryClient = useQueryClient();
  const { setAccessToken } = useAccountContext();

  useEffect(() => {
    if (token) {
      Cookies.set(Constants.KEY_ACCESS_TOKEN, token);
      setAccessToken(token);
      queryClient.invalidateQueries(['AUTH_FETCH_PROFILE']).then(() => null);

      router.replace('/');
    }
  }, [queryClient, router, setAccessToken, token])

  return (
    <RootLayout>
      <Head>
        <title>{token ? 'Xác thực tài khoản thành công' : 'Oops! Lỗi xác thực tài khoản'}</title>
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
              { title: 'Xác thực tài khoản' },
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
              type={error ? 'danger' : 'success'}
            >
              {error ? error.message : 'Xác thực tài khoản thành công'}
            </Typography.Title>
            {token &&
              <Typography.Paragraph className={'text-center transactionRedirectText'}>
                Bạn sẽ được chuyển hướng trong giây lát...
              </Typography.Paragraph>
            }
          </div>
        </div>
      </section>
    </RootLayout>
  );
}
