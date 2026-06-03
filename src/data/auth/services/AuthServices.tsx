import apiUtils from "../../../utils/APIUtils";
import {
  FullProfileResource,
  LoginParams,
  LoginResource,
  RegisterParams,
  RegisterResponse,
  ForgotPasswordParams,
  ResetPasswordParams,
  ChangePasswordParams,
  LoginGoogleParams,
  VerifyEmailResendParams,
  VerifyEmailParams,
} from "../models/types";
import { AuthParseUtils } from "../utils/AuthParseUtils";
import EndpointConfig from "../../../constants/EndpointConfig";

export default class AuthServices {
  login(formDatas: LoginParams): Promise<LoginResource> {
    return new Promise((resolve, reject) => {
      apiUtils
        .post(EndpointConfig.AUTH_LOGIN, {
          ...formDatas,
        })
        .then((apiRes) => resolve(AuthParseUtils.login(apiRes.data)))
        .catch(reject);
    });
  }

  loginGoogle(formDatas: LoginGoogleParams): Promise<LoginResource> {
    return new Promise((resolve, reject) => {
      apiUtils
        .post(EndpointConfig.AUTH_LOGIN_GOOGLE, {
          ...formDatas,
        })
        .then((apiRes) => resolve(AuthParseUtils.login(apiRes.data)))
        .catch(reject);
    });
  }

  getFullInfo(accessToken: string): Promise<Partial<FullProfileResource>> {
    return new Promise((resolve, reject) => {
      // apiUtils.get(EndpointConfig.AUTH_FULL_INFO, {
      apiUtils
        .get(EndpointConfig.AUTH_FULL_INFO_V2, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((apiRes) => resolve(AuthParseUtils.profile(apiRes.data)))
        .catch(reject);
    });
  }

  updateFullInfo(formData: FormData): Promise<{ message?: string }> {
    return new Promise((resolve, reject) => {
      apiUtils
        .post(EndpointConfig.AUTH_FULL_INFO_UPDATE_V2, formData)
        .then((apiRes) => resolve(apiRes.data))
        .catch(reject);
    });
  }

  updateCitizenId(citizenId: string): Promise<{ message?: string }> {
    return new Promise((resolve, reject) => {
      apiUtils
        .post(EndpointConfig.AUTH_CITIZEN_ID_UPDATE, { citizen_id: citizenId })
        .then((apiRes) => resolve(apiRes.data))
        .catch(reject);
    });
  }

  logout() {
    return new Promise((resolve, reject) => {
      apiUtils
        .post(EndpointConfig.AUTH_LOGOUT)
        .then((apiRes) => resolve(apiRes.data))
        .catch(reject);
    });
  }

  register(formDatas: RegisterParams): Promise<RegisterResponse> {
    return new Promise((resolve, reject) => {
      apiUtils
        .post(EndpointConfig.AUTH_REGISTER_V2, {
          ...formDatas,
          account_type: "PERSONAL",
          password_confirmation: formDatas.password,
        })
        .then((apiRes) => resolve(AuthParseUtils.register(formDatas.email)))
        .catch(reject);
    });
  }

  companyRegister(formDatas: RegisterParams): Promise<RegisterResponse> {
    return new Promise((resolve, reject) => {
      apiUtils
        .post(EndpointConfig.AUTH_REGISTER_V2, {
          ...formDatas,
          account_type: "BUSINESS",
          password_confirmation: formDatas.password,
        })
        .then((apiRes) => resolve(AuthParseUtils.register(formDatas.email)))
        .catch(reject);
    });
  }

  forgotPassword(
    formData: ForgotPasswordParams
  ): Promise<{ message?: string }> {
    return new Promise((resolve, reject) => {
      apiUtils
        .post(EndpointConfig.AUTH_FORGOT_PASSWORD, formData)
        .then((apiRes) => resolve(apiRes.data))
        .catch(reject);
    });
  }

  resetPassword(
    formData: ResetPasswordParams,
    token: string
  ): Promise<{ message?: string }> {
    return new Promise((resolve, reject) => {
      apiUtils
        .put(EndpointConfig.AUTH_FORGOT_PASSWORD, formData, {
          params: { token },
        })
        .then((apiRes) => resolve(apiRes.data))
        .catch(reject);
    });
  }

  changePassword(
    formData: ChangePasswordParams
  ): Promise<{ message?: string }> {
    return new Promise((resolve, reject) => {
      apiUtils
        .post(EndpointConfig.AUTH_CHANGE_PASSWORD, formData)
        .then((apiRes) => resolve(apiRes.data))
        .catch(reject);
    });
  }

  verifyEmailResend(
    params: VerifyEmailResendParams
  ): Promise<{ message?: string }> {
    return new Promise((resolve, reject) => {
      apiUtils
        .post(EndpointConfig.AUTH_VERIFY_EMAIL_RESEND, params)
        .then((apiRes) => resolve(apiRes.data))
        .catch(reject);
    });
  }

  verifyOtp(params: VerifyEmailParams): Promise<{ message?: string }> {
    return new Promise((resolve, reject) => {
      apiUtils
        .post(EndpointConfig.AUTH_VERIFY_OTP, params)
        .then((apiRes) => resolve(apiRes.data))
        .catch(reject);
    });
  }

  verifyOtpResend(
    params: VerifyEmailResendParams
  ): Promise<{ message?: string }> {
    return new Promise((resolve, reject) => {
      apiUtils
        .post(EndpointConfig.AUTH_VERIFY_OTP_RESEND, params)
        .then((apiRes) => resolve(apiRes.data))
        .catch(reject);
    });
  }
}
