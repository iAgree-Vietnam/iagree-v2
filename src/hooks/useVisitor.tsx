import { useEffect, useState } from 'react';
import Constants from '../constants/Constants';

export default function useVisitor() {

    const [accessToken, setAccessToken] = useState(null);
    const [auth, setAuth] = useState(null);

    useEffect(() => {
        const accessTokenFromStorage = window.localStorage.getItem(Constants.KEY_ACCESS_TOKEN);


    }, []);

    return {
        accessToken: accessToken,
        auth: null,
        isLoading: false,
        refetch: () => {
        },
        remove: () => {
        },
    };

}
