import { GetServerSidePropsContext } from 'next/types';

export default abstract class BackendServices {

    // context: GetServerSidePropsContext;
    protected context?: GetServerSidePropsContext;

    public constructor(context?: GetServerSidePropsContext) {
        this.context = context;
    }

}
