import { DocumentCommentResource, DocumentDetailInitResource, DocumentResource, DocumentSharedResource, FullDocumentResource } from '@/src/data/document/models/document.types';
import { RawDocumentCommentResource, RawDocumentDetailInitResource, RawDocumentResource, RawDocumentSharedResource, RawFullDocumentResource } from '@/src/data/document/models/document.raw';
import datetimeUtils from '@/src/utils/DatetimeUtils';
import { SettingParserUtils } from '@/src/data/setting/utils/SettingParserUtils';
import { TemplateParseUtils } from '@/src/data/template/utils/TemplateParseUtils';
import { AuthParseUtils } from '@/src/data/auth/utils/AuthParseUtils';

export const DocumentParseUtils = {

    item(dataItem: RawDocumentResource): DocumentResource {
        return {
            documentId: dataItem.id,
            name: dataItem.name,
            createdDate: dataItem.created_at ? datetimeUtils.getMoment(dataItem.created_at)?.format(datetimeUtils.LOCAL_DATE_TIME) || '' : '',
            updatedDate: dataItem.updated_at ? datetimeUtils.getMoment(dataItem.updated_at)?.format(datetimeUtils.LOCAL_DATE_TIME) || '' : '',
        };
    },

    fullItem(dataItem: RawFullDocumentResource): FullDocumentResource {
        return {
            ...this.item(dataItem as RawFullDocumentResource),
            templateId: dataItem.template_id,
            body: dataItem.body,
            status: dataItem.status,
        };
    },

    detailInit(dataItem: RawDocumentDetailInitResource): DocumentDetailInitResource {
        return {
            ...this.fullItem(dataItem.document),
            sampleDocuments: TemplateParseUtils.templatesDraftParser(dataItem.templatesDraft),
            setting: SettingParserUtils.data(dataItem.setting),
        };
    },

    itemShared(dataItem: RawDocumentSharedResource): DocumentSharedResource {
        return {
            documentShareId: dataItem.id,
            documentId: dataItem.document?.id,
            name: dataItem.document?.name,
            status: dataItem.status,
            userShare: AuthParseUtils.profile(dataItem.user_share),
            userView: AuthParseUtils.profile(dataItem.user_view),
            createdDate: dataItem.document?.created_at ? datetimeUtils.getMoment(dataItem.document.created_at)?.format(datetimeUtils.LOCAL_DATE_TIME) || '' : '',
            updatedDate: dataItem.document?.updated_at ? datetimeUtils.getMoment(dataItem.document.updated_at)?.format(datetimeUtils.LOCAL_DATE_TIME) || '' : '',
        };
    },

    itemComment(dataItem: RawDocumentCommentResource): DocumentCommentResource {
        return {
            id: dataItem.id,
            documentId: dataItem.document_id,
            userId: dataItem.user_id,
            parentId: dataItem.parent_id,
            comment: dataItem.comment,
            status: dataItem.status,
            user: dataItem.user ? AuthParseUtils.profile(dataItem.user) : null,
            createdDate: dataItem.created_at ? datetimeUtils.getMoment(dataItem.created_at)?.format(datetimeUtils.LOCAL_DATE_TIME) || '' : '',
            updatedDate: dataItem.updated_at ? datetimeUtils.getMoment(dataItem.updated_at)?.format(datetimeUtils.LOCAL_DATE_TIME) || '' : '',
            replies: dataItem.replies.map(DocumentParseUtils.itemComment),
        }
    }

};
