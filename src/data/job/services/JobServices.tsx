import apiUtils from "../../../utils/APIUtils";
import EndpointConfig from "../../../constants/EndpointConfig";
import { JobParseUtils } from "../utils/JobParseUtils";
import {
  AgreeJobResultParams,
  FullJobResource,
  JobFormParams,
  JobApplyParams,
  JobResource,
  JobSelectboxResource,
  JobSubmitResponseResource,
  JobUploadDocumentParams,
  RejectJobResultParams,
  JobSuggest,
  SendOfferParams,
  PlatformFeeResponseResource,
  CalculatePlatformFeeParams,
  ConfirmPartnerParams,
} from "../models/job.types";
import moment from "moment";
import { DatasResource } from "../../base/models/base.types";
import URLUtils from "../../../utils/URLUtils";
import _, { toString } from "lodash";
import { RcFile } from "antd/es/upload/interface";
import Constants from "../../../constants/Constants";
import NumberUtils from "@/src/utils/NumberUtils";
import { FullJobResourceV2, JobResourceV2 } from "../models/v2/job.types";
import { JobParseUtilsV2 } from "../utils/JobParseUtilsV2";
import fetchUtil from "@/src/utils/BackendAPIUtils";
import { supabase } from "@/lib/supabase";

export default class JobServices {
  get(queryParams: any): Promise<DatasResource<JobResource>> {
    return new Promise((resolve, reject) => {
      apiUtils
        .get(EndpointConfig.JOB_ADD, { params: queryParams })
        .then((apiRes) => resolve(JobParseUtils.list(apiRes.data)))
        .catch(reject);
    });
  }

  getV2(queryParams: any): Promise<DatasResource<JobResourceV2>> {
    return new Promise((resolve, reject) => {
      apiUtils
        // .get(EndpointConfig.JOB_ADD, { params: queryParams })
        .get(EndpointConfig.JOB_ADD_V2, { params: queryParams })
        .then((apiRes) => resolve(JobParseUtilsV2.list(apiRes.data)))
        .catch(reject);
    });
  }

  confirmBid(payload: {
    status: 1 | 0;
    jobId: string;
  }): Promise<DatasResource<JobResource>> {
    return new Promise((resolve, reject) => {
      apiUtils
        .post(
          EndpointConfig.JOB_CONFIRM_BID.replace(":jobId", payload.jobId),
          payload
        )
        .then((apiRes) => resolve(apiRes.data))
        .catch(reject);
    });
  }

  getFullInfo(jobId: number, queryParams: any): Promise<FullJobResource> {
    return new Promise((resolve, reject) => {
      const endpointUrl = URLUtils.bindUrl(EndpointConfig.JOB_DETAIL, {
        ":jobId": jobId,
      });

      apiUtils
        .get(endpointUrl, { params: queryParams })
        .then((apiRes) => resolve(JobParseUtils.detailInit(apiRes.data)))
        .catch(reject);
    });
  }
  

  getFullInfoV2(jobId: number, queryParams: any) {
    return new Promise((resolve, reject) => {
      const endpointUrl = URLUtils.bindUrl(EndpointConfig.JOB_DETAIL, {
        ":jobId": jobId,
      });

      apiUtils
        .get(endpointUrl, { params: queryParams })
        .then((apiRes) => {
          resolve(JobParseUtils.detailInit(apiRes.data));
        })
        .catch(reject);
    });
  }

