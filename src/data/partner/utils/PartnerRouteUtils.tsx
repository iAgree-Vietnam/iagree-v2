import { PartnerResource } from "../models/partner.types";
import StringUtils from "../../../utils/StringUtils";
import { FullProfileResource } from "../../auth/models/types";

export class PartnerRouteUtils {
  static toScreen(queryParams: any) {
    return ["/partners", new URLSearchParams(queryParams)].join("?");
  }

  static toDetailUrl(partnerResource: Partial<PartnerResource>) {
    return `/partners/${StringUtils.slugify(
      partnerResource?.user?.name || partnerResource?.user?.fullName || ""
    )}.${
      partnerResource?.id ||
      partnerResource?.partnerId ||
      partnerResource?.user?.partner?.id
    }`;
  }

  static toDetailAppliedPartner(profileResource: FullProfileResource) {
    return `/partners/${StringUtils.slugify(profileResource?.fullName || "")}.${
      profileResource?.partner?.id
    }`;
  }

  static toRegisterUrl() {
    return `/partners/register`;
  }

  static toProfileUrl() {
    return `/partners/profile`;
  }

  static toProfileEditUrl() {
    return `/partners/profile/edit`;
  }

  static toProfileReviewsUrl() {
    return `/partners/profile-reviews`;
  }

  static toBecomeAPartnerScreen() {
    return `/become-a-partner`;
  }

  static toHowItWorksForPartners() {
    return `/how-it-works-for-partners`;
  }

  static toPartnerRegisterV2() {
    return `/partner-register-v2`;
  }

  static toPartnersSearchScreen() {
    return `/partners-search`;
  }

  static toPartnerRegisterGetStart() {
    return `/partner-register-get-start`;
  }
}
