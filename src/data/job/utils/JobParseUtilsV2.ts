import datetimeUtils from "@/src/utils/DatetimeUtils";
import { LocationParserUtils } from "../../location/utils/LocationParserUtils";
import { SalaryParseUtils } from "../../salary/utils/SalaryParseUtils";
import { RawFullJobResource } from "../models/job.raw";
import { FullJobResource } from "../models/job.types";
import { JobParseUtils } from "./JobParseUtils";
import { RawFullJobResourceV2, RawBadgeInfo } from "../models/v2/job.raw";
import { FullJobResourceV2, JobResourceV2, BadgeInfo } from "../models/v2/job.types";
import { SkillParserUtils } from "../../skill/utils/SkillParserUtils";
import Constants from "@/src/constants/Constants";
import PriceUtils from "@/src/utils/PriceUtils";
import { DatasResource } from "../../base/models/base.types";

export const JobParseUtilsV2 = {
  list(
    data: DatasResource<RawFullJobResourceV2>
  ): DatasResource<FullJobResourceV2> {
    return {
      ...data,
      items: data.items.map(JobParseUtilsV2.item),
      total: data.total,
    };
  },

  item(dataItem: RawFullJobResourceV2): FullJobResourceV2 {
    return {
      jobId: dataItem?.id,
      name: dataItem?.name,
      status: dataItem?.status,
      postingEndDate: dataItem?.posting_end_date,
      createdByUserId: dataItem?.created_by_user_id,
      partnerUserId: dataItem?.partner_user_id,
      startDate: dataItem?.start_date,
      endDate: dataItem?.end_date,
      price: dataItem?.price,
      connect: dataItem?.connect,
      salaryType: dataItem?.salary_type,
      priceMin: dataItem?.price_min,
      priceMax: dataItem?.price_max,
      description: dataItem?.description,
      jobDurationType: dataItem?.job_duration_type,
      duration: dataItem?.duration,
      react: dataItem?.react,
      isExpired: dataItem?.is_expired,
      applicantsCount: dataItem?.applicants_count,
      skills: dataItem?.skills?.map(SkillParserUtils.item),
      badgeInfo: JobParseUtilsV2.statusBadge(dataItem?.badge_info),
      applyDate: dataItem?.apply_date
        ? datetimeUtils
            .getMoment(dataItem?.apply_date)
            ?.format(datetimeUtils.LOCAL_DATE) || ""
        : "",
      updatedDate: dataItem.updated_at
        ? datetimeUtils
            .getMoment(dataItem?.updated_at)
            ?.format(datetimeUtils.LOCAL_DATE) || ""
        : "",
    };
  },

  statusBadge(badgeInfo: RawBadgeInfo): BadgeInfo {
    return {
      badgeLabel: badgeInfo.badge_label,
      badgeStatus: badgeInfo.badge_status
    }
  },

  renderSalaryText(jobResource: JobResourceV2) {
    if (jobResource?.salaryType === Constants.JOB.SALARY_TYPE.DEAL)
      return "Thỏa thuận";

    if (jobResource?.salaryType === Constants.JOB.SALARY_TYPE.FIXED)
      return PriceUtils.displayVND(jobResource.priceMax);

    if (jobResource?.salaryType === Constants.JOB.SALARY_TYPE.RANGE) {
      return [
        PriceUtils.displayVND(jobResource.priceMin),
        PriceUtils.displayVND(jobResource.priceMax),
      ].join(" ~ ");
    }

    return "...";
  },
};
