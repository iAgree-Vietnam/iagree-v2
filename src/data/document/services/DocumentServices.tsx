import { DatasResource } from '@/src/data/base/models/base.types';
import apiUtils from '@/src/utils/APIUtils';
import EndpointConfig from '@/src/constants/EndpointConfig';
import { DocumentCommentParams, DocumentCommentResource, DocumentResource, DocumentSharedParams, DocumentSharedResource, DocumentUpdateParams, DocumentUploadParams } from '@/src/data/document/models/document.types';
import { RawDocumentCommentResource, RawDocumentResource, RawDocumentSharedResource } from '@/src/data/document/models/document.raw';
import { DocumentParseUtils } from '@/src/data/document/utils/DocumentParseUtils';
import URLUtils from '@/src/utils/URLUtils';
import { RcFile } from 'antd/lib/upload';
import datetimeUtils from '@/src/utils/DatetimeUtils';

export default class DocumentServices {

    get(queryParams: any): Promise<DatasResource<DocumentResource>> {
        return new Promise((resolve, reject) => {
            apiUtils.get(EndpointConfig.DOCUMENT_LIST, { params: queryParams })
                .then((apiRes) => {
                    const dataResponse: DatasResource<RawDocumentResource> = apiRes.data;

                    resolve({
                        items: dataResponse.items.map(DocumentParseUtils.item),
                        total: dataResponse.total,
                    });
                })
                .catch(reject);
        });
    }

    onUpdate(params: DocumentUpdateParams) {
        return new Promise((resolve, reject) => {
            const endpointUrl = URLUtils.bindUrl(EndpointConfig.DOCUMENT_DELETE, { ':documentId': params.documentId });

            const formDatas = {
                name: params.title,
                body: params.body,
            };

            apiUtils.put(endpointUrl, formDatas)
                .then((apiRes) => resolve(apiRes.data))
                .catch(reject);
        });
    }

    onDelete(documentResource: DocumentResource) {
        return new Promise((resolve, reject) => {
            const endpointUrl = URLUtils.bindUrl(EndpointConfig.DOCUMENT_DELETE, { ':documentId': documentResource.documentId });

            apiUtils.delete(endpointUrl, {})
                .then((apiRes) => resolve(apiRes.data))
                .catch(reject);
        });
    }

    onUpload(uploadParams: DocumentUploadParams) {
        return new Promise((resolve, reject) => {
            const attachmentResource = uploadParams.attachments[0] as any;

            const formDatas = new FormData();
            formDatas.append('name', uploadParams.title);
            formDatas.append('file', attachmentResource?.originFileObj);

            apiUtils.post(EndpointConfig.DOCUMENT_UPLOAD, formDatas, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then(resolve)
                .catch(reject);
        });
    }

    getShared(queryParams?: any): Promise<DocumentSharedResource[]> {
        return new Promise((resolve, reject) => {
            apiUtils.get(EndpointConfig.DOCUMENT_SHARE_LIST, { params: queryParams })
                .then((apiRes) => {
                    const dataResponse: RawDocumentSharedResource[] = apiRes.data;

                    resolve(dataResponse.map(DocumentParseUtils.itemShared));
                })
                .catch(reject);
        });
    }

    getSharePreview(documentShareId: number) {
        const endpointUrl = URLUtils.bindUrl(EndpointConfig.DOCUMENT_PREVIEW_SHARE, { ':documentShareId': documentShareId });

        return new Promise((resolve, reject) => {
            apiUtils.post(endpointUrl, {}, {
                responseType: 'arraybuffer',
            })
                .then((apiRes) => {
                    resolve(URL.createObjectURL(new Blob([apiRes.data], { type: 'application/pdf' })));
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    onApproveShared(documentShareId: number) {
        return new Promise((resolve, reject) => {
            const endpointUrl = URLUtils.bindUrl(EndpointConfig.DOCUMENT_APPROVE_SHARE, { ':documentShareId': documentShareId });

            apiUtils.post(endpointUrl)
                .then((apiRes) => resolve(apiRes.data))
                .catch(reject);
        });
    }

    onRejectShared(documentShareId: number) {
        return new Promise((resolve, reject) => {
            const endpointUrl = URLUtils.bindUrl(EndpointConfig.DOCUMENT_REJECT_SHARE, { ':documentShareId': documentShareId });

            apiUtils.post(endpointUrl)
                .then((apiRes) => resolve(apiRes.data))
                .catch(reject);
        });
    }

    onCancelShared(documentShareId: number) {
        return new Promise((resolve, reject) => {
            const endpointUrl = URLUtils.bindUrl(EndpointConfig.DOCUMENT_CANCEL_SHARE, { ':documentShareId': documentShareId });

            apiUtils.post(endpointUrl)
                .then((apiRes) => resolve(apiRes.data))
                .catch(reject);
        });
    }

    onShare(variables: DocumentSharedParams) {
        return new Promise((resolve, reject) => {
            const { documentId, ...params} = variables;
            const endpointUrl = URLUtils.bindUrl(EndpointConfig.DOCUMENT_SHARE, { ':documentId': documentId });

            apiUtils.post(endpointUrl, params)
                .then((apiRes) => resolve(apiRes.data))
                .catch(reject);
        });
    }

    getComments(documentId: number): Promise<DocumentCommentResource[]> {
        return new Promise((resolve, reject) => {
            const endpointUrl = URLUtils.bindUrl(EndpointConfig.DOCUMENT_COMMENTS_LIST, { ':documentId': documentId });

            apiUtils.get(endpointUrl)
                .then((apiRes) => {
                    const dataResponse: RawDocumentCommentResource[] = apiRes.data;

                    resolve(dataResponse.sort((a, b) => 
                         datetimeUtils.getMoment(b.created_at)?.diff(datetimeUtils.getMoment(a.created_at)) || 0
                    ).map(DocumentParseUtils.itemComment));
                })
                .catch(reject);
        });
    }

    onComment(variables: DocumentCommentParams) {
        return new Promise((resolve, reject) => {
            const { documentId, ...params} = variables;
            const endpointUrl = URLUtils.bindUrl(EndpointConfig.DOCUMENT_CREATE_COMMENT, { ':documentId': documentId });

            apiUtils.post(endpointUrl, params)
                .then((apiRes) => resolve(apiRes.data))
                .catch(reject);
        });
    }

}
