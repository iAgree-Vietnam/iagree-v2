import { DatasResource } from "@/src/data/base/models/base.types";
import { SettingResource } from "@/src/data/setting/models/setting.types";
import {
  CategoryResource,
  CateServiceResource,
  ServiceResource,
} from "@/src/data/category/models/category.types";
import { TagResource } from "@/src/data/tag/models/tag.types";
import { ExperienceResource } from "@/src/data/experience/models/experience.types";
import { LocationResource } from "@/src/data/location/models/location.types";
import { LanguageResource } from "@/src/data/language/models/language.types";
import { EducationResource } from "@/src/data/education/models/education.types";
import { WorkHistoryResource } from "@/src/data/workHistory/models/workHistory.types";
import {
  FullProfileResource,
  FullProfileResourceV2,
  UserOverviewResource,
} from "@/src/data/auth/models/types";
import { FullJobResource } from "../../job/models/job.types";
import { SkillResource } from "../../skill/models/skill.types";
import { BankResource } from "../../bank/models/bank.types";
import { TypicalProjectsResource } from "../../typical-projects/models/typicalProjects.types";
import { RawReviewResource } from "./partner.raw";

export interface PartnerInitResource {
  // categories: DatasResource<CategoryResource>,
  categories: CategoryResource[];
  tags: DatasResource<TagResource>;
  experiences: DatasResource<ExperienceResource>;
  locations: DatasResource<LocationResource>;
  partners: Partial<PartnerResource>[];
  specialPartners?: PartnerResource[];
  setting: SettingResource;
  total? : number
}

