import { MetadataRoute } from "next";
import { CountByRate } from "../data/partner/models/partner.types";
import Constants from "./Constants";
import { RawReviewResource } from "../data/partner/models/partner.raw";
import { filter } from "lodash";

export class ConstantsHelper {
  static DEFAULT_SITEMAP(): MetadataRoute.Sitemap {
    const url = process.env.FRONTEND_BASE_URL || "http://localhost:3000";
    return [
      {
        url: `${url}/`,
        // changeFrequency: "daily",
        // priority: 1,
        lastModified: new Date(),
      },
      {
        url: `${url}/about-us`,
        // changeFrequency: "daily",
        // priority: 1,
        lastModified: new Date(),
      },
      {
        url: `${url}/become-a-partner`,
        // changeFrequency: "daily",
        // priority: 1,
        lastModified: new Date(),
      },
      {
        url: `${url}/cancel-transaction-policy`,
        // changeFrequency: "daily",
        // priority: 1,
        lastModified: new Date(),
      },
      // {
      //   url: `${url}/category-detail`,
      //   changeFrequency: "daily",
      //   priority: 1,
      //   lastModified: new Date(),
      // },
      {
        url: `${url}/chat`,
        // changeFrequency: "daily",
        // priority: 1,
        lastModified: new Date(),
      },
      {
        url: `${url}/check-role`,
        // changeFrequency: "daily",
        // priority: 1,
        lastModified: new Date(),
      },
      {
        url: `${url}/company-register`,
        // changeFrequency: "daily",
        // priority: 1,
        lastModified: new Date(),
      },
      {
        url: `${url}/complain-resolve-policy`,
        // changeFrequency: "daily",
        // priority: 1,
        lastModified: new Date(),
      },
      {
        url: `${url}/confirm-sign-contract`,
        // changeFrequency: "daily",
        // priority: 1,
        lastModified: new Date(),
      },
      {
        url: `${url}/contact`,
        // changeFrequency: "daily",
        // priority: 1,
        lastModified: new Date(),
      },
      {
        url: `${url}/contracts`,
        // changeFrequency: "daily",
        // priority: 1,
        lastModified: new Date(),
      },
      {
        url: `${url}/contracts/confirm`,
        // changeFrequency: "daily",
        // priority: 1,
        lastModified: new Date(),
      },
      {
        url: `${url}/contracts/upload`,
        // changeFrequency: "daily",
        // priority: 1,
        lastModified: new Date(),
      },
      {
        url: `${url}/copyright-policy`,
        // changeFrequency: "daily",
        // priority: 1,
        lastModified: new Date(),
      },

      {
        url: `${url}/documents`,
        // changeFrequency: "daily",
        // priority: 1,
        lastModified: new Date(),
      },
      {
        url: `${url}/editor`,
        // changeFrequency: "daily",
        // priority: 1,
        lastModified: new Date(),
      },
      {
        url: `${url}/forgot-password`,
        // changeFrequency: "daily",
        // priority: 1,
        lastModified: new Date(),
      },
      {
        url: `${url}/how-it-works`,
        // changeFrequency: "daily",
        // priority: 1,
        lastModified: new Date(),
      },
      {
        url: `${url}/how-it-works-for-partners`,
        // changeFrequency: "daily",
        // priority: 1,
        lastModified: new Date(),
      },
      {
        url: `${url}/internal-wallet`,
        // changeFrequency: "daily",
        // priority: 1,
        lastModified: new Date(),
      },
      {
        url: `${url}/internal-wallet/income-reconciliation`,
        // changeFrequency: "daily",
        // priority: 1,
        lastModified: new Date(),
      },
      {
        url: `${url}/internal-wallet/manage-info`,
        // changeFrequency: "daily",
        // priority: 1,
        lastModified: new Date(),
      },
      {
        url: `${url}/internal-wallet/transaction-history`,
        // changeFrequency: "daily",
        // priority: 1,
        lastModified: new Date(),
      },
      {
        url: `${url}/internal-wallet/withdrawal-money`,
        // changeFrequency: "daily",
        // priority: 1,
        lastModified: new Date(),
      },
      {
        url: `${url}/jobs`,
        // changeFrequency: "daily",
        // priority: 1,
        lastModified: new Date(),
      },
      {
        url: `${url}/jobs/add`,
        // changeFrequency: "daily",
        // priority: 1,
        lastModified: new Date(),
      },

      {
        url: `${url}/jobs/apply/cong-viec-bi-huy`,
        // changeFrequency: "daily",
        // priority: 1,
        lastModified: new Date(),
      },
      {
        url: `${url}/jobs/apply/cong-viec-da-hoan-thanh`,
        // changeFrequency: "daily",
        // priority: 1,
        lastModified: new Date(),
      },
      {
        url: `${url}/jobs/apply/cong-viec-da-luu`,
        // changeFrequency: "daily",
        // priority: 1,
        lastModified: new Date(),
      },
      {
        url: `${url}/jobs/apply/cong-viec-da-ung-tuyen`,
        // changeFrequency: "daily",
        // priority: 1,
        lastModified: new Date(),
      },
      {
        url: `${url}/jobs/apply/cong-viec-dang-thuc-hien`,
        // changeFrequency: "daily",
        // priority: 1,
        lastModified: new Date(),
      },
      {
        url: `${url}/jobs/apply/tat-ca-cong-viec`,
        // changeFrequency: "daily",
        // priority: 1,
        lastModified: new Date(),
      },

      {
        url: `${url}/jobs/invited/cong-viec-duoc-moi`,
        // changeFrequency: "daily",
        // priority: 1,
        lastModified: new Date(),
      },
      {
        url: `${url}/jobs/list`,
        // changeFrequency: "daily",
        // priority: 1,
        lastModified: new Date(),
      },
      {
        url: `${url}/jobs/management/cong-viec-bi-huy`,
        // changeFrequency: "daily",
        // priority: 1,
        lastModified: new Date(),
      },
      {
        url: `${url}/jobs/management/cong-viec-da-dang`,
        // changeFrequency: "daily",
        // priority: 1,
        lastModified: new Date(),
      },
      {
        url: `${url}/jobs/management/cong-viec-da-hoan-thanh`,
        // changeFrequency: "daily",
        // priority: 1,
        lastModified: new Date(),
      },
      {
        url: `${url}/jobs/management/cong-viec-dang-thuc-hien`,
        // changeFrequency: "daily",
        // priority: 1,
        lastModified: new Date(),
      },
      {
        url: `${url}/jobs-search`,
        // changeFrequency: "daily",
        // priority: 1,
        lastModified: new Date(),
      },
      {
        url: `${url}/login`,
        // changeFrequency: "daily",
        // priority: 0.9,
        lastModified: new Date(),
      },
      {
        url: `${url}/login-become-partner`,
        // changeFrequency: "daily",
        // priority: 0.9,
        lastModified: new Date(),
      },
      {
        url: `${url}/manage-and-use-chances-policy`,
        // changeFrequency: "weekly",
        // priority: 0.7,
        lastModified: new Date(),
      },
      {
        url: `${url}/mysign-support`,
        // changeFrequency: "daily",
        // priority: 0.8,
        lastModified: new Date(),
      },

      {
        url: `${url}/news`,
        // changeFrequency: "daily",
        // priority: 0.8,
        lastModified: new Date(),
      },
      {
        url: `${url}/operation-policy`,
        // changeFrequency: "weekly",
        // priority: 0.7,
        lastModified: new Date(),
      },
      {
        url: `${url}/partner-register-get-start`,
        // changeFrequency: "monthly",
        // priority: 0.6,
        lastModified: new Date(),
      },
      {
        url: `${url}/partner-register-v2`,
        // changeFrequency: "monthly",
        // priority: 0.6,
        lastModified: new Date(),
      },
      {
        url: `${url}/partners`,
        // changeFrequency: "weekly",
        // priority: 0.7,
        lastModified: new Date(),
      },
      {
        url: `${url}/partners-search`,
        // changeFrequency: "weekly",
        // priority: 0.7,
        lastModified: new Date(),
      },
      {
        url: `${url}/payment`,
        // changeFrequency: "daily",
        // priority: 1,
        lastModified: new Date(),
      },
      {
        url: `${url}/payment-policy`,
        // changeFrequency: "weekly",
        // priority: 0.6,
        lastModified: new Date(),
      },
      {
        url: `${url}/personal-register`,
        // changeFrequency: "daily",
        // priority: 0.9,
        lastModified: new Date(),
      },
      {
        url: `${url}/post-job-success`,
        // changeFrequency: "daily",
        // priority: 0.8,
        lastModified: new Date(),
      },
      {
        url: `${url}/pricing`,
        // changeFrequency: "monthly",
        // priority: 0.5,
        lastModified: new Date(),
      },
      {
        url: `${url}/privacy-policy`,
        // changeFrequency: "monthly",
        // priority: 0.6,
        lastModified: new Date(),
      },
      {
        url: `${url}/profile`,
        // changeFrequency: "daily",
        // priority: 1,
        lastModified: new Date(),
      },
      {
        url: `${url}/receive-feedback-from-social-organization`,
        // changeFrequency: "monthly",
        // priority: 0.5,
        lastModified: new Date(),
      },
      {
        url: `${url}/refund-policy`,
        // changeFrequency: "monthly",
        // priority: 0.5,
        lastModified: new Date(),
      },
      {
        url: `${url}/register`,
        // changeFrequency: "daily",
        // priority: 0.9,
        lastModified: new Date(),
      },
      {
        url: `${url}/register-become-partner`,
        // changeFrequency: "daily",
        // priority: 0.8,
        lastModified: new Date(),
      },
      {
        url: `${url}/reset-password`,
        // changeFrequency: "daily",
        // priority: 0.7,
        lastModified: new Date(),
      },
      {
        url: `${url}/search`,
        // changeFrequency: "daily",
        // priority: 1,
        lastModified: new Date(),
      },
      {
        url: `${url}/services`,
        // changeFrequency: "weekly",
        // priority: 0.7,
        lastModified: new Date(),
      },
      {
        url: `${url}/templates`,
        // changeFrequency: "monthly",
        // priority: 0.5,
        lastModified: new Date(),
      },
      {
        url: `${url}/term-of-use`,
        // changeFrequency: "monthly",
        // priority: 0.6,
        lastModified: new Date(),
      },
      {
        url: `${url}/user-violation-policy`,
        // changeFrequency: "monthly",
        // priority: 0.6,
        lastModified: new Date(),
      },
      {
        url: `${url}/verify-email`,
        // changeFrequency: "daily",
        // priority: 0.9,
        lastModified: new Date(),
      },
      {
        url: `${url}/verify-email`,
        // changeFrequency: "daily",
        // priority: 1,
        lastModified: new Date(),
      },
      {
        url: `${url}/verify-email-resend`,
        // changeFrequency: "daily",
        // priority: 1,
        lastModified: new Date(),
      },
      {
        url: `${url}/verify-otp`,
        // changeFrequency: "daily",
        // priority: 0.9,
        lastModified: new Date(),
      },
      {
        url: `${url}/verify-otp-register-become-partner`,
        // changeFrequency: "daily",
        // priority: 0.9,
        lastModified: new Date(),
      },
    ];
  }
  static getJobStatusTitle(statusId: number, isPartner?: boolean) {
    switch (statusId) {
      case Constants.JOB.STATUS.LUU_NHAP:
        return {
          bgColor: "#979797",
          color: "#FFFFFF",
          name: "Lưu nháp",
        };

      case Constants.JOB.STATUS.DUYET_DANG_TUYEN:
        if (isPartner)
          return {
            bgColor: "#25272D",
            color: "#FFFFFF",
            name: "Ứng tuyển",
          };
        return {
          bgColor: "#25272D",
          color: "#FFFFFF",
          name: "Đăng tuyển",
        };

      case Constants.JOB.STATUS.YEU_CAU_DANG_TUYEN:
        if (isPartner)
          return {
            bgColor: "#25272D",
            color: "#FFFFFF",
            name: "Ứng tuyển",
          };
        return {
          bgColor: "#25272D",
          color: "#FFFFFF",
          name: "Đang chờ duyệt",
        };

      case Constants.JOB.STATUS.CANCEL_DANG_TUYEN:
        return {
          bgColor: "#FFFFFF",
          borderColor: "#E14141",
          color: "#E14141",
          name: "Hủy",
        };

      case Constants.JOB.STATUS.CHO_UNG_TUYEN:
        if (isPartner)
          return {
            bgColor: "#25272D",
            color: "#FFFFFF",
            name: "Ứng tuyển",
          };
        return {
          bgColor: "#25272D",
          color: "#FFFFFF",
          name: "Tìm đối tác",
        };

      case Constants.JOB.STATUS.TAM_UNG_THANH_TOAN:
        if (isPartner)
          return {
            bgColor: "#E59F1E",
            color: "#FFFFFF",
            // name: "Ký hợp đồng",
            name: "Chờ thanh toán",
          };
        return {
          bgColor: "#995109",
          color: "#FFFFFF",
          name: "Thanh toán công việc",
          shortName: "Thanh toán",
        };

      case Constants.JOB.STATUS.CHO_PARTNER_XAC_NHAN:
        if (isPartner)
          return {
            bgColor: "#E59F1E",
            color: "#FFFFFF",
            name: "Xác nhận",
          };
        return {
          bgColor: "#995109",
          color: "#FFFFFF",
          name: "Xác nhận",
        };

      case Constants.JOB.STATUS.CHO_TAT_TOAN:
        if (isPartner)
          return {
            bgColor: "#6C0999",
            color: "#FFFFFF",
            name: "Duyệt kết quả công việc",
            shortName: "Duyệt kết quả",
          };
        return {
          bgColor: "#E14141",
          color: "#FFFFFF",
          name: "Tất toán",
        };

      case Constants.JOB.STATUS.THANH_TOAN_PARTNER:
        if (isPartner)
          return {
            bgColor: "#6C0999",
            color: "#FFFFFF",
            name: "Duyệt kết quả công việc",
            shortName: "Duyệt kết quả",
          };
        return {
          bgColor: "#E14141",
          color: "#FFFFFF",
          name: "Tất toán",
        };

      case Constants.JOB.STATUS.CHO_KY_HOP_DONG:
        return {
          bgColor: "#E59F1E",
          color: "#FFFFFF",
          name: "Ký hợp đồng",
        };

      case Constants.JOB.STATUS.DA_KY_HOP_DONG:
        return {
          bgColor: "#094399",
          color: "#FFFFFF",
          name: "Đang thực hiện",
        };

      case Constants.JOB.STATUS.DA_NGHIEM_THU:
        return {
          bgColor: "#6C0999",
          color: "#FFFFFF",
          name: "Duyệt kết quả công việc",
          shortName: "Duyệt kết quả",
        };

      case Constants.JOB.STATUS.DUYET_HOAN_THANH_CV:
        return {
          bgColor: "#09993E",
          color: "#FFFFFF",
          name: "Hoàn thành",
        };

      case Constants.JOB.STATUS.CHO_NGHIEM_THU:
        if (isPartner)
          return {
            // bgColor: "#995109",
            bgColor: "#6C0999",
            color: "#FFFFFF",
            name: "Gửi kết quả công việc",
            shortName: "Gửi kết quả",
          };
        return {
          bgColor: "#6C0999",
          color: "#FFFFFF",
          name: "Duyệt kết quả công việc",
          shortName: "Duyệt kết quả",
        };

      case Constants.JOB.STATUS.CANCELED:
        return {
          bgColor: "#FFFFFF",
          borderColor: "#E14141",
          color: "#E14141",
          name: "Hủy",
        };

      case Constants.JOB.STATUS.CHO_XU_LY_HUY:
        return {
          bgColor: "#979797",
          color: "#FFFFFF",
          name: "Chờ xử lý hủy",
        };

      case Constants.JOB.STATUS.THUONG_LUONG:
        return {
          bgColor: "#979797",
          color: "#FFFFFF",
          name: "Thương lượng lại",
        };

      case Constants.JOB.STATUS.DE_XUAT_CUOI:
        return {
          bgColor: "#979797",
          color: "#FFFFFF",
          name: "Đề xuất cuối",
        };

      case Constants.JOB.STATUS.CHO_KHIEU_NAI:
        return {
          bgColor: "#979797",
          color: "#FFFFFF",
          name: "Chờ khiếu nại",
        };

      case Constants.JOB.STATUS.DANG_KHIEU_NAI:
        return {
          bgColor: "#979797",
          color: "#FFFFFF",
          name: "Đang khiếu nại",
        };
    }

    return {
      bgColor: "#25272D",
      color: "#FFFFFF",
      name: statusId,
    };
  }

