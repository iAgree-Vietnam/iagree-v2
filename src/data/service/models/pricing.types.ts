export interface PricingResource {
  users: PricingItem;
  signatures: PricingItem;
}

export interface PricingItem {
  services: ServiceItem[];
  allPackages: PackageItem[];
}

export interface PackageItem {
  packageId: number;
  name: string;
  packageKeyName: string;
  description: string | null;
  price: number;
  unit: string;
}

export interface ServicePackagePivot {
  serviceId: number;
  packageId: number;
}

export interface ServicePackageItem {
  servicePackageId: number;
  name: string;
  pivot: ServicePackagePivot;
}

export interface ServicePackagesItem {
  servicePackagesId: number
  serviceId: number
  packageId: number
  type: number
  amount: number
  status: number
}

export interface ServiceItem {
  serviceId: number;
  serviceKeyName: string;
  name: string;
  packages: ServicePackageItem[];
  servicePackages: ServicePackagesItem[]
}

export interface CitizenIdStatus {
  id: number;
  citizenId: string;
  status: {
    code: 0 | 1 | 2 | 3;
    message: string;
  }
}

export interface ESignPackageDataItem {
  name: string;
  key: string;
  servicePackages: ServicePackagesItem;
}