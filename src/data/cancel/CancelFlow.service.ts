import Constants from "@/src/constants/Constants";
import { UserRoleEnum } from "@/src/screens/JobScreen/modals/CancelJobModal";
import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosHeaders,
} from "axios";
import { setupCache } from "axios-cache-interceptor";
import Cookies from "js-cookie";
import { RawProfileResponse } from "../auth/models/types";

// =========================================================================
// I. GLOBAL TYPES VÀ RESPONSE CHUNG
// =========================================================================

/**
 * Interface cho phản hồi thành công chung của API
 * @template T - Kiểu dữ liệu trong trường 'data'
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string; // Có thể có message cho một số hành động thành công
}

/** Interface cho phản hồi hành động (Hủy, Phản hồi,...) */
export interface ActionResponse {
  success: boolean;
  message: string;
  refund_amount?: number;
  cancellation_fee?: number;
  cancellation_id?: number;
  response_deadline?: string;
  negotiation_deadline?: string;
  // Thêm các trường khác có thể có khi thực hiện hành động
}

// =========================================================================
// II. CANCELLATION (HỦY CÔNG VIỆC) TYPES
// =========================================================================

export interface BasicCancelParams {
  reason?: string;
  refund_percentage?: number;

  user_role?: UserRoleEnum;
}

export type UserRole = "customer" | "partner";

export interface RequestCancellationParams {
  user_role: UserRole;
  reason: string;
  refund_percentage: number;
}

export enum NegotiationResponseType {
  ACCEPT = "accept",
  REJECT = "reject",
  NEGOTIATE = "negotiate",
}

export enum AccountType {
  PERSONAL = "PERSONAL",
  BUSINESS = "BUSINESS",
}

export enum SexType {
  Unknown = 0,
  Male = 1,
  Female = 2,
}

export enum LevelType {
  FREE = "ACCOUNT_FREE",
  PREMIUM = "ACCOUNT_PREMIUM",
}
// export type NegotiationResponseType = "accept" | "reject" | "negotiate";
export interface RespondToCancellationParams {
  response_type: NegotiationResponseType;
  message: string;
  counter_refund_percentage?: number; // Chỉ dùng khi response_type là 'negotiate'
}

export interface FinalProposalParams {
  refund_percentage: number;
  message: string;
}

export interface UserResponseDetail {
  id: number;
  type: number; // User Type
  is_admin: 0 | 1; // Dùng Union Type 0 | 1 thay vì boolean nếu API trả về số
  name: string;
  name_rep: string | null;
  account_type: AccountType; // Dùng Enum AccountType
  level: LevelType; // Dùng Enum LevelType
  avatar: string; // URL
  email: string;
  email_verified_at: string | null;
  confirmation_code: string | null;
  expired_code_time: string | null;
  sex: SexType; // Dùng Enum SexType
  bithday: string | null;
  citizen_id: string;
  status: number;
  is_online: 0 | 1;
  last_seen: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  google_id: string | null;
  account_type_created: number;
}
export interface ResponsesCancellationDetails {
  id: number;
  cancellation_id: number;
  responded_by_user_id: number;
  response_type: ResponseType;
  message: string;
  // Chuyển string sang number, dùng `string | null` nếu API trả về null
  counter_refund_percentage: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  responded_by: UserResponseDetail;
}
export interface CancellationDetails {
  id: number;
  project_id: number;
  status: string; // Ví dụ: 'pending_partner', 'accepted', 'rejected'
  requested_by: RawProfileResponse;
  created_at: string;
  // ... các trường chi tiết khác về cancellation
  reason: string;
  refund_percentage: string;
  is_final_proposal: boolean;
  response_deadline: string;
  complaint_deadline: string;
  updated_at: string;
  deleted_at: string;

  responses: ResponsesCancellationDetails[];
}

// =========================================================================
// III. COMPLAINT (KHIẾU NẠI) TYPES
// =========================================================================
export enum ComplaintType {
  CancellationDispute = "cancellation_dispute",
  AcceptanceDispute = "acceptance_dispute",
}
// export type ComplaintType = "cancellation_dispute" | "acceptance_dispute";
export type ComplaintStatus =
  | "pending_payment"
  | "under_review"
  | "resolved"
  | "closed";

export interface FileComplaintParams {
  complaint_type: ComplaintType;
  description: string;
  attachments: string[]; // URLs
}

export interface FileAcceptanceComplaintParams {
  description: string;
  attachments: string[];
}

export interface PayFeeParams {
  transaction_id: string;
}

export interface ComplaintFileResponse extends ActionResponse {
  complaint_id: number;
  fee_amount: number;
  fee_id: number;
}

export interface ComplaintListItem {
  id: number;
  project_id: number;
  complaint_type: ComplaintType;
  status: ComplaintStatus;
  // ... các trường khác
}

export interface ComplaintsListData {
  current_page: number;
  data: ComplaintListItem[];
  per_page: number;
  total: number;
}

