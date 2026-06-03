import { RawSalaryResource } from '../../salary/models/salary.raw';
import { DatasResource } from '../../base/models/base.types';
import { RawCategoryResource, RawCateServiceResource, RawServiceResource } from '../../category/models/category.raw';
import { RawExperienceResource } from '../../experience/models/experience.raw';
import { RawTimeItem } from '../../time/models/time.raw';
import { RawTagResource } from '../../tag/models/tag.raw';
import { RawLocationResource } from '../../location/models/location.raw';
import { RawSettingResource } from '../../setting/models/setting.raw';
import { TagResource } from '../../tag/models/tag.types';
import { RawSkillResource } from '../../skill/models/skill.raw';
import { RawPartnerResource } from '../../partner/models/partner.raw';
import { RawProfileResponse } from '../../auth/models/types';
import { RawFullJobResourceV2 } from './v2/job.raw';

export interface RawJobsResource {
    items: RawFullJobResource[];
    total: number;
}

export interface RawJobResource {
    id: number;
    // category_project_id: number;
    category_project_ids: number[];
    location_id: number;
    base_salary_id: number;
    work_experience_id: number;
    work_time_id: number;
    type_bib: number;
    name: string;
    start_date: string;
    end_date: string;
    price: number;
    is_feature: number;
    description: string;
    job_requirements: string;
    benefits: string;
    posting_start_date: string;
    posting_end_date: string;
    isExpired: boolean | null;
    note: any;
    status: number;
    created_at: string;
    updated_at: string;
    logo: string;
    base_salary: RawSalaryResource | null;
    location: RawLocationResource | null;
    react: boolean;

    salary_type: number;
    price_min: number | null;
    price_max: number | null;

    apply_date: string | null; // Ngày ứng tuyển
    user_project_contract: RawJobContractResource;
    is_public: number;
    number_accept: number | null;
    number_accept_remaining: number;
    job_duration_type: number | null;
    duration: number | null;
    need_partners: number | null;
    apply_status: number | null;
    deliverable_attachments: string | null;
    connect: number | null;
    confirm_info: string | null;
    // skills: RawSkillResource[] | null;
    // partners: RawPartnerResource[];
    // partners: number[] | null;
}

export interface RawFullJobResource extends RawJobResource {
    created_by_user_id: number;
    partner_user_id: number;
    support_user_id: number;
    user_project_bid: RawJobBidResource | null;
    user_project_contracts: RawJobContractResource[];
    // is_apply?: boolean;
    is_apply: RawUserProjectBidResource | null;
    work_experience: RawExperienceResource | null;
    categories: RawCategoryResource[] | null;
    skills: RawSkillResource[] | null;
    categoryServices: RawCateServiceResource[] | null;
    services: RawServiceResource[] | null;
    work_time: RawTimeItem | null;
    tags: RawTagResource[];
    rate: number | null;
    resultJobs: RawJobResultResource[];
    historyJobs: RawHistoryJobResultResource[];
    projectTransaction: RawProjectTransaction | null;
    projectTransactionHistory: RawProjectTransactionHistory[] | null;
    // is_public: number;
    user_project_bids: RawUserProjectBidResource[] | [];
    // partners: RawPartnerResource[];
    partners: number[] | null;
    projectAttachmentFiles: RawProjectAttachmentFiles[] | [];
    user_project_deals: RawUserProjectBidResource[] | [];
    reviews?: RawJobReviews[] | [] | null;
    user_created_project?: RawUserCreatedProjectResource | null;
    description: string
}

export interface RawUserCreatedProjectResource {
    user: {
        id: number;
        name: string;
        name_rep: string | null;
        avatar: string | null;
    };
    user_review: {
        total: number | 0;
        avg_rate: number | 0;
    };
    total_jobs: number | 0;
    reply_chat: string | null;
    total_spent: {
        total_spent: number | 0;
    };
}

export interface RawJobReviews {
    id: number,
    project_id: number,
    type: number,
    user_id_rate: number,
    partner_user_id: number,
    rate: number,
    date: string | null,
    decscription: string,
    status: number,
    created_at: string,
    updated_at: string,
    user: RawUserReview;
    partner_user: RawUserReview;
}

export interface RawUserReview {
    id: number;
    name: string;
    email?: string | null;
    avatar: string;
}

export interface RawProjectAttachmentFiles {
    id: number;
    file: string;
    file_name: string;
}

export interface RawProjectTransaction {
    transactions: RawProjectTransactionTransactions | null;
    advance: RawProjectTransactionAdvance | null;
    settlement: RawProjectTransactionSettlement | null;
}

