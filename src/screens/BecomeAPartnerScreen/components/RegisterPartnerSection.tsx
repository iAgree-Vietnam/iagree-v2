"use client";

import React from "react";
import styles from "./RegisterPartnerSection.module.css";
import { Reveal } from "react-awesome-reveal";
import { keyframes } from "@emotion/react";

const embedUrl =
  "https://www.youtube.com/embed/LQBppLmeQis?si=XZD-nLbihsstb_zl";

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

const RegisterPartnerSection: React.FC = () => {
  return (
    <Reveal keyframes={customAnimation} triggerOnce>
      <section id="send-direct-invitation" className={styles.sectionContainer}>
        <div className={styles.contentWrapper}>
          <div className={styles.mainContent}>
            <div className={styles.mainTitle}>
              HƯỚNG DẪN ĐĂNG KÝ ĐỐI TÁC
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
                  src={embedUrl}
                  title="HƯỚNG DẪN ĐĂNG KÝ ĐỐI TÁC"
                  frameBorder="0"
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

export default RegisterPartnerSection;