import StringUtils from "@/src/utils/StringUtils";
import { PackageItem } from "../models/pricing.types";
import { TransactionResource } from "../../payment/models/transaction.types";

export default class PricingRouteUtils {

    static toScreen() {
        return '/pricing';
    }
    
    static toPaymentUpgradeAccountUrl(packageItem: PackageItem) {
        return `/payment/upgrade-account/${StringUtils.slugify(packageItem.name)}.${packageItem.packageId}`;
    }

    static toPaymentESignatureUrl(packageItem: PackageItem) {
        return `/payment/e-signature/${StringUtils.slugify(packageItem.name)}.${packageItem.packageId}`;
    }

    static toPaymentJobsUrl(transaction: TransactionResource) {
        return `/payment/jobs/${StringUtils.slugify(transaction.name)}.${transaction.typeId}/${transaction.orderId}`;
    }

    static toPaymentConnectsUrl(packageItem: PackageItem) {
        return `/payment/connects/${StringUtils.slugify(packageItem.name)}.${packageItem.packageId}`;
    }

}
