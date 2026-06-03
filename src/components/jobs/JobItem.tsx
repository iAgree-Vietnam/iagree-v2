"use client";

import { useState, useRef, useEffect, useCallback, forwardRef } from "react";
import { Button, Typography, Tag } from "antd";
import Link from "next/link";
import {
  HeartFilled,
  HeartOutlined,
  LoadingOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import type { FullJobResource } from "@/src/data/job/models/job.types";
import JobRouteUtils from "@/src/data/job/utils/JobRouteUtils";
import useJobReaction from "@/src/screens/JobScreen/hooks/useJobReaction";
import { JobParseUtils } from "@/src/data/job/utils/JobParseUtils";
import { IconSvgLocal } from "../icon-svg-local";
import Constants from "@/src/constants/Constants";
import { useAccountContext } from "@/src/contexts/AccountContext";
import styles from "./JobItem.module.css";
import useIsMobile from "@/src/screens/HomeScreen/hooks/useIsMobile";

type JobItemProps = {
  data: FullJobResource;
  onReactionSuccess?: () => void;
  isHideAmountApply?: boolean;
};

const JobStatus = {
  ACTIVE: "Đang tuyển",
  CLOSED: "Đã đóng",
  PENDING: "Đang chờ duyệt",
};

const renderStatusTag = (status: string) => {
  let tagClassName = styles.activeTag;
  switch (status) {
    case JobStatus.ACTIVE:
      tagClassName = styles.activeTag;
      break;
    case JobStatus.CLOSED:
      tagClassName = styles.closedTag;
      break;
    case JobStatus.PENDING:
      tagClassName = styles.pendingTag;
      break;
  }
  return <Tag className={`${styles.statusTag} ${tagClassName}`}>{status}</Tag>;
};

const JobItem = forwardRef<HTMLDivElement, JobItemProps>((props, ref) => {
  const [jobResource, setJobResource] = useState(props.data);
  const isTablet = useIsMobile(1024);

  useEffect(() => {
    if (props.data) {
      setJobResource(props.data);
    }
  }, [props.data]);

  const reactionMutation = useJobReaction({
    onSuccess: () => {
      setJobResource((prev) => ({ ...prev, isLiked: !prev.isLiked }));
      props.onReactionSuccess?.();
    },
  });

  const accountContext = useAccountContext();
  const fullProfileResource = accountContext.auth;
  const isLoggedIn = accountContext.isLoggedIn;
  const isValidUser =
    fullProfileResource &&
    fullProfileResource.userId &&
    fullProfileResource?.fullName;
  const isActuallyLoggedIn = isLoggedIn && isValidUser;

  const checkDisplayChances =
    isActuallyLoggedIn &&
    fullProfileResource?.partner &&
    jobResource?.createdByUserId !== fullProfileResource?.userId;

  const skillsContainerRef = useRef<HTMLDivElement>(null);
  const renderedSkillCountRef = useRef(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);

  function formatDateToISO(dateString: string) {
    if (!dateString) return null;

    const parts = dateString.split("/");
    if (parts.length !== 3) return null;

    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  let daysRemaining: string | number;
  const dateISO = formatDateToISO(jobResource.postingEndDate);

  if (jobResource.postingEndDate == null || dateISO == null) {
    daysRemaining = "";
  } else {
    const now = new Date();
    const endDate = new Date(dateISO);

    if (isNaN(endDate.getTime())) {
      daysRemaining = "Ngày không hợp lệ";
    } else {
      const diffMs = endDate.getTime() - now.getTime();
      const daysDiff = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      if (daysDiff === 0) {
        daysRemaining = "Hôm nay là hạn cuối";
      } else if (daysDiff < 0) {
        daysRemaining = "Hết hạn ứng tuyển";
      } else {
        daysRemaining = `Còn ${daysDiff} ngày`;
      }
    }
  }

  const jobStatus = JobStatus.ACTIVE;
  const applicantsCount = jobResource?.userProjectBids
    ? jobResource?.userProjectBids?.length
    : 0;
  const chanceCount = jobResource.connect || 0;

  const checkScrollable = useCallback(() => {
    const container = skillsContainerRef.current;
    if (container) {
      const scrollable = container.scrollWidth > container.offsetWidth;
      setIsScrollable(scrollable);

      if (scrollable) {
        setShowLeftArrow(container.scrollLeft > 0);
        const canScrollRight =
          container.scrollLeft + container.offsetWidth < container.scrollWidth;
        setShowRightArrow(canScrollRight);
      } else {
        setShowLeftArrow(false);
        setShowRightArrow(false);
      }
    }
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    const container = skillsContainerRef.current;
    if (container) {
      const scrollAmount = 150;
      if (direction === "left") {
        container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
      setTimeout(() => {
        checkScrollable();
      }, 300);
    }
  };

  useEffect(() => {
    checkScrollable();
    const container = skillsContainerRef.current;
    if (container) {
      const handleScrollEvent = () => checkScrollable();
      const handleResizeEvent = () => checkScrollable();
      container.addEventListener("scroll", handleScrollEvent);
      window.addEventListener("resize", handleResizeEvent);

      return () => {
        container.removeEventListener("scroll", handleScrollEvent);
        window.removeEventListener("resize", handleResizeEvent);
      };
    }
  }, [checkScrollable]);

  useEffect(() => {
    renderedSkillCountRef.current = 0;
    if (!jobResource.skills || jobResource.skills.length === 0) {
      checkScrollable();
    }
  }, [jobResource, checkScrollable]);

  const getJobDeadline = () => {
    let jobDurationType = "";
    if (jobResource?.jobDurationType === Constants.JOB.DURATION_TYPE.DAYS) {
      jobDurationType = "Ngày";
    } else if (
      jobResource?.jobDurationType === Constants.JOB.DURATION_TYPE.WEEKS
    ) {
      jobDurationType = "Tuần";
    } else if (
      jobResource?.jobDurationType === Constants.JOB.DURATION_TYPE.MONTHS
    ) {
      jobDurationType = "Tháng";
    }

    if (jobResource?.duration && jobDurationType) {
      return `${jobResource.duration} ${jobDurationType}`;
    }

    if (
      (!jobResource?.duration || !jobDurationType) &&
      jobResource?.startDate &&
      jobResource?.endDate
    ) {
      const startDate = jobResource.startDate;
      const endDate = jobResource.endDate;

      if (startDate && endDate) {
        return `${startDate} - ${endDate}`;
      }
    }

    return "Chưa xác định";
  };

  return (
    <div style={{
      width: "100%",
      height: "100%",
    }} ref={ref} className={styles.jobItemContainer}>
      <Link href={JobRouteUtils.toDetailUrl(jobResource)}>
        <div className={styles.header}>
          <div className={styles.statusInfo}>
            {renderStatusTag(jobStatus)}
            <Typography.Text className={styles.daysRemaining}>
              {daysRemaining}
            </Typography.Text>
          </div>
          {!props.isHideAmountApply && (
            <Button
              type="text"
              className={styles.heartButton}
              disabled={reactionMutation?.isPending}
              onClick={(e) => {
                e.preventDefault();
                reactionMutation.mutate({ jobId: jobResource.jobId });
              }}
            >
              {!reactionMutation.isPending ? (
                <>
                  {jobResource.isLiked ? (
                    <HeartFilled className={styles.heartIconFilled} />
                  ) : (
                    <HeartOutlined className={styles.heartIconOutlined} />
                  )}
                </>
              ) : (
                <LoadingOutlined className={styles.loadingIcon} />
              )}
            </Button>
          )}
        </div>

        <div className={styles.titleContainer}>
          <Typography.Title
            level={isTablet ? 4 : 3}
            className={styles.jobTitle}
            ellipsis={{
              rows: 2,
              tooltip: jobResource.name,
            }}
            title={jobResource.name}
          >
            {jobResource.name}
          </Typography.Title>
        </div>

        <Typography.Paragraph
          className={styles.description}
          ellipsis={{ rows: 2 }}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: jobResource.description,
            }}
          />
        </Typography.Paragraph>

        <div className={styles.detailsContainer}>
          <div className={styles.detailItem}>
            <div className={styles.detailIconAndLabel}>
              <IconSvgLocal name={"IC_MONEY"} className={styles.detailIcon} />
              <Typography.Text className={styles.detailLabel}>
                Thù lao
              </Typography.Text>
            </div>
            <Typography.Text className={styles.detailValue}>
              {JobParseUtils.renderSalaryText(jobResource)}
            </Typography.Text>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.detailItem}>
            <div className={styles.detailIconAndLabel}>
              <IconSvgLocal name={"IC_CLOCK"} className={styles.detailIcon} />
              <Typography.Text className={styles.detailLabel}>
                Thời gian thực hiện
              </Typography.Text>
            </div>
            <Typography.Text className={styles.detailValue}>
              {getJobDeadline()}
            </Typography.Text>
          </div>
        </div>

        <div
          className={`${styles.skillsWrapper} ${
            isScrollable && (showLeftArrow || showRightArrow)
              ? styles.skillsWrapperWithArrows
              : ""
          }`}
          style={{
            visibility:
              (jobResource.skills?.length ?? 0) > 0 ? "visible" : "hidden",
          }}
        >
          {isScrollable && showLeftArrow && (
            <div
              className={`${styles.scrollArrow} ${styles.leftArrow}`}
              onClick={(e) => {
                e.preventDefault();
                handleScroll("left");
              }}
            >
              <LeftOutlined style={{ fontSize: 15 }} />
            </div>
          )}

          <div ref={skillsContainerRef} className={styles.skillsContainer}>
            {jobResource.skills?.map((skill, index) => (
              <Tag
                key={index}
                className={styles.skillTag}
                ref={(node) => {
                  if (
                    node &&
                    renderedSkillCountRef.current <
                      (jobResource.skills?.length ?? 0)
                  ) {
                    renderedSkillCountRef.current += 1;
                    if (
                      renderedSkillCountRef.current ===
                      (jobResource.skills?.length ?? 0)
                    ) {
                      checkScrollable();
                    }
                  }
                }}
              >
                {skill.name}
              </Tag>
            ))}
          </div>

          {isScrollable && showRightArrow && (
            <div
              className={`${styles.scrollArrow} ${styles.rightArrow}`}
              onClick={(e) => {
                e.preventDefault();
                handleScroll("right");
              }}
            >
              <RightOutlined style={{ fontSize: 15 }} />
            </div>
          )}
        </div>

        {checkDisplayChances && (
          <Typography.Text className={styles.chanceText}>
            Cần <span className={styles.boldGreen}>{chanceCount} Cơ Hội </span>
            để ứng tuyển
          </Typography.Text>
        )}

        {/* {!props.isHideAmountApply && (
          <Typography.Text className={styles.applicantsText}>
            <br /> <span className={styles.boldBlack}>{applicantsCount} </span>
            người đang ứng tuyển
          </Typography.Text>
        )} */}
      </Link>
    </div>
  );
});

export default JobItem;
