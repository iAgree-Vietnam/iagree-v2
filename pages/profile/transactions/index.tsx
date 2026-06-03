import React from 'react';
import { GetServerSidePropsContext } from 'next/types';
import TransactionScreen from '@/src/screens/ProfileScreen/TransactionScreen/TransactionScreen';

export const getServerSideProps = async(context: GetServerSidePropsContext) => {
    return {
        props: {},
    };
};

function Component(props: any) {

    return (
        <TransactionScreen
            {...props}
        />
    );
}

export default Component;
