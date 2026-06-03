import StringUtils from '@/src/utils/StringUtils';
import { DocumentResource, DocumentSharedResource } from '@/src/data/document/models/document.types';

export default class DocumentRouteUtils {

    static toScreen(queryParams: any) {
        return `/documents`;
    }

    static toSharedScreen(queryParams: any) {
        return `/documents/van-ban-duoc-chia-se`;
    }

    static toSharedDetailsUrl(documentResource: DocumentSharedResource) {
        return `/documents/van-ban-duoc-chia-se/${StringUtils.slugify(documentResource.name)}.${documentResource.documentShareId}`;
    }

    static toEditUrl(documentResource: DocumentResource) {
        return `/documents/${StringUtils.slugify(documentResource.name)}.${documentResource.documentId}`;
    }

}
