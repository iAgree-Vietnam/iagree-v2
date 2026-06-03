import StringUtils from "@/src/utils/StringUtils";
import { ContractResource } from "../models/contract.types";

export default class ContractRouteUtils {

    static toScreen(queryParams: any) {
        return ['/contracts', new URLSearchParams(queryParams)].join('?')
    }

    static toDetailUrl(contract: ContractResource) {
        return `/contracts/${StringUtils.slugify(contract.name)}.${contract.contractId}`;
    }

    static toUploadScreen() {
        return `/contracts/upload`;
    }
}
