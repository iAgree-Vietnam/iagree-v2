import {
  RawCitizenIdStatus,
  RawPackageItem,
  RawPricingItem,
  RawPricingResource,
  RawServiceItem,
  RawServicePackageItem,
  RawServicePackagesItem,
} from '@/src/data/pricing/models/pricing.raw';
import {
  CitizenIdStatus,
  PackageItem,
  PricingItem,
  PricingResource,
  ServiceItem,
  ServicePackageItem,
  ServicePackagesItem,
} from '@/src/data/pricing/models/pricing.types';
import { UserPackageResource } from '../../auth/models/types';
import Constants from '@/src/constants/Constants';

export const PricingParseUtils = {
  init(rawPricingResource: RawPricingResource): PricingResource {
    return {
      users: PricingParseUtils.item(rawPricingResource.users),
      signatures: PricingParseUtils.item(rawPricingResource.signatures),
      connects: PricingParseUtils.item(rawPricingResource.connects),
    };
  },

  item(dataItem: RawPricingItem): PricingItem {
    return {
      allPackages: dataItem?.allPackages?.map(PricingParseUtils.packageItem),
      services: dataItem?.services?.map(PricingParseUtils.serviceItem),
    };
  },

  packageItem(dataItem: RawPackageItem): PackageItem {
    return {
      packageId: dataItem.id,
      packageKeyName: dataItem.package_key_name,
      description: dataItem.description,
      name: dataItem.name,
      price: dataItem.price,
      unit: dataItem.unit,
    };
  },

  serviceItem(dataItem: RawServiceItem): ServiceItem {
    return {
      serviceId: dataItem.id,
      serviceKeyName: dataItem.service_key_name,
      name: dataItem.name,
      packages: dataItem?.packages?.map(PricingParseUtils.servicePackageItem),
      servicePackages: dataItem?.service_packages?.map(PricingParseUtils.servicePackagesItem),
    };
  },

  servicePackageItem(dataItem: RawServicePackageItem): ServicePackageItem {
    return {
      servicePackageId: dataItem.id,
      name: dataItem.name,
      pivot: {
        packageId: dataItem.pivot.package_id,
        serviceId: dataItem.pivot.service_id,
      },
    };
  },

  servicePackagesItem(dataItem: RawServicePackagesItem): ServicePackagesItem {
    return {
      servicePackagesId: dataItem.id,
      amount: dataItem.amount,
      packageId: dataItem.package_id,
      serviceId: dataItem.service_id,
      status: dataItem.status,
      type: dataItem.type,
    };
  },

  getESignatureDefault(): UserPackageResource {
    return {
      beginDate: '',
      endDate: '',
      keyName: Constants.E_SIGNATURE_PACKAGE.E_SIGNATURE_BY_ONCE,
      name: 'Lượt ký lẻ',
      status: 1,
      type: Constants.PAYMENT.TYPE_TEXT.E_SIGNATURE,
    }
  },

  citizenIdStatusItem(data: RawCitizenIdStatus): CitizenIdStatus {
    return {
      citizenId: data.citizen_id,
      id: data.id,
      status: data.status
    }
  }
};
