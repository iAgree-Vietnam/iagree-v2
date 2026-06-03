import { SalaryResource } from "../../salary/models/salary.types";
import { DatasResource } from "../../base/models/base.types";
import {
  CategoryResource,
  CateServiceResource,
  ServiceResource,
} from "../../category/models/category.types";
import { ExperienceResource } from "../../experience/models/experience.types";
import { TimeResource } from "../../time/models/time.types";
import { LocationResource } from "../../location/models/location.types";
import { TagResource } from "../../tag/models/tag.types";
import { Moment } from "moment";
import { SettingResource } from "../../setting/models/setting.types";
import { RcFile } from "antd/es/upload/interface";
import { SkillResource } from "../../skill/models/skill.types";
import {
  PartnerApplyResource,
  PartnerResource,
} from "../../partner/models/partner.types";
import { FullProfileResource } from "../../auth/models/types";
import { RawUserProjectBidResource } from "./job.raw";
import { FullJobResourceV2 } from "./v2/job.types";

export interface JobResource {
  jobId: number;
  typeBib: number;
  name: string;
  startDate: string;
  endDate: string;
  price: number;
  isFeature: boolean;

  description: string;
  jobRequirements: string;
  benefits: string;

  logoUrl: string | null;
  salary: SalaryResource | null;
  location: LocationResource | null;
  postingStartDate: string;
  postingEndDate: string;
  isExpired: boolean | null;

  note: string;
  status: number;

  createdDate: string;
  updatedDate: string | null;

  isLiked: boolean;

  salaryType: number;
  priceMin: number | null;
  priceMax: number | null;

  contract: JobContractOverviewResource | null;
  applyDate: string;
  isPublic: number;
  numberAccept: number | null;
  numberAcceptRemaining: number;
  jobDurationType: number | null;
  duration: number | null;
  needPartners: number | null;
  applyStatus: number | null;
  deliverableAttachments: string | null;
  // skills: SkillResource[] | null;
  userProjectBids: UserProjectBidResource[];
  confirmInfo: string | null;
}

export interface FullJobResource extends JobResource {
  createdByUserId: number;
  partnerUserId: number;
  isReadTerm?: number | null;
  bid: JobBidResource | null;
  contracts: JobContractResource[];
  // isApply: boolean | null;
  isApply: UserProjectBidResource | null;
  salary: SalaryResource | null;
  experience: ExperienceResource | null;
  categories: CategoryResource[] | null;
  time: TimeResource | null;
  rate: number | null;
  tags: TagResource[];
  results: JobResultResource[];
  histories: HistoryJobResultResource[];
  projectTransaction: ProjectTransaction | null;
  projectTransactionHistory: ProjectTransactionHistory[] | null;
  categoryServices: CateServiceResource[] | null;
  services: ServiceResource[] | null;
  skills: SkillResource[] | null;
  // numberAccept: number | null;
  // isPublic: number;
  // partnersApply: PartnerApplyResource[] | null;
  userProjectBids: UserProjectBidResource[] | [];
  // partners: PartnerResource[] | null;
  partners: number[] | null;
  projectAttachmentFiles: ProjectAttachmentFiles[] | [];
  connect: number | null;
  userProjectDeals: UserProjectBidResource[] | [];
  reviews?: JobReviews[] | [] | null;
  userCreatedProject?: userCreatedProjectResource | null;
}

export interface userCreatedProjectResource {
  user: {
    userId: number;
    userName: string;
    nameRep: string | null;
    avatar: string | null;
  };
  userReview: {
    total: number | 0;
    avgRate: number | 0;
  };
  totalJobs: number | 0;
  replyChat: string | null;
  totalSpent: {
    totalSpent: number | 0;
  };
}

export interface ConfirmedProjectInfoResource {
  Project: {
    price: number;
    start_date: string;
    end_date: string;
    number_accept: number;
  };
}

export interface JobReviews {
  reviewId: number;
  projectId: number;
  type: number;
  userIdRate: number;
  partnerUserId: number;
  rate: number;
  date: string | null;
  decscription: string;
  status: number;
  createdAt: string;
  updatedAt: string;
  user: UserReview;
  partnerUser: UserReview;
}

export interface UserReview {
  id: number;
  name: string;
  email?: string | null;
  avatarUrl: string;
}

