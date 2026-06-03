import DocumentEditScreen from '@/src/screens/DocumentScreen/DocumentEditScreen/DocumentEditScreen';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { GetServerSidePropsContext } from 'next/types';
import BackendDocumentServices from '@/src/data/document/services/BackendDocumentServices';

export const getServerSideProps: GetServerSideProps = async(context: GetServerSidePropsContext) => {
    const slug: string | any = context?.query?.url || '';
    const slugList: string[] = slug?.split('.');
    const documentId = slugList.length > 1 ? slugList[1] : 0;
    const apiRes = await new BackendDocumentServices(context).getFullInfo(documentId as number);

    return {
        props: {
            data: apiRes,
        },
    };
};

export default function Component(props: InferGetServerSidePropsType<typeof getServerSideProps>) {

    return (
        <DocumentEditScreen
            {...props}
        />
    );
}
