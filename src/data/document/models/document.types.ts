import { SettingResource } from '@/src/data/setting/models/setting.types';
import { SampleDocumentCategoryWithDocumentsResource } from '@/src/data/template/models/template.types';
import { FullProfileResource } from '@/src/data/auth/models/types';

export interface DocumentResource {
    documentId: number;
    name: string;
    createdDate: string;
    updatedDate: string;
}

export interface FullDocumentResource extends DocumentResource {
    templateId: number;
    body: string;
    status: number;
}

export interface DocumentFilterParams {
    page: number;
    search: string | null;
}

export interface DocumentDetailInitResource extends FullDocumentResource {
    sampleDocuments: SampleDocumentCategoryWithDocumentsResource[];
    setting: SettingResource;
}

export interface DocumentUpdateParams {
    documentId: number;
    title: string;
    body: string;
}

export interface DocumentUploadParams {
    title: string;
    attachments: File[];
}
export interface DocumentSharedResource {
    documentShareId: number;
    documentId: number;
    name: string;
    status: number;
    userShare: Partial<FullProfileResource>;
    userView: Partial<FullProfileResource>
    createdDate: string;
    updatedDate: string;
}
export interface DocumentSharedParams {
    documentId: number;
    userIds: string[];
}
export interface DocumentCommentResource {
    id: number;
    userId: number;
    documentId: number;
    parentId: number | null;
    comment: string;
    status: number;
    createdDate: string;
    updatedDate: string;
    user: Partial<FullProfileResource> | null;
    replies: DocumentCommentResource[];
}
export interface DocumentCommentParams {
    documentId: number;
    commentId?: number;
    comment: string;
}

export interface DocumentDirectPreviewParams {
    body: string;
    title: string;
    documentId: number;
}