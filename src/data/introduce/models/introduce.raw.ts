import { RawCategoryResource } from "../../category/models/category.raw";
import { RawPartnerResource } from "../../partner/models/partner.raw";

export interface RawIntroduceResponse {
  categories: RawCategoryResource[];
  partnersTop: RawPartnerResource[];
}