export interface CountByRate {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

export interface PartnerDetailResource {
  // categories: DatasResource<CategoryResource>,
  categories: CategoryResource[];
  category_services: CategoryResource[];
  tags: DatasResource<TagResource>;
  experiences: DatasResource<ExperienceResource>;
  locations: DatasResource<LocationResource>;
  // locations: LocationResource[] | null;
  languages: DatasResource<LanguageResource>;
  // reviews: DatasResource<ReviewResource> & {
  //   rateAvg: number;
  //   countByRate: CountByRate;
  // };
  partner: FullPartnerResource;
  setting: SettingResource;
  projectCompleted: FullJobResource[];
  projectWithPartner: FullJobResource[];
  myReviews: ReviewResource[];
  complain: ComplainResource[];
  // skills: DatasResource<SkillResource>;
  // categoryServices: CateServiceResource[];
  // services: ServiceResource[];
  skills: SkillResource[];
  reviews?:RawReviewResource[]
}

export interface PartnerResource {
  partnerId?: number;
  userId: number;
  id: number;
  category_services: CategoryResource[]
  // categoryId: number | null;
  locationId?: number;
  experienceId?: number;
  position?: string;
  cardNumber?: string | null;
  isFeature?: number;
  rate?: number;
  description?: any;
  reason?: any;
  status?: number;
  createdDate?: string;
  updatedDate?: string;
  totalReview?: number;
  totalCompletedProjects?: number;
  isFavorite?: boolean | null;
  isFounding?: number;
  location?: LocationResource | null;
  work_experience?: ExperienceResource | null;
  educations?: EducationResource[];
  work_histories?: WorkHistoryResource[];
  typical_projects?: TypicalProjectsResource[];
  tags?: TagResource[];
  languages?: LanguageResource[];
  user?: Partial<FullProfileResource>;
  categories?: CategoryResource[] | null;
  categoryServices?: CateServiceResource[] | null;
  services?: ServiceResource[] | null;
  skills?: SkillResource[] | null;
  is_citizen_id_verified?: number | string | null;
  username?: string | null;
  locations?: LocationResource[] | null;
  opportunityWallet?: OpportunityWalletResource | null;
  total_completed_projects?: number;
  total_review?: number;

}

export interface PartnerResourceV2 {
  partnerId?: number;
  userId: number;
  // categoryId: number | null;
  locationId: number;
  experienceId: number;
  position: string;
  cardNumber?: string | null;
  isFeature: number;
  rate: number;
  description: any;
  reason: any;
  status: number;
  createdDate: string;
  updatedDate: string;
  totalReview: number;
  isFavorite: boolean | null;
  isFounding: number;
  location: LocationResource | null;
  work_experience: ExperienceResource | null;
  educations: EducationResource[];
  work_histories: WorkHistoryResource[];
  typical_projects: TypicalProjectsResource[];
  tags: TagResource[];
  languages: LanguageResource[];
  user: Partial<FullProfileResourceV2>;
  categories: CategoryResource[] | null;
  categoryServices: CateServiceResource[] | null;
  services: ServiceResource[] | null;
  skills: SkillResource[] | null;
  isCitizenIdVerified?: number | string | null;
  username: string | null;
  locations: LocationResource[] | null;
  opportunityWallet?: OpportunityWalletResource | null;
  email ?: string;

}

export interface OpportunityWalletResource {
  walletId: number;
  partnerId?: number;
  currentBalance: number;
  totalEarned: number;
  totalSpent: number;
  totalExpired: number;
  createdAt: string;
  updatedAt: string;
}

export interface PartnerApplyResource {
  partnerId?: number;
  userId: number;
  locationId: number;
  experienceId: number | null;
  position: string;
  cardNumber: string | null;
  citizenPhotoFront?: string;
  citizenPhotoBack?: string;
  businessLicense: string | null;
  taxCode: string | null;
  bankId: number;
  accountNumber: string;
  portraitCard: string;
  qrCode: string;
  isFeature: number;
  isFounding: number;
  rate: number;
  description: string | null;
  reason: string | null;
  status: number;
  createdDate: string;
  updatedDate: string;
  user: Partial<FullProfileResource>;
}

export interface FullPartnerResource extends PartnerResource {
  reviews?:RawReviewResource[]
}

export interface UserReviewResource extends UserOverviewResource {
  avatarUrl: string | null;
}

export interface ReviewResource {
  reviewId: number;
  projectId: number;
  projectName: string;
  projectStatus: number;
  userReviewAttachments: UserReviewAttachmentsResource[] | [];
  userIdRate: number;
  partnerUserId: number;
  rate: number;
  date: string;
  description: string;
  status: number;
  createdDate: string;
  updatedDate: string;
  userReview: UserReviewResource;
  reviewPartnerUserId: {
    id: number;
    name: string;
    avatar: string;
  };
  reviewProject: {
    id: number;
    name: string;
  };
}

export interface UserReviewAttachmentsResource {
  attachmentId: number;
  type: number;
  fileName: string;
  fileUrl: string;
  description: string | null;
  status: number;
}

export interface ComplainResource {
  idComplain: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  partnerUrl: string;
  subject: string;
  body: string;
  file: string;
  partnerId?: number;
  messages: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export interface PartnerFilterParams {
  page: number;
  search: string | null;
  position: string | null;
  rate: number | null;
  experienceId: number | null;
  categoryIds: number[];
  locationIds: number[];
  tagIds: number[];
  skillIds: number[];
  categoryServiceIds: number[];
  serviceIds: number[];
  languageIds: number[] | null;
  accountType: string | null;
}

export interface PartnerFilterParamsV2 {
  search: string | null | undefined;
  type: string | null;
  partnerPage: number | null | undefined;
  partnerCategoryIds: number[] | undefined;
  locationIds: number[] | undefined;
  partnerSkillIds: number[] | undefined;
  partnerServiceCategoryIds: number[] | undefined;
  partnerServiceIds: number[] | undefined;
  languageIds: number[] | undefined;
  accountType: string | null | undefined;
}

export interface PartnerSelectBoxResource {
  // categories: DatasResource<CategoryResource>;
  categories: CategoryResource[];
  // categoryServices: CategoryResource[];
  // services: CategoryResource[];
  tags: DatasResource<TagResource>;
  locations: DatasResource<LocationResource>;
  experiences: DatasResource<ExperienceResource>;
  languages: DatasResource<LanguageResource>;
  // skills: DatasResource<SkillResource>;
  // banks: DatasResource<BankResource>;
  banks: BankResource[];
  skills: SkillResource[];
}

export interface PartnerRegisterParams {
  category_project_ids: number[];
  location_id: number;
  // work_experience_id: number;
  languages: number[];
  // tags: number[];
  position: string;
  referral_source_id?: number;
  // attachments: PartnerRegisterAttachment[];
  // citizen_photo_front: string;
  // citizen_photo_back: string;
  educations: EducationResource[];
  workHistories: WorkHistoryResource[];
  // description: string;
  // phone_number: string;
  tax_code: string;
  name_rep: string;
  // front_card: string;
  // back_card: string;
  front_card: File;
  back_card: File;
  card_number: string;
  // portrait_card: string;
  portrait_card: File;
  bank_id: number | null;
  account_number: string | null;
  // qr_code: string;
  qr_code: File | null;
  business_license: string;
  main_skills: number[];
  category_service_ids: number[];
  service_ids: number[];
}

export interface PartnerConnectParams {
  partner_id: number;
  messages: string;
}

export interface PartnerUpdateParams {
  avatar: File;
  category_project_ids: number[];
  location_id: number;
  work_experience_id: number;
  languages: number[];
  tags: number[];
  position: string;
  educations: EducationResource[];
  workHistories: WorkHistoryResource[];
  description: string;
  main_skills: number[];
  category_service_ids: number[];
  service_ids: number[];
  typicalProjects: TypicalProjectsResource[];
}

export interface PartnerRegisterAttachment {
  name: string;
  description: string;
  file: string;
}

export interface PartnerFeedbackFromSocialOrganizationParams {
  name: string;
  address: string;
  phone: string;
  email: string;
  partner_url: string;
  subject: string;
  body: string;
  file: string | null;
  recaptcha_token: string;
}

export const PARTNER_SORT_RATE_DESC = "rate,desc";
export const PARTNER_SORT_RATE_ASC = "rate,asc";
