import { RawSkillResource } from "@/src/data/skill/models/skill.raw";

export interface RawJobsResourceV2 {
    total: number;
    items: RawFullJobResourceV2[];
}

export interface RawJobResourceV2 {
    id: number;
    name: string;
    status: number;
    posting_end_date: string;
    created_by_user_id: number;
    partner_user_id: number;
    start_date: string;
    end_date: string;
    price: number;
    connect: number;
    salary_type: number;
    price_min: number;
    price_max: number;
    description: string;
    job_duration_type: number;
    duration: number;
    react: number;
    is_expired: boolean;
    applicants_count: number;
    badge_info: RawBadgeInfo;
    apply_date?: string;
    updated_at?: string;
}

export interface RawFullJobResourceV2 extends RawJobResourceV2 {
    skills: RawSkillResource[];
}

export interface RawBadgeInfo {
    badge_label: string;
    badge_status: string;
}