"use client";

import React, { useState, useEffect } from "react";
import { Row, Typography, Col, Button } from "antd";
import PartnerItem from "@/src/components/partner/PartnerItem";
import { ButtonWithIcon } from "@/src/components/button";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import { PartnerRouteUtils } from "@/src/data/partner/utils/PartnerRouteUtils";
import { PartnerResource } from "@/src/data/partner/models/partner.types";
import useIsMobile from "../hooks/useIsMobile";
import { ButtonWithDottedLoadingIcon } from "@/src/components/button/ButtonWithDottedLoadingIcon";
import { reverse, take } from "lodash";

type Props = {
  partnerSlideItems: any[];
  router: any;
};

const ITEMS_PER_PAGE = 6;
const SCROLL_SPEED_PX_PER_SEC = 80;

const TopPartnersSection: React.FC<Props> = ({ partnerSlideItems, router }) => {
  const isTablet = useIsMobile(1200);
  const isMobile = useIsMobile(660);

  const allPartnerItems = partnerSlideItems.flatMap(
    (partnerPages) => partnerPages
  );

  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const handleLoadMore = () => {
    setVisibleCount((prev) =>
      Math.min(prev + ITEMS_PER_PAGE, allPartnerItems.length)
    );
  };

  const handleCollapse = () => {
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const renderLoadMoreOrCollapse = () => {
    if (visibleCount < allPartnerItems.length) {
      return (
        <Row
          justify="space-between"
          align="middle"
          className={"sectionTitleContainer"}
        >
          <Col>
            <ButtonWithDottedLoadingIcon
              iconPosition={"end"}
              onClick={handleLoadMore}
            >
              Tải thêm
            </ButtonWithDottedLoadingIcon>
          </Col>
          <Col>
            <ButtonWithIcon
              icon={
                <IconSvgLocal name={"IC_ARROW_RIGHT"} width={26} height={9} />
              }
              iconPosition={"end"}
              style={{ marginLeft: 10 }}
              onClick={() => router.push(PartnerRouteUtils.toPartnersSearchScreen())}
            >
              Xem tất cả
            </ButtonWithIcon>
          </Col>
        </Row>
      );
    } else if (allPartnerItems.length > visibleCount) {
      return null;
    }
    {
      return (
        <Button type="default" onClick={handleCollapse}>
          Thu gọn
        </Button>
      );
    }
    return null;
  };

  // 🎯 Tính tốc độ animation động dựa trên tổng số lượng partner
  useEffect(() => {
    const track = document.querySelector(
      ".slider-track-v2"
    ) as HTMLElement | null;
    const container = document.querySelector(
      ".slider-container-v2"
    ) as HTMLElement | null;

    if (track && container) {
      const trackWidth = track.scrollWidth;
      const distance = trackWidth / 2; // chỉ trượt nửa track (vì nhân đôi list)
      const duration = distance / SCROLL_SPEED_PX_PER_SEC;

      track.style.animationDuration = `${duration}s`;
      track.style.animationTimingFunction = "linear";
      track.style.animationIterationCount = "infinite";
    }
  }, [allPartnerItems.length]);

  const renderContent = () => {
    if (isTablet) {
      return (
        <section
          className={"sectionContainer partnerWrapper"}
          style={{ background: "transparent", marginInline: "1rem" }}
        >
          <div className={"contentWrapper"}>
            <Row
              justify="space-between"
              align="middle"
              className={"sectionTitleContainer"}
            >
              <Col>
                <Typography.Title
                  className={"sectionTitle partnerSectionTitle"}
                  level={2}
                  style={{ margin: 0 }}
                >
                  Danh Sách Đối Tác
                </Typography.Title>
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 40 }}>
              {allPartnerItems
                .slice(0, visibleCount)
                .map((item: PartnerResource, itemIndex: number) => (
                  <Col key={itemIndex} span={isMobile ? 24 : 12}>
                    <PartnerItem data={item} />
                  </Col>
                ))}
            </Row>

            <Row justify="center" style={{ marginTop: 20 }}>
              {renderLoadMoreOrCollapse()}
            </Row>
          </div>
        </section>
      );
    }

    // 🖥️ Desktop giữ nguyên slider, thêm hiệu ứng tốc độ động
    return (
      <section className={"sectionContainer partnerWrapper"}>
        <div className={"contentWrapper"}>
          <Row justify="space-between" align="middle" style={{ marginTop: 0 }}>
            <Col className={"sectionTitleContainer"}>
              <Typography.Title
                className={"sectionTitle partnerSectionTitle"}
                level={2}
                style={{ margin: 0 }}
              >
                Danh Sách Đối Tác
              </Typography.Title>
            </Col>
            <Col>
              <ButtonWithIcon
                icon={
                  <IconSvgLocal name={"IC_ARROW_RIGHT"} width={26} height={9} />
                }
                iconPosition={"end"}
                onClick={() => router.push(PartnerRouteUtils.toPartnersSearchScreen())}
              >
                Xem tất cả Đối tác
              </ButtonWithIcon>
            </Col>
          </Row>

          <div
            className="slider-container-v2"
            onMouseEnter={() => {
              const track = document.querySelector(".slider-track-v2");
              if (track) track.classList.add("paused-v2");
            }}
            onMouseLeave={() => {
              const track = document.querySelector(".slider-track-v2");
              if (track) track.classList.remove("paused-v2");
            }}
          >
            <div className="slider-track-v2">
              {take([...allPartnerItems, ...allPartnerItems], 30).map(
                (item: PartnerResource, itemIndex: number) => (
                  <div key={itemIndex} className="partner-item-wrapper-v2">
                    <PartnerItem data={item} />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>
    );
  };

  return renderContent();
};

export default TopPartnersSection;
