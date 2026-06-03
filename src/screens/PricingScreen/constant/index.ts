import { OpportunityTxnType } from "@/src/data/chance/chance.service";

export const OpportunityTxnLabels: Record<OpportunityTxnType, string> = {
    [OpportunityTxnType.ALL]: "Tất cả Cơ Hội",
    [OpportunityTxnType.PURCHASE]: "Mua lẻ",
    [OpportunityTxnType.BECOME_PARTNER]: "Nâng cấp tài khoản",
    [OpportunityTxnType.MONTHLY_FREE]: "Tặng",
    [OpportunityTxnType.JOB_REFUND]: "Hoàn lại",
    [OpportunityTxnType.JOB_BID]: "Ứng tuyển",
    [OpportunityTxnType.EXPIRED]: "Hết hạn",
    [OpportunityTxnType.ADMIN_ADJUSTMENT]: "Admin chỉnh sửa",
    [OpportunityTxnType.REFERRAL_CODE]: "Mã giới thiệu",
  };