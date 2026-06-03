"use client";

import React, { useEffect, useRef } from "react";
import styles from "./WorkProcessSection.module.css";
import { Reveal } from "react-awesome-reveal";
import { keyframes } from "@emotion/react";

// const videoUrl =
//   "https://demo.arcade.software/RWpIYcxXAYyCXayykeoD?embed&embed_mobile=inline&embed_desktop=inline&show_copy_link=true";

const videoUrl =
  "https://www.youtube.com/embed/kCqheRaLEXI?si=ot5pchDVyGEbXi9O";

const customAnimation = keyframes`
    from {
      opacity: 0;
      transform: translate3d(-100px, 0, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
`;

const WorkProcessSection: React.FC = () => {
  // const arcadeIframeRef = useRef<HTMLIFrameElement | null>(null);

  // useEffect(() => {
  //   function onArcadeIframeMessage(e: {
  //     origin: string;
  //     isTrusted: any;
  //     data: { event: string };
  //   }) {
  //     if (e.origin !== "https://demo.arcade.software" || !e.isTrusted) return;

  //     const arcadeIframe = arcadeIframeRef.current;
  //     if (!arcadeIframe || !arcadeIframe.contentWindow) return;

  //     if (e.data.event === "arcade-init") {
  //       arcadeIframe.contentWindow.postMessage(
  //         { event: "register-popout-handler" },
  //         "*"
  //       );
  //     }
  //   }

  //   window.addEventListener("message", onArcadeIframeMessage);

  //   const arcadeIframe = arcadeIframeRef.current;
  //   if (arcadeIframe && arcadeIframe.contentWindow) {
  //     arcadeIframe.contentWindow.postMessage(
  //       { event: "register-popout-handler" },
  //       "*"
  //     );
  //   }
  //   return () => {
  //     if (arcadeIframe && arcadeIframe.contentWindow) {
  //       arcadeIframe.contentWindow.postMessage(
  //         { event: "unregister-popout-handler" },
  //         "*"
  //       );
  //     }
  //     window.removeEventListener("message", onArcadeIframeMessage);
  //   };
  // }, []);

  return (
    <Reveal keyframes={customAnimation} triggerOnce>
      <section id="work-process" className={styles.sectionContainer}>
        <div className={styles.contentWrapper}>
          <div className={styles.mainContent}>
            <div className={styles.mainTitle}>
              Hướng dẫn gửi đề xuất - đàm phán - thanh toán
            </div>

            {/* Form and Video */}
            <div className={styles.videoContent}>
              <div
                style={{
                  position: "relative",
                  paddingBottom: "calc(49.333333333333336% + 41px)",
                  height: 0,
                  width: "100%",
                }}
              >
                <iframe
                  // ref={arcadeIframeRef}
                  src={videoUrl}
                  title="HƯỚNG DẪN GỬI ĐỀ XUẤT - ĐÀM PHÁN - THANH TOÁN"
                  // frameBorder="0"
                  loading="lazy"
                  allowFullScreen
                  allow="clipboard-write"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    colorScheme: "light",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  );
};

export default WorkProcessSection;
