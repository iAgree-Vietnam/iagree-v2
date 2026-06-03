"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button, Image, Row, Space, Tag, Typography } from "antd";
import {
  HeartFilled,
  HeartOutlined,
  LoadingOutlined,
  StarFilled,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import type { PartnerResource } from "@/src/data/partner/models/partner.types";
import Images from "@/src/constants/Images";
import { PartnerRouteUtils } from "@/src/data/partner/utils/PartnerRouteUtils";
import NumberUtils from "@/src/utils/NumberUtils";
import { ButtonWithIcon } from "../button";
import { IconSvgLocal } from "../icon-svg-local";
import usePartnerReaction from "@/src/screens/PartnerScreen/hooks/usePartnerReaction";
import type { SkillResource } from "@/src/data/skill/models/skill.types";

import stylesBasic from "./PartnerItem.module.css";
type PartnerItemProps = {
  data: Partial<PartnerResource>;
  onReactionSuccess?: () => void;
};

function PartnerItem(props: PartnerItemProps) {
  const [partnerResource, setPartnerResource] = useState(props.data);
  const fullProfileResource = partnerResource.user;
  const reactionMutation = usePartnerReaction({
    onSuccess: () => {
      setPartnerResource({
        ...partnerResource,
        isFavorite: !partnerResource.isFavorite,
      });
      props.onReactionSuccess?.();
    },
  });

  const skillsContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);

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
      const scrollAmount = 100;
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

  // Choose styles based on fullName
  let stylesToUse;

  // if (
  //   fullProfileResource?.fullName === "Daniel Nguyen" ||
  //   fullProfileResource?.fullName === "Huy Nguyen" ||
  //   fullProfileResource?.fullName === "Nguyễn Thị Mỹ Linh"
  // ) {
  //   stylesToUse = stylesElite;
  // } else if (
  //   fullProfileResource?.fullName === "Nguyen Pham Thuy Duong" ||
  //   fullProfileResource?.fullName === "Nguyễn Minh Nhân Phạm" ||
  //   fullProfileResource?.fullName === "Nguyễn Bảo Ngọc"
  // ) {
  //   stylesToUse = stylesPro;
  // } else {
  //   stylesToUse = stylesBasic;
  // }

  stylesToUse = stylesBasic;

  return (
    <Link
      href={PartnerRouteUtils.toDetailUrl(partnerResource)}
      className={stylesToUse.partnerItemContainer}
    >
      <div className={stylesToUse.partnerItemTop}>
        <div
          style={{
            position: "relative",
            width: 110,
            height: 110,
            margin: "0 auto",
          }}
        >
          {/* User avatar */}
          <Image
            preview={false}
            src={
              partnerResource?.user?.avatar ||
              partnerResource?.user?.avatarUrl ||
              "/placeholder.svg"
            }
            fallback={Images.ACCOUNT_DEFAULT}
            width={110}
            height={110}
            alt={fullProfileResource?.fullName}
            className={stylesToUse.imageAvatar}
          />
          {/* Verified icon */}
          {partnerResource?.is_citizen_id_verified == 1 && (
            <div
              style={{
                position: "absolute",
                bottom: -5,
                right: 5,
                zIndex: 1,
              }}
            >
              <div
                style={{
                  padding: "0",
                }}
              >
                <IconSvgLocal
                  name={"IC_VERIFIED"}
                  width={25}
                  height={25}
                  fill="#09943E"
                />
              </div>
            </div>
          )}
        </div>

        {/* Rest of the component remains the same */}
        <div className={stylesToUse.descContainer}>
          {/* Fixed height for partner name */}
          <Typography.Paragraph
            ellipsis={{ rows: 1 }}
            className={`${stylesToUse.partnerName} text-center`}
            title={partnerResource?.user?.name}
            style={{ height: "1.3em", overflow: "hidden", marginBottom: 0 }}
          >
            {partnerResource?.user?.name || partnerResource?.user?.fullName}
          </Typography.Paragraph>
          {/* Fixed height for position */}
          <Typography.Paragraph
            ellipsis={{ rows: 1 }}
            className={`${stylesToUse.partnerPosition} text-center`}
            style={{ height: "1.3em", overflow: "hidden" }}
          >
            {partnerResource.position}
          </Typography.Paragraph>

          <div
            className={stylesToUse.rateContainer}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* Rating display */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <StarFilled style={{ fontSize: "15px", color: "#09943E" }} />
              <Typography.Paragraph
                className={stylesToUse.rate}
                style={{ margin: 0 }}
              >
                {NumberUtils.display(partnerResource.rate)}
                <span className={stylesToUse.reviews}>
                  (
                  {partnerResource?.total_review ||
                    partnerResource?.totalReview ||
                    0}{" "}
                  đánh giá)
                </span>
              </Typography.Paragraph>
            </div>

            {/* Divider line */}
            <div
              style={{
                width: 0.5,
                height: "20px",
                backgroundColor: "#ffffff",
                margin: "0 10px",
              }}
            />

            {/* Job count display */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <IconSvgLocal
                name={"IC_CASE"}
                width={18}
                height={18}
                fill="#09943E"
              />
              <Typography.Paragraph
                style={{ margin: 0, marginLeft: "5px", fontSize: "14px" }}
              >
                {partnerResource.total_completed_projects || partnerResource.totalCompletedProjects} công việc
              </Typography.Paragraph>
            </div>
          </div>
          {/* <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {fullProfileResource?.fullName === "Daniel Nguyen" ||
            fullProfileResource?.fullName === "Huy Nguyen" ||
            fullProfileResource?.fullName === "Nguyễn Thị Mỹ Linh" ? (
              <PartnerBadges tier={"ELITE"} />
            ) : fullProfileResource?.fullName === "Nguyen Pham Thuy Duong" ||
              fullProfileResource?.fullName === "Nguyễn Minh Nhân Phạm" ||
              fullProfileResource?.fullName === "Nguyễn Bảo Ngọc" ? (
              <PartnerBadges tier={"PRO"} />
            ) : (
              <div style={{ visibility: "hidden" }}>
                <PartnerBadges tier={"PRO"} />
              </div>
            )}
          </div> */}
          <div className={stylesToUse.descriptionContainer}>
            <Typography.Paragraph
              ellipsis={{ rows: 3 }}
              style={{ color: "grey", margin: 0 }}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: partnerResource.description,
                }}
              />
            </Typography.Paragraph>
          </div>

          <div
            className={stylesToUse.partnerItemCenter}
            style={{
              position: "relative",
              height: "40px",
              marginTop: "25px",
              marginLeft: isScrollable && showLeftArrow ? "20px" : "0px",
              marginRight: isScrollable && showRightArrow ? "20px" : "0px",
              display: "flex",
              alignItems: "center",
            }}
          >
            {/* Left Arrow */}
            {isScrollable && showLeftArrow && (
              <div
                style={{
                  position: "absolute",
                  left: -20,
                  zIndex: 2,
                  cursor: "pointer",
                  color: "#000000",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#09943E";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#000000";
                }}
                onClick={(e) => {
                  e.preventDefault();
                  handleScroll("left");
                }}
              >
                <LeftOutlined style={{ fontSize: 15 }} />
              </div>
            )}

            {/* Skills Container */}
            <div
              ref={skillsContainerRef}
              style={{
                overflowX: "auto",
                whiteSpace: "nowrap",
                flex: "1",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                gap: 4
              }}
              className={stylesToUse.skillsContainer}
            >
              {partnerResource.skills?.map((tag: SkillResource) => (
                <Tag key={tag.skillId} style={{ marginBottom: 0, marginRight: 4 }}>
                  {tag.name}
                </Tag>
              ))}
            </div>

            {/* Right Arrow */}
            {isScrollable && showRightArrow && (
              <div
                style={{
                  position: "absolute",
                  right: -20,
                  zIndex: 2,
                  cursor: "pointer",
                  color: "#000000",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#09943E";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#000000";
                }}
                onClick={(e) => {
                  e.preventDefault();
                  handleScroll("right");
                }}
              >
                <RightOutlined style={{ fontSize: 15 }} />
              </div>
            )}
          </div>
        </div>

        <Space style={{ position: "absolute", right: "12px", top: "12px" }}>
          <Button
            type={"text"}
            onClick={(e) => {
              e.preventDefault();
              reactionMutation.mutate({
                partnerId: partnerResource?.partnerId || -1,
              });
            }}
            shape={"circle"}
            disabled={reactionMutation.isPending}
          >
            {!reactionMutation.isPending ? (
              <>
                {partnerResource.isFavorite ? (
                  <HeartFilled style={{ color: "#09943E", fontSize: 24 }} />
                ) : (
                  <HeartOutlined style={{ fontSize: 24, color: "#979797" }} />
                )}
              </>
            ) : (
              <LoadingOutlined style={{ color: "#979797", fontSize: 24 }} />
            )}
          </Button>
        </Space>

        {Boolean(partnerResource.isFounding) && (
          <>
            <div className={stylesToUse.foundingTag}>Founding Partner</div>
            <div className={stylesToUse.foundingTagContainer} />
          </>
        )}
      </div>

      <Row className={stylesToUse.partnerItemBottom} justify={"center"}>
        <ButtonWithIcon
          icon={<IconSvgLocal name={"IC_ARROW_RIGHT"} width={26} height={9} />}
          iconPosition={"end"}
        >
          Xem hồ sơ
        </ButtonWithIcon>
      </Row>
    </Link>
  );
}

export default PartnerItem;
