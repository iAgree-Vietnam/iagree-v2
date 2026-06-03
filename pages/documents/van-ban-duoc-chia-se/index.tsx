import React from 'react';
import DocumentSharedScreen from '@/src/screens/DocumentScreen/DocumentSharedScreen/DocumentSharedScreen';
import { GetServerSidePropsContext } from 'next/types';
import CookieUtils from '@/src/utils/CookieUtils';
import Seo from '@/src/components/Seo';
import { ConstantConfig } from '@/src/constants/Config';

export const getServerSideProps = async(context: GetServerSidePropsContext) => {
    if (!CookieUtils.hasAccessToken(context)) {
        return {
            redirect: {
                destination: '/login',
                permanent: true,
            },
        };
    }

    return {
        props: {},
    };
};

function Component(props: any) {

    return (
        <>
          <Seo
        title={"Tài liệu của tôi"}
        description={
          "Quản lý và theo dõi tài liệu của bạn trên iAgree. Trang này yêu cầu đăng nhập."
        }
        canonicalPath="/documents"
        ogImage={ConstantConfig.DEFAULT_OG_IMAGE?.[0]?.url}
      />
        <DocumentSharedScreen
            {...props}
        />
        </>
    );
}

export default Component;