export interface RawProjectTransactionTransactions {
    transaction_totals_sum: string;
    transaction_totals_sum_success: string;
    transaction_totals_sum_pending: string;
}

export interface RawProjectTransactionAdvance {
    transaction_sum: string;
    transaction_sum_success: string;
    transaction_sum_pending: string;
}

export interface RawProjectTransactionSettlement extends RawProjectTransactionAdvance { }

export interface RawProjectTransactionHistory {
    // id: number;
    transaction_type: number;
    type_id: number;
    transaction_name: string;
    transaction_amount: number;
    order_id: string;
    transaction_id: string | null;
    // price: number;
    payment_method: string | null;
    payment_type: string | null;
    date: string;
    platformfee_percentage: number;
    platformfee: number;
    product_sub_total: number;
    status: number;
    note: string | null;
    created_at?: string;
    updated_at?: string;
    purchase_type: number | null;
    purchase_price: number | null;
    purchase_status: number | null;
}

export interface RawJobBidResource {
    id: number;
    project_id: number;
    user_id: number;
    application_letter: string;
    application_file: string | null;
    note: string | null;
    status: number;
    created_at: string;
    updated_at: string;
}

export interface RawUserProjectDealResource {
  id: number;
  project_id: number;
  user_project_bid_id: number;
  user_id: number;
  type: number;
  application_letter: string | null;
  application_file: string | null;
  description: string | null;
  negotiate_price: number;
  number_accept: number;
  start_date: string;
  end_date: string;
  client_ip: string | null;
  device_name: string | null;
  platform: string | null;
  deal_status: number;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface RawUserProjectBidResource {
    id: number;
    project_id: number;
    user_id: number;
    application_letter: string;
    application_file: string | null;
    note: string | null;
    negotiate_price: number;
    description: string | null;
    number_accept: number;
    start_date: string;
    end_date: string;
    bid_type: number | null;
    status: number;
    created_at: string;
    updated_at: string;
    project?: RawFullJobResource | null;
    user?: RawProfileResponse | null;
    project_bid_files?: RawProjectBidFilesResource[] | [] | null;
    partner_name? : string
    user_project_deals: RawUserProjectDealResource[] | [] | null;
}

export interface RawProjectBidFilesResource {
    id: number;
    user_project_bid_id: number;
    file: string;
    note: string | null;
    status: number;
    created_at: string;
    updated_at: string;
}

export interface RawJobContractOverviewResource {
    id: number;
    project_id: number;
    created_at: string;
}

export interface RawJobContractResource extends RawJobContractOverviewResource {
    user_id: number;
    to_user_id: number;
    user_document_id: any;
    name: string;
    body: string;
    file: string;
    last_modified: string;
    status: number;
    updated_at: string;
}

export interface RawJobResultResource {
    id: number;
    project_id?: number | null;
    round?: number | null;
    application_name: string;
    application_file: string;
    description: string;
    size: string;
    status: number;
    created_at: string;
    updated_at?: string;
}

export interface RawHistoryJobResultResource {
    round: number;
    status: number;
    note: string;
    created_at: string;
    updated_at: string;
    application_file: RawJobResultResource[];
}

export interface RawJobInitResource {
    // categories: DatasResource<RawCategoryResource>;
    categories: RawCategoryResource[];
    // categoryServices: RawCateServiceResource[];
    // services: RawServiceResource[];
    experiences: DatasResource<RawExperienceResource>;
    times: DatasResource<RawTimeItem>;
    salaries: DatasResource<RawSalaryResource>;
    tags: DatasResource<RawTagResource>;
    jobs: DatasResource<RawFullJobResourceV2>;
    jobsTop: RawFullJobResource[];
    skills: RawSkillResource[];
}


export interface RawJobSelectboxResource {
    salaries: DatasResource<RawSalaryResource>;
    // categories: DatasResource<RawCategoryResource>;
    categories: RawCategoryResource[];
    // categoryServices: RawCateServiceResource[];
    // services: RawServiceResource[];
    tags: DatasResource<RawTagResource>;
    locations: DatasResource<RawLocationResource>;
    experiences: DatasResource<RawExperienceResource>;
    times: DatasResource<RawTimeItem>;
    skills: RawSkillResource[];
}

export interface RawJobDetailInitResource {
    project: RawFullJobResource,
    // setting: RawSettingResource[],
    project_related: RawFullJobResource[],
}

export interface RawJobSubmitResponseResource {
    id: number;
    name: string;
}

export interface RawJobTotalByStatusItem {
    status: number;
    total_status: number;
}

export interface RawJobFilterInfo {
    total_by_status?: RawJobTotalByStatusItem[];
    count_total_by_status?: number;
}