  static getAuthJobTitle(type: number) {
    if (type === Constants.JOB.TYPE.MANAGEMENT) {
      return "Quản lý công việc đăng tuyển";
    } else if (type === Constants.JOB.TYPE.APPLY) {
      return "Quản lý công việc ứng tuyển";
    } 
    // else if (type === Constants.JOB.TYPE.INVITED) {
    //   return "Quản lý công việc được mời";
    // }
  }

  static getJobResultStatusTitle(statusId: number): string {
    switch (statusId) {
      case Constants.JOB.RESULT_STATUS.WAITING_APPROVE:
        return "Chờ phản hồi";

      case Constants.JOB.RESULT_STATUS.APPROVE:
        return "Đồng ý";

      case Constants.JOB.RESULT_STATUS.REJECT:
        return "Từ chối";
    }

    return "...";
  }

  static getRatingTitle(ratingId: number): string {
    switch (ratingId) {
      case Constants.RATING.ALL:
        return "Tất cả";

      case Constants.RATING.MOT_SAO:
        return "1";

      case Constants.RATING.HAI_SAO:
        return "2";

      case Constants.RATING.BA_SAO:
        return "3";

      case Constants.RATING.BON_SAO:
        return "4";

      case Constants.RATING.NAM_SAO:
        return "5";
    }

    return "...";
  }

