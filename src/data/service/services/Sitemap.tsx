import axios, {
  AxiosHeaders,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { setupCache } from "axios-cache-interceptor";

export class WalletService {
  private readonly axiosClient: AxiosInstance;

  constructor(private token?: string) {
    this.axiosClient = setupCache(
      axios.create({
        baseURL: process.env.API_BASE_URL,
      }),
      { ttl: 30 * 60 * 60 * 1000, methods: ["get"] }
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

  /** GET /{type}/wallet/bank-account */
}
