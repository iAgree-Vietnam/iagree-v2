import EndpointConfig from '@/src/constants/EndpointConfig';
import fetchUtil from '@/src/utils/BackendAPIUtils';
import URLUtils from '@/src/utils/URLUtils';
import BackendServices from '@/src/data/base/services/BackendServices';
import { DocumentParseUtils } from '@/src/data/document/utils/DocumentParseUtils';

export default class BackendDocumentServices extends BackendServices {

    getFullInfo(documentId: number) {
        return new Promise((resolve, reject) => {
            const endpointUrl = URLUtils.bindUrl(EndpointConfig.DOCUMENT_FULL_INFO, { ':documentId': documentId });

            fetchUtil(this.context, endpointUrl, {})
                .then((apiRes) => resolve(DocumentParseUtils.detailInit(apiRes)))
                .catch(reject);
        });
    }

}