  static getCountByRate(
    countByRate: CountByRate,
    total: number,
    value: number
  ): string {
    let num = 0;
    switch (value) {
      case Constants.RATING.ALL:
        num = total;
        break;
      case Constants.RATING.MOT_SAO:
        num = countByRate[1];
        break;
      case Constants.RATING.HAI_SAO:
        num = countByRate[2];
        break;
      case Constants.RATING.BA_SAO:
        num = countByRate[3];
        break;
      case Constants.RATING.BON_SAO:
        num = countByRate[4];
        break;
      case Constants.RATING.NAM_SAO:
        num = countByRate[5];
        break;
    }

    return `(${num})`;
  }

  static countByRate(reviews: RawReviewResource[]): Record<number, number> {
    const result: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    }

    for (const review of reviews) {
      const rate = review.rate
      if (rate >= 1 && rate <= 5) {
        result[rate]++
      }
    }

    return result
  }

  // 🔹 Lấy amount theo key (1–5)
  static countByRateKey(reviews: RawReviewResource[], key: number): number {
    if (key < 1 || key > 5) return 0

    return filter(reviews, r => r?.rate === key).length
  }

  static getPaymentType(typeId: number): string {
    switch (typeId) {
      case Constants.PAYMENT.TYPE.TEMPLATE:
        return "Template";

      case Constants.PAYMENT.TYPE.ACCOUNT_SERVICE:
        return "Nâng cấp tài khoản";

      case Constants.PAYMENT.TYPE.JOB:
        return "Công việc";

      case Constants.PAYMENT.TYPE.E_SIGNATURE:
        return "Ký số";
      case Constants.PAYMENT.TYPE.CONNECT:
        return "Cơ Hội";
    }

    return "...";
  }

  static getContractStatusTitle(statusId: number): string {
    switch (statusId) {
      case Constants.CONTRACT.STATUS.LUU_NHAP:
        return "Lưu nháp";

      case Constants.CONTRACT.STATUS.DA_BAN_HANH:
        return "Đã ký";

      case Constants.CONTRACT.STATUS.DANG_XU_LY:
        return "Đang chờ ký";

      case Constants.CONTRACT.STATUS.TU_CHOI:
        return "Hủy";

      case Constants.CONTRACT.STATUS.HUY:
        return "Hủy";

      case Constants.CONTRACT.STATUS.REQUEST_MY_SIGN:
        return "Đang chờ ký";
    }

    return "...";
  }

  static getContractStatusBg(statusId: number): string {
    switch (statusId) {
      case Constants.CONTRACT.STATUS.LUU_NHAP:
        return "#979797";

      case Constants.CONTRACT.STATUS.REQUEST_MY_SIGN:
      case Constants.CONTRACT.STATUS.DANG_XU_LY:
        return "#E59F1E";

      case Constants.CONTRACT.STATUS.TU_CHOI:
      case Constants.CONTRACT.STATUS.HUY:
        return "#E14141";
    }

    return "#09993E";
  }

  static getContractSignStatusTitle(statusId: number): string {
    switch (statusId) {
      case Constants.CONTRACT.SIGN_STATUS.CHO_DUYET:
        return "Đang chờ";

      case Constants.CONTRACT.SIGN_STATUS.DONG_Y:
        return "Đang chờ";

      case Constants.CONTRACT.SIGN_STATUS.TU_CHOI:
        return "Đang chờ";

      case Constants.CONTRACT.SIGN_STATUS.REQUEST_MY_SIGN:
        return "Đang chờ";

      case Constants.CONTRACT.SIGN_STATUS.MY_SIGNED:
        return "Đã ký";
    }

    return "...";
  }

  static getContractSignStatusBg(statusId: number): string {
    switch (statusId) {
      case Constants.CONTRACT.SIGN_STATUS.CHO_DUYET:
      case Constants.CONTRACT.SIGN_STATUS.DONG_Y:
      case Constants.CONTRACT.SIGN_STATUS.TU_CHOI:
      case Constants.CONTRACT.SIGN_STATUS.REQUEST_MY_SIGN:
        return "#E59F1E";

      case Constants.CONTRACT.SIGN_STATUS.MY_SIGNED:
        return "#09993E";
    }

    return "#09993E";
  }

  static getSignTypeTitle(signTypeId: number): string {
    switch (signTypeId) {
      case Constants.CONTRACT.SIGN_TYPE.SONG_SONG:
        return "Ký song song";

      case Constants.CONTRACT.SIGN_TYPE.LAN_LUOT:
        return "Ký lần lượt";
    }

    return "...";
  }

  static getFileTypeFromPath(filePath: string): string {
    const extension = filePath.split(".").pop()?.toLowerCase() || "";
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
    return imageExtensions.includes(extension) ? "image" : "document";
  }
}
