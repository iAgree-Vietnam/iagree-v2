import { DatasResource } from '../../base/models/base.types';
import { BannerResource } from '../../banner/models/banner.types';
import { TemplateResource } from '../../template/models/template.types';
import { FullJobResource, JobResource } from '../../job/models/job.types';
import { PostResource } from '../../post/models/post.types';
import { AboutUsResource } from '../../aboutus/models/aboutus.types';
import { SearchResource } from '../../search/models/search.types';
import { CategoryResource } from '../../category/models/category.types';
import { LocationResource } from '../../location/models/location.types';
import { SettingResource } from '../../setting/models/setting.types';
import { PartnerResource } from '../../partner/models/partner.types';
import { FullJobResourceV2 } from '../../job/models/v2/job.types';

/**
 * @see RawHomeResponse
 */
export interface HomeInitResource {
    banners: Partial<DatasResource<BannerResource>>;
    templates: Partial<DatasResource<TemplateResource>>;
    // jobs: Partial<DatasResource<FullJobResource>>;
    jobs: Partial<DatasResource<FullJobResourceV2>>;
    post: Partial<DatasResource<PostResource>>;
    aboutUs: Partial<AboutUsResource>;

    popularSearchs: Partial<DatasResource<SearchResource>>;
    templateCategories: Partial<DatasResource<CategoryResource>>;
    // jobCategories: DatasResource<CategoryResource>;
    jobCategories: Partial<CategoryResource[]>;
    locations: Partial<DatasResource<LocationResource>>;
    partners: Partial<PartnerResource>[];
    getAboutUsReport: Partial<AboutUsReport>;
    setting: Partial<SettingResource>;
}

export interface AboutUsReport {
    getTotalPartner: number;
    getTotalReview: number;
    getTotalUser: number;
    getTotalClients: number;
    getTotalOrder: number;
    getTotalProjectCompleted: number;
}

interface SuggestItem {
    name: string;
}

export interface HomeSuggestResponse extends SuggestItem {
    keyword: string;
    templates: SuggestItem[];
    jobs: SuggestItem[];
    partners: SuggestItem[];
}

export interface HomeSuggestOption {
    value?: string;
    type?: string;
    label?: string;
    options?: HomeSuggestOption[];
}

export interface HomeSuggestParams {
    name: string;
}
