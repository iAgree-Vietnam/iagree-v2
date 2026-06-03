import axios, {
  AxiosHeaders,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { setupCache } from "axios-cache-interceptor";
import Cookies from "js-cookie";
import Constants from "../../constants/Constants";
// Import các types cần thiết (giả sử AxiosInstance được truyền vào)

// Định nghĩa kiểu dữ liệu cho response thành công
export type AuthValidateSuccessData = {
  referrer_name: string; // Tên người giới thiệu
  reward_amount: number; // Số tiền thưởng
};

// Định nghĩa kiểu dữ liệu cho toàn bộ phản hồi
// (Dựa vào ảnh Postman, backend trả về success/message/data)
export type AuthValidateResponse<T = unknown> = {
  reward_amount: number | undefined;
  referrer_name?: string;
  success: boolean;
  message: string; // "Mã giới thiệu hợp lệ" hoặc "Mã giới thiệu không hợp lệ"
  data?: T; // Chỉ có khi success là true, hoặc null/undefined khi fail
};

export type IStatisticRef = {
  total_referrals: number;
  successful_referrals: number;
  pending_referrals: number;
  total_rewards: number;
  referral_code: string;
};

export type IRefList = {
  id: number;
  referred_name: string;
  referred_username: string;
  status: string;
  created_at: string;
  note: string;
};

export class AuthService {
  private readonly axiosClient: AxiosInstance; // Tái sử dụng AxiosInstance đã cấu hình (ví dụ từ WalletService)
  token = Cookies.get(Constants.KEY_ACCESS_TOKEN);
  constructor() {
    this.axiosClient = setupCache(
      axios.create({
        baseURL: process.env.API_BASE_URL,
      }),
      { ttl: 15 * 60 * 1000, methods: ["get"] }
    );

    // Interceptor: gắn token + set multipart khi data là FormData
    this.axiosClient.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Authorization
        if (this.token) {
          if (config.headers instanceof AxiosHeaders) {
            config.headers.set("Authorization", `Bearer ${this.token}`);
          } else {
            (config.headers as any) = {
              // ...(config.headers || {}),
              Authorization: `Bearer ${this.token}`,
            };
          }
        }

        // Nếu payload là FormData (upload file) → set Content-Type multipart/form-data
        // (thực tế có thể không cần set, axios sẽ tự set boundary;
        //  nhưng bạn yêu cầu gán qua interceptor thì mình set rõ ràng)
        const isFormData =
          typeof FormData !== "undefined" && config.data instanceof FormData;
        if (isFormData) {
          if (config.headers instanceof AxiosHeaders) {
            config.headers.set("Content-Type", "multipart/form-data");
          } else {
            (config.headers as any) = {
              // ...(config.headers),
              "Content-Type": "multipart/form-data",
            };
          }
        }

        return config;
      }
    );

    // unwrap data
    this.axiosClient.interceptors.response.use(
      (response) => response?.data,
      (error) => error?.response
    );
  }
  /**
   * POST /api/partner/Auth/validate
   * Kiểm tra tính hợp lệ của mã giới thiệu.
   * @param AuthCode Mã giới thiệu (VD: "IA0888888888")
   * @returns AuthValidateResponse<AuthValidateSuccessData | null>
   */

  public async referalAnalyst(): Promise<AuthValidateResponse<IStatisticRef>> {
    return this.axiosClient.get("/partner/statistics");
    // return response.data;
  }

  public async referalList(): Promise<AuthValidateResponse<IRefList[]>> {
    return this.axiosClient.get("/partner/referrals");
    // return response.data;
  }

  public async validateAuthCode(
    referralCode: string
  ): Promise<AuthValidateResponse<AuthValidateSuccessData | null>> {
    const response = await this.axiosClient.post(
      "/partner/referral/validate",
      {
        // Payload gửi đi theo Postman
        referral_code: referralCode,
      } // Thêm config nếu cần, nhưng thường POST JSON không cần thêm gì // (Nếu response trả về 400, interceptor đã handle để nó vẫn là Promise resolve)
    ); // **Quan trọng:** Postman images cho thấy cả 2 status (200 OK và 400 Bad Request) // đều trả về JSON có structure {success: boolean, message: string, data: ...} // Dựa vào interceptor: // - Nếu 200 OK: response?.data = {success: true, ...} // - Nếu 400 Bad Request: response = error?.response = {data: {success: false, ...}, status: 400, ...} // Và interceptor response đã unwrap/handle error, nên ta chỉ cần return. // Vì interceptor đã unwrap data cho response 200, và trả về `error?.response` cho lỗi (400) // nên ta cần **bảo đảm** logic xử lý lỗi/data từ response ở `WalletService` ổn áp. // Nếu `WalletService` interceptor **chỉ** unwrap `response.data` cho **200 OK** (như code ông) // và trả về `error?.response` cho lỗi (ví dụ 400) thì ta cần chỉnh nhẹ. // **GIẢ ĐỊNH** `axiosClient` đã được cấu hình như trong `WalletService` // (unwrap data cho 200, trả về response cho lỗi)

    if (response && response.data) {
      // Nếu là response 400 (error?.response) → ta trả về response.data
      // Nếu là response 200 (response?.data) → ta trả về response.data
      return { success: true, ...response.data };
    } // Fallback nếu không có data (cực hiếm)

    return {
      success: false,
      message: "Lỗi kết nối hoặc dữ liệu không xác định.",
      data: null,
      reward_amount: -1,
    };
  }

  public async validateIdentityCard(
    citizen_id: string
  ): Promise<AuthValidateResponse<null>> {
    try {
      const response = await this.axiosClient.post(
        "/user/check/citizenid",
        {
          // Payload gửi đi theo Postman
          citizen_id,
        } // Thêm config nếu cần, nhưng thường POST JSON không cần thêm gì // (Nếu response trả về 400, interceptor đã handle để nó vẫn là Promise resolve)
      ); // **Quan trọng:** Postman images cho thấy cả 2 status (200 OK và 400 Bad Request) // đều trả về JSON có structure {success: boolean, message: string, data: ...} // Dựa vào interceptor: // - Nếu 200 OK: response?.data = {success: true, ...} // - Nếu 400 Bad Request: response = error?.response = {data: {success: false, ...}, status: 400, ...} // Và interceptor response đã unwrap/handle error, nên ta chỉ cần return. // Vì interceptor đã unwrap data cho response 200, và trả về `error?.response` cho lỗi (400) // nên ta cần **bảo đảm** logic xử lý lỗi/data từ response ở `WalletService` ổn áp. // Nếu `WalletService` interceptor **chỉ** unwrap `response.data` cho **200 OK** (như code ông) // và trả về `error?.response` cho lỗi (ví dụ 400) thì ta cần chỉnh nhẹ. // **GIẢ ĐỊNH** `axiosClient` đã được cấu hình như trong `WalletService` // (unwrap data cho 200, trả về response cho lỗi)

      return { success: true, ...response.data };
    } catch (error) {
      return {
        success: false,
        message: "Lỗi kết nối hoặc dữ liệu không xác định.",
        data: null,
        reward_amount: -1,
      };
    }
  }
}