export interface ProjectAttachmentFiles {
  fileId: number;
  fileUrl: string;
  fileName: string;
}

export interface ProjectTransaction {
  transactions: ProjectTransactionTransactions | null;
  advance: ProjectTransactionAdvance | null;
  settlement: ProjectTransactionSettlement | null;
}

export interface ProjectTransactionTransactions {
  transactionTotalsSum: string;
  transactionTotalsSumSuccess: string;
  transactionTotalsSumPending: string;
}

export interface ProjectTransactionAdvance {
  transactionSum: string;
  transactionSumSuccess: string;
  transactionSumPending: string;
}

export interface ProjectTransactionSettlement
  extends ProjectTransactionAdvance {}

export interface ProjectTransactionHistory {
  // id: number;
  transactionType: number;
  typeId: number;
  name: string;
  transactionAmount: number;
  orderId: string;
  transactionId: string | null;
  // price: number;
  paymentMethod: string | null;
  paymentType: string | null;
  date: string;
  platformfeePercentage: number;
  platformfee: number;
  productSubTotal: number;
  status: number;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  purchaseType: number | null;
  purchasePrice: number | null;
  purchaseStatus: number | null;
}

export interface JobInitResource {
  // categories: DatasResource<CategoryResource>,
  categories: CategoryResource[];
  // categoryServices: CateServiceResource[];
  // services: ServiceResource[];
  experiences: DatasResource<ExperienceResource>;
  times: DatasResource<TimeResource>;
  salaries: DatasResource<SalaryResource>;
  tags: DatasResource<TagResource>;
  jobs: DatasResource<FullJobResourceV2>;
  specialJobs: FullJobResource[];
  // skills: SkillResource[];
}

export interface JobSelectboxResource {
  salaries: DatasResource<SalaryResource>;
  // categories: DatasResource<CategoryResource>;
  categories: CategoryResource[];
  tags: DatasResource<TagResource>;
  locations: DatasResource<LocationResource>;
  experiences: DatasResource<ExperienceResource>;
  times: DatasResource<TimeResource>;
  skills: SkillResource[];
}

export interface JobFormParams {
  name: string;
  category_project_ids: number[];
  // locationId: number,
  // salaryId: number,
  // experienceId: number,
  // timeId: number,
  // endDate: Moment,
  // tagIds: number[],
  description: string;
  requirements: string;
  benefits: string;
  status: number;
  job_type: string;
  job_date_type: string | null;
  duration: number | null;
  start_date: string | null;
  end_date: string | null;
  need_partners: number | null;
  deliverable_attachments: string | null;

  salary_type: number;
  price: number | null;
  price_min: number | null;
  price_max: number | null;

  category_service_ids: number[] | null;
  service_ids: number[] | null;
  skills: number[];
  number_accept: number;
  is_public: number;
  partners: number[] | null;
  attachment_files: File[] | null;
  posting_end_date: string | null;
}

export interface CalculatePlatformFeeParams {
  type: number;
  price: number;
}
export interface JobsFilterParams {
  page: number;
  type: number | null;
  statusId: number | null;
  search: string | null;
  categoryIds: number[];
  experienceId: number | null;
  salaryId: number | null;
  timeIds: number[];
  tagIds: number[];
  locationIds?: number[];
  skillIds: number[];
  categoryServiceIds: number[];
  serviceIds: number[];
  statusList?: string[];
  // deadlineType?: number; // Loại thời gian: 1 (Theo số ngày), 2 (Ngày cụ thể)
  // jobDurationType?: number; // Hạn hoàn thành mong muốn (Xuất hiện khi Loại thời gian là 1 (theo số ngày))
  // duration?: number; // Số ngày
  // startDate?: Moment; // Ngày bắt đầu (Xuất hiện khi Loại thời gian là 2 (Ngày cụ thể))
  // endDate?: Moment; // Ngày kết thúc (Xuất hiện khi Loại thời gian là 2 (Ngày cụ thể))
  postingEndDate?: string; // Thời hạn ứng tuyển
  postedDateRange?: string; // Thời gian đăng công việc
  priceMin?: number;
  priceMax?: number;
}

