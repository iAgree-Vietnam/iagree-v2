import { useQuery } from "@tanstack/react-query";
import _ from "lodash";

import TransactionServices from "@/src/data/payment/services/TransactionServices";

export default function useSelectedTransaction(orderId: string) {
  return useQuery({
    queryKey: ["TRANSACTION_DETAIL_SCREEN", orderId],
    queryFn: () => new TransactionServices().getFullInfo(orderId),
    enabled: _.isString(orderId),
  });
}
