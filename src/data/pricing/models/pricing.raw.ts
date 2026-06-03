export interface RawPricingResource {
  users: RawPricingItem;
  signatures: RawPricingItem;
  connects: RawPricingItem;
}

export interface RawPricingItem {
  services: RawServiceItem[];
  allPackages: RawPackageItem[];
}

export interface RawPackageItem {
  id: number;
  name: string;
  package_key_name: string;
  description: string | null;
  price: number;
  unit: string;
}

export interface RawServicePackagePivot {
  service_id: number;
  package_id: number;
}

export interface RawServicePackageItem {
  id: number;
  name: string;
  pivot: RawServicePackagePivot;
}

export interface RawServicePackagesItem {
  id: number
  service_id: number
  package_id: number
  type: number
  amount: number
  status: number
}

export interface RawServiceItem {
  id: number;
  name: string;
  service_key_name: string;
  packages: RawServicePackageItem[];
  service_packages: RawServicePackagesItem[];
}

export interface RawCitizenIdStatus {
  id: number;
  citizen_id: string;
  status: {
    code: 0 | 1 | 2 | 3;
    message: string;
  }
}