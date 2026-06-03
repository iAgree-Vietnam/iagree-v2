import apiUtils from "@/src/utils/APIUtils";
import EndpointConfig from "@/src/constants/EndpointConfig";
import URLUtils from "@/src/utils/URLUtils";
import { PartnerParserUtils } from "@/src/data/partner/utils/PartnerParserUtils";
import {
  PartnerDetailResource,
  PartnerResource,
  PartnerSelectBoxResource,
  PartnerRegisterParams,
  PartnerUpdateParams,
  ReviewResource,
  PartnerConnectParams,
  PartnerFeedbackFromSocialOrganizationParams,
  PartnerInitResource,
} from "@/src/data/partner/models/partner.types";
import { DatasResource } from "@/src/data/base/models/base.types";

export default class PartnerServices {
  get(queryParams: any): Promise<Partial<PartnerInitResource>> {
    return new Promise((resolve, reject) => {
      apiUtils
        // .get(EndpointConfig.PARTNER_LIST, { params: queryParams })
        .get(EndpointConfig.PARTNER_LIST_V3, { params: queryParams })

        .then((apiRes: any) => {
          resolve({
            partners: apiRes?.data?.items,
            total: apiRes?.data?.total,
          });
        })
        .catch(reject);
    });
  }

  getFullInfo(partnerId?: number): Promise<PartnerDetailResource> {
    return new Promise((resolve, reject) => {
      const endpointUrl = URLUtils.bindUrl(
        EndpointConfig.PARTNER_FULL_INFO_V2,
        {
          ":partnerId": partnerId,
        }
      );

      apiUtils
        .get(endpointUrl)
        .then((apiRes) => {

          resolve(PartnerParserUtils.detailInit(apiRes.data));
        })
        .catch(reject);
    });
  }

  getSelectBoxes(): Promise<PartnerSelectBoxResource> {
    return new Promise((resolve, reject) => {
      apiUtils
        .get(EndpointConfig.PARTNER_SELECT_BOX)
        .then((apiRes) => resolve(PartnerParserUtils.selectBox(apiRes.data)))
        .catch(reject);
    });
  }

  // getSelectBoxesTest(): Promise<PartnerSelectBoxResource> {
  //     return new Promise((resolve, reject) => {
  //         fetch('https://mocki.io/v1/0d82bd06-97f7-496a-a3f2-de038254ca48')
  //             .then((response) => response.json())
  //             .then((data) => {
  //                 const parsed = PartnerParserUtils.selectBox(data);
  //                 resolve(parsed);
  //             })
  //             .catch(reject);
  //     });
  // }

  onRegister(formData: PartnerRegisterParams): Promise<any> {
    return new Promise((resolve, reject) => {
      // apiUtils.post(EndpointConfig.PARTNER_LIST, formData)
      apiUtils
        .post(EndpointConfig.PARTNER_LIST_V2, formData)
        .then((apiRes) => resolve(apiRes.data))
        .catch(reject);
    });
  }

  onConnect(formData: PartnerConnectParams): Promise<any> {
    return new Promise((resolve, reject) => {
      apiUtils
        .post(EndpointConfig.PARTNER_CONNECT, formData)
        .then((apiRes) => resolve(apiRes.data))
        .catch(reject);
    });
  }

  onUpdate(params: {
    formData: FormData | PartnerUpdateParams;
    partnerId: number;
  }): Promise<any> {
    return new Promise((resolve, reject) => {
      const endpointUrl = URLUtils.bindUrl(EndpointConfig.PARTNER_FULL_INFO, {
        ":partnerId": params.partnerId,
      });

      apiUtils
        .post(endpointUrl, params.formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((apiRes) => resolve(apiRes.data))
        .catch(reject);
    });
  }

  getReviews(
    partnerId: number,
    params: any
  ): Promise<DatasResource<ReviewResource>> {
    return new Promise((resolve, reject) => {
      const endpointUrl = URLUtils.bindUrl(EndpointConfig.PARTNER_REVIEWS, {
        ":partnerId": partnerId,
      });

      apiUtils
        .get(endpointUrl, { params })
        .then((apiRes) => resolve(PartnerParserUtils.listReview(apiRes.data)))
        .catch(reject);
    });
  }

  onReaction(partnerId: number) {
    return new Promise((resolve, reject) => {
      const endpointUrl = URLUtils.bindUrl(EndpointConfig.PARTNER_REACT, {
        ":partnerId": partnerId,
      });

      apiUtils
        .post(endpointUrl)
        .then((apiRes) => resolve(apiRes.data))
        .catch(reject);
    });
  }

  getFavoriteList(): Promise<PartnerResource[]> {
    return new Promise((resolve, reject) => {
      apiUtils
        .get(EndpointConfig.PARTNER_FAVORITE_LIST)
        .then((apiRes) => resolve(apiRes.data?.map?.(PartnerParserUtils.item)))
        .catch(reject);
    });
  }

  onFeedbackFromSocialOrganization(
    params: PartnerFeedbackFromSocialOrganizationParams
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      apiUtils
        .post(EndpointConfig.PARTNER_COMPLAIN, {
          ...params,
          address: params?.address || "undefined",
          partner_url: params?.partner_url || "undefined",
          subject: params?.subject || "undefined",
          body: params?.body || "undefined",
        })
        .then((apiRes) => resolve(apiRes.data))
        .catch(reject);
    });
  }

  getListBank(): Promise<
    {
      id: number;
      bank_name: string;
      bank_code: string;
    }[]
  > {
    return new Promise((resolve, reject) => {
      return apiUtils
        .get(EndpointConfig.BANK)
        .then((apiRes) => {
          resolve(apiRes.data);
        })
        .catch(reject);
    });
  }
}