export interface JobsFilterParamsV2 {
  jobPage: number | null | undefined;
  type: string | null;
  search: string | null;
  jobCategoryIds: number[] | undefined;
  jobSkillIds: number[] | undefined;
  jobServiceCategoryIds: number[] | undefined;
  jobServiceIds: number[] | undefined;
  salaryId: number | null;
  postingEndDate: string | null;
  postedDateRange: string | null;
  priceMin: number | null | undefined;
  priceMax: number | null | undefined;
}

export interface JobReactionParams {
  jobId: number;
}

export interface JobApplyParams {
  letter: string;
  description: string;
  negotiatePrice: number | null;
  attachments: RcFile[] | null;
  numberAccept: number;
  startDate: Moment;
  endDate: Moment;
}

export interface JobUploadDocumentParams {
  resultId: number;
  documentName: string;
  attachments: RcFile[];
  description: string;
}

export interface UserProjectDealResource {
  dealId: number;
  projectId: number;
  userProjectBidId: number;
  userId: number;
  type: number;
  applicationLetter: string | null;
  applicationFile: string | null;
  description: string | null;
  negotiatePrice: number;
  numberAccept: number;
  startDate: string;
  endDate: string;
  clientIp: string | null;
  deviceName: string | null;
  platform: string | null;
  dealStatus: number;
  status: number;
  createdAt: string;
  updatedAt: string;
}
export interface UserProjectBidResource {
  bidId: number;
  projectId: number;
  userId: number;
  applicationLetter: string;
  applicationFile: string | null;
  note: string | null;
  negotiatePrice: number;
  description: string | null;
  numberAccept: number;
  startDate?: string;
  endDate?: string;
  bidType: number | null;
  status: number;
  createdAt: string;
  updatedAt: string;
  project?: FullJobResource | null;
  user?: Partial<FullProfileResource> | null;
  projectBidFiles?: ProjectBidFilesResource[] | [] | null;
  userProjectDeals?: UserProjectDealResource[] | [] | null;
}

export interface ProjectBidFilesResource {
  fileId: number;
  userProjectBidId: number;
  file: string;
  note: string | null;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export interface JobBidResource {
  bidId: number;
  projectId: number;
  userId: number;
  letter: string;
  attachmentUrl: string | null;
  note: string | null;
  status: number;
  createdDate: string;
  updatedDate: string;
}

export interface JobContractOverviewResource {
  contractId: number;
  projectId: number;
  createdDate: string;
}

export interface JobContractResource extends JobContractOverviewResource {
  userId: number;
  toUserId: number;
  userDocumentId: number;
  name: string;
  body: string;
  fileUrl: string;
  status: number;
  lastModifiedDate: string;
  updatedDate: string;
}

export interface JobResultResource {
  resultId: number;
  projectId?: number | null;
  round?: number | null;
  name: string;
  fileUrl: string;
  description: string | null;
  status: number;
  note?: string | null;
  fileSize?: string | null;
  createdDate: string | undefined;
  updatedDate?: string | undefined;
}

export interface HistoryJobResultResource {
  round: number;
  status: number;
  note: string;
  createdDate: string;
  updatedDate: string;
  applicationFile?: JobResultResource[];
}

export interface JobDetailInitResource extends FullJobResource {
  // setting: SettingResource;
  projectRelated: FullJobResource[];
}

export interface JobSubmitResponseResource {
  jobId: number;
  name: string;
}

export interface PlatformFeeResponseResource {
  price: number;
  platformfee_percentage: number;
  total: number;
  platformfee: number;
  message: string;
}

export interface AgreeJobResultParams {
  rate: number;
  description: string;
  attachment_files: RcFile[];
}

export interface RejectJobResultParams {
  result_job_file: Array<{
    id: number;
    status: number;
  }>;
  description: string;
}

export interface JobDeleteDocumentParams {
  jobId: number;
  resultId: number;
}

export interface JobDownloadDocumentParams {
  jobId: number;
  resultId: number;
  file: JobResultResource;
}

export interface JobDeleteParams {
  jobId: number;
}

export interface JobSuggest {
  name: string;
}

export interface ConfirmPartnerParams {
  user_id: number;
  start_date: string;
  end_date: string;
  negotiate_price: number;
  number_accept: number;
  description: string;
  client_ip: string;
  device_name: string;
  platform: string;
}

export interface SendOfferParams extends ConfirmPartnerParams {
  deal_status: number;
}

export const JOB_SORT_PRICE_DESC = "price_desc";
export const JOB_SORT_PRICE_ASC = "price_asc";
