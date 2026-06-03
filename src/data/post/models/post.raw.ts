import { DatasResource } from "@/src/data/base/models/base.types";
import { RawSettingResource } from "@/src/data/setting/models/setting.raw";

export interface RawPostsResource { 
    posts: DatasResource<RawPostItem>;
    setting: RawSettingResource[],
}

export interface RawPostItem {
    id: number;
    title: string;
    short_description: string;
    description: string;
    photo: string;
    is_media: number;
    publish_date: string;
    status: number;
    created_at: string;
    updated_at: string;
}

export interface RawPostDetails {
    post: RawPostItem;
    top: RawPostItem[];
}