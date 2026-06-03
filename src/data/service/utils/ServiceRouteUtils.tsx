import StringUtils from "@/src/utils/StringUtils";
import { PackageItem } from "../models/pricing.types";
import { TransactionResource } from "../../payment/models/transaction.types";

export default class ServiceRouteUtils {

    static toScreen() {
        return '/services';
    }

}
