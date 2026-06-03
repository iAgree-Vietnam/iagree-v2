import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { GetServerSidePropsContext } from 'next/types';

import ContractsDetailScreen from '@/src/screens/ContractScreen/ContractDetailScreen/ContractDetailScreen';
import CookieUtils from '@/src/utils/CookieUtils';

export const getServerSideProps: GetServerSideProps = async (
    context: GetServerSidePropsContext
) => {
    if (!CookieUtils.hasAccessToken(context)) {
        return {
            redirect: {
                destination: '/login',
                permanent: true,
            },
        };
    }
    
    const slug: string | any = context?.query?.url || '';
    const slugList: string[] = slug?.split('.');
    const contractId = slugList.length > 1 ? slugList[1] : 0;

    return {
        props: {
            contractId,
        },
    };
};

export default function Component(
    props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
    return <ContractsDetailScreen {...props} />;
}
