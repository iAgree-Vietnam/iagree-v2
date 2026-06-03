import { SkillResource } from "@/src/data/skill/models/skill.types";

export interface JobsResourceV2 {
    total: number;
    items: FullJobResourceV2[];
}

export interface JobResourceV2 {
    jobId: number;
    name: string;
    status: number;
    postingEndDate: string;
    createdByUserId: number;
    partnerUserId: number;
    startDate: string;
    endDate: string;
    price: number;
    connect: number;
    salaryType: number;
    priceMin: number;
    priceMax: number;
    description: string;
    jobDurationType: number;
    duration: number;
    react: number;
    isExpired: boolean;
    applicantsCount: number;
    badgeInfo: BadgeInfo;
    applyDate?: string;
    updatedDate?: string;
}

export interface FullJobResourceV2 extends JobResourceV2 {
    skills: SkillResource[];
}

export interface BadgeInfo {
    badgeLabel: string;
    badgeStatus: string;
}