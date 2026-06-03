import { CategoryResource } from "../../category/models/category.types";
import { PartnerResourceV2 } from "../../partner/models/partner.types";

/**
 * @see RawIntroduceResponse
 */
export interface IntroduceResource {
  categories: CategoryResource[];
  partnersTop: PartnerResourceV2[];
}
