"use client";


import { Row, Col } from "antd";
import styles from "./HowToConnectSection_2.module.css";

import { Reveal } from "react-awesome-reveal";
import { keyframes } from "@emotion/react";
import useIsMobile from "../../HomeScreen/hooks/useIsMobile";
import { IconSvgLocal } from "@/src/components/icon-svg-local";

const customAnimation = keyframes`
    from {
        opacity: 0;
        transform: translate3d(0, 100px, 0);
    }
    to {
        opacity: 1;
        transform: translate3d(0, 0, 0);
    }
`;

const HowToConnectSection_2: React.FC = () => {
  const isMobileOrTablet = useIsMobile(1160);

  const desktopLayout = (
    <Row justify="center" align="stretch" gutter={100}>
      {/* Left Column */}
      <Col md={8}>
        <div className={styles.leftColumn}>
          <div className={styles.stepWrapper}>
            <div className={styles.stepNumber}>01</div>
            <div className={styles.step}>
              <div className={styles.stepContent}>
                <div className={styles.stepText}>Đăng ký tài khoản</div>
              </div>
            </div>
          </div>
          <IconSvgLocal
            name={"IC_ARROW_DOWN_2"}
            height={70}
            width={50}
            fill={"#09993E"}
          />
          <div className={styles.stepWrapper}>
            <div className={styles.stepNumber}>02</div>
            <div className={styles.step}>
              <div className={styles.stepContent}>
                <div className={styles.stepText}>Đăng tải công việc</div>
              </div>
            </div>
          </div>
          <IconSvgLocal
            name={"IC_ARROW_DOWN_2"}
            height={70}
            width={50}
            fill={"#09993E"}
          />{" "}
          <div className={styles.stepWrapper}>
            <div className={styles.stepNumber}>03</div>
            <div className={styles.step}>
              <div className={styles.stepContent}>
                <div className={styles.stepText}>
                  Lựa chọn, thống nhất công việc
                </div>
              </div>
            </div>
          </div>
          <IconSvgLocal
            name={"IC_REDO"}
            className={styles.flipIconHorizontally}
          />
        </div>
      </Col>

      {/* Center Flow */}
      <Col md={8}>
        <div className={styles.centerFlow}>
          <IconSvgLocal
            name={"IC_ARROW_RIGHT_2"}
            height={150}
            width={100}
            fill={"transparent"}
          />
          <div className={styles.centerBox}>
            <div>Đăng công việc để tìm ứng viên phù hợp</div>
          </div>
          {/* Di chuyển bước 4 vào đây */}
          <div className={`${styles.stepWrapper} ${styles.stepWrapperCenter}`}>
            <div className={styles.stepNumber}>04</div>
            <div className={styles.step}>
              <div className={styles.stepContent}>
                <div className={styles.stepText}>
                  Thanh toán 100% và uỷ quyền cho iAgree giữ tiền
                </div>
              </div>
            </div>
          </div>
        </div>
      </Col>

      {/* Right Column */}
      <Col md={8}>
        <div className={styles.rightColumn}>
          <div className={styles.stepWrapper}>
            <div className={styles.stepNumber}>07</div>
            <div className={styles.step}>
              <div className={styles.stepContent}>
                <div className={styles.stepText}>Hoàn thành và đánh giá</div>
              </div>
            </div>
          </div>
          <IconSvgLocal
            name={"IC_ARROW_UP_2"}
            height={70}
            width={50}
            fill={"#09993E"}
          />{" "}
          <div className={styles.stepWrapper}>
            <div className={styles.stepNumber}>06</div>
            <div className={styles.step}>
              <div className={styles.stepContent}>
                <div className={styles.stepText}>Nghiệm thu</div>
              </div>
            </div>
          </div>
          <IconSvgLocal
            name={"IC_ARROW_UP_2"}
            height={70}
            width={50}
            fill={"#09993E"}
          />
          <div className={styles.stepWrapper}>
            <div className={styles.stepNumber}>05</div>
            <div className={styles.step}>
              <div className={styles.stepContent}>
                <div className={styles.stepText}>Theo dõi tiến độ</div>
              </div>
            </div>
          </div>
          <IconSvgLocal
            name={"IC_REDO"}
            className={styles.flipIconHorizontally2}
          />
        </div>
      </Col>
    </Row>
  );

  const mobileLayout = (
    <div className={styles.flowchartContainerMobile}>
      {/* Center Box */}
      <div className={styles.centerFlowMobile}>
        <div className={styles.centerBox}>
          <div>Chủ động tìm kiếm Đối tác theo nhu cầu</div>
        </div>
      </div>
      <IconSvgLocal
        name={"IC_ARROW_DOWN_2"}
        height={70}
        width={50}
        fill={"#09993E"}
      />{" "}
      {/* Steps 1-3 */}
      <div className={styles.stepWrapperMobile}>
        <div className={styles.stepNumberMobile}>01</div>
        <div className={styles.stepMobile}>
          <div className={styles.stepContent}>
            <div className={styles.stepText}>Đăng ký tài khoản</div>
          </div>
        </div>
      </div>
      <IconSvgLocal
        name={"IC_ARROW_DOWN_2"}
        height={70}
        width={50}
        fill={"#09993E"}
      />{" "}
      <div className={styles.stepWrapperMobile}>
        <div className={styles.stepNumberMobile}>02</div>
        <div className={styles.stepMobile}>
          <div className={styles.stepContent}>
            <div className={styles.stepText}>Đăng tải công việc</div>
          </div>
        </div>
      </div>
      <IconSvgLocal
        name={"IC_ARROW_DOWN_2"}
        height={70}
        width={50}
        fill={"#09993E"}
      />{" "}
      <div className={styles.stepWrapperMobile}>
        <div className={styles.stepNumberMobile}>03</div>
        <div className={styles.stepMobile}>
          <div className={styles.stepContent}>
            <div className={styles.stepText}>
              Lựa chọn, thống nhất công việc
            </div>
          </div>
        </div>
      </div>
      <IconSvgLocal
        name={"IC_ARROW_DOWN_2"}
        height={70}
        width={50}
        fill={"#09993E"}
      />{" "}
      {/* Steps 4-7 */}
      <div className={styles.stepWrapperMobile}>
        <div className={styles.stepNumberMobile}>04</div>
        <div className={styles.stepMobile}>
          <div className={styles.stepContent}>
            <div className={styles.stepText}>
              Thanh toán 100% và uỷ quyền cho iAgree giữ tiền
            </div>
          </div>
        </div>
      </div>
      <IconSvgLocal
        name={"IC_ARROW_DOWN_2"}
        height={70}
        width={50}
        fill={"#09993E"}
      />{" "}
      <div className={styles.stepWrapperMobile}>
        <div className={styles.stepNumberMobile}>05</div>
        <div className={styles.stepMobile}>
          <div className={styles.stepContent}>
            <div className={styles.stepText}>Theo dõi tiến độ</div>
          </div>
        </div>
      </div>
      <IconSvgLocal
        name={"IC_ARROW_DOWN_2"}
        height={70}
        width={50}
        fill={"#09993E"}
      />{" "}
      <div className={styles.stepWrapperMobile}>
        <div className={styles.stepNumberMobile}>06</div>
        <div className={styles.stepMobile}>
          <div className={styles.stepContent}>
            <div className={styles.stepText}>Nghiệm thu</div>
          </div>
        </div>
      </div>
      <IconSvgLocal
        name={"IC_ARROW_DOWN_2"}
        height={70}
        width={50}
        fill={"#09993E"}
      />{" "}
      <div className={styles.stepWrapperMobile}>
        <div className={styles.stepNumberMobile}>07</div>
        <div className={styles.stepMobile}>
          <div className={styles.stepContent}>
            <div className={styles.stepText}>Hoàn thành và đánh giá</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Reveal keyframes={customAnimation} triggerOnce>
      <section id="how-to-connect" className={styles.sectionContainer}>
        <div className={styles.contentWrapper}>
          <div className={styles.mainTitle}>CÁCH ĐỂ KẾT NỐI VỚI ĐỐI TÁC</div>
          <div className={styles.subTitle}>Hình Thức 2</div>
          {isMobileOrTablet ? mobileLayout : desktopLayout}
        </div>
      </section>
    </Reveal>
  );
};

export default HowToConnectSection_2;
