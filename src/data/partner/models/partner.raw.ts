import { DatasResource } from '@/src/data/base/models/base.types';
import { RawCategoryResource, RawCateServiceResource, RawServiceResource } from '@/src/data/category/models/category.raw';
import { RawTagResource } from '@/src/data/tag/models/tag.raw';
import { RawExperienceResource } from '@/src/data/experience/models/experience.raw';
import { RawLocationResource } from '@/src/data/location/models/location.raw';
import { RawSettingResource } from '@/src/data/setting/models/setting.raw';
import { SettingResource } from '@/src/data/setting/models/setting.types';
import { RawLanguageResource } from '@/src/data/language/models/language.raw';
import { RawEducationResource } from '@/src/data/education/models/education.raw';
import { RawWorkHistoryResource } from '@/src/data/workHistory/models/workHistory.raw';
import { RawProfileResponse, RawUserOverviewResource } from '@/src/data/auth/models/types';
import { RawFullJobResource } from '../../job/models/job.raw';
import { RawSkillResource } from '../../skill/models/skill.raw';
import { RawBankResource } from '../../bank/models/bank.raw';
import { CategoryResource } from '../../category/models/category.types';
import { RawTypicalProjectsResource } from '../../typical-projects/models/typicalProjects.raw';
import { LocationResource } from '../../location/models/location.types';

export interface RawPartnerInitResource {
    // categories: DatasResource<RawCategoryResource>,
    categories: RawCategoryResource[];
    tags: DatasResource<RawTagResource>,
    experiences: DatasResource<RawExperienceResource>,
    locations: DatasResource<RawLocationResource>,
    partners: DatasResource<RawPartnerResource>,
    partnersTop: RawPartnerResource[],
    setting: RawSettingResource[],
}

export interface RawCountByRate {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
}

export interface RawPartnerDetailInitResource {
    // categories: DatasResource<RawCategoryResource>,
    categories: RawCategoryResource[];
    tags: DatasResource<RawTagResource>,
    experiences: DatasResource<RawExperienceResource>,
    locations: DatasResource<LocationResource>,
    // location_ids: RawLocationResource[];
    languages: DatasResource<RawLanguageResource>,
    reviews: DatasResource<RawReviewResource> & { rate_avg: number, count_by_rate: RawCountByRate },
    partner: RawFullPartnerResource,
    setting: RawSettingResource[];
    project_completed: RawFullJobResource[];
    project_with_partner: RawFullJobResource[];
    my_reviews: RawReviewResource[];
    complain: RawComplainResource[];
    skills: RawSkillResource[];
    categoryServices: RawCateServiceResource[];
    services: RawServiceResource[];
}


export interface RawPartnerResource {
    id: number;
    user_id: number;
    referral_code?: string;
    referred_by: number;
  
    // category_project_ids: number[];
    location_id: number;
    work_experience_id: number;
    position: string;
    is_feature: number;
    rate: number;
    description: any;
    reason: any;
    status: number;
    created_at: string;
    updated_at: string;
    total_review: number;
    total_completed_projects: number;
    is_founding: number;
    is_favorite: boolean | null;
    location: RawLocationResource;
    work_experience: RawExperienceResource | null;
    educations: RawEducationResource[];
    work_histories: RawWorkHistoryResource[];
    typical_projects: RawTypicalProjectsResource[];
    tags: RawTagResource[];
    languages: RawLanguageResource[];
    user: RawProfileResponse;
    citizen_photo_front: string,
    citizen_photo_back: string,
    categories: RawCategoryResource[] | null;
    categoryServices: RawCateServiceResource[] | null;
    category_services: RawCateServiceResource[] | null;
    services: RawServiceResource[] | null;
    skills: RawSkillResource[] | null;
    bank_id: number | null;
    account_number: string | null;
    portrait_card: string | null;
    qr_code: string | null;
    card_number: string | null;
    business_license: string | null;
    tax_code: string | null;
    is_citizen_id_verified: number | string | null;
    username: string | null;
    location_ids: RawLocationResource[] | null;
    opportunity_wallet?: RawOpportunityWalletResource | null;
}

export interface RawOpportunityWalletResource {
  id: number;
  partner_id: number;
  current_balance: number;
  total_earned: number;
  total_spent: number;
  total_expired: number;
  created_at: string;
  updated_at: string;
}

export interface RawFullPartnerResource extends RawPartnerResource {
    complain: RawComplainResource[];
    locations: DatasResource<LocationResource>,
    reviews?:RawReviewResource[]
}

export interface RawUserReviewResource extends RawUserOverviewResource {
    avatar: string | null
}

export interface RawReviewResource {
    id: number;
    project_id: number;
    project_name: string;
    project_status: number;
    user_review_attachments: RawUserReviewAttachmentsResource[] | [];
    user_id_rate: number;
    partner_user_id: number;
    rate: number;
    date: string;
    description: string;
    status: number;
    created_at: string;
    updated_at: string;
    user_review: RawUserReviewResource;
    review_partner_user_id: {
        id: number;
        name: string;
        avatar: string;
    }
    review_project: {
        id: number;
        name: string;
    },
    user: RawProfileResponse;
    project: IProjectFlow;
}

interface BadgeInfo {
    badge_label: string;  // Ví dụ: "Đã nghiệm thu"
    badge_status: string; // Ví dụ: "accepted"
    badge_color: string;  // Ví dụ: "#6C0999"
  }
  
  // Interface chính cho đối tượng công việc/dự án
  export interface IProjectFlow {
    id: number;
    name: string;
    badge_info: BadgeInfo;
  }

export interface RawUserReviewAttachmentsResource {
    id: number;
    type: number;
    file_name: string;
    file_url: string;
    file: string;
    description: string | null;
    status: number;
}

export interface RawComplainResource {
    id: number
    name: string
    address: string
    phone: string
    email: string
    partner_url: string
    subject: string
    body: string
    file: string
    partner_id: number
    messages: string
    status: number
    created_at: string
    updated_at: string
}

export interface RawPartnerSelectBoxResource {
    // categories: DatasResource<RawCategoryResource>,
    categories: RawCategoryResource[],
    categoryServices: RawCategoryResource[],
    services: RawCategoryResource[],
    tags: DatasResource<RawTagResource>,
    experiences: DatasResource<RawExperienceResource>,
    locations: DatasResource<RawLocationResource>,
    languages: DatasResource<RawLanguageResource>,
    reviews: DatasResource<RawReviewResource>,
    partner: RawFullPartnerResource,
    setting: RawSettingResource[],
    // skills: DatasResource<RawSkillResource>,
    // banks: DatasResource<RawBankResource>,
    banks: RawBankResource[],
    skills: RawSkillResource[],
}

export interface PartnerReactionParams {
    partnerId: number;
}