  onCreate(formData: JobFormParams): Promise<JobSubmitResponseResource> {
    return new Promise((resolve, reject) => {
      apiUtils
        .post(EndpointConfig.JOB_ADD, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((apiRes) =>
          resolve(JobParseUtils.createResponse(apiRes.data.data))
        )
        .catch(reject);
    });
  }

  onUpdate(
    jobId: number,
    formDatas: JobFormParams
  ): Promise<JobSubmitResponseResource> {
    return new Promise((resolve, reject) => {
      const endpointUrl = URLUtils.bindUrl(EndpointConfig.JOB_EDIT, {
        ":jobId": jobId,
      });

      apiUtils
        .put(endpointUrl, formDatas)
        .then(() => resolve({ jobId: jobId, name: formDatas.name }))
        .catch(reject);
    });
  }

  onCalculateFee(
    formDatas: CalculatePlatformFeeParams
  ): Promise<PlatformFeeResponseResource> {
    return new Promise((resolve, reject) => {
      apiUtils
        .post(EndpointConfig.JOB_PLATFORM_FEE, formDatas)
        .then((apiRes) => resolve(apiRes.data))
        .catch(reject);
    });
  }

  onReaction(jobId: number) {
    return new Promise((resolve, reject) => {
      const endpointUrl = URLUtils.bindUrl(EndpointConfig.JOB_REACTION, {
        ":jobId": jobId,
      });

      apiUtils
        .post(endpointUrl)
        .then((apiRes) => resolve(apiRes.data))
        .catch(reject);
    });
  }

  getSelectBoxes(): Promise<JobSelectboxResource> {
    return new Promise((resolve, reject) => {
      apiUtils
        .get(EndpointConfig.JOB_SELECTBOX_FOR_ADD)
        .then((apiRes) => resolve(JobParseUtils.selectboxForAdd(apiRes.data)))
        .catch(reject);
    });
  }

  // getSelectBoxesTest(): Promise<JobSelectboxResource> {
  //     return new Promise((resolve, reject) => {
  //         fetch('https://mocki.io/v1/849030de-175c-4750-8d8c-4a95e83ec9ff')
  //             .then((response) => response.json())
  //             .then((data) => {
  //                 const parsed = JobParseUtils.selectboxForAdd(data);
  //                 resolve(parsed);
  //             })
  //             .catch(reject);
  //     });
  // }

  onApply(jobId: number, dataParams: JobApplyParams) {
    return new Promise((resolve, reject) => {
      const endpointUrl = URLUtils.bindUrl(EndpointConfig.JOB_APPLY, {
        ":jobId": jobId,
      });

      const formDatas = new FormData();
      const attachmentResource = _.get(
        dataParams,
        "attachments.0",
        null
      ) as RcFile;

      formDatas.append("application_letter", dataParams.letter || "");
      formDatas.append("description", dataParams.description || "");
      if (dataParams.attachments && dataParams.attachments.length > 0) {
        dataParams.attachments.forEach(
          (attachmentResource: RcFile, index: number) => {
            formDatas.append(
              "application_file[]",
              _.get(attachmentResource, "originFileObj") as any,
              attachmentResource?.name || "file"
            );
          }
        );
      }
      if (NumberUtils.isNumber(dataParams.negotiatePrice)) {
        formDatas.append(
          "negotiate_price",
          (dataParams.negotiatePrice || "").toString()
        );
      }
      if (NumberUtils.isNumber(dataParams.numberAccept)) {
        formDatas.append(
          "number_accept",
          (dataParams.numberAccept || "").toString()
        );
      }
      formDatas.append("start_date", dataParams.startDate.format("YYYY-MM-DD"));
      formDatas.append("end_date", dataParams.endDate.format("YYYY-MM-DD"));

      apiUtils
        .post(endpointUrl, formDatas, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((apiRes) => resolve(apiRes.data))
        .catch(reject);
    });
  }

  onUploadDocument(jobId: number, dataParams: JobUploadDocumentParams) {
    return new Promise((resolve, reject) => {
      const endpointUrl = _.isNumber(dataParams.resultId)
        ? URLUtils.bindUrl(EndpointConfig.JOB_UPDATE_DOCUMENT, {
            ":resultId": dataParams.resultId,
          })
        : URLUtils.bindUrl(EndpointConfig.JOB_UPLOAD_DOCUMENT, {
            ":jobId": jobId,
          });

      const formDatas = new FormData();
      const attachmentResource = _.get(
        dataParams,
        "attachments.0",
        null
      ) as RcFile;

      formDatas.append("application_name", dataParams.documentName);
      formDatas.append(
        "application_file",
        _.get(attachmentResource, "originFileObj") as any,
        attachmentResource.name
      );
      formDatas.append("description", dataParams.description);

      apiUtils
        .post(endpointUrl, formDatas, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((apiRes) => resolve(apiRes.data))
        .catch(reject);
    });
  }

  onDocumentDownload(jobId: number, resultId: number) {
    return new Promise((resolve, reject) => {
      const endpointUrl = URLUtils.bindUrl(
        EndpointConfig.JOB_DOWNLOAD_DOCUMENT,
        { ":resultId": resultId }
      );

      apiUtils
        .get(endpointUrl, {
          baseURL: process.env.BASE_URL,
          responseType: "arraybuffer",
        })
        .then((apiRes) => {
          const contentType =
            apiRes.headers["content-type"] || "application/pdf";
          const fileBlob = new Blob([apiRes.data], { type: contentType });
          resolve(fileBlob);
        })
        .catch(reject);
    });
  }

  onDocumentDelete(jobId: number, resultId: number) {
    return new Promise((resolve, reject) => {
      const endpointUrl = URLUtils.bindUrl(EndpointConfig.JOB_DELETE_DOCUMENT, {
        ":resultId": resultId,
      });

      apiUtils
        .delete(endpointUrl, {})
        .then((apiRes) => resolve(apiRes.data))
        .catch(reject);
    });
  }

  onSendResult(jobId: number) {
    return new Promise((resolve, reject) => {
      const endpointUrl = URLUtils.bindUrl(EndpointConfig.JOB_SEND_RESULT, {
        ":jobId": jobId,
      });

      apiUtils
        .post(endpointUrl)
        .then((apiRes) => resolve(apiRes.data))
        .catch(reject);
    });
  }

  onAgreeResult(jobId: number, params: AgreeJobResultParams) {
    return new Promise((resolve, reject) => {
      const endpointUrl = URLUtils.bindUrl(EndpointConfig.JOB_AGREE_RESULT, {
        ":jobId": jobId,
      });

      const formDatas = new FormData();

      formDatas.append("rate", toString(params.rate));
      formDatas.append("description", params.description || "");
      if (params.attachment_files && params.attachment_files.length > 0) {
        params.attachment_files.forEach((file: RcFile, index: number) => {
          const fileToAppend = _.get(file, "originFileObj") || file;
          formDatas.append(`attachment_files[${index}]`, fileToAppend);
        });
      }

      apiUtils
        .post(endpointUrl, formDatas, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((apiRes) => resolve(apiRes.data))
        .catch(reject);
    });
  }

  onPartnerRate(jobId: number, params: AgreeJobResultParams) {
    return new Promise((resolve, reject) => {
      const endpointUrl = URLUtils.bindUrl(EndpointConfig.JOB_PARTNER_RATE, {
        ":jobId": jobId,
      });

      const formDatas = new FormData();

      formDatas.append("rate", toString(params.rate));
      formDatas.append("description", params.description || "");
      if (params.attachment_files && params.attachment_files.length > 0) {
        params.attachment_files.forEach((file: RcFile, index: number) => {
          const fileToAppend = _.get(file, "originFileObj") || file;
          formDatas.append(`attachment_files[${index}]`, fileToAppend);
        });
      }

      apiUtils
        .post(endpointUrl, formDatas, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((apiRes) => resolve(apiRes.data))
        .catch(reject);
    });
  }

  onRejectResult(jobId: number, params: RejectJobResultParams) {
    return new Promise((resolve, reject) => {
      const endpointUrl = URLUtils.bindUrl(EndpointConfig.JOB_REJECT_RESULT, {
        ":jobId": jobId,
      });

      apiUtils
        .post(endpointUrl, params)
        .then((apiRes) => resolve(apiRes.data))
        .catch(reject);
    });
  }

  onDelete(jobId: number) {
    return new Promise((resolve, reject) => {
      const endpointUrl = URLUtils.bindUrl(EndpointConfig.JOB_DELETE, {
        ":jobId": jobId,
      });

      apiUtils
        .delete(endpointUrl)
        .then((apiRes) => resolve(apiRes.data))
        .catch(reject);
    });
  }

  onSuggest(queryParams: JobSuggest): Promise<JobSuggest> {
    return new Promise((resolve, reject) => {
      apiUtils
        .get(EndpointConfig.JOB_SUGGESTIONS, { params: queryParams })
        .then((apiRes) => resolve(apiRes.data))
        .catch(reject);
    });
  }

  onSendOffer(jobId: number, dataParams: SendOfferParams) {
    return new Promise((resolve, reject) => {
      const endpointUrl = URLUtils.bindUrl(EndpointConfig.JOB_SEND_OFFER, {
        ":jobId": jobId,
      });

      const formDatas = new FormData();
      formDatas.append("user_id", toString(dataParams?.user_id));
      formDatas.append("start_date", dataParams.start_date || "");
      formDatas.append("end_date", dataParams.end_date || "");
      formDatas.append("negotiate_price", toString(dataParams.negotiate_price));
      formDatas.append("number_accept", dataParams.number_accept.toString());
      formDatas.append("description", dataParams.description || "");
      formDatas.append("client_ip", dataParams.client_ip || "");
      formDatas.append("device_name", dataParams.device_name || "");
      formDatas.append("platform", dataParams.platform || "");
      formDatas.append("deal_status", dataParams.deal_status.toString());

      apiUtils
        .post(endpointUrl, formDatas)
        .then((apiRes) => resolve(apiRes.data))
        .catch(reject);
    });
  }

  onConfirmOffer(jobId: number, dataParams: ConfirmPartnerParams) {
    return new Promise((resolve, reject) => {
      const endpointUrl = URLUtils.bindUrl(EndpointConfig.JOB_CONFIRM_OFFER, {
        ":jobId": jobId,
      });

      const formDatas = new FormData();
      formDatas.append("user_id", dataParams?.user_id?.toString());
      formDatas.append("start_date", dataParams.start_date);
      formDatas.append("end_date", dataParams.end_date);
      formDatas.append("price", dataParams?.negotiate_price?.toString());
      formDatas.append("number_accept", dataParams?.number_accept?.toString());
      formDatas.append("description", dataParams.description);
      formDatas.append("client_ip", dataParams.client_ip);
      formDatas.append("device_name", dataParams.device_name);
      formDatas.append("platform", dataParams.platform);

      apiUtils
        .post(endpointUrl, formDatas)
        .then((apiRes) => resolve(apiRes.data))
        .catch(reject);
    });
  }

  getFavoriteList(): Promise<DatasResource<FullJobResourceV2>> {
    return new Promise((resolve, reject) => {
      apiUtils
        .get(EndpointConfig.JOB_FAVORITE_LIST)
        .then((apiRes) => resolve(JobParseUtilsV2.list(apiRes.data)))
        .catch(reject);
    });
  }

  // ── SUPABASE METHODS ─────────────────────────────────────────────────────────

  /** Map a Supabase job row to the FullJobResourceV2 shape expected by UI */
  private static mapSupabaseJob(job: any): FullJobResourceV2 {
    const now = new Date();
    const expiresAt = job.expires_at ? new Date(job.expires_at) : null;
    const isExpired = expiresAt ? expiresAt < now : false;

    const formatDate = (dateStr?: string) => {
      if (!dateStr) return "";
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "";
      return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${d.getFullYear()}`;
    };

    // Determine salaryType: 1=DEAL, 2=RANGE, 3=FIXED
    let salaryType = Constants.JOB.SALARY_TYPE.DEAL;
    if (job.budget_min && job.budget_max && job.budget_min < job.budget_max) {
      salaryType = Constants.JOB.SALARY_TYPE.RANGE;
    } else if (job.budget_max) {
      salaryType = Constants.JOB.SALARY_TYPE.FIXED;
    }

    // Badge info
    let badgeLabel = "Đang tuyển";
    let badgeStatus = "ACTIVE";
    if (isExpired) {
      badgeLabel = "Hết hạn";
      badgeStatus = "EXPIRED";
    } else if (job.status !== "open") {
      badgeLabel = "Đóng";
      badgeStatus = "CLOSED";
    }

    return {
      jobId: job.id as any, // UUID string used as React key
      name: job.title || "",
      status: job.status === "open" ? 1 : 0,
      postingEndDate: formatDate(job.expires_at),
      createdByUserId: 0,
      partnerUserId: 0,
      startDate: formatDate(job.created_at),
      endDate: formatDate(job.expires_at || job.deadline),
      price: job.budget_max || job.budget_min || 0,
      connect: 0,
      salaryType,
      priceMin: job.budget_min || 0,
      priceMax: job.budget_max || 0,
      description: job.description || "",
      jobDurationType: Constants.JOB.DURATION_TYPE?.DAYS ?? 1,
      duration: job.duration_days || 0,
      react: 0,
      isExpired,
      applicantsCount: job.proposals_count || 0,
      skills: (job.skills_required || []).map((name: string, i: number) => ({
        skillId: i,
        name,
      })),
      badgeInfo: { badgeLabel, badgeStatus },
    } as any;
  }

  /** List jobs from Supabase with basic filtering/pagination */
  async listFromSupabase(filters: Record<string, any>): Promise<DatasResource<FullJobResourceV2>> {
    const limit = filters.per_page || 12;
    const page = Math.max(1, filters.page || 1);
    const offset = (page - 1) * limit;

    let query = supabase
      .from("jobs")
      .select(
        `id, title, description, status, budget_min, budget_max, duration_days,
         deadline, expires_at, created_at, proposals_count, views_count,
         skills_required, category_id`,
        { count: "exact" }
      )
      .eq("status", "open")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (filters.name) {
      query = query.ilike("title", `%${filters.name}%`);
    }

    if (filters.price_min) {
      query = query.gte("budget_min", filters.price_min);
    }

    if (filters.price_max) {
      query = query.lte("budget_max", filters.price_max);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("[JobServices.listFromSupabase] error:", error);
      return { items: [], total: 0 };
    }

    return {
      items: (data || []).map(JobServices.mapSupabaseJob),
      total: count || 0,
    };
  }

  /** Get a single job by ID from Supabase */
  async getByIdFromSupabase(id: string): Promise<FullJobResourceV2 | null> {
    const { data, error } = await supabase
      .from("jobs")
      .select(`*, profiles(display_name, avatar_url, avg_rating), categories(name, slug)`)
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return JobServices.mapSupabaseJob(data);
  }
}
