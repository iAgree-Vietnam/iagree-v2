import axios, { AxiosError, AxiosResponse } from 'axios';
import qs from 'qs';
import Constants from '../constants/Constants';
import _ from 'lodash';
import Cookies from 'js-cookie';

const apiUtils = axios.create({
    baseURL: process.env.API_BASE_URL,
    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'comma', strictNullHandling: true, skipNulls: true }),
});

apiUtils.interceptors.request.use((request) => {
    const accessToken = Cookies.get(Constants.KEY_ACCESS_TOKEN)||null;

    // @ts-ignore
    request.headers = {
        ...request.headers||{},
        Authorization: _.isEmpty(request.headers?.Authorization) ? `Bearer ${accessToken}` : request.headers?.Authorization,
    };

    return request;
});

apiUtils.interceptors.response.use(
    function (response: AxiosResponse) {
        if (_.has(response, 'data.errorMessage')&& !_.isEmpty(response.data.errorMessage)) return Promise.reject({ response });

        return Promise.resolve(response);
    },
    async function (error: AxiosError | Error) {
        return Promise.reject(error);
    },
);

export default apiUtils;
