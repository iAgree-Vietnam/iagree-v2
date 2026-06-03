// GuideToFindingPartnersSection_4.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "antd";
import styles from "./GuideToFindingPartnersSection_4.module.css";
import { Fade } from "react-awesome-reveal";
import { useRouter } from "next/router";
import { useAccountContext } from "@/src/contexts/AccountContext";
import Cookies from "js-cookie";
import Constants from "@/src/constants/Constants";
import JobRouteUtils from "@/src/data/job/utils/JobRouteUtils";
import VideoThumbnail from "./VideoThumbnail";
import GuideToFindingPartnersSectionModal from "../modals/GuideToFindingPartnersSectionModal";

const videoUrl =
  "https://demo.arcade.software/gp0HlgFB6Lxs0pWwBoRB?embed&embed_mobile=inline&embed_desktop=inline&show_copy_link=true";

const GuideToFindingPartnersSection_4: React.FC = () => {
  const router = useRouter();
  const accountContext = useAccountContext();
  const fullProfileResource = accountContext.auth;

  const isLoggedIn = accountContext.isLoggedIn;
  const isValidUser =
    fullProfileResource &&
    fullProfileResource.userId &&
    fullProfileResource?.fullName;
  const isActuallyLoggedIn = isLoggedIn && isValidUser;

  const handleJobAddClick = () => {
    if (!isActuallyLoggedIn) {
      Cookies.set(Constants.ROUTE_PRE_LOGIN, JobRouteUtils.toAddScreen());
      router.push("/login");
    } else {
      router.push(JobRouteUtils.toAddScreen());
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const arcadeIframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    function onArcadeIframeMessage(e: {
      origin: string;
      isTrusted: any;
      data: { event: string };
    }) {
      if (e.origin !== "https://demo.arcade.software" || !e.isTrusted) return;

      const arcadeIframe = arcadeIframeRef.current;
      if (!arcadeIframe || !arcadeIframe.contentWindow) return;

      if (e.data.event === "arcade-init") {
        arcadeIframe.contentWindow.postMessage(
          { event: "register-popout-handler" },
          "*"
        );
      }
    }

    window.addEventListener("message", onArcadeIframeMessage);

    const arcadeIframe = arcadeIframeRef.current;
    if (arcadeIframe && arcadeIframe.contentWindow) {
      arcadeIframe.contentWindow.postMessage(
        { event: "register-popout-handler" },
        "*"
      );
    }
    return () => {
      if (arcadeIframe && arcadeIframe.contentWindow) {
        arcadeIframe.contentWindow.postMessage(
          { event: "unregister-popout-handler" },
          "*"
        );
      }
      window.removeEventListener("message", onArcadeIframeMessage);
    };
  }, []);

  const handlePlayClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <Fade direction="right" cascade damping={0.1} triggerOnce={true}>
      <section
        id="guide-to-finding-partners-4"
        className={styles.guideContainer}
      >
        <div className={styles.guideFlexContainer}>
          {/* Text Content - Left Side */}
          <div className={styles.textContent}>
            <div className={styles.mainTitle}>4. Tùy chọn sau khi đăng</div>
            <div className={styles.subTitle}>
              Gợi ý các Đối tác phù hợp nhất với Yêu cầu công việc của bạn. Bạn
              có thể chủ động kết nối với họ ngay tại đây.
            </div>

            <Button
              type="primary"
              size="large"
              className={styles.postJobButton}
              onClick={handleJobAddClick}
            >
              Đăng bài ngay
            </Button>
          </div>

          {/* Video Player - Right Side */}
          <div className={styles.videoContent}>
            <div
              style={{
                position: "relative",
                height: 0,
                width: 0,
              }}
            >
              <iframe
                ref={arcadeIframeRef}
                src={videoUrl}
                title="HƯỚNG DẪN TÌM KIẾM ĐỐI TÁC"
                frameBorder="0"
                loading="lazy"
                allowFullScreen
                allow="clipboard-write"
                style={{
                  position: "relative",
                  top: 0,
                  left: 0,
                  height: 0,
                  width: 0,
                  colorScheme: "light",
                  // Ẩn iframe khi không có modal
                  opacity: isModalOpen ? 0 : 0,
                  pointerEvents: isModalOpen ? "none" : "auto",
                }}
              />
            </div>

            <VideoThumbnail
              title="HƯỚNG DẪN"
              onPlay={handlePlayClick}
              thumbnail="/assets/img/introduce/thumb_xac_nhan.png"
            />
          </div>
        </div>
      </section>

      {/* Modal sẽ nhận ref và hiển thị iframe */}
      <GuideToFindingPartnersSectionModal
        open={isModalOpen}
        title={"TUỲ CHỌN SAU KHI ĐĂNG"}
        onClose={handleModalClose}
        arcadeIframeRef={arcadeIframeRef}
      />
    </Fade>
  );
};

export default GuideToFindingPartnersSection_4;
