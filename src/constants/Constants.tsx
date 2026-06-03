import { MetadataRoute } from "next";

// @ts-ignore
export default {
  CONFIG: {
    BASE_URL: "https://cms.iagree.asia",
    API_BASE_URL: "https://cms.iagree.asia/api",
    GOOGLE_CLIENT_ID:
      "715899899418-3j0bf059fsrmbsra6jfhsuij1fm5fa57.apps.googleusercontent.com",
    // GOOGLE_CLIENT_ID: '50002415232-8o3vcu581v30137o8j22j0ipvjek8a18.apps.googleusercontent.com',
    GOOGLE_CLIENT_SECRET: "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",
    // GOOGLE_CLIENT_SECRET: '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',
    GOOGLE_RECAPTCHA_KEY: "6LdXOhorAAAAAJHADcBTBLyxvfY5iIpx5MMn4iMM",
    NEXTAUTH_SECRET: "NEXT-SECRET",
    FACEBOOK_META_PIXELS_CODE: "1651794858407518",
  },

  SOCKET_CONFIG: {
    broadcaster: "pusher",
    key: process.env.BROADCASTER_KEY as string,
    cluster: process.env.BROADCASTER_CLUSTER,
    wsHost: process.env.BROADCASTER_WSHOST,
    wsPort: 443,
    wssPort: 443,
    forceTLS: true,
    disableStats: true,
    enabledTransports: ["ws", "wss"],
  },

  KEY_ACCESS_TOKEN: "KEY_ACCESS_TOKEN",
  KEY_VERIFY_EMAIL: "KEY_VERIFY_EMAIL",
  KEY_PASSWORD: "KEY_PASSWORD",
  KEY_PAYMENT_TYPE: "KEY_PAYMENT_TYPE",
  ROUTE_PRE_LOGIN: "ROUTE_PRE_LOGIN",
  IS_REGISTER_BECOME_PARTNER: "REGISTER_BECOME_PARTNER",

  TEMPLATE: {
    TYPE: {
      MANAGE_TEMPLATE: 1,
      MANAGE_DOCUMENT: 2,
      MANAGE_CONTRACT: 3,
    },
    STATUS: {
      ALL: 1,
      PAID: 2,
      SAVED: 3,
      MINE: 4,
    },
    PREVIEW_TYPE: {
      TEMPLATE: 1,
      DOCUMENT: 2,
    },
  },

  DOCUMENT: {
    SHARE_STATUS: {
      SHARE: 0,
      APPROVED: 1,
      REJECTED: 2,
      CANCELED: 3,
    },
  },

  JOB: {
    SALARY_TYPE: {
      DEAL: 1, // Thỏa thuận
      RANGE: 2, // Khoảng giá
      FIXED: 3, // Cố định
    },
    DEADLINE: {
      AMOUNT: 1,
      CALENDAR: 2,
    },

    TAB: {
      JOB_INFO: "JOB_INFO",
      JOB_PARTNER: "JOB_PARTNER",
      JOB_SIGN: "JOB_SIGN",
      JOB_REPORT: "JOB_REPORT",
      JOB_REVIEW: "JOB_REVIEW",
      JOB_PAYMENT: "JOB_PAYMENT",
      JOB_SETTLEMENT: "JOB_SETTLEMENT",
      JOB_RESULT: "JOB_RESULT",
      JOB_PROCESSING: "JOB_PROCESSING",
      JOB_RATE: "JOB_RATE",
    },

    TYPE: {
      MANAGEMENT: 1,
      APPLY: 2,
      INVITED: 3,
    },
    ROUTE_MANAGE_STATUS: {
      DANG_TUYEN: 1,
      TIM_DOI_TAC: 4,
      TAM_UNG: 11,
      TAT_TOAN: 12,
      DANG_CHO_DUYET: 2,
      CHO_PARTNER_XAC_NHAN: 14,
    },
    ROUTE_APPLY_STATUS: {
      DA_LUU: 2,
      UNG_TUYEN: 4,
      GUI_KET_QUA: 9,
    },
    ROUTE_COMMON_STATUS: {
      ALL: 0,
      KY_HOP_DONG: 5,
      DANG_THUC_HIEN: 6,
      DUYET_KET_QUA: 7,
      CHO_NGHIEM_THU: 9,
      HOAN_THANH: 8,
      HUY: 10,
    },
    STATUS: {
      LUU_NHAP: 0,
      DUYET_DANG_TUYEN: 1,
      YEU_CAU_DANG_TUYEN: 2,
      CANCEL_DANG_TUYEN: 3,
      CHO_UNG_TUYEN: 4,

      CHO_KY_HOP_DONG: 5,
      DA_KY_HOP_DONG: 6,
      CHO_NGHIEM_THU: 9,
      DA_NGHIEM_THU: 7,
      DUYET_HOAN_THANH_CV: 8,
      CANCELED: 10, // trạng thái admin hủy công việc
      TAM_UNG_THANH_TOAN: 11,
      CHO_TAT_TOAN: 12,
      THANH_TOAN_PARTNER: 13,
      CHO_PARTNER_XAC_NHAN: 14,
      CHO_XU_LY_HUY: 15,
      THUONG_LUONG: 16,
      DE_XUAT_CUOI: 17,
      CHO_KHIEU_NAI: 18,
      DANG_KHIEU_NAI: 19
    },
    SAVE_STATUS: {
      DRAFT: 0,
      SAVE: 2,
    },
    RESULT_STATUS: {
      WAITING_APPROVE: 0,
      APPROVE: 1,
      REJECT: 2,
    },
    PAYMENT_TYPE: {
      ADVANCE: 0,
      SETTLEMENT: 1,
      TOTAL: 2,
    },

    DEADLINE_TYPE: {
      DEADLINE: 1,
      TIME: 2,
    },
    JOB_TYPE: {
      ONETIME: 1,
    },
    DURATION_TYPE: {
      DAYS: 1,
      WEEKS: 2,
      MONTHS: 3,
    },
    OFFER: {
      TYPE: {
        CLIENT: 1,
        PARTNER: 2,
      },

      DEAL_STATUS: {
        NOT_ACCEPTED: 0,
        ACCEPTED: 1,
      },

      STATUS: {
        NOT_RESPONSE: 0,
        RESPONSED: 1,
      },
    },
    REVIEW: {
      TYPE: {
        CLIENT: 1,
        PARTNER: 2,
      },
    },
    BID: {
      TYPE: {
        APPLY: 0,
        INVITED: 1,
      },
    },
    PLATFORM_FEE: {
      TYPE: {
        PARTNER: 1,
        CLIENT: 2,
      },
    },
    POSTED_DATE_TYPE: {
      TODAY: "toDay",
      LAST1DAY: "last1Day",
      LAST3DAYS: "last3Days",
      LAST7DAYS: "last7Days",
      LAST15DAYS: "last15Days",
      LAST30DAYS: "last30Days",
      LAST90DAYS: "last90Days",
    },
    POSTED_DATE_TYPE_V2: {
      TODAY: "TODAY",
      LAST1DAY: "LAST_1_DAYS",
      LAST3DAYS: "LAST_3_DAYS",
      LAST7DAYS: "LAST_7_DAYS",
      LAST15DAYS: "LAST_15_DAYS",
      LAST30DAYS: "LAST_30_DAYS",
      LAST90DAYS: "LAST_90_DAYS",
    },
  },

  PARTNER: {
    IS_CITIZEN_ID_VERIFIED: 1,
    CHO_DUYET: 0,
    DA_DUYET: 1,
    TU_CHOI: 2,
    TAB: {
      REGISTER_INFO: "REGISTER_INFO",
      REGISTER_VERIFY: "REGISTER_VERIFY",
      REGISTER_PAYMENT: "REGISTER_PAYMENT",
      REGISTER_CONFIRM: "REGISTER_CONFIRM",
    },
    STATUS_APPLY_KEY: {
      APPLIED: 0,
      SELECTED: 1,
      DEAL: 2,
      REJECTED: 3,
      INVITED: 4,
      PARTNER_REJECT: 5,
    },
    STATUS_APPLY: [
      {
        key: "0",
        value: "Đã ứng tuyển",
        color: "rgba(59, 130, 246, 1)",
        colorBlur: "rgba(59, 130, 246, 0.15)",
      },
      {
        key: "1",
        value: "Được chọn",
        color: "rgba(16, 185, 129, 1)",
        colorBlur: "rgba(16, 185, 129, 0.15)",
      },
      {
        key: "2",
        value: "Thương lượng",
        color: "rgba(245, 158, 11, 1)",
        colorBlur: "rgba(245, 158, 11, 0.15)",
      },
      {
        key: "3",
        value: "Từ chối",
        color: "rgba(239, 68, 68, 1)",
        colorBlur: "rgba(239, 68, 68, 0.15)",
      },
      {
        key: "4",
        value: "Được mời",
        color: "rgba(139, 92, 246, 1)",
        colorBlur: "rgba(139, 92, 246, 0.15)",
      },
      {
        key: "5",
        value: "Đối tác từ chối",
        color: "rgba(107, 114, 128, 1)",
        colorBlur: "rgba(107, 114, 128, 0.15)",
      },
    ],
  },

  JOB_ADD_FORM: {
    OVERVIEW: 0,
    SCOPE_AND_BUDGET: 1,
    CONFIRM_AND_REGISTER: 2,
    REGISTERED_OPTIONS: 3,
    TAB: {
      JOB_ADD_OVERVIEW: "JOB_ADD_OVERVIEW",
      JOB_ADD_SCOPE_AND_BUDGET: "JOB_ADD_SCOPE_AND_BUDGET",
      JOB_ADD_CONFIRM_AND_REGISTER: "JOB_ADD_CONFIRM_AND_REGISTER",
      JOB_ADD_REGISTERED_OPTIONS: "JOB_ADD_REGISTERED_OPTIONS",
    },
  },

  NOTIFICATION: {
    STATUS: {
      CHUA_DOC: 0,
      DA_DOC: 1,
    },
    MAX_COUNT: 99,
    TYPE: {
      SYSTEM_NOTIFICATION: 1,
      TEMPLATE_NOTIFICATION: 2,
      JOB_NOTIFICATION: 3,
      PRICING_NOTIFICATION: 4,
    },
  },

  GENDER: {
    MEN: 1,
    WOMEN: 2,
    OTHER: 3,
  },

  TRANSACTION_SEARCH_TYPE: {
    ORDER_ID: 1,
    NAME: 2,
  },

  RATING: {
    ALL: 0,
    NAM_SAO: 5,
    BON_SAO: 4,
    BA_SAO: 3,
    HAI_SAO: 2,
    MOT_SAO: 1,
  },

  PAYMENT: {
    TYPE: {
      TEMPLATE: 1,
      ACCOUNT_SERVICE: 2,
      JOB: 3,
      E_SIGNATURE: 4,
      CONNECT: 5,
    },
    TYPE_TEXT: {
      ACCOUNT_SERVICE: "All user",
      E_SIGNATURE: "E-Signature",
    },
    STATUS: {
      ALL: -1,
      COMPLETE: 1,
      INCOMPLETE: 0,
      REJECT: 2,
      DISPUTE: 3,
    },
  },

  HEADER: {
    HEIGHT: 95,
  },

  SETTING: {
    OFFICE_NAME: "OFFICE_NAME",
    OFFICE_ADDRESS: "OFFICE_ADDRESS",
    TAX_CODE: "TAX_CODE",
    HOTLINE_SUPPORT: "HOTLINE_SUPPORT",
    CONTACT_EMAIL: "CONTACT_EMAIL",
    FACEBOOK: "FACEBOOK",
    INSTAGRAM: "INSTAGRAM",
    TWITTER: "TWITTER",
    LINKEDIN: "LINKEDIN",
    ABOUT_US: "ABOUT_US",
    PRIVACY_POLICY: "PRIVACY_POLICY",
    PAYMENT_POLICY: "PAYMENT_POLICY",
    REFUND_POLICY: "REFUND_POLICY",
    TERMS_OF_USE: "TERMS_OF_USE",
    MYSIGN_SUPPORT: "MYSIGN_SUPPORT",
    OPERATION_POLICY: "OPERATION_POLICY",
    COMPLAIN_RESOLVE_POLICY: "COMPLAIN_RESOLVE_POLICY",
    CANCEL_TRANSACTION_POLICY: "CHINH_SACH_HUY_GIAO_DICH_HOAN_TIEN",
    DISPUTE_RESOLUTION_MECHANISM: "CO_CHE_GIAI_QUYET_TRANH_CHAP",
    CONTACT_POLICY: "CONTACT_POLICY",
    COPYRIGHT_POLICY: "COPYRIGHT_POLICY",
    USER_VIOLATION_POLICY: "USER_VIOLATION_POLICY",
    MANAGE_AND_USE_CHANCES_POLICY: "MANAGE_AND_USE_CHANCES_POLICY",
    YOUTUBE: "YOUTUBE_URL",
    TIKTOK: "TIKTOK_URL",
    COMMU_FACEBOOK: "COMMU_FACEBOOK",
    POLICY_FOR_PARTNERS: "POLICY_FOR_PARTNERS",
  },

  CONTRACT: {
    SIGN_TYPE: {
      LAN_LUOT: 1,
      SONG_SONG: 2,
    },
    STATUS: {
      LUU_NHAP: 0,
      DA_BAN_HANH: 1,
      DANG_XU_LY: 2,
      TU_CHOI: 3,
      HUY: 4,
      REQUEST_MY_SIGN: 5,
    },
    SIGN_STATUS: {
      CHO_DUYET: 0,
      DONG_Y: 1,
      TU_CHOI: 2,
      REQUEST_MY_SIGN: 3,
      MY_SIGNED: 4,
      EXTENSION: 5,
    },
    CONFIRM_MAIL_STATUS: {
      DONG_Y: 1,
      TU_CHOI: 2,
    },
    SIGN_IMG_SIZE: {
      WIDTH: 266,
      HEIGHT: 130,
    },
    UPLOAD_CONTRACT: "UPLOAD_CONTRACT",
  },

  E_SIGNATURE_PACKAGE: {
    E_SIGNATURE_BY_ONCE: "E_SIGNATURE_BY_ONCE",
    E_SIGNATURE_BY_STARTER: "E_SIGNATURE_BY_STARTER",
    E_SIGNATURE_BY_SMART: "E_SIGNATURE_BY_SMART",
    E_SIGNATURE_BY_PRO: "E_SIGNATURE_BY_PRO",
    E_SIGNATURE_BY_MONTH: "E_SIGNATURE_BY_MONTH",
    E_SIGNATURE_BY_ALL_USER: "E_SIGNATURE_BY_ALL_USER",
  },

  E_SIGNATURE_BY_ONCE_KEY_NAME: "E_SIGNATURE_BY_ALL_USER",

  TEMPLATE_PROFESSIONAL_KEY_NAME: "TU_VAN_VA_CHINH_SUA_TEMPLATE_CHUYEN_NGHIEP",

  ALL_USER_PACKAGE_KEY_NAME: {
    ACCOUNT_FREE: "ACCOUNT_FREE",
    ACCOUNT_BASIC: "ACCOUNT_BASIC",
    ACCOUNT_STANDARD: "ACCOUNT_STANDARD",
    ACCOUNT_PREMIUM: "ACCOUNT_PREMIUM",
  },

  ACCOUNT_TYPE_CREATED: {
    EMAIL: 1,
    GOOGLE: 2,
  },

  BUY_USER_PACKAGE_KEY_NAME: "BUY_USER_PACKAGE_KEY_NAME",

  E_SIGNATURE_SERVICE_PACKAGE_TYPE: {
    FREE: 1,
    FREE_BY_ONCE: 2,
  },

  SERVICE_PACKAGE_STATUS: {
    INACTIVE: 0,
    ACTIVE: 1,
  },

  HOME_SEARCH_SUGGESTIONS: {
    KEY_TYPE: {
      TEMPLATE: "template",
      JOB: "job",
      PARTNERS: "partners",
    },
  },

  CITIZEN_ID_STATUS: {
    NOT_LOGIN: 0,
    SIGNED: 1,
    NOT_VERIFY: 2,
    NOT_SIGNED: 3,
  },

  TEXT_MAX_LENGTH: 1500,
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  MAX_FILE_COUNT: 5,

  REASON_MAX_LENGTH: 5000,
};
