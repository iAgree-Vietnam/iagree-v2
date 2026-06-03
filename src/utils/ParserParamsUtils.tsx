import { JobsFilterParamsV2 } from "../data/job/models/job.types";
import { PartnerFilterParamsV2 } from "../data/partner/models/partner.types";

function parseNumberArray(value: any): number[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(Number);
  return String(value)
    .split(",")
    .map((v) => Number(v))
    .filter((v) => !isNaN(v));
}

export function getInitialJobFilters(query: any): JobsFilterParamsV2 {
  return {
    search: query?.search ?? "",
    type: query?.type ?? null,
    jobPage: query?.job_page ? Number(query.job_page) : 1,
    jobCategoryIds: parseNumberArray(query?.job_category_ids),
    jobSkillIds: parseNumberArray(query.job_skill_ids),
    jobServiceCategoryIds: parseNumberArray(query.job_service_category_ids),
    jobServiceIds: parseNumberArray(query.job_service_ids),
    salaryId: query?.salary_id ? Number(query.salary_id) : null,
    priceMin: query?.price_min ? Number(query.price_min) : null,
    priceMax: query?.price_max ? Number(query.price_max) : null,
    postingEndDate: query?.posting_end_date ?? null,
    postedDateRange: query?.posted_date_range ?? null,
  };
}

export function getInitialPartnerFilters(query: any): PartnerFilterParamsV2 {
  return {
    search: query.search ?? null,
    type: query.type ?? null,
    partnerPage: query.partner_page ? Number(query.partner_page) : 1,
    partnerCategoryIds: parseNumberArray(query.partner_category_ids),
    partnerSkillIds: parseNumberArray(query.partner_skill_ids),
    partnerServiceCategoryIds: parseNumberArray(
      query.partner_service_category_ids
    ),
    partnerServiceIds: parseNumberArray(query.partner_service_ids),
    locationIds: parseNumberArray(query.location_ids),
    languageIds: parseNumberArray(query.language_ids),
    accountType: (query.account_type as "PERSONAL" | "BUSINESS") ?? null,
  };
}
