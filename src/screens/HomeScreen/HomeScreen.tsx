import React, { useCallback, useEffect, useMemo, useRef } from "react";
import Head from "next/head";
import RootLayout from "@/src/layouts/RootLayout";
import JobCategoriesSection from "./sections/JobCategoriesSection";
import useHomeInit from "./hooks/useHomeInit";
import { useAccountContext } from "@/src/contexts/AccountContext";
import Constants from "@/src/constants/Constants";
import { useRouter } from "next/router";
import AuthRouteUtils from "@/src/data/auth/utils/AuthRouteUtils";
import dynamic from "next/dynamic";
import TemplatePreviewModal, {
  TemplatePreviewModalizeHelperVisible,
} from "../TemplateScreen/modals/TemplatePreviewModal";
import { ConstantConfig } from "@/src/constants/Config";

// --- CUSTOM HOOK CHO LOGIC HIỂN THỊ MODAL ---
const useConnectingModalLogic = (
  isActuallyLoggedIn: boolean,
  isPartner: boolean
) => {
  // Logic phức tạp về tần suất hiển thị modal được đóng gói tại đây

  useEffect(() => {
    if (!isActuallyLoggedIn || isPartner) {
      return;
    }

    const MAX_SHOWS_PER_DAY = 2;
    const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000;
    const MODAL_COOLDOWN_TIME = 2 * 60 * 1000;

    const lastShowTimeStr = localStorage.getItem("lastModalShowTime");
    const modalShowTimeStr = localStorage.getItem("modalShowTime");
    const showCountStr = localStorage.getItem("modalShowCount");

    const now = new Date().getTime();
    const lastShowTime = lastShowTimeStr ? parseInt(lastShowTimeStr) : 0;
    const modalShowTime = modalShowTimeStr ? parseInt(modalShowTimeStr) : 0;
    const showCount = showCountStr ? parseInt(showCountStr) : 0;

    const isNewDay = now - lastShowTime > MILLISECONDS_IN_DAY;
    const hasEnoughCooldownPassed = now - modalShowTime > MODAL_COOLDOWN_TIME;

    let newShowCount = showCount;
    if (isNewDay) {
      newShowCount = 0;
    }

    if (newShowCount < MAX_SHOWS_PER_DAY && hasEnoughCooldownPassed) {
      // Logic hiển thị modal (nếu cần) và cập nhật thời gian
      // setIsModalVisible(true);
      localStorage.setItem("modalShowTime", now.toString());
    }
  }, [isActuallyLoggedIn, isPartner]);
};

// --- DYNAMIC IMPORTS (CODE SPLITTING) ---
const BannerSectionV2 = dynamic(
  () => import("./sections/BannerSectionV2"),
  { ssr: true } // Giữ SEO cho hero
);

const PopularJobsSectionV2 = dynamic(
  () => import("./sections/PopularJobsSectionV2"),
  { ssr: false }
);

const TopPartnersSection = dynamic(
  () => import("./sections/TopPartnersSection"),
  { ssr: false }
);

const ProfessionalTemplatesSection = dynamic(
  () => import("./sections/ProfessionalTemplatesSection"),
  { ssr: false }
);

const SolutionsSection = dynamic(() => import("./sections/SolutionsSection"), {
  ssr: false,
});

const BannerAboutUsSection = dynamic(
  () => import("./sections/BannerAboutUsSection"),
  { ssr: false }
);

const BannerHowItWorksSection = dynamic(
  () => import("./sections/BannerHowItWorksSection"),
  { ssr: false }
);

const BannerHowItWorksForPartnersSection = dynamic(
  () => import("./sections/BannerHowItWorksForPartnersSection"),
  { ssr: false }
);

// const TemplatePreviewModal = dynamic(
//   () => import("../TemplateScreen/modals/TemplatePreviewModal"),
//   { ssr: false }
// );

// --- COMPONENT CHÍNH ---
function HomeScreen(props: any) {
  const router = useRouter();

  // Dọn dẹp Local Storage khi render lần đầu (giữ nguyên logic gốc)

  const accountContext = useAccountContext();

  const fullProfileResource = accountContext.auth;

  useEffect(() => {
    localStorage.removeItem("cardNumber");
    accountContext.refreshAccount();
  }, []);

  // Tính toán các biến kiểm tra trạng thái quan trọng
  const isActuallyLoggedIn = useMemo(() => {
    const isValidUser =
      fullProfileResource &&
      fullProfileResource.userId &&
      fullProfileResource?.fullName;
    return accountContext.isLoggedIn && isValidUser;
  }, [accountContext.isLoggedIn, fullProfileResource]);

  const isPartner = useMemo(() => {
    return fullProfileResource?.partner?.status === Constants.PARTNER.DA_DUYET;
  }, [fullProfileResource]);

  const templatePreviewModalRef =
    useRef<TemplatePreviewModalizeHelperVisible>(null);

  const topRef = useRef<HTMLElement | any>(null);

  const { data: homeInitResource } = useHomeInit({
    initData: {},
  });

  // Gán biến trực tiếp (Tối ưu hóa: Bỏ useMemo không cần thiết)
  const jobSlideItems = homeInitResource?.jobs?.items ?? [];
  const templateSlideItems = homeInitResource.templates;
  const partnerSlideItems = homeInitResource.partners ?? [];

  // Gọi hook quản lý logic modal
  useConnectingModalLogic(isActuallyLoggedIn as any, isPartner);

  // --- HANDLERS DÙNG USECALLBACK ---

  const onTemplatePreview = useCallback(
    (templateResource: any) => {
      templatePreviewModalRef.current?.open(templateResource);
    },
    [templatePreviewModalRef]
  );

  const handleScrollDown = useCallback(() => {
    window.scrollTo({
      behavior: "smooth",
      top:
        topRef.current?.getBoundingClientRect().top -
        document.body.getBoundingClientRect().top -
        Constants.HEADER.HEIGHT,
    });
  }, [topRef]);

  const handleCategoryClick = useCallback(
    (categoryName: string) => {
      router.push(AuthRouteUtils.toCategoryDetail(categoryName));
    },
    [router]
  );

  return (
    <RootLayout>
      {/* Banner Section */}

      <BannerSectionV2
        data={homeInitResource?.banners as any}
        popularSearchs={homeInitResource?.popularSearchs as any}
        scrollDown={handleScrollDown}
      />
      {/* Job Categories Section */}
      <JobCategoriesSection
        jobCategories={homeInitResource?.jobCategories as any}
        handleCategoryClick={handleCategoryClick}
      />
      {/* Popular jobs */}
      <PopularJobsSectionV2 jobSlideItems={jobSlideItems} router={router} />
      <BannerHowItWorksSection />
      {/* Top Partners */}
      <TopPartnersSection
        partnerSlideItems={partnerSlideItems}
        router={router}
      />

      {isPartner && <BannerHowItWorksForPartnersSection />}

      <SolutionsSection />
      {/* Professional Templates */}

      <ProfessionalTemplatesSection
        templateSlideItems={templateSlideItems?.items || []}
        homeInitResource={homeInitResource}
        onTemplatePreview={onTemplatePreview}
        router={router}
      />

      {/* About Us & Statistics Section */}
      <BannerAboutUsSection homeInitResource={homeInitResource} />
      <TemplatePreviewModal ref={templatePreviewModalRef} />
    </RootLayout>
  );
}

export default HomeScreen;
