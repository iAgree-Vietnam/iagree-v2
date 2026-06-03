import RootLayout from '@/src/layouts/RootLayout';
import Head from 'next/head';
import Lottie from "lottie-react";
import { Typography } from 'antd';

import notFoundAnimation from '@/public/assets/lottie/404.json';

export default function NotFoundScreen() {
    return (
        <RootLayout>
            <Head>
                <title>Oops! 404 Not Found</title>
            </Head>

            <section className={'sectionContainer'}>
                <div className={'contentWrapper'}>
                    <Lottie animationData={notFoundAnimation} loop={true} className={'notFoundAnimation'} />
                    <div className={'notFoundDescription'}>
                        <Typography.Title level={2}>Oops! Trang bạn tìm kiếm không tồn tại</Typography.Title>
                        <Typography>Rất tiếc, chúng tôi không thể tìm thấy trang mà bạn đang tìm kiếm. Có thể đường dẫn đã thay đổi hoặc trang này không còn tồn tại nữa.</Typography>
                    </div>
                </div>
            </section>
        </RootLayout>
    );
}
