import { DatasResource } from '@/src/data/base/models/base.types';
import { RawSettingResource } from '@/src/data/setting/models/setting.raw';
import { RawTemplateDraftResource } from '@/src/data/template/models/template.raw';
import { RawProfileResponse } from '@/src/data/auth/models/types';

export interface RawDocumentResource {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface RawFullDocumentResource extends RawDocumentResource {
    user_id: number;
    template_id: number;
    body: string;
    status: number;
}

export interface RawDocumentDetailInitResource {
    document: RawFullDocumentResource;
    templatesDraft: DatasResource<RawTemplateDraftResource>;
    setting: RawSettingResource[];
}
export interface RawDocumentSharedResource {
    id: number;
    document_id: number;
    status: number;
    document: RawFullDocumentResource;
    user_share: RawProfileResponse;
    user_view: RawProfileResponse;
}
export interface RawDocumentCommentResource {
    id: number;
    user_id: number;
    document_id: number;
    parent_id: number | null;
    comment: string;
    status: number;
    created_at: string;
    updated_at: string;
    user: RawProfileResponse;
    replies: RawDocumentCommentResource[];
}