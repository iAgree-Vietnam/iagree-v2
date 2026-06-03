import { ParsedUrlQuery } from "querystring";
import _ from "lodash";

import {
  RawFullPartnerResource,
  RawPartnerDetailInitResource,
  RawPartnerInitResource,
  RawPartnerResource,
  RawReviewResource,
  RawPartnerSelectBoxResource,
  RawUserReviewResource,
  RawComplainResource,
  RawOpportunityWalletResource,
  RawUserReviewAttachmentsResource,
} from "../models/partner.raw";
import {
  FullPartnerResource,
  PartnerDetailResource,
  PartnerInitResource,
  PartnerResource,
  ReviewResource,
  PartnerSelectBoxResource,
  UserReviewResource,
  ComplainResource,
  PartnerApplyResource,
  OpportunityWalletResource,
  UserReviewAttachmentsResource,
  PartnerResourceV2,
  PartnerFilterParamsV2,
} from "../models/partner.types";
import { CategoryParseUtils } from "@/src/data/category/utils/CategoryParseUtils";
import { TagParseUtils } from "@/src/data/tag/utils/TagParseUtils";
import { ExperienceParserUtils } from "@/src/data/experience/utils/ExperienceParserUtils";
import { LocationParserUtils } from "@/src/data/location/utils/LocationParserUtils";
import { SettingParserUtils } from "@/src/data/setting/utils/SettingParserUtils";
import { LanguageParserUtils } from "@/src/data/language/utils/LanguageParserUtils";
import { EducationParserUtils } from "@/src/data/education/utils/EducationParserUtils";
import { WorkHistoryParserUtils } from "@/src/data/workHistory/utils/WorkHistoryParserUtils";
import { AuthParseUtils } from "@/src/data/auth/utils/AuthParseUtils";
import { DatasResource } from "@/src/data/base/models/base.types";
import { PartnerFilterParams } from "@/src/data/partner/models/partner.types";
import NumberUtils from "@/src/utils/NumberUtils";
import { DecodeHTTPHelper } from "@/src/utils/HTTPHelper";
import { JobParseUtils } from "../../job/utils/JobParseUtils";
import { SkillParserUtils } from "../../skill/utils/SkillParserUtils";
import {
  RawCategoryResource,
  RawCateServiceResource,
  RawServiceResource,
} from "../../category/models/category.raw";
import { ServiceParseUtils } from "../../category/utils/ServicesParseUtils";
import { CategoryServiceParseUtils } from "../../category/utils/CategoryServiceParseUtils";
import { TypicalProjectsParserUtils } from "../../typical-projects/utils/TypicalProjectsParserUtils";

interface RawCategoryWithServiceCategory extends RawCategoryResource {
  service_category?: any[];
}

