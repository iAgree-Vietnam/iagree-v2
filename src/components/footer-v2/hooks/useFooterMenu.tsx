import { useCallback } from "react";
import Link from "next/link";
import { useAccountContext } from "../../../contexts/AccountContext";
import TermOfUseRouteUtils from "../../../data/term-of-use/utils/TermOfUseRouteUtils";
import AboutUsRouteUtils from "../../../data/aboutus/utils/AboutUsRouteUtils";
import PrivacyPolicyRouteUtils from "../../../data/privacy-policy/utils/PrivacyPolicyRouteUtils";
import PostRouteUtils from "../../../data/post/utils/PostRouteUtils";
import { useDetectDeviceV2 } from "@/src/hooks/useDetectDevice";

export const useFooterMenu = () => {
  const accountContext = useAccountContext();
  const { setting } = accountContext;

  const normalizeSettingItem = useCallback((s?: string) => {
    if (!s) return "";
    const regex = new RegExp(
      ["vànbsp;", "<p>", "</p>", "<br>"].join("|"),
      "gi"
    );
    return s.replace(regex, "");
  }, []);

  const partners = [
    { src: "/assets/img/partners/partner-10.png", alt: "Vietcombank" },
    { src: "/assets/img/logo_vnpay.png", alt: "VNPAY" },
    { src: "/assets/img/logo_visa.png", alt: "VISA" },
    { src: "/assets/img/logo_mastercard.png", alt: "Master Card" },
  ];

  const partnerMenus = [
    {
      key: "Vietcombank",
      label: partners?.map((partner, index) => (
        <img
          key={index}
          src={partner.src}
          alt={partner.alt}
          style={{ height: 28, objectFit: "cover", paddingRight: "2rem" }}
        />
      )),
    },
  ];
  const isMobile = useDetectDeviceV2().isMobile;

  const supportMenus = [
    // {
    //   key: "MYSIGN_SUPPORT",
    //   label: (
    //     <Link href={PrivacyPolicyRouteUtils.toMySignSupport()}>
    //       Hướng dẫn sử dụng MySign
    //     </Link>
    //   ),
    // },
    {
      key: "FEEDBACK_FROM_SOCIAL_ORGANIZATION",
      label: (
        <Link href={PrivacyPolicyRouteUtils.toFeedbackFromOrganization()}>
          Tiếp nhận phản ánh của tổ chức xã hội
        </Link>
      ),
    },
    // {
    //   key: "CONTACT",
    //   label: (
    //     <Link href={PrivacyPolicyRouteUtils.toContactScreen()}>Liên hệ</Link>
    //   ),
    // },
    // {
    //   key: "IDENTITY",
    //   label: (
    //     <Link href={PrivacyPolicyRouteUtils.toIdentitySupportScreen()}>
    //       {`Hướng dẫn cập nhật CCCD ${
    //         isMobile ? "<br/>" : ""
    //       } dành cho đối tác`}
    //     </Link>
    //   ),
    // },
  ];

  const termMenus = [
    {
      key: "TERM_OF_USE",
      label: (
        <Link href={TermOfUseRouteUtils.toScreen()}>Điều khoản dịch vụ</Link>
      ),
    },
    {
      key: "PAYMENT_POLICY",
      label: (
        <Link href={PrivacyPolicyRouteUtils.toPaymentPolicyScreen()}>
          Thanh toán, hoàn tiền và phí nền tảng
        </Link>
      ),
    },
    {
      key: 'POLICY_FOR_PARTNERS',
      label: (
        <Link href={PrivacyPolicyRouteUtils.toPolicyForPartnersScreen()}>
          Quy tắc ứng xử & Điều khoản dành cho Đối Tác
        </Link>
      )
    }
  ];

  const introduceMenus = [
    {
      key: "ABOUT_US",
      label: <Link href={AboutUsRouteUtils.toScreen()}>Về chúng tôi</Link>,
    },

    {
      key: "NEWS",
      label: <Link href={PostRouteUtils.toScreen()}>Tin tức</Link>,
    },
  ];

  const policyMenus = [
    {
      key: "PRIVACY_POLICY",
      label: (
        <Link href={PrivacyPolicyRouteUtils.toScreen()}>
          Chính sách bảo mật
        </Link>
      ),
    },
    {
      key: "COMPLAIN_RESOLVE_POLICY",
      label: (
        <Link href={PrivacyPolicyRouteUtils.toComplainResolveScreen()}>
          Chính sách hủy công việc, giải quyết tranh chấp và khiếu nại
        </Link>
      ),
    },

    {
      key: "CONTACT_POLICY",
      label: (
        <Link href={PrivacyPolicyRouteUtils.toContactPolicyScreen()}>
          Chính sách gửi thông báo và liên hệ
        </Link>
      ),
    },
    {
      key: "COPYRIGHT_POLICY",
      label: (
        <Link href={PrivacyPolicyRouteUtils.toCopyrightPolicyScreen()}>
          Chính sách nội dung và bản quyền
        </Link>
      ),
    },
    {
      key: "USER_VIOLATION_POLICY",
      label: (
        <Link href={PrivacyPolicyRouteUtils.toUserViolationPolicyScreen()}>
          Chính sách xử lý vi phạm của người dùng
        </Link>
      ),
    },
    {
      key: "MANAGE_AND_USE_CHANCES_POLICY",
      label: (
        <Link
          href={PrivacyPolicyRouteUtils.toManageAndUseChancesPolicyScreen()}
        >
          Chính sách quản lý và sử dụng Cơ Hội
        </Link>
      ),
    },
  ];

  const communityMenus = [
    {
      key: "COMMUNITY_IAGREE",
      label: (
        <Link href={normalizeSettingItem(setting?.communFacebook)}>
          Cộng đồng Freelancer / Đối Tác iAgree Việt Nam
        </Link>
      ),
    },
  ];

  return {
    termMenus,
    supportMenus,
    policyMenus,
    introduceMenus,
    partnerMenus,
    partners,
    communityMenus,
    normalizeSettingItem,
  };
};
