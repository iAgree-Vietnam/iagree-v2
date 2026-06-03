import { BankResource } from "@/src/data/bank/models/bank.types";
import { CategoryResource } from "@/src/data/category/models/category.types";
import { LanguageResource } from "@/src/data/language/models/language.types";
import { LocationResource } from "@/src/data/location/models/location.types";
import { SkillResource } from "@/src/data/skill/models/skill.types";

/**
 * Gets the name of a service from its ID.
 * It searches through the nested structure of categories.
 */
export const getServiceName = (
  categories: CategoryResource[] | undefined,
  serviceId: number
): string | undefined => {
  if (!categories) return undefined;
  const numServiceId = Number(serviceId);
  for (const category of categories) {
    for (const cateService of category.childrens || []) {
      const service = cateService.childrens?.find(
        (s) => Number(s.serviceId) === numServiceId
      );
      if (service) {
        return service.name;
      }
    }
  }
  return undefined;
};

/**
 * Gets the name of a service category from its ID.
 * It searches through the nested structure of categories.
 */
export const getServiceCategoryName = (
  categories: CategoryResource[] | undefined,
  cateServiceId: number
): string | undefined => {
  if (!categories) return undefined;
  const numCateServiceId = Number(cateServiceId);
  for (const category of categories) {
    const cateService = category.childrens?.find(
      (cs) => Number(cs.cateServiceId) === numCateServiceId
    );
    if (cateService) {
      return cateService.name;
    }
  }
  return undefined;
};

/**
 * Gets the name of a skill from its ID.
 */
export const getSkillName = (
  skills: SkillResource[] | undefined,
  skillId: number
): string | undefined => {
  const numSkillId = Number(skillId);
  return skills?.find((s) => Number(s.skillId) === numSkillId)?.name;
};

/**
 * Gets the name of a language from its ID.
 */
export const getLanguageName = (
  languages: { items: LanguageResource[] } | undefined,
  langId: number
): string | undefined => {
  const numLangId = Number(langId);
  return languages?.items.find((l) => Number(l.languageId) === numLangId)?.name;
};

/**
 * Gets the name of a location from its ID.
 */
export const getLocationName = (
  locations: { items: LocationResource[] } | undefined,
  locationId: number
): string | undefined => {
  const numLocationId = Number(locationId);
  return locations?.items.find((l) => Number(l.locationId) === numLocationId)
    ?.name;
};

/**
 * Gets the name of a bank from its ID.
 */
export const getBankName = (
  banks: BankResource[] | undefined,
  bankId: number
): string | undefined => {
  const numBankId = Number(bankId);
  return banks?.find((b) => Number(b.bankId) === numBankId)?.name;
};
