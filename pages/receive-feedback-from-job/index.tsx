import { FeedbackFromSocialOrganizationScreen } from '@/src/screens/FeedbackFromSocialOrganizationScreen/FeedbackFromSocialOrganizationScreen';
import { FeedbackFormScreen } from '@/src/screens/FeetbackFromJob/FeedbackFromJob';
import CookieUtils from '@/src/utils/CookieUtils';
import { GetServerSidePropsContext } from 'next';

export const getServerSideProps = async(context: GetServerSidePropsContext) => {
    if (!CookieUtils.hasAccessToken(context)) {}

    return {
        props: {},
    };
};

function Component(props: any) {

    return (
        <FeedbackFormScreen
            {...props}
        />
    );
}

export default Component;

