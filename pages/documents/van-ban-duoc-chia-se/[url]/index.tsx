import DocumentSharedDetailsScreen from '@/src/screens/DocumentScreen/DocumentSharedDetailsScreen/DocumentSharedDetailsScreen';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { GetServerSidePropsContext } from 'next/types';
import BackendDocumentServices from '@/src/data/document/services/BackendDocumentServices';
import Seo from '@/src/components/Seo';
import { ConstantConfig } from '@/src/constants/Config';

export const getServerSideProps: GetServerSideProps = async(context: GetServerSidePropsContext) => {
    const slug: string | any = context?.query?.url || '';
    const slugList: string[] = slug?.split('.');
    const documentShareId = slugList.length > 1 ? slugList[1] : 0;

    return {
        props: {
            data: { documentShareId },
        },
    };
};

export default function Component(props: InferGetServerSidePropsType<typeof getServerSideProps>) {

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
        <DocumentSharedDetailsScreen
            {...props}
        />
        </>
    );
}
