import React from 'react';
import { GetServerSidePropsContext } from 'next/types';
import TermOfUseScreen from '@/src/screens/TermOfUseScreen/TermOfUseScreen';
import BackendTermOfUseServices from '@/src/data/term-of-use/services/BackendTermOfUseServices';

export const getServerSideProps = async(context: GetServerSidePropsContext) => {
    const res = await new BackendTermOfUseServices(context).get();

    return {
        props: {data: res},
    };
};

function Component(props: any) {

    return (
        <TermOfUseScreen
            {...props}
        />
    );
}

export default Component;
