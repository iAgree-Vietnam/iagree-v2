"use client";

import React, { useMemo, useEffect, useState } from "react";
import { Row, Typography, Col, List, Button } from "antd";
import JobItem from "@/src/components/jobs/JobItem";
import { ButtonWithIcon } from "@/src/components/button";
import JobRouteUtils from "@/src/data/job/utils/JobRouteUtils";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import { FullJobResource } from "@/src/data/job/models/job.types";
import useIsMobile from "../hooks/useIsMobile";
import { ButtonWithDottedLoadingIcon } from "@/src/components/button/ButtonWithDottedLoadingIcon";
import ArrayUtils from "@/src/utils/ArrayUtils";
import { FullJobResourceV2 } from "@/src/data/job/models/v2/job.types";
import JobItemV2 from "@/src/components/jobs/JobItemV2";

type Props = {
  jobSlideItems: FullJobResourceV2[];
  router: any;
};

const SCROLL_SPEED_PX_PER_SEC = 80;

const PopularJobsSectionV2: React.FC<Props> = ({ jobSlideItems, router }) => {
  const isTablet = useIsMobile(1200);
  const isMobile = useIsMobile(660);

  const ITEMS_TABLET = 6;
  const ITEMS_MOBILE = 5;
  const [visibleCount, setVisibleCount] = useState(
    isMobile ? ITEMS_MOBILE : ITEMS_TABLET
  );

  const sortedJobs = ArrayUtils.sortJobsByDateAndStatusV2(jobSlideItems);
  const midIndex = Math.ceil(sortedJobs.length / 2);
  const topRowJobs = sortedJobs.slice(0, midIndex);
  const bottomRowJobs = sortedJobs.slice(midIndex);

  const infiniteTopJobs = useMemo(
    () => [...topRowJobs, ...topRowJobs],
    [topRowJobs]
  );

  const infiniteBottomJobs = useMemo(
    () => [...bottomRowJobs, ...bottomRowJobs],
    [bottomRowJobs]
  );

  useEffect(() => {
    const topTrack = document.querySelector(
      ".jobs-track-row1"
    ) as HTMLElement | null;
    const bottomTrack = document.querySelector(
      ".jobs-track-row2"
    ) as HTMLElement | null;

    if (topTrack) {
      const distance = topTrack.scrollWidth / 2;
      const duration = distance / SCROLL_SPEED_PX_PER_SEC;
      topTrack.style.animationDuration = `${duration}s`;
      topTrack.style.animationTimingFunction = "linear";
      topTrack.style.animationIterationCount = "infinite";
    }

    if (bottomTrack) {
      const distance = bottomTrack.scrollWidth / 2;
      const duration = distance / SCROLL_SPEED_PX_PER_SEC;
      bottomTrack.style.animationDuration = `${duration}s`;
      bottomTrack.style.animationTimingFunction = "linear";
      bottomTrack.style.animationIterationCount = "infinite";
    }
  }, [jobSlideItems.length]);

  const handleLoadMore = () => {
    setVisibleCount((prev) =>
      Math.min(
        prev + (isMobile ? ITEMS_MOBILE : ITEMS_TABLET),
        jobSlideItems.length
      )
    );
  };

  const handleCollapse = () => {
    setVisibleCount(isMobile ? ITEMS_MOBILE : ITEMS_TABLET);
  };

  const renderLoadMoreOrCollapse = () => {
    if (visibleCount < jobSlideItems.length) {
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
              onClick={() => router.push(JobRouteUtils.toJobsSearchScreen())}
            >
              Xem tất cả
            </ButtonWithIcon>
          </Col>
        </Row>
      );
    } else if (jobSlideItems.length > visibleCount) {
      return null;
    } else if (
      jobSlideItems.length > (isMobile ? ITEMS_MOBILE : ITEMS_TABLET)
    ) {
      return (
        <Button type="default" onClick={handleCollapse}>
          Thu gọn
        </Button>
      );
    }
    return null;
  };

  if (isTablet && !isMobile) {
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
                Công việc mới nhất
              </Typography.Title>
            </Col>
          </Row>

          <List
            grid={{ gutter: 24, xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 }}
            dataSource={jobSlideItems.slice(0, visibleCount)}
            className={"jobListContainer"}
            style={{ marginTop: "1rem" }}
            renderItem={(item: FullJobResourceV2) => (
              <List.Item style={{
                width: "100%"
              }}>
                {/* <JobItem key={item.jobId} data={item} /> */}
                <div style={{
                width: "100%"
              }}>
                <JobItemV2 key={item.jobId} data={item} />
                </div>
              </List.Item>
            )}
          />

          <Row justify="center" style={{ marginTop: 20 }}>
            {renderLoadMoreOrCollapse()}
          </Row>
        </div>
      </section>
    );
  }

  if (isMobile) {
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
                Công việc mới nhất
              </Typography.Title>
            </Col>
          </Row>

          <List
            grid={{ gutter: 24, xs: 1 }}
            dataSource={jobSlideItems.slice(0, visibleCount)}
            className={"jobListContainer"}
            style={{ marginTop: "1rem" }}
            renderItem={(item: FullJobResourceV2) => (
              <List.Item>
                {/* <JobItem key={item.jobId} data={item} /> */}
                <JobItemV2 key={item.jobId} data={item} />
              </List.Item>
            )}
          />

          <Row justify="center" style={{ marginTop: 20 }}>
            {renderLoadMoreOrCollapse()}
          </Row>
        </div>
      </section>
    );
  }

  // 🖥️ Desktop: hiển thị toàn bộ danh sách chia 2 hàng, animation auto
  return (
    <section className={"sectionContainer partnerWrapper"}>
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
              Công việc mới nhất
            </Typography.Title>
          </Col>
          <Col>
            <ButtonWithIcon
              icon={
                <IconSvgLocal name={"IC_ARROW_RIGHT"} width={26} height={9} />
              }
              iconPosition={"end"}
              onClick={() => router.push(JobRouteUtils.toJobsSearchScreen())}
            >
              Xem tất cả công việc
            </ButtonWithIcon>
          </Col>
        </Row>

        <div className="jobRowWrapper">
          <div className="jobs-track-row1">
            {/* {[...infiniteTopJobs].map(
              (item: FullJobResource, index: number) => (
                <div key={index} className="jobs-item-wrapper">
                  <JobItem data={item} />
                </div>
              )
            )} */}

            {[...infiniteTopJobs].map(
              (item: FullJobResourceV2, index: number) => (
                <div key={index} className="jobs-item-wrapper">
                  <JobItemV2 data={item} />
                </div>
              )
            )}
          </div>
        </div>

        <div className="jobRowWrapper">
          <div className="jobs-track-row2">
            {/* {[...infiniteBottomJobs].map(
              (item: FullJobResource, index: number) => (
                <div key={index} className="jobs-item-wrapper">
                  <JobItem data={item} />
                </div>
              )
            )} */}

            {[...infiniteBottomJobs].map(
              (item: FullJobResourceV2, index: number) => (
                <div key={index} className="jobs-item-wrapper">
                  <JobItemV2 data={item} />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularJobsSectionV2;
