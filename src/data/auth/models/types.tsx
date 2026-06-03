import {
  RawPartnerResource,
  RawReviewResource,
} from "@/src/data/partner/models/partner.raw";
import {
  PartnerResource,
  ReviewResource,
} from "../../partner/models/partner.types";
import { DatasResource } from "../../base/models/base.types";
import { RcFile } from "antd/es/upload";

export interface RawUserOverviewResource {
  id: number;
  name: string;
}

export interface RawUserServiceResource {
  service_key: string;
  name: string;
  service_value: string;
  status: number;
  begin_date: string;
  end_date: string;
}

export interface RawUserPackageResource {
  type: string;
  key_name: string;
  name: string;
  status: number;
  begin_date: string;
  end_date: string;
}

export interface RawProfileResponse extends RawUserOverviewResource {
  type: number;
  referral_code: string | null;
  referred_by: number | null;
  account_type: string;
  is_admin: number;
  email?: string | null;
  email_verified_at: string;
  sex: number;
  bithday: string;
  phone: string;
  status: number;
  created_at: string;
  updated_at: string;
  avatar: string;
  partner: RawPartnerResource | null;
  level_display: string | null;
  google_id: string | null;
  citizen_id: string | null;
  account_type_created: number;
  user_reviews: DatasResource<RawReviewResource>;
  user_services: RawUserServiceResource[] | null;
  user_packages: RawUserPackageResource[] | null;
  name_rep: string | null;
  tax_code: string | null;
  card_number: string | null;
  front_card: string | null;
  back_card: string | null;
  business_license: string | null;
  documents: string[] | string | null;
  userId: number;
  fullName: string;
  accountType: "PERSONAL" | "BUSINESS"; // Có thể thêm các loại khác nếu có
  isAdmin: boolean;
  phoneNumber: string;
  avatarUrl: string;
  googleId: string | null;
  citizenId: string | null;
  accountTypeCreated: number;
  levelDisplay: string | null; // Hoặc một kiểu khác nếu có dữ liệu cho levelDisplay
  userReviews: {
    items: any[]; // Bạn có thể tạo kiểu cho từng item trong review nếu cần
    total: number;
  };
  userServices: any[] | null; // Bạn có thể định nghĩa lại kiểu của từng userService nếu cần
  userPackages: any[] | null; // Tương tự như userServices
  taxCode: string | null;
  nameRep: string | null;
  cardNumber: string | null;
  frontCard: string | null;
  backCard: string | null;
  businessLicense: string | null;
}

export interface RawLoginResponse {
  token: string;
}

export interface UserOverviewResource {
  userId?: number;
  fullName?: string;
}

export interface UserServiceResource {
  serviceKey: string;
  name: string;
  serviceValue: string;
  status: number;
  beginDate: string;
  endDate: string;
}

export interface UserPackageResource {
  type: string;
  keyName: string;
  name: string;
  status: number;
  beginDate: string;
  endDate: string;
}

export interface FullProfileResource extends UserOverviewResource {
  type: number;
  referral_code?: string | null;
  referred_by?: number | null;
  accountType: string;
  isAdmin: boolean;
  email?: string | null;
  sex: number;
  bithday: string | null;
  phoneNumber: string | null;
  status: number;
  avatarUrl: string;
  partner: Partial<RawPartnerResource> | null;
  levelDisplay: string | null;
  googleId: string | null;
  citizenId: string | null;
  accountTypeCreated: number;
  userReviews: DatasResource<ReviewResource>;
  userServices: UserServiceResource[] | null;
  userPackages: UserPackageResource[] | null;
  nameRep: string | null;
  taxCode: string | null;
  cardNumber: string | null;
  frontCard: string | null;
  backCard: string | null;
  businessLicense: string | null;
  documents: string[] | string | null;
  avatar: string
  name: string
}

export interface FullProfileResourceV2 extends UserOverviewResource {
  type?: number;
  accountType?: string;
  isAdmin: boolean;
  email?: string;
  sex?: number;
  bithday?: string | null;
  status?: number;
  avatarUrl?: string;
  partner?: RawPartnerResource | null;
  levelDisplay?: string | null;
  googleId?: string | null;
  citizenId?: string | null;
  accountTypeCreated?: number;
  userReviews?: DatasResource<ReviewResource>;
  userServices?: UserServiceResource[] | null;
  userPackages?: UserPackageResource[] | null;
  nameRep?: string | null;
  taxCode?: string | null;
  cardNumber?: string | null;
  frontCard?: string | null;
  backCard?: string | null;
  businessLicense?: string | null;
  documents?: string[] | string | null;
}

export interface LoginResource {
  accessToken: string;
}

export interface LoginParams {
  email: string;
  password: string;
}

export interface LoginGoogleParams {
  email: string;
  full_name: string;
  google_token: string;
}

export interface RegisterParams {
  name: string;
  name_rep: string;
  email: string;
  password: string;
  phone: string;
  citizen_id: string;
  tax_code: string;
}

export interface ForgotPasswordParams {
  email: string;
}

export interface ResetPasswordParams {
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ChangePasswordParams {
  old_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface VerifyEmailParams {
  confirmation_code: string;
}

export interface VerifyEmailResendParams {
  email: string;
}

export interface RegisterResponse {
  email: string;
  message?: string | null;
}

export interface RawRegisterResponse {}
