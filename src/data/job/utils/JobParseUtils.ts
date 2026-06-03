import {
  RawFullJobResource,
  RawHistoryJobResultResource,
  RawJobBidResource,
  RawJobContractOverviewResource,
  RawJobContractResource,
  RawJobDetailInitResource,
  RawJobInitResource,
  RawJobResource,
  RawJobResultResource,
  RawJobReviews,
  RawJobSelectboxResource,
  RawJobSubmitResponseResource,
  RawProjectAttachmentFiles,
  RawProjectBidFilesResource,
  RawProjectTransaction,
  RawProjectTransactionHistory,
  RawUserCreatedProjectResource,
  RawUserProjectBidResource,
  RawUserProjectDealResource,
} from "../models/job.raw";
import {
  FullJobResource,
  HistoryJobResultResource,
  JobBidResource,
  JobContractOverviewResource,
  JobContractResource,
  JobDetailInitResource,
  JobInitResource,
  JobResource,
  JobResultResource,
  JobReviews,
  JobSelectboxResource,
  JobsFilterParams,
  JobsFilterParamsV2,
  JobSubmitResponseResource,
  ProjectAttachmentFiles,
  ProjectBidFilesResource,
  ProjectTransaction,
  ProjectTransactionHistory,
  userCreatedProjectResource,
  UserProjectBidResource,
  UserProjectDealResource,
} from "../models/job.types";
import { SalaryParseUtils } from "../../salary/utils/SalaryParseUtils";
import { CategoryParseUtils } from "../../category/utils/CategoryParseUtils";
import { TimeParserUtils } from "../../time/utils/TimeParserUtils";
import { ExperienceParserUtils } from "../../experience/utils/ExperienceParserUtils";
import { LocationParserUtils } from "../../location/utils/LocationParserUtils";
import { TagParseUtils } from "../../tag/utils/TagParseUtils";
import { DatasResource } from "../../base/models/base.types";
import { SettingParserUtils } from "../../setting/utils/SettingParserUtils";
import datetimeUtils from "../../../utils/DatetimeUtils";
import _ from "lodash";
import { ParsedUrlQuery } from "querystring";
import NumberUtils from "@/src/utils/NumberUtils";
import { DecodeHTTPHelper } from "@/src/utils/HTTPHelper";
import Constants from "@/src/constants/Constants";
import PriceUtils from "@/src/utils/PriceUtils";
import {
  RawCategoryResource,
  RawCateServiceResource,
  RawServiceResource,
} from "../../category/models/category.raw";
import { CategoryServiceParseUtils } from "../../category/utils/CategoryServiceParseUtils";
import { ServiceParseUtils } from "../../category/utils/ServicesParseUtils";
import { AuthParseUtils } from "../../auth/utils/AuthParseUtils";
import { JobParseUtilsV2 } from "./JobParseUtilsV2";

// Extend RawCategoryResource locally for parsing
interface RawCategoryWithServiceCategory extends RawCategoryResource {
  //   service_category?: any[];
}

