import { RawBannersResource } from '../../banner/models/banner.raw';
import { RawJobsResource } from '../../job/models/job.raw';
import { RawPostItem } from '../../post/models/post.raw';
import { RawTemplatesResource } from '../../template/models/template.raw';
import { RawAboutUsResource } from '../../aboutus/models/aboutus.raw';
import { DatasResource } from '../../base/models/base.types';
import { RawLocationResource } from '../../location/models/location.raw';
import { RawCategoryResource } from '../../category/models/category.raw';
import { RawSearchResource } from '../../search/models/search.raw';
import { RawSettingResource } from '../../setting/models/setting.raw';
import { RawPartnerResource } from '../../partner/models/partner.raw';
import { RawJobsResourceV2 } from '../../job/models/v2/job.raw';

export interface RawAboutUsReport {
    getTotalPartner: number;
    getTotalReview: number;
    getTotalUser: number;
    getTotalClients: number;
    getTotalOrder: number;
    getTotalProjectCompleted: number;
}

export interface RawHomeResponse {

    banners: RawBannersResource;
    templates: RawTemplatesResource;
    // jobs: RawJobsResource;
    jobs: RawJobsResourceV2;
    post: DatasResource<RawPostItem>;
    aboutUs: RawAboutUsResource;
    popularSearch: DatasResource<RawSearchResource>;
    categoryTemplate: DatasResource<RawCategoryResource>;
    // categoryProjectService: DatasResource<RawCategoryResource>;
    categories: RawCategoryResource[];
    locations: DatasResource<RawLocationResource>;
    partnersTop: RawPartnerResource[];
    getAboutUsReport: RawAboutUsReport;
    setting: RawSettingResource[];
}
