import { message } from 'antd';
import { AxiosError } from 'axios';
import _ from 'lodash';

class DialogUtils {

    underConstruction() {
        message.warning('Chức năng hiện đang phát triển').then(r => null);
    }

    showResponseError(error: AxiosError | Error | any, apiName: string) {

        const apiErrorMessage = _.get(error, 'response.data.message');
        if (!_.isEmpty(apiErrorMessage)&&_.isString(apiErrorMessage)) return message.error(apiErrorMessage).then(() => null);

        message.error('Có lỗi xảy ra').then(() => null);
    }

    showConfirmDialog(message: string) {
        return new Promise((resolve, reject) => {
            const isConfirmed = window.confirm(message);

            isConfirmed ? resolve(true) : reject();
        });
    }

}

const dialogUtils = new DialogUtils();
export default dialogUtils;