export interface ComplaintFiledByUser {
  id: number;
  type: number;
  is_admin: 0 | 1;
  name: string;
  name_rep: string | null;
  account_type: AccountType;
  level: LevelType;
  avatar: string;
  email: string;
  email_verified_at: string | null;
  confirmation_code: string | null;
  expired_code_time: string | null;
  sex: SexType;
  bithday: string | null;
  citizen_id: string;
  status: number;
  is_online: 0 | 1;
  last_seen: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  google_id: string | null;
  account_type_created: number;
}


export interface ComplaintDetail {
  id: number;
  project: any;
  filed_by: any;
  status: ComplaintStatus;
  // ...
}

// export type ComplaintFiledByUser = RawProfileResponse;
export interface ComplaintProjectSummary {
  id: number;
  project_id?: number; // nếu API có thêm, cho optional
  partners: any | null;
  location_id: number | null;
  base_salary_id: number | null;
  work_experience_id: number | null;
  work_time_id: number | null;
  created_by_user_id: number;
  partner_user_id: number | null;
  support_user_id: number | null;
  type_bib: number;
  name: string;
  start_date: string;              // "21/11/2025"
  end_date: string;                // "27/11/2025"
  start_date_original: string | null;
  end_date_original: string | null;
  description_original: string | null;
  confirm_info: string | null;     // JSON string
  price: number;
  connect: number;
  salary_type: number;
  price_min: number;
  price_max: number;
  is_feature: 0 | 1;
  description: string;
  job_requirements: string | null;
  benefits: string | null;
  posting_start_date: string | null;
  posting_end_date: string | null;
  note: string | null;
  finished_at: string | null;
  number_accept: number;
  job_duration_type: number;
  duration: number;
  need_partners: number;
  apply_status: number | null;
  deliverable_attachments: string | null;
  status: number;
  is_public: 0 | 1;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ComplaintDetail {
  id: number;
  project_id: number;
  cancellation_id: number | null;
  filed_by_user_id: number;
  complaint_type: ComplaintType;          // 'acceptance_dispute' | 'cancellation_dispute'
  status: ComplaintStatus;               // 'pending_payment' | 'under_review' | ...
  description: string;
  attachments: string[];                 // API trả [] nên để string[]
  fee_amount: string;                    // "400000.00"
  fee_paid: boolean;
  fee_paid_at: string | null;
  resolution: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;

  // project: ComplaintProjectSummary;
  // filed_by: ComplaintFiledByUser;
  cancellation: CancellationDetails | null; // nếu sau này API trả chi tiết cancellation
}

// =========================================================================
// IV. SERVICE CLASS
// =========================================================================
export interface CancellationInfo {
  project_id: number;
  project_name: string;
  current_status: number;
  status_text: string;
  price: number;
  partner_user_id: number;
  created_by_user_id: number;
  can_cancel_before_execution: boolean;
  can_quick_cancel: boolean;
  can_request_cancellation: boolean;
  can_file_acceptance_complaint: boolean;
  has_pending_cancellation: boolean;
  has_pending_complaint: boolean;
  hours_since_start: Date | null;
  days_since_delivery: number | null;
  started_at: string | null;
  delivered_at: string | null;
  quick_cancel_deadline: string | null;
  acceptance_complaint_deadline: string | null;
  suggested_action: string;
}

export class CancelFlowService {
  private readonly axiosClient: AxiosInstance;
  private readonly token = Cookies.get(Constants.KEY_ACCESS_TOKEN);

  constructor() {
    this.axiosClient = setupCache(
      axios.create({
        baseURL: process.env.API_BASE_URL,
      }),
      { ttl: 15 * 60 * 1000, methods: ["get"] }
    );

    // --- Interceptor Request: Gắn token và Content-Type ---
    this.axiosClient.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Authorization
        if (this.token) {
          if (config.headers instanceof AxiosHeaders) {
            config.headers.set("Authorization", `Bearer ${this.token}`);
          } else {
            (config.headers as any) = {
              Authorization: `Bearer ${this.token}`,
            };
          }
        }

        // Content-Type Handling
        const isFormData =
          typeof FormData !== "undefined" && config.data instanceof FormData;

        if (isFormData) {
          // Axios sẽ tự động set 'multipart/form-data' với boundary
        } else if (config.method !== "get" && !config.headers["Content-Type"]) {
          // Đảm bảo là JSON cho non-GET requests nếu không phải FormData
          if (config.headers instanceof AxiosHeaders) {
            config.headers.set("Content-Type", "application/json");
          } else {
            (config.headers as any) = {
              "Content-Type": "application/json",
            };
          }
        }

        return config;
      }
    );