export const JobParseUtils = {
  init(dataItem: RawJobInitResource): JobInitResource {
    return {
      // categories: {
      //     items: dataItem?.categories.items.map(CategoryParseUtils.item),
      //     total: dataItem?.categories.total,
      // },
      // categories: dataItem?.categories.map(category => ({
      //     categoryId: category.id,
      //     name: category.name
      // })),
      ...dataItem,
      categories: (dataItem?.categories as RawCategoryResource[])?.map(
        (category) => ({
          cateServiceId: -1, id: "", serviceId: -1,
          categoryId: category.id,
          name: category.name,
          photo: category.photo,
          childrens: Array.isArray(category.childrens)
            ? category?.childrens?.map(
                (cateService: RawCateServiceResource) => ({
                  cateServiceId: cateService.id,
                  name: cateService.name,
                  id: "", serviceId: -1,
                  childrens: Array.isArray(cateService.childrens)
                    ? cateService.childrens.map(
                        (service: RawServiceResource) => ({
                          serviceId: service.id,
                          name: service.name,
                        })
                      )
                    : [],
                })
              )
            : [],
        })
      ) as any,
      experiences: {
        items: dataItem?.experiences.items.map(ExperienceParserUtils.item),
        total: dataItem?.experiences.total,
      },
      times: {
        items: dataItem?.times.items.map(TimeParserUtils.item),
        total: dataItem?.times.total,
      },
      salaries: {
        items: dataItem?.salaries.items.map(SalaryParseUtils.item),
        total: dataItem?.salaries.total,
      },
      tags: {
        items: dataItem?.tags.items.map(TagParseUtils.item),
        total: dataItem?.tags.total,
      },
      jobs: {
        items: dataItem?.jobs.items.map(JobParseUtilsV2.item),
        total: dataItem?.jobs.total,
      },
      specialJobs: dataItem?.jobsTop.map(JobParseUtils.item),
      // skills: dataItem?.skills?.map(skill => ({
      //     skillId: skill.id,
      //     name: skill.name,
      //     categoryProjectId: skill.category_project_id
      // })),
    };
  },

  omitNil<T extends Record<string, any>>(obj?: T){
    if (!obj) return {};
    return Object.fromEntries(
      Object.entries(obj).filter(
        ([_, v]) => v !== null && v !== undefined
      )
    )
  },

  list(
    data: DatasResource<RawFullJobResource>
  ): DatasResource<FullJobResource> {
    return {
      ...data,
      items: data.items.map(JobParseUtils.fullItem),
      total: data.total,
    };
  },

  detailInit(dataItem: RawJobDetailInitResource): JobDetailInitResource {
        return {
      ...this.fullItem(dataItem?.project),
      // setting: SettingParserUtils.data(dataItem?.setting),
      projectRelated: dataItem?.project_related?.map(JobParseUtils.item) || [],
    } as any;
  },


  detailInitV2(dataItem: RawJobDetailInitResource): JobDetailInitResource {
    
    return {
      ...this.omitNil(dataItem),
      ...this.omitNil({...dataItem?.project,...this.fullItem(dataItem?.project)}),
      // setting: SettingParserUtils.data(dataItem?.setting),
      projectRelated: dataItem?.project_related?.map(JobParseUtils.item) || [],
    } as any;
  },

  fullItem(dataItem: RawFullJobResource): FullJobResource {
    return {
      ...dataItem,
      ...JobParseUtils.item(dataItem as RawFullJobResource),
      createdByUserId: dataItem?.created_by_user_id || -1,
      partnerUserId: dataItem?.partner_user_id || -1,
      bid: dataItem?.user_project_bid 
        ? JobParseUtils.bidItem(dataItem?.user_project_bid)
        : null,
      contracts:
        dataItem?.user_project_contracts?.map(JobParseUtils.contractItem) || [],
      // isApply: typeof dataItem?.is_apply !== 'undefined' ? dataItem?.is_apply : null,
      isApply: dataItem?.is_apply
        ? JobParseUtils.userProjectBidItem(dataItem?.is_apply) 
        : null,
      salary: dataItem?.base_salary 
        ? SalaryParseUtils.item(dataItem?.base_salary) 
        : null,
      experience: dataItem?.work_experience 
        ? ExperienceParserUtils.item(dataItem?.work_experience)
        : null,
      // categoryProjects: dataItem?.category_project ? CategoryParseUtils.item(dataItem?.category_project) : null,
      categories: dataItem?.categories?.map(CategoryParseUtils.item) || null,
      time: dataItem?.work_time 
        ? TimeParserUtils.item(dataItem?.work_time)
        : null,
      tags: dataItem?.tags?.map(TagParseUtils.item) || [],
      rate: dataItem?.rate || null,
      results: dataItem?.resultJobs?.map(JobParseUtils.resultItem) || [],
      histories:
        dataItem?.historyJobs?.map(JobParseUtils.historyResultItem) || [],
      projectTransaction: JobParseUtils.projectTransactionItem(
        dataItem?.projectTransaction
      ),
        projectTransactionHistory:
        dataItem?.projectTransactionHistory?.map(
          JobParseUtils.projectTransactionHistoryItem
        ) || null,
      skills:
        dataItem?.skills?.map((skill) => ({
              skillId: skill.id,
              name: skill.name,
              categoryProjectId: skill.category_project_id || null,
            })) || null,
      categoryServices:
        dataItem?.categoryServices?.map(CategoryServiceParseUtils.item) || null,
      services: dataItem?.services?.map(ServiceParseUtils.item) || null,
      // numberAccept: dataItem?.number_accept || null,
      // isPublic: dataItem?.is_public,
      // partnersApply: dataItem?.partners?.map(PartnerParserUtils.partnerApplyJob) || null,
      partners: dataItem?.partners || null,
      userProjectBids:
        dataItem?.user_project_bids?.map(JobParseUtils.userProjectBidItem) ||
        [],
      projectAttachmentFiles:
        dataItem?.projectAttachmentFiles?.map(
          JobParseUtils.projectAttachmentFile
        ) || [],
      userProjectDeals:
        dataItem?.user_project_deals?.map(JobParseUtils.userProjectBidItem) ||
        [],
      reviews: dataItem?.reviews
        ? dataItem?.reviews.map(JobParseUtils.jobReviewsItem) 
        : [],
      userCreatedProject: dataItem.user_created_project
        ? JobParseUtils.userCreatedProject(dataItem.user_created_project) 
        : null,
    };
  },

  userCreatedProject(
    dataItem: RawUserCreatedProjectResource
  ): userCreatedProjectResource {
    return {
      user: {
        userId: dataItem.user.id,
        userName: dataItem.user.name,
        nameRep: dataItem.user.name_rep || "",
        avatar: dataItem.user.avatar || "",
      },
      userReview: {
        total: dataItem.user_review.total || 0,
        avgRate: dataItem.user_review.avg_rate || 0,
      },
      totalJobs: dataItem.total_jobs,
      replyChat: dataItem.reply_chat || "",
      totalSpent: {
        totalSpent: dataItem.total_spent.total_spent || 0,
      },
    };
  },

  jobReviewsItem(dataItem: RawJobReviews): JobReviews {
    return {
      reviewId: dataItem?.id,
      projectId: dataItem?.project_id,
      type: dataItem?.type,
      userIdRate: dataItem?.user_id_rate,
      partnerUserId: dataItem?.partner_user_id,
      rate: dataItem?.rate,
      date: dataItem?.date,
      decscription: dataItem?.decscription,
      status: dataItem?.status,
      createdAt: dataItem?.created_at,
      updatedAt: dataItem?.updated_at,
      user: {
        id: dataItem?.user.id,
        name: dataItem?.user.name,
        email: dataItem?.user.email ?? null,
        avatarUrl: dataItem?.user.avatar,
      },
      partnerUser: {
        id: dataItem?.partner_user.id,
        name: dataItem?.partner_user.name,
        email: dataItem?.partner_user.email ?? null,
        avatarUrl: dataItem?.partner_user.avatar,
      },
    };
  },

  projectAttachmentFile(
    dataItem: RawProjectAttachmentFiles
  ): ProjectAttachmentFiles {
    return {
      fileId: dataItem?.id,
      fileUrl: dataItem?.file,
      fileName: dataItem?.file_name,
    };
  },

  item(dataItem: RawFullJobResource): FullJobResource {    
    return {
      jobId: dataItem?.id || -1,
      typeBib: dataItem?.type_bib || -1,
      name: dataItem?.name || "",
      startDate: dataItem?.start_date || "",
      endDate: dataItem?.end_date || "",
      price: dataItem?.price || 0,
      isFeature: Boolean(dataItem?.is_feature),

      description: dataItem?.description || "",
      jobRequirements: dataItem?.job_requirements || "",
      benefits: dataItem?.benefits || "",

      logoUrl: dataItem?.logo || null,
      salary: dataItem?.base_salary
        ? SalaryParseUtils.item(dataItem?.base_salary)
        : null,
      location: dataItem?.location
        ? LocationParserUtils.item(dataItem?.location)
        : null,
      postingStartDate: dataItem?.posting_start_date
        ? datetimeUtils
            .getMoment(dataItem?.posting_start_date)
            ?.format(datetimeUtils.LOCAL_DATE_TIME) || ""
        : "",
      postingEndDate: dataItem?.posting_end_date
        ? datetimeUtils
            .getMoment(dataItem?.posting_end_date)
            ?.format(datetimeUtils.LOCAL_DATE) || ""
        : "",
      isExpired: dataItem?.isExpired || false,

      note: dataItem?.note || "",
      status: dataItem?.status || 0,

      createdDate: dataItem?.created_at
        ? datetimeUtils
            .getMoment(dataItem?.created_at)
            ?.format(datetimeUtils.LOCAL_DATE_TIME) || ""
        : "",
      updatedDate: dataItem?.updated_at
        ? datetimeUtils
            .getMoment(dataItem?.created_at)
            ?.format(datetimeUtils.LOCAL_DATE_TIME) || ""
        : "",
      //@ts-ignore
      isLiked: dataItem?.react || null,

      salaryType: dataItem?.salary_type || 1,
      priceMin: dataItem?.price_min || 0,
      priceMax: dataItem?.price_max || 0,

      contract: dataItem?.user_project_contract
        ? JobParseUtils.contractOverviewItem(dataItem?.user_project_contract)
        : null,
      applyDate: dataItem?.apply_date
        ? datetimeUtils
            .getMoment(dataItem?.apply_date)
            ?.format(datetimeUtils.LOCAL_DATE) || ""
        : "",
      numberAccept: dataItem?.number_accept || null,
      numberAcceptRemaining: dataItem?.number_accept_remaining || 0,
      isPublic: dataItem?.is_public || -1,
      applyStatus: dataItem?.apply_status || -1,
      deliverableAttachments: dataItem?.deliverable_attachments || "",
      duration: dataItem?.duration || -1,
      jobDurationType: dataItem?.job_duration_type || -1,
      needPartners: dataItem?.need_partners || -1,
      createdByUserId: dataItem?.created_by_user_id,
      connect: dataItem?.connect || -1,
      userProjectBids:
        dataItem?.user_project_bids?.map(JobParseUtils.userProjectBidItem) ||
        [],
      skills:
        dataItem?.skills?.map((skill) => ({
          skillId: skill.id,
          name: skill.name,
          categoryProjectId: skill.category_project_id || null,
        })) || [],
      confirmInfo: dataItem?.confirm_info || "",
    };
  },

  selectboxForAdd(dataItem: RawJobSelectboxResource): JobSelectboxResource {
    return {
      salaries: {
        items: dataItem?.salaries.items.map(SalaryParseUtils.item),
        total: dataItem?.salaries.total,
      },
      categories: (
        dataItem?.categories as RawCategoryWithServiceCategory[]
      ).map((category) => ({
        id: "", serviceId: -1,
        cateServiceId: -1,
        categoryId: category.id,
        name: category.name,
        childrens: Array.isArray(category.childrens)
          ? category.childrens.map((cateService: RawCateServiceResource) => ({
              cateServiceId: cateService.id,
              id: "", serviceId: -1,
              name: cateService.name,
              photo: cateService.photo,
              childrens: Array.isArray(cateService.childrens)
                ? cateService.childrens.map((service: RawServiceResource) => ({
                    serviceId: service.id,
                    name: service.name,
                  }))
                : [],
            }))
          : [],
      })) as any,
      experiences: {
        items: dataItem?.experiences.items.map(ExperienceParserUtils.item),
        total: dataItem?.experiences.total,
      },
      times: {
        items: dataItem?.times.items.map(TimeParserUtils.item),
        total: dataItem?.times.total,
      },
      locations: {
        items: dataItem?.locations.items.map(LocationParserUtils.item),
        total: dataItem?.locations.total,
      },
      tags: {
        items: dataItem?.tags.items.map(TagParseUtils.item),
        total: dataItem?.tags.total,
      },
      skills: dataItem?.skills?.map((skill) => ({
        skillId: skill.id,
        name: skill.name,
        categoryProjectId: skill.category_project_id || null,
      })),
    };
  },

  bidItem(dataItem: RawJobBidResource): JobBidResource {
    return {
      bidId: dataItem?.id,
      projectId: dataItem?.project_id,
      userId: dataItem?.user_id,
      letter: dataItem?.application_letter,
      attachmentUrl: dataItem?.application_file,
      note: dataItem?.note,
      status: dataItem?.status,
      createdDate: dataItem?.created_at,
      updatedDate: dataItem?.updated_at,
    };
  },

  dealHistoryItem(
    dataItem: RawUserProjectDealResource
  ): UserProjectDealResource {
    return {
      dealId: dataItem?.id  || -1,
      projectId: dataItem?.project_id  || -1,
      userProjectBidId: dataItem?.user_project_bid_id  || -1,
      userId: dataItem?.user_id  || -1,
      type: dataItem?.type,
      applicationLetter: dataItem?.application_letter || "",
      applicationFile: dataItem?.application_file || "",
      description: dataItem?.description  || "",
      negotiatePrice: dataItem?.negotiate_price || -1,
      numberAccept: dataItem?.number_accept  || -1,
      startDate: dataItem?.start_date  || "",
      endDate: dataItem?.end_date  || "",
      clientIp: dataItem?.client_ip  || "",
      deviceName: dataItem?.device_name  || "",
      platform: dataItem?.platform  || "",
      dealStatus: dataItem?.deal_status,
      status: dataItem?.status,
      createdAt: dataItem?.created_at  || "",
      updatedAt: dataItem?.updated_at  || "",
    };
  },

  userProjectBidItem(
    dataItem: RawUserProjectBidResource
  ): UserProjectBidResource {
    return {
      bidId: dataItem?.id || -1,
      projectId: dataItem?.project_id || -1,
      userId: dataItem?.user_id || -1,
      applicationLetter: dataItem?.application_letter || "",
      applicationFile: dataItem?.application_file || "",
      note: dataItem?.note || "",
      description: dataItem?.description || "",
      negotiatePrice: dataItem?.negotiate_price || -1,
      numberAccept: dataItem?.number_accept,
      startDate: dataItem?.start_date || undefined,
      endDate: dataItem?.end_date || undefined,
      bidType: dataItem?.bid_type || null,
      status: dataItem?.status,
      createdAt: dataItem?.created_at || "",
      updatedAt: dataItem?.updated_at || "",
      project: dataItem?.project ? JobParseUtils.item(dataItem?.project) : null,
      user: dataItem?.user ? AuthParseUtils.profile(dataItem?.user) : null,
      projectBidFiles: dataItem?.project_bid_files
        ? dataItem?.project_bid_files.map(JobParseUtils.projectBidFileItem)
        : null,
      userProjectDeals: dataItem?.user_project_deals
        ? dataItem?.user_project_deals.map(JobParseUtils.dealHistoryItem)
        : null,
    };
  },

  projectBidFileItem(
    dataItem: RawProjectBidFilesResource
  ): ProjectBidFilesResource {
    return {
      fileId: dataItem?.id  || -1,
      userProjectBidId: dataItem?.user_project_bid_id  || -1,
      file: dataItem?.file || "",
      note: dataItem?.note || "",
      status: dataItem?.status || -1,
      createdAt: dataItem?.created_at || "",
      updatedAt: dataItem?.updated_at || "",
    };
  },

  contractOverviewItem(
    dataItem: RawJobContractOverviewResource
  ): JobContractOverviewResource {
    return {
      contractId: dataItem?.id,
      projectId: dataItem?.project_id,
      createdDate: dataItem?.created_at
        ? datetimeUtils
            .getMoment(dataItem?.created_at)
            ?.format(datetimeUtils.LOCAL_DATE_TIME) || ""
        : "",
    };
  },

  contractItem(dataItem: RawJobContractResource): JobContractResource {
    return {
      ...JobParseUtils.contractOverviewItem(dataItem),
      userId: dataItem?.user_id,
      toUserId: dataItem?.to_user_id,
      userDocumentId: dataItem?.user_document_id,
      name: dataItem?.name,
      body: dataItem?.body,
      fileUrl: dataItem?.file,

      status: dataItem?.status,
      lastModifiedDate: dataItem?.last_modified,
      updatedDate: dataItem?.updated_at
        ? datetimeUtils
            .getMoment(dataItem?.updated_at)
            ?.format(datetimeUtils.LOCAL_DATE_TIME) || ""
        : "",
    };
  },

  resultItem(dataItem: RawJobResultResource): JobResultResource {
    return {
      resultId: dataItem.id,
      projectId: dataItem.project_id || null,
      round: dataItem.round || null,
      name: dataItem.application_name,
      fileUrl: dataItem.application_file,
      fileSize: dataItem.size || null,
      description: dataItem.description || null,
      status: dataItem.status,
      createdDate: dataItem.created_at
        ? datetimeUtils
            .getMoment(dataItem.created_at)
            ?.format(datetimeUtils.LOCAL_DATE_TIME)
        : "",
      updatedDate: dataItem.updated_at
        ? datetimeUtils
            .getMoment(dataItem.updated_at)
            ?.format(datetimeUtils.LOCAL_DATE_TIME)
        : "",
    };
  },

  historyResultItem(
    dataItem: RawHistoryJobResultResource
  ): HistoryJobResultResource {
    return {
      round: dataItem?.round,
      note: dataItem?.note,
      status: dataItem?.status,
      createdDate: dataItem?.created_at
        ? datetimeUtils
            .getMoment(dataItem?.created_at)
            ?.format(datetimeUtils.LOCAL_DATE_TIME) || ""
        : "",
      updatedDate: dataItem?.updated_at
        ? datetimeUtils
            .getMoment(dataItem?.updated_at)
            ?.format(datetimeUtils.LOCAL_DATE_TIME) || ""
        : "",
      applicationFile:
        dataItem?.application_file?.map(JobParseUtils.resultItem) || [],
    };
  },

  projectTransactionItem(
    dataItem: RawProjectTransaction | null
  ): ProjectTransaction | null {
    if (!dataItem) return null;
    return {
      transactions: this.projectTransactionTransactionsItem(
        dataItem?.transactions
      ),
      advance: this.projectTransactionAdvanceItem(dataItem?.advance),
      settlement: this.projectTransactionSettlementItem(dataItem?.settlement),
    };
  },

  projectTransactionTransactionsItem(
    dataItem: RawProjectTransaction["transactions"]
  ): ProjectTransaction["transactions"] {
    if (!dataItem) return null;
    return {
      transactionTotalsSum: dataItem?.transaction_totals_sum,
      transactionTotalsSumPending: dataItem?.transaction_totals_sum_pending,
      transactionTotalsSumSuccess: dataItem?.transaction_totals_sum_success,
    };
  },

  projectTransactionAdvanceItem(
    dataItem: RawProjectTransaction["advance"]
  ): ProjectTransaction["advance"] {
    if (!dataItem) return null;
    return {
      transactionSum: dataItem?.transaction_sum,
      transactionSumPending: dataItem?.transaction_sum_pending,
      transactionSumSuccess: dataItem?.transaction_sum_success,
    };
  },

  projectTransactionSettlementItem(
    dataItem: RawProjectTransaction["settlement"]
  ): ProjectTransaction["settlement"] {
    if (!dataItem) return null;
    return {
      transactionSum: dataItem?.transaction_sum,
      transactionSumPending: dataItem?.transaction_sum_pending,
      transactionSumSuccess: dataItem?.transaction_sum_success,
    };
  },

  projectTransactionHistoryItem(
    dataItem: RawProjectTransactionHistory
  ): ProjectTransactionHistory {
    return {
      // id: dataItem?.id,
      transactionType: dataItem?.transaction_type,
      typeId: dataItem?.type_id,
      name: dataItem?.transaction_name,
      transactionAmount: dataItem?.transaction_amount,
      orderId: dataItem?.order_id,
      transactionId: dataItem?.transaction_id || null,
      // price: dataItem?.price,
      paymentMethod: dataItem?.payment_method,
      paymentType: dataItem?.payment_type,
      date: dataItem?.date,
      platformfeePercentage: dataItem?.platformfee_percentage,
      platformfee: dataItem?.platformfee,
      productSubTotal: dataItem?.product_sub_total,
      note: dataItem?.note || null,
      status: dataItem?.status,
      createdAt: dataItem?.created_at
        ? datetimeUtils
            .getMoment(dataItem?.created_at)
            ?.format(datetimeUtils.LOCAL_DATE_TIME) || ""
        : "",
      updatedAt: dataItem?.updated_at
        ? datetimeUtils
            .getMoment(dataItem?.updated_at)
            ?.format(datetimeUtils.LOCAL_DATE_TIME) || ""
        : "",
      purchaseType: dataItem?.purchase_type,
      purchasePrice: dataItem?.purchase_price,
      purchaseStatus: dataItem?.purchase_status,
    };
  },

  createResponse(
    dataItem: RawJobSubmitResponseResource
  ): JobSubmitResponseResource {
    return {
      jobId: dataItem?.id,
      name: dataItem?.name,
    };
  },

  getFilterInitialState(): JobsFilterParams {
    return {
      page: 1,
      type: null,
      statusId: null,
      search: null,
      categoryIds: [],
      experienceId: null,
      salaryId: null,
      timeIds: [],
      locationIds: [],
      tagIds: [],
      skillIds: [],
      categoryServiceIds: [],
      serviceIds: [],
    };
  },

  isFilterInitialState(params: JobsFilterParams): boolean {
    return (
      JSON.stringify(params) ===
      JSON.stringify(JobParseUtils.getFilterInitialState())
    );
  },

  jobQueries(urlQuery: ParsedUrlQuery): JobsFilterParams {
    const filterParams = this.getFilterInitialState();

    if (_.has(urlQuery, "page") && NumberUtils.isNumber(urlQuery.page)) {
      filterParams.page = Number(urlQuery.page);
    }

    if (_.has(urlQuery, "search") && !_.isEmpty(urlQuery.search)) {
      filterParams.search = urlQuery.search as string;
    }

    if (
      _.has(urlQuery, "categoryIds") &&
      _.has(urlQuery, "type") &&
      urlQuery.type === "job"
    ) {
      filterParams.categoryIds = DecodeHTTPHelper.convertInts(
        urlQuery.categoryIds as string
      );
    }

    if (
      _.has(urlQuery, "experienceId") &&
      NumberUtils.isNumber(urlQuery.experienceId)
    ) {
      filterParams.experienceId = Number(urlQuery.experienceId);
    }

    if (
      _.has(urlQuery, "salaryId") &&
      NumberUtils.isNumber(urlQuery.salaryId)
    ) {
      filterParams.salaryId = Number(urlQuery.salaryId);
    }

    if (_.has(urlQuery, "timeIds")) {
      filterParams.timeIds = DecodeHTTPHelper.convertInts(
        urlQuery.timeIds as string
      );
    }

    if (_.has(urlQuery, "locationIds")) {
      filterParams.locationIds = DecodeHTTPHelper.convertInts(
        urlQuery.locationIds as string
      );
    }

    if (
      _.has(urlQuery, "skillIds") &&
      _.has(urlQuery, "type") &&
      urlQuery.type === "job"
    ) {
      filterParams.skillIds = DecodeHTTPHelper.convertInts(
        urlQuery.skillIds as string
      );
    }

    if (
      _.has(urlQuery, "categoryServiceIds") &&
      _.has(urlQuery, "type") &&
      urlQuery.type === "job"
    ) {
      filterParams.categoryServiceIds = DecodeHTTPHelper.convertInts(
        urlQuery.categoryServiceIds as string
      );
    }

    if (
      _.has(urlQuery, "serviceIds") &&
      _.has(urlQuery, "type") &&
      urlQuery.type === "job"
    ) {
      filterParams.serviceIds = DecodeHTTPHelper.convertInts(
        urlQuery.serviceIds as string
      );
    }

    return filterParams;
  },

  getFilterInitialStateV2(): JobsFilterParamsV2 {
    return {
      jobPage: 1,
      type: null,
      search: null,
      jobCategoryIds: [],
      jobSkillIds: [],
      jobServiceCategoryIds: [],
      jobServiceIds: [],
      salaryId: null,
      postingEndDate: null,
      postedDateRange: null,
      priceMin: null,
      priceMax: null,
    };
  },

  jobQueriesV2(urlQuery: ParsedUrlQuery): JobsFilterParamsV2 {
    const filterParams = this.getFilterInitialStateV2();

    if (_.has(urlQuery, "jobPage") && NumberUtils.isNumber(urlQuery.jobPage)) {
      filterParams.jobPage = Number(urlQuery.jobPage);
    }

    if (_.has(urlQuery, "search") && !_.isEmpty(urlQuery.search)) {
      filterParams.search = urlQuery.search as string;
    }

    if (_.has(urlQuery, "type") && !_.isEmpty(urlQuery.type)) {
      filterParams.type = urlQuery.type as string;
    }

    if (_.has(urlQuery, "jobCategoryIds")) {
      filterParams.jobCategoryIds = DecodeHTTPHelper.convertInts(
        urlQuery.jobCategoryIds as string
      );
    }

    if (
      _.has(urlQuery, "salaryId") &&
      NumberUtils.isNumber(urlQuery.salaryId)
    ) {
      filterParams.salaryId = Number(urlQuery.salaryId);
    }

    if (_.has(urlQuery, "jobSkillIds")) {
      filterParams.jobSkillIds = DecodeHTTPHelper.convertInts(
        urlQuery.jobSkillIds as string
      );
    }

    if (_.has(urlQuery, "jobServiceCategoryIds")) {
      filterParams.jobServiceCategoryIds = DecodeHTTPHelper.convertInts(
        urlQuery.jobServiceCategoryIds as string
      );
    }

    if (_.has(urlQuery, "jobServiceIds")) {
      filterParams.jobServiceIds = DecodeHTTPHelper.convertInts(
        urlQuery.jobServiceIds as string
      );
    }

    return filterParams;
  },

  renderSalaryText(jobResource: JobResource) {
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
