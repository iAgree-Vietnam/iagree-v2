import StringUtils from "@/src/utils/StringUtils";
import { TransactionResource } from "@/src/data/payment/models/transaction.types";

export default class AuthRouteUtils {
  static toScreen(params?: any) { return '/' }
  static toPersonalRegister() {
    return "/personal-register";
  }

  static toScreen(params?: any) { return '/' }
  static toAnalyst() {
    return "/analyst";
  }

  static toScreen(params?: any) { return '/' }
  static toCompanyRegister() {
    return "/company-register";
  }

  static toScreen(params?: any) { return '/' }
  static toCheckRole() {
    return "/check-role";
  }

  static toScreen(params?: any) { return '/' }
  static toLogin() {
    return "/login";
  }

  static toScreen(params?: any) { return '/' }
  static toVerifyEmailResend() {
    return "/verify-email-resend";
  }

  static toScreen(params?: any) { return '/' }
  static toVerifyOtp() {
    return "/verify-otp";
  }

  static toScreen(params?: any) { return '/' }
  static toVerifyOtpV2() {
    return "/verify-otp-register-become-partner";
  }

  static toScreen(params?: any) { return '/' }
  static toForgotPassword() {
    return "/forgot-password";
  }

  static toScreen(params?: any) { return '/' }
  static toProfile() {
    return "/profile";
  }

  static toScreen(params?: any) { return '/' }
  static toSubScription() {
    return "/profile/subscriptions";
  }

  static toScreen(params?: any) { return '/' }
  static toChangePassword() {
    return "/profile/change-password";
  }

  static toScreen(params?: any) { return '/' }
  static toTransaction() {
    return "/profile/transactions";
  }
  static toScreen(params?: any) { return '/' }
  static toTransactionDetails(transactionResource: TransactionResource) {
    return `/profile/transactions/${StringUtils.slugify(
      transactionResource.name
    )}.${transactionResource.orderId}`;
  }

  static toScreen(params?: any) { return '/' }
  static toNotification() {
    return "/profile/notifications";
  }

  static toScreen(params?: any) { return '/' }
  static toFavorite() {
    return "/profile/favorite";
  }

  static toScreen(params?: any) { return '/' }
  static toManageChance() {
    return "/pricing/chance";
  }

  static toScreen(params?: any) { return '/' }
  static toInternalWallet() {
    return "/internal-wallet";
  }

  static toScreen(params?: any) { return '/' }
  static toWithDrawalMoney() {
    return "/internal-wallet/withdrawal-money";
  }

  static toScreen(params?: any) { return '/' }
  static toManageInfo() {
    return "/internal-wallet/manage-info";
  }

  static toScreen(params?: any) { return '/' }
  static toTransactionHistory() {
    return "/internal-wallet/transaction-history";
  }

  static toScreen(params?: any) { return '/' }
  static toIncomeReconciliation() {
    return "/internal-wallet/income-reconciliation";
  }

  static toScreen(params?: any) { return '/' }
  static toChat() {
    return "/chat";
  }

  static toScreen(params?: any) { return '/' }
  static toRegisterBecomePartner() {
    return "/register-become-partner";
  }

  static toScreen(params?: any) { return '/' }
  static toCategoryDetail(categoryName: string) {
    return `/category-detail/${StringUtils.slugify(categoryName)}`;
  }

  static toScreen(params?: any) { return '/' }
  static toServiceCategory(categoryName: string, serviceCategoryName: string) {
    return `/category-detail/${StringUtils.slugify(
      categoryName
    )}/${StringUtils.slugify(serviceCategoryName)}`;
  }

  static toScreen(params?: any) { return '/' }
  static toService(
    categoryName: string,
    serviceCategoryName: string,
    serviceIds: number[]
  ) {
    const categorySlug = StringUtils.slugify(categoryName);
    const serviceCategorySlug = StringUtils.slugify(serviceCategoryName);

    const serviceIdsQuery =
      serviceIds.length > 0 ? `serviceIds=${serviceIds.join(",")}` : "";

    return `/category-detail/${categorySlug}/${serviceCategorySlug}${
      serviceIdsQuery ? `?${serviceIdsQuery}` : ""
    }`;
  }

  static toScreen(params?: any) { return '/' }
  static isAuthPath(pathname: string) {
    return [
      this.toLogin(),
      this.toPersonalRegister(),
      this.toVerifyEmailResend(),
      this.toVerifyOtp(),
      this.toForgotPassword(),
      this.toCompanyRegister(),
      this.toCheckRole(),
    ].includes(pathname);
  }

  static toScreen(params?: any) { return '/' }
  static toLoginBecomePartner() {
    return "/login-become-partner";
  }
}