    // --- Interceptor Response: Unwrap data ---
    this.axiosClient.interceptors.response.use(
      (response) => response?.data,
      (error) => error?.response?.data || error?.response
    );
  }

  // =========================================================================
  // 1. HÀM HỦY CÔNG VIỆC (CANCELLATION)
  // =========================================================================

  /** 1.1. Hủy trước khi thực hiện: POST /api/projects/{projectId}/cancel-before-execution */
  public async cancelBeforeExecution(
    projectId: number,
    params: BasicCancelParams
  ): Promise<ActionResponse> {
    const url = `/projects/${projectId}/cancel-before-execution`;
    return this.axiosClient.post(url, params);
  }

  /** 1.2. Hủy nhanh trong 24h: POST /api/projects/{projectId}/quick-cancel */
  public async quickCancel(
    projectId: number,
    params: BasicCancelParams
  ): Promise<ActionResponse> {
    const url = `/projects/${projectId}/quick-cancel`;
    return this.axiosClient.post(url, params);
  }

  /** 1.3. Yêu cầu hủy (Thương lượng): POST /api/projects/{projectId}/request-cancellation */
  public async requestCancellation(
    projectId: number,
    params: RequestCancellationParams
  ): Promise<ActionResponse> {
    const url = `/projects/${projectId}/request-cancellation`;
    return this.axiosClient.post(url, params);
  }

  /** 1.4. Phản hồi yêu cầu hủy: POST /api/cancellations/{cancellationId}/respond */
  public async respondToCancellation(
    cancellationId: number,
    params: RespondToCancellationParams
  ): Promise<ActionResponse> {
    const url = `/cancellations/${cancellationId}/respond`;
    return this.axiosClient.post(url, params);
  }

  /** 1.5. Gửi đề xuất cuối cùng: POST /api/cancellations/{cancellationId}/final-proposal */
  public async sendFinalProposal(
    cancellationId: number,
    params: FinalProposalParams
  ): Promise<ActionResponse> {
    const url = `/cancellations/${cancellationId}/final-proposal`;
    return this.axiosClient.post(url, params);
  }

  /** 1.6. Lấy danh sách yêu cầu hủy: GET /api/projects/{projectId}/cancellations */
  public async getCancellationsList(
    projectId: number
  ): Promise<ApiResponse<CancellationDetails[]>> {
    const url = `/projects/${projectId}/cancellations`;
    return this.axiosClient.get(url);
  }

  /** 1.7. Chi tiết yêu cầu hủy: GET /api/cancellations/{cancellationId} */
  public async getCancellationDetails(
    cancellationId: number
  ): Promise<ApiResponse<CancellationDetails>> {
    const url = `/cancellations/${cancellationId}`;
    return this.axiosClient.get(url);
  }

  // =========================================================================
  // 2. HÀM KHIẾU NẠI (COMPLAINT)
  // =========================================================================

  /** 2.1. Nộp khiếu nại (sau khi hủy): POST /api/projects/{projectId}/file-complaint */
  public async fileCancellationComplaint(
    projectId: number,
    params: Partial<FileComplaintParams>
  ): Promise<ComplaintFileResponse> {
    const url = `/projects/${projectId}/file-complaint`;
    const fullParams: Partial<FileComplaintParams> = {
      ...params,
      complaint_type: params?.complaint_type  || ComplaintType.CancellationDispute // Set cứng
    };
    return this.axiosClient.post(url, fullParams);
  }

  /** 2.2. Nộp khiếu nại nghiệm thu: POST /api/projects/{projectId}/file-acceptance-complaint */
  public async fileAcceptanceComplaint(
    projectId: number,
    params: FileAcceptanceComplaintParams
  ): Promise<ComplaintFileResponse> {
    const url = `/projects/${projectId}/file-acceptance-complaint`;
    return this.axiosClient.post(url, params);
  }

  /** 2.3. Thanh toán phí: POST /api/fees/{feeId}/pay */
  public async payFee(
    feeId: number,
    params: PayFeeParams
  ): Promise<ActionResponse> {
    const url = `/fees/${feeId}/pay`;
    return this.axiosClient.post(url, params);
  }

  /** 2.4. Danh sách khiếu nại: GET /api/complaints */
  public async getComplaintsList(
    status?: ComplaintStatus,
    type?: ComplaintType,
    userId?: number
  ): Promise<ApiResponse<ComplaintsListData>> {
    const url = `/complaints`;
    const queryParams: Record<string, any> = {};

    if (status) queryParams.status = status;
    if (type) queryParams.type = type;
    if (userId) queryParams.user_id = userId;

    return this.axiosClient.get(url, { params: queryParams });
  }

  /** 2.5. Chi tiết khiếu nại: GET /api/complaints/{complaintId} */
  public async getComplaintDetails(
    complaintId: number
  ): Promise<ApiResponse<ComplaintDetail>> {
    const url = `/complaints/${complaintId}`;
    return this.axiosClient.get(url);
  }

  /** 3.1. Chi tiết trạng thái hủy: GET /api/{complaintId}/cancellation-info */

  public async checkStatusCancel(
    projectId: number
  ): Promise<ApiResponse<CancellationInfo>> {
    const url = `/projects/${projectId}/cancellation-info`;
    // GET request (có sử dụng cache)
    return this.axiosClient.get(url);
  }




  
}
