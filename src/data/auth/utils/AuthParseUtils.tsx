import datetimeUtils from '@/src/utils/DatetimeUtils';
import { RawProfileResponse, FullProfileResource, RawLoginResponse, LoginResource, RawRegisterResponse, RegisterResponse, RawUserOverviewResource, UserOverviewResource, UserServiceResource, RawUserServiceResource, RawUserPackageResource, UserPackageResource, FullProfileResourceV2 } from '../models/types';
import { PartnerParserUtils } from '../../partner/utils/PartnerParserUtils';

export const AuthParseUtils = {

    login(dataItem: RawLoginResponse): LoginResource {
        return {
            accessToken: dataItem?.token,
        };
    },


    register(email: string): RegisterResponse {
        return { email };
    },

    profile(dataItem: RawProfileResponse): Partial<FullProfileResource> {
        return {
            ...this.userOverview(dataItem),
            type: dataItem?.type,
            referral_code: dataItem?.partner?.referral_code || null,
            referred_by: dataItem?.partner?.referred_by || null,
            accountType: dataItem?.account_type,
            isAdmin: Boolean(dataItem?.is_admin),
            email: dataItem?.email || null,
            sex: dataItem?.sex,
            bithday: dataItem?.bithday,
            phoneNumber: dataItem?.phone || null,
            status: dataItem?.status,
            avatarUrl: dataItem?.avatar,
            partner: dataItem?.partner || null,
            googleId: dataItem?.google_id,
            citizenId: dataItem?.citizen_id || null,
            accountTypeCreated: dataItem?.account_type_created,
            levelDisplay: dataItem?.level_display || null,
            userReviews: { items: dataItem?.user_reviews?.items?.map?.(PartnerParserUtils.reviewItem) || [], total: dataItem?.user_reviews?.total || 0 },
            userServices: dataItem?.user_services ? dataItem?.user_services.map(AuthParseUtils.userService) : null,
            userPackages: dataItem?.user_packages ? dataItem?.user_packages.map(AuthParseUtils.userPackage) : null,
            taxCode: dataItem?.tax_code || null,
            nameRep: dataItem?.name_rep || null,
            cardNumber: dataItem?.card_number || null,
            frontCard: dataItem?.front_card || null,
            backCard: dataItem?.back_card || null,
            businessLicense: dataItem?.business_license || null,
            documents: dataItem?.documents || null,
        };
    },

    introduce(dataItem: RawProfileResponse): Partial<FullProfileResourceV2> {
        return {
            ...this.userOverview(dataItem),
            type: dataItem?.type,
            accountType: dataItem?.account_type,
            isAdmin: Boolean(dataItem?.is_admin),
            email: dataItem?.email || "",
            sex: dataItem?.sex,
            bithday: dataItem?.bithday || "",
            // phoneNumber: dataItem?.phone || "",
            status: dataItem?.status,
            avatarUrl: dataItem?.avatar || "",
            partner: dataItem?.partner || null,
            googleId: dataItem?.google_id || "",
            citizenId: dataItem?.citizen_id || "",
            accountTypeCreated: dataItem?.account_type_created,
            levelDisplay: dataItem?.level_display || null,
            userReviews: { items: dataItem?.user_reviews?.items?.map?.(PartnerParserUtils.reviewItem) || [], total: dataItem?.user_reviews?.total || 0 },
            userServices: dataItem?.user_services ? dataItem?.user_services.map(AuthParseUtils.userService) : null,
            userPackages: dataItem?.user_packages ? dataItem?.user_packages.map(AuthParseUtils.userPackage) : null,
            taxCode: dataItem?.tax_code || null,
            nameRep: dataItem?.name_rep || null,
            cardNumber: dataItem?.card_number || null,
            frontCard: dataItem?.front_card || null,
            backCard: dataItem?.back_card || null,
            businessLicense: dataItem?.business_license || null,
            documents: dataItem?.documents || null,
        };
    },

    userOverview(dataItem: RawUserOverviewResource): UserOverviewResource {
        return {
            userId: dataItem?.id,
            fullName: dataItem?.name,
        };
    },

    userService(dataItem: RawUserServiceResource): UserServiceResource {
        return {
            serviceKey: dataItem?.service_key,
            serviceValue: dataItem?.service_value,
            name: dataItem?.name,
            status: dataItem?.status,
            beginDate: datetimeUtils.getMoment(dataItem?.begin_date, datetimeUtils.BACKEND_DATE_TIME)?.format(datetimeUtils.LOCAL_DATE) || '',
            endDate: datetimeUtils.getMoment(dataItem?.end_date, datetimeUtils.BACKEND_DATE_TIME)?.format(datetimeUtils.LOCAL_DATE) || '',
        };
    },

    userPackage(dataItem: RawUserPackageResource): UserPackageResource {
        return {
            type: dataItem?.type,
            keyName: dataItem?.key_name,
            name: dataItem?.name,
            status: dataItem?.status,
            beginDate: datetimeUtils.getMoment(dataItem?.begin_date, datetimeUtils.BACKEND_DATE_TIME)?.format(datetimeUtils.LOCAL_DATE) || '',
            endDate: datetimeUtils.getMoment(dataItem?.end_date, datetimeUtils.BACKEND_DATE_TIME)?.format(datetimeUtils.LOCAL_DATE) || '',
        };
    },

};
