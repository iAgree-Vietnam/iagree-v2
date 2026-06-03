import { DatasResource } from '@/src/data/base/models/base.types';
import {
    FullProfileResource,
    RawProfileResponse,
} from '@/src/data/auth/models/types';
import { AuthParseUtils } from '../../auth/utils/AuthParseUtils';
import { PartnerParserUtils } from '../../partner/utils/PartnerParserUtils';
import { pick } from 'lodash';

export const UserParserUtils = {
    list(
        dataItem: DatasResource<RawProfileResponse>
    ): DatasResource<FullProfileResource> {
        return {
            items: dataItem.items.map(UserParserUtils.item),
            total: dataItem.total,
        };
    },

    normalizeUser(raw: Partial<FullProfileResource> | null){
        return {
          // ===== root fields =====
          ...pick(raw, [
            "userId",
            "fullName",
            "email",
            "phoneNumber",
            "avatarUrl",
            "accountType",
            "referral_code",
            "referred_by",
            "sex",
            "userPackages",
            "userReviews",
            "userServices",
          ]),
      
          // ===== partner =====
          partner: raw?.partner
            ? {
                ...pick(raw.partner, [
                  "created_at",
                  "is_citizen_id_verified",
                  "is_feature",
                  "last_monthly_opportunities_at",
                  "location_id",
                  "position",
                  "qr_code",
                  "rate",
                  "reason",
                  "referral_code",
                  "referred_by",
                  "status",
                  "subscription_plan",
                  "username",
                ]),
      
                // ===== nested wallet =====
                opportunity_wallet: raw.partner.opportunity_wallet
                  ? pick(raw.partner.opportunity_wallet, [
                      "id",
                      "current_balance",
                      "total_earned",
                      "total_spent",
                      "total_expired",
                      "created_at",
                      "updated_at",
                    ])
                  : null,
              }
            : null,
        }
      },

    item(dataItem: RawProfileResponse): FullProfileResource {
        return {
            userId: dataItem?.id,
            fullName: dataItem?.name,
            type: dataItem.type,
            isAdmin: Boolean(dataItem?.is_admin),
            email: dataItem?.email,
            sex: dataItem?.sex,
            bithday: dataItem?.bithday,
            phoneNumber: dataItem?.phone,
            status: dataItem?.status,
            avatarUrl: dataItem?.avatar,
            partner: dataItem?.partner || null,
            googleId: dataItem?.google_id,
            citizenId: dataItem?.citizen_id,
            accountTypeCreated: dataItem?.account_type_created,
            levelDisplay: dataItem?.level_display,
            userReviews: { items: dataItem?.user_reviews?.items?.map?.(PartnerParserUtils.reviewItem) || [], total: dataItem.user_reviews?.total || 0 },
            userServices: dataItem?.user_services ? dataItem?.user_services.map(AuthParseUtils.userService) : null,
            userPackages: dataItem?.user_packages ? dataItem?.user_packages.map(AuthParseUtils.userPackage) : null,
            accountType: dataItem?.account_type,
            nameRep: dataItem?.name_rep || null,
            taxCode: dataItem?.tax_code,
            cardNumber: dataItem?.card_number,
            frontCard: dataItem?.front_card,
            backCard: dataItem?.back_card,
            businessLicense: dataItem?.business_license,
            documents: dataItem?.documents,
            avatar: "",
            name: ""
        };
    },
};
