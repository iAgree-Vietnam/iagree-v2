import Constants from "@/src/constants/Constants";
import { RawSettingResource } from "../models/setting.raw";
import { SettingResource } from "../models/setting.types";
import { reduce } from "lodash";

export const SettingParserUtils = {
  data(datas: RawSettingResource[]): SettingResource {
    const rawSettingObj = reduce(datas,
      (a: { [key: string]: string }, v) => ({ ...a, [v.key]: v.value }),
      {}
    );

    return {
      officeName: rawSettingObj?.[Constants.SETTING.OFFICE_NAME] || "",
      officeAddress: rawSettingObj?.[Constants.SETTING.OFFICE_ADDRESS] || "",
      taxCode: rawSettingObj?.[Constants.SETTING.TAX_CODE] || "",
      hotlineNumber: rawSettingObj?.[Constants.SETTING.HOTLINE_SUPPORT] || "",
      email: rawSettingObj?.[Constants.SETTING.CONTACT_EMAIL] || "",
      facebookUrl: rawSettingObj?.[Constants.SETTING.FACEBOOK] || "",
      twitterUrl: rawSettingObj?.[Constants.SETTING.TWITTER] || "",
      instagramUrl: rawSettingObj?.[Constants.SETTING.INSTAGRAM] || "",
      youtubeUrl: rawSettingObj?.[Constants.SETTING.YOUTUBE] || "",
      tiktokUrl: rawSettingObj?.[Constants.SETTING.TIKTOK] || "",
      communFacebook: rawSettingObj?.[Constants.SETTING.COMMU_FACEBOOK] || "",
      linkedinUrl: rawSettingObj?.[Constants.SETTING.LINKEDIN] || "",
      aboutUs: rawSettingObj?.[Constants.SETTING.ABOUT_US] || "",
      termsOfUse: rawSettingObj?.[Constants.SETTING.TERMS_OF_USE] || "",
      privacyPolicy: rawSettingObj?.[Constants.SETTING.PRIVACY_POLICY] || "",
      paymentPolicy:
        SettingParserUtils.htmlBeautify(
          rawSettingObj?.[Constants.SETTING.PAYMENT_POLICY]
        ) || "",
      refundPolicy:
        SettingParserUtils.htmlBeautify(
          rawSettingObj?.[Constants.SETTING.REFUND_POLICY]
        ) || "",
      mySignSupport:
        SettingParserUtils.htmlBeautify(
          rawSettingObj?.[Constants.SETTING.MYSIGN_SUPPORT]
        ) || "",
      operationPolicy:
        SettingParserUtils.htmlBeautify(
          rawSettingObj?.[Constants.SETTING.OPERATION_POLICY]
        ) || "",
      complainPolicy:
        SettingParserUtils.htmlBeautify(
          rawSettingObj?.[Constants.SETTING.COMPLAIN_RESOLVE_POLICY]
        ) || "",
      disputeResolutionMechanism:
        SettingParserUtils.htmlBeautify(
          rawSettingObj?.[Constants.SETTING.DISPUTE_RESOLUTION_MECHANISM]
        ) || "",
      cancelTransactionPolicy:
        SettingParserUtils.htmlBeautify(
          rawSettingObj?.[Constants.SETTING.CANCEL_TRANSACTION_POLICY]
        ) || "",
      contactPolicy:
        SettingParserUtils.htmlBeautify(
          rawSettingObj?.[Constants.SETTING.CONTACT_POLICY]
        ) || "",
      copyrightPolicy:
        SettingParserUtils.htmlBeautify(
          rawSettingObj?.[Constants.SETTING.COPYRIGHT_POLICY]
        ) || "",
      userViolationPolicy:
        SettingParserUtils.htmlBeautify(
          rawSettingObj?.[Constants.SETTING.USER_VIOLATION_POLICY]
        ) || "",
      manageAndUseChancesPolicy:
        SettingParserUtils.htmlBeautify(
          rawSettingObj?.[Constants.SETTING.MANAGE_AND_USE_CHANCES_POLICY]
        ) || "",
    };
  },

  htmlBeautify(html: string) {
    if (!html) return "";
    let result = html.replaceAll("<p", '<p class="policyParagraph"');
    result = result.replaceAll("<h1", '<h1 class="policyHeader"');
    result = result.replaceAll("<h2", '<h2 class="policyHeader"');
    result = result.replaceAll("<h3", '<h3 class="policyHeader"');
    result = result.replaceAll("<h4", '<h4 class="policyHeader"');
    result = result.replaceAll("<h5", '<h5 class="policyHeader"');
    result = result.replaceAll("<h6", '<h6 class="policyHeader"');
    result = result.replaceAll("<ul", '<ul class="policyUnorderedList"');
    result = result.replaceAll("<ol", '<ol class="policyOrderedList"');
    result = result.replaceAll("<li", '<li class="policyListItem"');
    return result;
  },
};
