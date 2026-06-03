import { GetServerSidePropsContext } from 'next/types';
import CookieUtils from '@/src/utils/CookieUtils';
import JobEditFormScreen from '@/src/screens/JobScreen/JobEditFormScreen/JobEditFormScreen';

export const getServerSideProps = async(context: GetServerSidePropsContext) => {
    if (!CookieUtils.hasAccessToken(context)) {
        return {
            redirect: {
                destination: '/login',
                permanent: true,
            },
        };
    }

    const jobId: number | any = context?.query?.id || '';

    return {
        props: {
            jobId: Number(jobId),
        },
    };
};

function Component(props: any) {
  return <JobEditFormScreen {...props} />
}

export default Component;