export const PartnerParserUtils = {
  init(dataItem: RawPartnerInitResource): PartnerInitResource {
    return {
      categories: (dataItem.categories as RawCategoryResource[])?.map(
        (category) => ({
          id: "", serviceId: -1,
          cateServiceId:-1,
          categoryId: category?.id,
          name: category?.name,
          childrens: Array.isArray(category?.childrens)
            ? category?.childrens?.map(
                (cateService: RawCateServiceResource) => ({
                  cateServiceId: cateService?.id,
                  id: "", serviceId: -1,
                  name: cateService?.name,
                  childrens: Array.isArray(cateService?.childrens)
                    ? cateService?.childrens?.map(
                        (service: RawServiceResource) => ({
                          serviceId: service?.id,
                          name: service?.name,
                        })
                      )
                    : [],
                })
              )
            : [],
        })
      ) as any,
      tags: {
        items: dataItem?.tags?.items?.map(TagParseUtils.item),
        total: dataItem?.tags?.total,
      },
      experiences: {
        items: dataItem?.experiences?.items?.map(ExperienceParserUtils.item),
        total: dataItem?.experiences?.total,
      },
      locations: {
        items: dataItem?.locations?.items?.map(LocationParserUtils.item),
        total: dataItem?.locations?.total,
      },
      partners: {
        items: dataItem?.partners?.items?.map(PartnerParserUtils.item) ,
        total: dataItem?.partners?.total,
      } as any,
      specialPartners: dataItem.partnersTop?.map(PartnerParserUtils.item) as any,
      setting: SettingParserUtils.data(dataItem?.setting),
    };
  },

  detailInit(dataItem: RawPartnerDetailInitResource): PartnerDetailResource {
    
    return {
      // categories: (dataItem?.categories as RawCategoryResource[])?.map(
      //   (category) => ({
      //     categoryId: category?.id,
      //     name: category?.name,
      //     childrens: Array.isArray(category?.childrens)
      //       ? category?.childrens?.map(
      //           (cateService: RawCateServiceResource) => ({
      //             cateServiceId: cateService?.id,
      //             name: cateService?.name,
      //             childrens: Array.isArray(cateService?.childrens)
      //               ? cateService?.childrens?.map(
      //                   (service: RawServiceResource) => ({
      //                     serviceId: service?.id,
      //                     name: service?.name,
      //                   })
      //                 )
      //               : [],
      //           })
      //         )
      //       : [],
      //   })
      // ),
      categories: dataItem?.partner?.categories || [] as unknown as RawCategoryResource[],
      tags: {
        items: dataItem?.tags?.items?.map(TagParseUtils.item),
        total: dataItem?.tags?.total,
      },
      experiences: {
        items: dataItem?.experiences?.items?.map(ExperienceParserUtils.item),
        total: dataItem?.experiences?.total,
      },
      locations: {
        items: dataItem?.partner?.locations,
        total: dataItem?.locations?.total,
      } as any,
      languages: {
        items: dataItem?.languages?.items?.map(LanguageParserUtils.item),
        total: dataItem?.languages?.total,
      },
      // reviews: {
      //   items: dataItem?.partner?.reviews?.items?.map(this.reviewItem),
      //   total: dataItem?.partner?.reviews?.total,
      //   rateAvg: dataItem?.partner?.reviews?.rate_avg,
      //   countByRate: { ...dataItem?.partner?.reviews?.count_by_rate },
      // },
      reviews: dataItem?.partner?.reviews,
      partner: this.fullItem(dataItem?.partner),
      projectCompleted:
        dataItem?.project_completed?.map(JobParseUtils.fullItem) || null,
      projectWithPartner:
        dataItem?.project_with_partner?.map(JobParseUtils.fullItem) || null,
      myReviews:
        dataItem?.my_reviews?.map(PartnerParserUtils.reviewItem) || null,
      complain:
        dataItem?.partner?.complain?.map(PartnerParserUtils.complainItem),
      setting: SettingParserUtils.data(dataItem?.setting),
      skills: dataItem?.skills?.map((skill) => ({
        skillId: skill?.id,
        name: skill?.name,
        categoryProjectId: skill?.category_project_id,
      })),
      category_services: dataItem?.partner?.category_services || []
    };
  },

  list(
    dataItem: DatasResource<RawPartnerResource>
  ): DatasResource<Partial<PartnerResource>> {
    return {
      items: dataItem?.items?.map(PartnerParserUtils.item),
      total: dataItem?.total,
    };
  },

  partnerApplyJob(dataItem: RawPartnerResource): PartnerApplyResource {
    return {
      partnerId: dataItem?.id,
      userId: dataItem?.user_id,
      locationId: dataItem?.location_id,
      experienceId: dataItem?.work_experience_id,
      position: dataItem?.position,
      isFeature: dataItem?.is_feature,
      rate: dataItem?.rate,
      description: dataItem?.description,
      reason: dataItem?.reason,
      status: dataItem?.status,
      createdDate: dataItem?.created_at || "",
      updatedDate: dataItem?.updated_at || "",
      isFounding: dataItem?.is_founding,
      user: AuthParseUtils.profile(dataItem?.user),
      cardNumber: dataItem?.card_number || "",
      citizenPhotoFront: dataItem?.citizen_photo_front || "",
      citizenPhotoBack: dataItem?.citizen_photo_back || "",
      businessLicense: dataItem?.business_license || null,
      taxCode: dataItem?.tax_code || null,
      bankId: dataItem?.bank_id || 0,
      accountNumber: dataItem?.account_number || "",
      portraitCard: dataItem?.portrait_card || "",
      qrCode: dataItem?.qr_code || "",
    };
  },

  item(dataItem: RawPartnerResource): Partial<PartnerResource> {
    return {
      ...(dataItem?.id ? { partnerId: dataItem.id } : {}),
      ...(dataItem?.user_id ? { userId: dataItem.user_id } : {}),
      ...(dataItem?.location_id ? { locationId: dataItem.location_id } : {}),
      ...(dataItem?.work_experience_id
        ? { experienceId: dataItem.work_experience_id }
        : {}),
      ...(dataItem?.position ? { position: dataItem.position } : {}),
      ...(dataItem?.card_number ? { cardNumber: dataItem.card_number } : {}),
      ...(dataItem?.is_feature !== undefined
        ? { isFeature: dataItem.is_feature }
        : {}),
      ...(dataItem?.rate !== undefined ? { rate: dataItem.rate } : {}),
      ...(dataItem?.description ? { description: dataItem.description } : {}),
      ...(dataItem?.reason ? { reason: dataItem.reason } : {}),
      ...(dataItem?.status ? { status: dataItem.status } : {}),
      ...(dataItem?.created_at ? { createdDate: dataItem.created_at } : {}),
      ...(dataItem?.updated_at ? { updatedDate: dataItem.updated_at } : {}),
      ...(dataItem?.total_review !== undefined
        ? { totalReview: dataItem.total_review }
        : {}),
      ...(dataItem?.total_completed_projects !== undefined
        ? { totalCompletedProjects: dataItem.total_completed_projects }
        : {}),
      ...(dataItem?.is_favorite !== undefined
        ? { isFavorite: dataItem.is_favorite }
        : {}),
      ...(dataItem?.is_founding !== undefined
        ? { isFounding: dataItem.is_founding }
        : {}),
      ...(dataItem?.username ? { username: dataItem.username } : {}),
      ...(dataItem?.is_citizen_id_verified !== undefined
        ? { is_citizen_id_verified: dataItem.is_citizen_id_verified }
        : {}),
  
      ...(dataItem?.location
        ? { location: LocationParserUtils.item(dataItem.location) }
        : {}),
      ...(dataItem?.work_experience
        ? {
            work_experience: ExperienceParserUtils.item(
              dataItem.work_experience
            ),
          }
        : {}),
      ...(dataItem?.educations
        ? {
            educations: dataItem.educations.map(
              EducationParserUtils.item
            ),
          }
        : {}),
      ...(dataItem?.typical_projects
        ? {
            typical_projects: dataItem.typical_projects.map(
              TypicalProjectsParserUtils.item
            ),
          }
        : {}),
      ...(dataItem?.work_histories
        ? {
            work_histories: dataItem.work_histories.map(
              WorkHistoryParserUtils.item
            ),
          }
        : {}),
      ...(dataItem?.tags
        ? { tags: dataItem.tags.map(TagParseUtils.item) }
        : {}),
      ...(dataItem?.user
        ? { user: AuthParseUtils.profile(dataItem.user) }
        : {}),
      ...(dataItem?.languages
        ? { languages: dataItem.languages.map(LanguageParserUtils.item) }
        : {}),
      ...(dataItem?.categories
        ? { categories: dataItem.categories.map(CategoryParseUtils.item) }
        : {}),
      ...(dataItem?.categoryServices
        ? {
            categoryServices: dataItem.categoryServices.map(
              CategoryServiceParseUtils.item
            ),
          }
        : {}),
      ...(dataItem?.services
        ? { services: dataItem.services.map(ServiceParseUtils.item) }
        : {}),
      ...(dataItem?.skills
        ? { skills: dataItem.skills.map(SkillParserUtils.item) }
        : {}),
      ...(dataItem?.location_ids
        ? {
            locations: dataItem.location_ids.map(
              LocationParserUtils.item
            ),
          }
        : {}),
      ...(dataItem?.opportunity_wallet
        ? {
            opportunityWallet:
              PartnerParserUtils.opportunityWallet(
                dataItem.opportunity_wallet
              ),
          }
        : {}),
    };
  },

  itemIntroduce(dataItem: RawPartnerResource): PartnerResourceV2 {
    return {
      partnerId: dataItem?.id,
      userId: dataItem?.user_id,
      locationId: dataItem?.location_id,
      experienceId: dataItem?.work_experience_id,
      position: dataItem?.position,
      cardNumber: dataItem?.card_number || "",
      isFeature: dataItem?.is_feature,
      rate: dataItem?.rate,
      description: dataItem?.description,
      reason: dataItem?.reason,
      status: dataItem?.status,
      createdDate: dataItem?.created_at,
      updatedDate: dataItem?.updated_at,
      totalReview: dataItem?.total_review || 0,
      isFavorite: dataItem?.is_favorite || null,
      isFounding: dataItem?.is_founding,
      location: dataItem?.location
        ? LocationParserUtils.item(dataItem?.location)
        : null,
      work_experience: dataItem?.work_experience
        ? ExperienceParserUtils.item(dataItem?.work_experience)
        : null,
      educations: dataItem?.educations?.map(EducationParserUtils.item) || null,
      typical_projects:
        dataItem?.typical_projects?.map(TypicalProjectsParserUtils.item) ||
        null,
      work_histories:
        dataItem?.work_histories?.map(WorkHistoryParserUtils.item) || null,
      tags: dataItem?.tags?.map(TagParseUtils.item),
      user: AuthParseUtils.introduce(dataItem?.user),
      languages: dataItem?.languages?.map(LanguageParserUtils.item) || null,
      categories: dataItem?.categories?.map(CategoryParseUtils.item) || null,
      categoryServices:
        dataItem?.categoryServices?.map(CategoryServiceParseUtils.item) || null,
      services: dataItem?.services?.map(ServiceParseUtils.item) || null,
      skills: dataItem?.skills?.map(SkillParserUtils.item) || null,
      isCitizenIdVerified: dataItem?.is_citizen_id_verified,
      username: dataItem?.username,
      locations: dataItem?.location_ids?.map(LocationParserUtils.item) || null,
      opportunityWallet: dataItem?.opportunity_wallet
        ? PartnerParserUtils.opportunityWallet(dataItem?.opportunity_wallet)
        : null,
    };
  },

  opportunityWallet(
    dataItem: RawOpportunityWalletResource
  ): OpportunityWalletResource {
    return {
      walletId: dataItem?.id,
      partnerId: dataItem?.partner_id,
      currentBalance: dataItem?.current_balance,
      totalEarned: dataItem?.total_earned,
      totalSpent: dataItem?.total_spent,
      totalExpired: dataItem?.total_expired,
      createdAt: dataItem?.created_at,
      updatedAt: dataItem?.updated_at,
    };
  },

  fullItem(dataItem: RawFullPartnerResource): FullPartnerResource {
    return {
      ...this.item(dataItem),
    } as any;
  },

  listReview(
    dataItem: DatasResource<RawReviewResource>
  ): DatasResource<ReviewResource> {
    return {
      items: dataItem.items?.map(PartnerParserUtils.reviewItem),
      total: dataItem.total,
    };
  },

  reviewItem(dataItem: RawReviewResource): ReviewResource {
    return {
      reviewId: dataItem?.id,
      projectId: dataItem?.project_id,
      projectName: dataItem?.project_name,
      projectStatus: dataItem?.project_status || 0,
      userReviewAttachments:
        dataItem?.user_review_attachments?.map(
          PartnerParserUtils.userReviewAttachment
        ) || [],
      userIdRate: dataItem?.user_id_rate,
      partnerUserId: dataItem?.partner_user_id,
      rate: dataItem?.rate,
      date: dataItem?.date,
      description: dataItem?.description,
      status: dataItem?.status,
      createdDate: dataItem?.created_at,
      updatedDate: dataItem?.updated_at,
      userReview: PartnerParserUtils.userReview(dataItem?.user_review),
      reviewPartnerUserId: { ...dataItem?.review_partner_user_id },
      reviewProject: { ...dataItem?.review_project },
    };
  },

  userReviewAttachment(
    dataItem: RawUserReviewAttachmentsResource
  ): UserReviewAttachmentsResource {
    return {
      attachmentId: dataItem?.id,
      type: dataItem?.type,
      fileName: dataItem?.file_name,
      fileUrl: dataItem?.file,
      description: dataItem?.description || "",
      status: dataItem?.status,
    };
  },

  complainItem(dataItem: RawComplainResource): ComplainResource {
    return {
      idComplain: dataItem?.id,
      name: dataItem?.name,
      address: dataItem?.address,
      phone: dataItem?.phone,
      email: dataItem?.email || "",
      partnerUrl: dataItem?.partner_url,
      subject: dataItem?.subject,
      body: dataItem?.body,
      file: dataItem?.file,
      partnerId: dataItem?.partner_id,
      messages: dataItem?.messages,
      status: dataItem?.status,
      createdAt: dataItem?.created_at,
      updatedAt: dataItem?.updated_at,
    };
  },

  userReview(dataItem: RawUserReviewResource): UserReviewResource {
    return {
      //@ts-ignore
      userId: dataItem?.id || null,
      fullName: dataItem?.name || "",
      avatarUrl: dataItem?.avatar || "",
    };
  },

  selectBox(dataItem: RawPartnerSelectBoxResource): PartnerSelectBoxResource {
    return {
      categories: (dataItem.categories as RawCategoryWithServiceCategory[]).map(
        (category) => ({
          categoryId: category?.id,
          name: category?.name,
          childrens: Array.isArray(category?.childrens)
            ? category?.childrens?.map(
                (cateService: RawCateServiceResource) => ({
                  cateServiceId: cateService?.id,
                  name: cateService?.name,
                  childrens: Array.isArray(cateService?.childrens)
                    ? cateService?.childrens?.map(
                        (service: RawServiceResource) => ({
                          serviceId: service?.id,
                          name: service?.name,
                        })
                      )
                    : [],
                })
              )
            : [],
        })
      ) as any,
      tags: {
        items: dataItem?.tags?.items?.map(TagParseUtils.item),
        total: dataItem?.tags?.total,
      },
      experiences: {
        items: dataItem?.experiences?.items?.map(ExperienceParserUtils.item),
        total: dataItem?.experiences?.total,
      },
      locations: {
        items: dataItem?.locations?.items?.map(LocationParserUtils.item),
        total: dataItem?.locations?.total,
      },
      languages: {
        items: dataItem?.languages?.items?.map(LanguageParserUtils.item),
        total: dataItem?.languages?.total,
      },
      banks: dataItem?.banks?.map((bank) => ({
        bankId: bank?.id,
        name: bank?.bank_name,
        bankCode: bank?.bank_code,
      })),
      skills: dataItem?.skills?.map((skill) => ({
        skillId: skill?.id,
        name: skill?.name,
        categoryProjectId: skill?.category_project_id,
      })),
    };
  },

  getFilterInitialState(): PartnerFilterParams {
    return {
      page: 1,
      search: null,
      position: null,
      rate: null,
      experienceId: null,
      categoryIds: [],
      locationIds: [],
      tagIds: [],
      skillIds: [],
      categoryServiceIds: [],
      serviceIds: [],
      languageIds: [],
      accountType: null,
    };
  },

  isFilterInitialState(params: PartnerFilterParams): boolean {
    return (
      JSON.stringify(params) ===
      JSON.stringify(PartnerParserUtils.getFilterInitialState())
    );
  },

  partnerQueries(urlQuery: ParsedUrlQuery): PartnerFilterParams {
    const filterParams = this.getFilterInitialState();

    if (_.has(urlQuery, "page") && NumberUtils.isNumber(urlQuery.page)) {
      filterParams.page = Number(urlQuery.page);
    }

    if (_.has(urlQuery, "search") && !_.isEmpty(urlQuery.search)) {
      filterParams.search = urlQuery.search as string;
    }

    if (_.has(urlQuery, "position") && !_.isEmpty(urlQuery.position)) {
      filterParams.position = urlQuery.position as string;
    }

    if (_.has(urlQuery, "rate") && NumberUtils.isNumber(urlQuery.rate)) {
      filterParams.rate = Number(urlQuery.rate);
    }

    if (
      _.has(urlQuery, "experienceId") &&
      NumberUtils.isNumber(urlQuery?.experienceId)
    ) {
      filterParams.experienceId = Number(urlQuery.experienceId);
    }

    if (
      _.has(urlQuery, "categoryIds") &&
      _.has(urlQuery, "type") &&
      urlQuery.type === "partner"
    ) {
      filterParams.categoryIds = DecodeHTTPHelper.convertInts(
        urlQuery.categoryIds as string
      );
    }

    if (_.has(urlQuery, "locationIds")) {
      filterParams.locationIds = DecodeHTTPHelper.convertInts(
        urlQuery.locationIds as string
      );
    }

    if (_.has(urlQuery, "tagIds")) {
      filterParams.tagIds = DecodeHTTPHelper.convertInts(
        urlQuery.tagIds as string
      );
    }

    if (
      _.has(urlQuery, "skillIds") &&
      _.has(urlQuery, "type") &&
      urlQuery.type === "partner"
    ) {
      filterParams.skillIds = DecodeHTTPHelper.convertInts(
        urlQuery.skillIds as string
      );
    }

    if (
      _.has(urlQuery, "categoryServiceIds") &&
      _.has(urlQuery, "type") &&
      urlQuery.type === "partner"
    ) {
      filterParams.categoryServiceIds = DecodeHTTPHelper.convertInts(
        urlQuery.categoryServiceIds as string
      );
    }

    if (
      _.has(urlQuery, "serviceIds") &&
      _.has(urlQuery, "type") &&
      urlQuery.type === "partner"
    ) {
      filterParams.serviceIds = DecodeHTTPHelper.convertInts(
        urlQuery.serviceIds as string
      );
    }

    return filterParams;
  },

  getFilterInitialStateV2(): PartnerFilterParamsV2 {
    return {
      partnerPage: 1,
      type: null,
      search: null,
      partnerCategoryIds: [],
      partnerSkillIds: [],
      partnerServiceCategoryIds: [],
      partnerServiceIds: [],
      locationIds: [],
      languageIds: [],
      accountType: null,
    };
  },

  partnerQueriesV2(urlQuery: ParsedUrlQuery): PartnerFilterParamsV2 {
    const filterParams = this.getFilterInitialStateV2();

    if (
      _.has(urlQuery, "partnerPage") &&
      NumberUtils.isNumber(urlQuery.partnerPage)
    ) {
      filterParams.partnerPage = Number(urlQuery.partnerPage);
    }

    if (_.has(urlQuery, "search") && !_.isEmpty(urlQuery.search)) {
      filterParams.search = urlQuery.search as string;
    }

    if (_.has(urlQuery, "type") && !_.isEmpty(urlQuery.type)) {
      filterParams.type = urlQuery.type as string;
    }

    if (_.has(urlQuery, "partnerCategoryIds")) {
      filterParams.partnerCategoryIds = DecodeHTTPHelper.convertInts(
        urlQuery.partnerCategoryIds as string
      );
    }

    if (_.has(urlQuery, "locationIds")) {
      filterParams.locationIds = DecodeHTTPHelper.convertInts(
        urlQuery.locationIds as string
      );
    }

    if (_.has(urlQuery, "partnerSkillIds")) {
      filterParams.partnerSkillIds = DecodeHTTPHelper.convertInts(
        urlQuery.partnerSkillIds as string
      );
    }

    if (_.has(urlQuery, "partnerServiceCategoryIds")) {
      filterParams.partnerServiceCategoryIds = DecodeHTTPHelper.convertInts(
        urlQuery.partnerServiceCategoryIds as string
      );
    }

    if (_.has(urlQuery, "partnerServiceIds")) {
      filterParams.partnerServiceIds = DecodeHTTPHelper.convertInts(
        urlQuery.partnerServiceIds as string
      );
    }

    return filterParams;
  },
};
