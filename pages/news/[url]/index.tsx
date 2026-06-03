import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { GetServerSidePropsContext } from 'next/types';

import NewsDetailScreen from '@/src/screens/NewsScreen/NewsDetailScreen/NewsDetailScreen';
import BackendPostServices from '@/src/data/post/services/BackendPostServices';

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
    const slug: string | any = context?.query?.url||'';
    const slugList: string[] = slug?.split('.');
    const postId = slugList.length > 1 ? slugList[1] : 0;
    const apiRes = await new BackendPostServices(context).getFullInfo(postId as number);

    return {
        props: {
            data: apiRes,
        },
    };
};

export default function Component(props: InferGetServerSidePropsType<typeof getServerSideProps>) {

    return (
        <NewsDetailScreen
            {...props}
        />
    );
}
