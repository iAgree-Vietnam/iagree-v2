"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "antd";
import styles from "./GuideToFindingPartnersSection.module.css";
import { Fade } from "react-awesome-reveal";
import { DownOutlined } from "@ant-design/icons";
import useIsMobile from "../../HomeScreen/hooks/useIsMobile";
import GuideToFindingPartnersSectionModal from "../modals/GuideToFindingPartnersSectionModal";
import VideoThumbnail from "./VideoThumbnail";

const videoUrl =
  "https://demo.arcade.software/OxuUU5ZiruVjsFnnkUKp?embed&embed_mobile=inline&embed_desktop=inline&show_copy_link=true";

const GuideToFindingPartnersSection: React.FC = () => {
  const isMobile = useIsMobile();
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

  const handleNextClick = () => {
    const nextSection = document.getElementById("guide-to-finding-partners-2");
    if (nextSection) {
      const sectionTop =
        nextSection.getBoundingClientRect().top + window.scrollY;
      const offset = isMobile ? 200 : 340;
      window.scrollTo({
        top: sectionTop - offset,
        behavior: "smooth",
      });
    }
  };

  const handlePlayClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <Fade direction="left" cascade damping={0.1} triggerOnce={true}>
      <section
        id="guide-to-finding-partners-1"
        className={styles.guideContainer}
      >
        <div className={styles.guideFlexContainer}>
          {/* Video Player - Left Side */}
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
              thumbnail="/assets/img/introduce/thumb_tong_quan.png"
            />
          </div>

          {/* Text Content - Right Side */}
          <div className={styles.textContent}>
            <div className={styles.mainTitle}>1. Thông tin tổng quan</div>
            <div className={styles.subTitle}>
              Hoàn thiện mô tả công việc tổng quan chỉ trong vài bước. Càng chi
              tiết, càng dễ dàng tiếp cận đến các freelancer hơn.
            </div>
            <Button
              type="primary"
              size="large"
              className={styles.nextButton}
              onClick={handleNextClick}
            >
              <div className={styles.nextButtonText}>Tiếp theo</div>
              <div className={styles.iconCircle}>
                <DownOutlined className={styles.nextButtonIcon} />
              </div>
            </Button>
          </div>
        </div>
      </section>

      {/* Modal sẽ nhận ref và hiển thị iframe */}
      <GuideToFindingPartnersSectionModal
        open={isModalOpen}
        title={"THÔNG TIN TỔNG QUAN"}
        onClose={handleModalClose}
        arcadeIframeRef={arcadeIframeRef}
      />
    </Fade>
  );
};

export default GuideToFindingPartnersSection;
