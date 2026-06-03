import StringUtils from "@/src/utils/StringUtils";
import { TransactionResource } from "@/src/data/payment/models/transaction.types";

export default class AuthRouteUtils {
  static toPersonalRegister() {
    return "/personal-register";
  }

  static toAnalyst() {
    return "/analyst";
  }

  static toCompanyRegister() {
    return "/company-register";
  }

  static toCheckRole() {
    return "/check-role";
  }

  static toLogin() {
    return "/login";
  }

  static toVerifyEmailResend() {
    return "/verify-email-resend";
  }

  static toVerifyOtp() {
    return "/verify-otp";
  }

  static toVerifyOtpV2() {
    return "/verify-otp-register-become-partner";
  }

  static toForgotPassword() {
    return "/forgot-password";
  }

  static toProfile() {
    return "/profile";
  }

  static toSubScription() {
    return "/profile/subscriptions";
  }

  static toChangePassword() {
    return "/profile/change-password";
  }

  static toTransaction() {
    return "/profile/transactions";
  }
  static toTransactionDetails(transactionResource: TransactionResource) {
    return `/profile/transactions/${StringUtils.slugify(
      transactionResource.name
    )}.${transactionResource.orderId}`;
  }

  static toNotification() {
    return "/profile/notifications";
  }

  static toFavorite() {
    return "/profile/favorite";
  }

  static toManageChance() {
    return "/pricing/chance";
  }

  static toInternalWallet() {
    return "/internal-wallet";
  }

  static toWithDrawalMoney() {
    return "/internal-wallet/withdrawal-money";
  }

  static toManageInfo() {
    return "/internal-wallet/manage-info";
  }

  static toTransactionHistory() {
    return "/internal-wallet/transaction-history";
  }

  static toIncomeReconciliation() {
    return "/internal-wallet/income-reconciliation";
  }

  static toChat() {
    return "/chat";
  }

  static toRegisterBecomePartner() {
    return "/register-become-partner";
  }

  static toCategoryDetail(categoryName: string) {
    return `/category-detail/${StringUtils.slugify(categoryName)}`;
  }

  static toServiceCategory(categoryName: string, serviceCategoryName: string) {
    return `/category-detail/${StringUtils.slugify(
      categoryName
    )}/${StringUtils.slugify(serviceCategoryName)}`;
  }

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

  static toLoginBecomePartner() {
    return "/login-become-partner";
  }
}
