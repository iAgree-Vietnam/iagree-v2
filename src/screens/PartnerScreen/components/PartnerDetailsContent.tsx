"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Typography,
  Row,
  Col,
  Image,
  Space,
  Tag,
  Button,
  List,
  Descriptions,
} from "antd";
import {
  EditOutlined,
  LeftOutlined,
  RightOutlined,
  StarFilled,
} from "@ant-design/icons";
import type {
  CountByRate,
  PartnerDetailResource,
  ReviewResource,
} from "@/src/data/partner/models/partner.types";
import Images from "@/src/constants/Images";
import Constants from "@/src/constants/Constants";
import { PartnerReviews } from "@/src/screens/PartnerScreen/components/PartnerReviews";
import type {
  DatasResource,
  ModalizeHelperVisible,
} from "@/src/data/base/models/base.types";
import NumberUtils from "@/src/utils/NumberUtils";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import datetimeUtils from "@/src/utils/DatetimeUtils";
import { useAccountContext } from "@/src/contexts/AccountContext";
import { useRouter } from "next/router";
import { PartnerRouteUtils } from "@/src/data/partner/utils/PartnerRouteUtils";
// import Slider from "@ant-design/react-slick";
import Slider from "react-slick"; // Đổi từ @ant-design/react-slick sang react-slick

import JobItem from "@/src/components/jobs/JobItem";
import _, { filter, meanBy, size } from "lodash";
import { PartnerComplain } from "./PartnerComplain";
import { useBreakpoint } from "@/src/hooks/useBreakpoint";
import { SkillsChipList } from "./SkillsChipList";
import { CategoryServicesChipList } from "./CategoryServicesChipList";
import { PartnerFeaturedProjectsViewSection } from "./PartnerFeaturedProjectsView";
import { ServicesChipList } from "./ServicesChipList";
import { PartnerEducationV2 } from "./PartnerEducationsV2";
import PartnerConnectModalV3 from "../modals/PartnerConnectModalV3";
import { PartnerRegisterSucceedModal } from "./PartnerRegisterSucceedModal";
import JobRouteUtils from "@/src/data/job/utils/JobRouteUtils";
import useIsMobile from "../../HomeScreen/hooks/useIsMobile";
import PartnerBadges from "./PartnerBadges";

interface PartnerDetailsContentProps {
  partnerDetails: PartnerDetailResource;
  isProfileDetails?: boolean;
}

// const myReviewSlickSettings = {
//   arrows: false,
//   dots: true,
//   infinite: true,
//   speed: 500,
//   slidesToShow: 1,
//   slidesToScroll: 1,
// };

const projectWithPartnerSlickSettings = {
  arrows: false,
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

export function PartnerDetailsContent({
  partnerDetails,
  isProfileDetails = false,
}: PartnerDetailsContentProps) {
  const router = useRouter();
  const { isDesktop, isMobile } = useBreakpoint();
  const isMobileAndTablet = useIsMobile(445);

  const { auth: userInfo } = useAccountContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [hasCheckedModal, setHasCheckedModal] = useState(false); // Thêm state mới để kiểm tra

  const accountContext = useAccountContext();
  const fullProfileResource = accountContext.auth;
  const isLoggedIn = accountContext.isLoggedIn;
  const isValidUser =
    fullProfileResource &&
    fullProfileResource?.userId &&
    fullProfileResource?.fullName;
  const isActuallyLoggedIn = isLoggedIn && isValidUser;

  const isPartner = useMemo(() => {
    return fullProfileResource?.partner?.status === Constants.PARTNER.DA_DUYET;
  }, [fullProfileResource]);

  const onJobApply = useCallback(() => {
    router.push(JobRouteUtils.toJobsSearchScreen({}));
    setIsModalVisible(false);
  }, [router]);

  const handleClose = useCallback(() => {
    setIsModalVisible(false);
    onModalClose();
  }, []);

  const onModalClose = useCallback(() => {
    const now = new Date().getTime();
    const showCountStr = localStorage.getItem("modalShowCount_PartnerDetails");
    const showCount = showCountStr ? Number.parseInt(showCountStr) : 0;
    localStorage.setItem("lastModalShowTime_PartnerDetails", now.toString());
    localStorage.setItem("modalShowTime_PartnerDetails", now.toString());
    localStorage.setItem(
      "modalShowCount_PartnerDetails",
      (showCount + 1).toString()
    );
  }, []);

  useEffect(() => {
    if (hasCheckedModal) {
      return;
    }

    if (!isActuallyLoggedIn || !isPartner) {
      setHasCheckedModal(true);
      return;
    }

    const MAX_SHOWS_PER_DAY = 2;
    const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000;
    const MODAL_COOLDOWN_TIME = 2 * 60 * 1000;

    const lastShowTimeStr = localStorage.getItem(
      "lastModalShowTime_PartnerDetails"
    );
    const modalShowTimeStr = localStorage.getItem(
      "modalShowTime_PartnerDetails"
    );
    const showCountStr = localStorage.getItem("modalShowCount_PartnerDetails");

    const now = new Date().getTime();
    const lastShowTime = lastShowTimeStr ? Number.parseInt(lastShowTimeStr) : 0;
    const modalShowTime = modalShowTimeStr
      ? Number.parseInt(modalShowTimeStr)
      : 0;
    const showCount = showCountStr ? Number.parseInt(showCountStr) : 0;

    const isNewDay = now - lastShowTime > MILLISECONDS_IN_DAY;
    const hasEnoughCooldownPassed = now - modalShowTime > MODAL_COOLDOWN_TIME;

    let newShowCount = showCount;
    if (isNewDay) {
      newShowCount = 0;
    }

    if (newShowCount < MAX_SHOWS_PER_DAY && hasEnoughCooldownPassed) {
      setIsModalVisible(true);
      localStorage.setItem("modalShowTime_PartnerDetails", now.toString());
    }

    setHasCheckedModal(true);
  }, [fullProfileResource, isPartner, isActuallyLoggedIn, hasCheckedModal]);

  const jobSlider = useRef<Slider>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
  };

  const {
    partner: {
      partnerId,
      user,
      position,
      // location,
      // work_experience,
      // tags,
      languages,
      status,
      rate,
      educations,
      work_histories,
      typical_projects,
      description,
      isFounding,
      categories,
      categoryServices,
      services,
      skills,
      locations,
    },
    // languages: listLanguage,
    // locations: listLocation,
    // tags: listTags,
    // experiences,
    reviews,
    projectCompleted,
    projectWithPartner,
    // myReviews,
    complain,
    category_services
  } = partnerDetails;

  const partnerConnectModalRef = useRef<ModalizeHelperVisible>(null);
  // const updateCitizenModalRef = useRef<ModalizeHelperVisible>(null);

  // const myReviewsSlideItems = useMemo(
  //   () => _.chunk(userInfo?.userReviews?.items, 3),
  //   [userInfo]
  // );

  const jobSlickSettings = {
    arrows: false,
    dots: !isDesktop ? true : false,
    infinite: false,
    speed: 500,
    slidesToShow: !isDesktop ? 1.25 : 2.5,
    slidesToScroll: 1,
  };

  const projectWithPartnerDone = filter(
    projectWithPartner,
    (item) => item.status === Constants.JOB.STATUS.DUYET_HOAN_THANH_CV
  );
  const projectWithPartnerSlideItems = useMemo(
    () => _.chunk(projectWithPartnerDone, 3),
    [projectWithPartnerDone]
  );

  const isShowReviews =
    !isProfileDetails ||
    (isProfileDetails && status === Constants.PARTNER.DA_DUYET);

  // const [form] = Form.useForm();

  const checkAccount = partnerDetails.partner.userId === userInfo?.userId;

  return (
    <div className={"partnerDetailContentContainer"}>
      <Row
        className={"sectionTitleContainer"}
        justify={"space-between"}
        align={"top"}
      >
        <Typography.Title className={"sectionTitle"} level={3}>
          {isProfileDetails ? " Thông tin của tôi" : user?.fullName}
        </Typography.Title>
        {isProfileDetails && status === Constants.PARTNER.DA_DUYET && (
          <Button
            type={"text"}
            size={"middle"}
            icon={<EditOutlined />}
            onClick={() => router.push(PartnerRouteUtils.toProfileEditUrl())}
          >
            Chỉnh sửa
          </Button>
        )}
      </Row>

      <Row gutter={[40, 40]}>
        <Col xs={24} lg={16}>
          <Space direction={"vertical"} size={40} className={"d-flex"}>
            <Space
              direction={"vertical"}
              size={20}
              className={
                "partnerDetailOverviewContainer borderedContainer flex d-flex"
              }
            >
              <Row gutter={30} align={"middle"} justify={"center"}>
                <Col>
                  <div
                    style={{
                      position: "relative",
                      width: 125,
                      height: 125,
                      margin: "0 auto",
                    }}
                  >
                    <Image
                      preview={false}
                      width={125}
                      height={125}
                      src={user?.avatarUrl || "/placeholder.svg"}
                      fallback={Images.ACCOUNT_DEFAULT}
                      alt="Avatar"
                      className="partnerAvatar"
                    />
                    {partnerDetails?.partner?.is_citizen_id_verified == "1" && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: -7,
                          right: 0,
                          zIndex: 1,
                        }}
                      >
                        <div
                          style={{
                            backgroundColor: "white",
                            borderRadius: "50%",
                            padding: "0",
                            border: "2px solid white",
                          }}
                        >
                          <IconSvgLocal
                            name={"IC_VERIFIED"}
                            width={25}
                            height={25}
                            fill="#09993E"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </Col>

                <Col
                  flex={1}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Row
                    justify={isMobileAndTablet ? "center" : "space-between"}
                    align={"middle"}
                  >
                    <Typography.Title
                      className={"partnerFullName nm-typo"}
                      style={{ fontSize: "25px", marginTop: "12px" }}
                    >
                      {user?.fullName}
                    </Typography.Title>

                    {isProfileDetails &&
                      status === Constants.PARTNER.CHO_DUYET && (
                        <Tag color={"#E59F1E"}>Chờ duyệt</Tag>
                      )}
                    {Boolean(isFounding) && (
                      <Tag
                        style={{
                          marginTop: "12px",
                        }}
                        className={"foundingTag"}
                      >
                        Founding Partner
                      </Tag>
                    )}
                  </Row>

                  {isShowReviews && (
                    <Space
                      style={
                        isMobile
                          ? {
                              display: "flex",
                              justifyContent: "center",
                              marginTop: "12px",
                            }
                          : {}
                      }
                    >
                      <div
                        className={"rateContainer"}
                        style={{
                          margin: "5px auto 0",
                          width: "100%",
                        }}
                      >
                        <StarFilled style={{ fontSize: "22px" }} />
                        <Typography.Paragraph
                          className={"rateInfo"}
                          style={{ fontSize: "15px" }}
                        >
                          {Number(meanBy(reviews, "rate") || 0).toFixed(2)}
                          <span className={"reviews"}>
                            ({size(reviews)} đánh giá)
                          </span>
                        </Typography.Paragraph>
                      </div>
                    </Space>
                  )}
                </Col>
              </Row>

              <Typography.Title
                className={"partnerPosition"}
                style={{ padding: "0", fontSize: "17px" }}
              >
                {position}
              </Typography.Title>

              <Row gutter={[24, 24]} justify={"space-between"}>
                <Col>
                  <Space size={"middle"} align={"center"}>
                    {
                      <div className={"iconWrapper"}>
                        <IconSvgLocal
                          name={"IC_BAG"}
                          fill={"#74767E"}
                          width={24}
                          height={24}
                        />
                      </div>
                    }
                    <div>
                      <Typography.Paragraph className={"infoTitle"}>
                        Lĩnh vực
                      </Typography.Paragraph>
                      <Typography.Paragraph className={"infoContent"}>
                        {categories?.map((item) => item.name).join(", ")}
                      </Typography.Paragraph>
                    </div>
                  </Space>
                </Col>
                <Col>
                  <Space size={"middle"} align={"center"}>
                    <div className={"iconWrapper"}>
                      <IconSvgLocal
                        name={"IC_LANGUAGE"}
                        fill={"none"}
                        stroke={"#74767E"}
                        width={24}
                        height={24}
                      />
                    </div>
                    <div>
                      <Typography.Paragraph className={"infoTitle"}>
                        Ngôn ngữ
                      </Typography.Paragraph>
                      <Typography.Paragraph className={"infoContent"}>
                        {languages?.map((item) => item.name).join(", ")}
                      </Typography.Paragraph>
                    </div>
                  </Space>
                </Col>
                <Col>
                  <Space size={"middle"} align={"center"}>
                    <div className={"iconWrapper"}>
                      <IconSvgLocal
                        name={"IC_LOCATION"}
                        fill={"#FBF6F5"}
                        width={18}
                        height={24}
                      />
                    </div>
                    <div>
                      <Typography.Paragraph className={"infoTitle"}>
                        Địa điểm
                      </Typography.Paragraph>
                      <Typography.Paragraph className={"infoContent"}>
                        {partnerDetails?.locations?.items
                          ?.map((item) => item.name)
                          .join(", ")}
                      </Typography.Paragraph>
                    </div>
                  </Space>
                </Col>
              </Row>

              <SkillsChipList skills={skills} type={"partner"} />
              <CategoryServicesChipList
                categories={partnerDetails.categories || []}
                categoryServices={partnerDetails.category_services}
                type={"partner"}
              />
              <ServicesChipList
                categories={categories}
                categoryServices={category_services}
                services={services}
                type={"partner"}
              />
            </Space>

            {(description || size(work_histories) > 0) && (
              <Space
                direction={"vertical"}
                size={40}
                className={
                  "partnerDetailInfoContainer borderedContainer d-flex"
                }
              >
                {description && (
                  <div>
                    <Typography.Title className={"infoTitle"} level={4}>
                      Giới thiệu
                    </Typography.Title>
                    <div
                      className={"infoContent nm-typo"}
                      dangerouslySetInnerHTML={{ __html: description }}
                    />
                  </div>
                )}
                {size(work_histories) > 0 && (
                  <div>
                    <Typography.Title className={"infoTitle"} level={4}>
                      Kinh nghiệm làm việc
                    </Typography.Title>
                    <Space
                      direction={"vertical"}
                      size={"large"}
                      className={"d-flex"}
                    >
                      {work_histories?.map((item) => (
                        <Space
                          size={"large"}
                          key={item.workHistoryId}
                          align={"start"}
                        >
                          {!isMobile && (
                            <div
                              className={"iconWrapper"}
                              style={{ borderRadius: "8px" }}
                            >
                              <IconSvgLocal
                                name={"IC_CITY"}
                                width={24}
                                height={24}
                              />
                            </div>
                          )}
                          <div>
                            <Typography.Title
                              className={"companyName nm-typo"}
                              level={4}
                            >
                              {isMobile && (
                                <IconSvgLocal
                                  name={"IC_CITY"}
                                  width={24}
                                  height={24}
                                />
                              )}
                              {` ${item.name}`}
                            </Typography.Title>
                            <Typography.Paragraph className={"position"}>
                              {item.position}
                            </Typography.Paragraph>
                            <Typography.Paragraph className={"workTime"}>
                              {/* {datetimeUtils
                                .getMoment(
                                  item.start_date,
                                  datetimeUtils.BACKEND_DATE_TIME
                                )
                                ?.format(datetimeUtils.LOCAL_DATE_WITHOUT_DAY)} */}
                              {item.start_date}
                              {" - "}
                              {item.end_date ? item?.end_date : "Hiện tại"}
                            </Typography.Paragraph>
                            <div
                              className={"infoContent nm-typo"}
                              dangerouslySetInnerHTML={{
                                __html: item.description,
                              }}
                            />
                          </div>
                        </Space>
                      ))}
                    </Space>
                  </div>
                )}
              </Space>
            )}

            {size(typical_projects) > 0 && (
              <Space
                direction={"vertical"}
                size={40}
                className={
                  "partnerDetailInfoContainer borderedContainer d-flex"
                }
              >
                {size(typical_projects) > 0 && (
                  <PartnerFeaturedProjectsViewSection
                    projects={typical_projects}
                    currentPage={currentPage}
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                  />
                )}
              </Space>
            )}

            {size(educations) > 0 && (
              <Space
                direction={"vertical"}
                size={40}
                className={
                  "partnerDetailInfoContainer borderedContainer d-flex"
                }
              >
                {size(educations) > 0 && (
                  <PartnerEducationV2 educations={educations} />
                )}
              </Space>
            )}

            {!isProfileDetails && size(projectCompleted) > 0 && (
              <Space
                direction={"vertical"}
                size={40}
                className={
                  "partnerDetailInfoContainer borderedContainer d-flex"
                }
              >
                <div>
                  <Row
                    align={"top"}
                    justify={"space-between"}
                    style={{ marginBottom: "32px" }}
                  >
                    <Typography.Title className={"infoTitle nm-typo"} level={4}>
                      Dự án đã hoàn thành
                    </Typography.Title>
                    {projectCompleted.length >
                      jobSlickSettings.slidesToShow && (
                      <Space className={"hidden-mb"}>
                        <Button
                          onClick={() => {
                            jobSlider.current?.slickPrev();
                          }}
                          shape={"circle"}
                        >
                          <LeftOutlined />
                        </Button>
                        <Button
                          onClick={() => {
                            jobSlider.current?.slickNext();
                          }}
                          shape={"circle"}
                        >
                          <RightOutlined />
                        </Button>
                      </Space>
                    )}
                  </Row>
                  {/* <Slider
                    {...jobSlickSettings}
                    ref={jobSlider}
                    className={"projectCompleteSlider"}
                  >
                    {projectCompleted?.map((job) => (
                      <div
                       
                      >
                        <JobItem isHideAmountApply data={job} key={job.jobId} />
                      </div>
                    ))}
                  </Slider> */}
                  <Slider {...projectWithPartnerSlickSettings}>
                    {projectCompleted?.map((job) => (
                      <div key={job.jobId}>
                        <JobItem isHideAmountApply data={job} />
                      </div>
                    ))}
                  </Slider>
                </div>
              </Space>
            )}

            {!isProfileDetails &&
              !checkAccount &&
              size(projectWithPartnerDone) > 0 && (
                <Space
                  direction={"vertical"}
                  size={40}
                  className={
                    "partnerDetailInfoContainer borderedContainer d-flex"
                  }
                >
                  <div>
                    <Typography.Title className={"infoTitle"} level={4}>
                      Công việc Đối tác đã thực hiện cho bạn
                    </Typography.Title>
                    <Slider {...projectWithPartnerSlickSettings}>
                      {projectWithPartnerSlideItems.map(
                        (jobPages, jobPageIndex) => (
                          <List
                            key={jobPageIndex}
                            dataSource={jobPages}
                            renderItem={(item) => (
                              <List.Item>
                                <div className={"jobWithPartnerItemContainer"}>
                                  <Descriptions
                                    size={"small"}
                                    column={1}
                                    items={[
                                      {
                                        key: "JobName",
                                        label: "Công việc",
                                        children: (
                                          <Typography.Paragraph
                                            className={"jobName nm-typo"}
                                          >
                                            {item.name}
                                          </Typography.Paragraph>
                                        ),
                                      },
                                    ]}
                                    style={{ marginBottom: "8px" }}
                                  />
                                  <Space
                                    size={4}
                                    align={"center"}
                                    style={{ marginBottom: "16px" }}
                                  >
                                    <StarFilled
                                      style={{
                                        fontSize: "16px",
                                        color: "#09993E",
                                      }}
                                    />
                                    <Typography.Paragraph
                                      className={"rateNumber nm-typo"}
                                    >
                                      {NumberUtils.display(item.rate)}
                                    </Typography.Paragraph>
                                  </Space>
                                  <Typography.Paragraph
                                    className={"reviewContent nm-typo"}
                                  >
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: item.description,
                                      }}
                                    />
                                  </Typography.Paragraph>
                                </div>
                              </List.Item>
                            )}
                            split={false}
                            className={"projectWithPartnerListContainer"}
                          />
                        )
                      )}
                    </Slider>
                  </div>
                </Space>
              )}

            {isShowReviews && (
              <div
                className={"partnerDetailReviewsContainer borderedContainer"}
              >
                <PartnerReviews
                  partnerId={partnerId || -1}
                  // initData={
                  //   {
                  //     items: reviews || [],
                  //     total: size(reviews)
                  // }as  DatasResource<ReviewResource> & {
                  //   rateAvg: number;
                  //   countByRate: CountByRate;
                  // }}
                  reviews={reviews || undefined}
                  isProfileDetails={isProfileDetails}
                />
              </div>
            )}
            {isShowReviews && (
              <div
                className={"partnerDetailReviewsContainer borderedContainer"}
              >
                <PartnerComplain initData={complain} />
              </div>
            )}
          </Space>
        </Col>

        <Col xs={24} lg={8}>
          {!isProfileDetails && !checkAccount && (
            <div
              className={"partnerConnectContainer"}
              style={{ position: "relative" }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                  zIndex: 10,
                  borderRadius: "inherit",
                  cursor: "pointer",
                }}
              />
              <Typography.Title className={"hintText"} level={4}>
                Kết nối với ứng viên ngay!
              </Typography.Title>
              {/* <Button
                type={"primary"}
                size={"large"}
                onClick={() => {
                  partnerConnectModalRef.current?.open();
                }}
                block
              >
                Gửi công việc
              </Button> */}

              <Button
                // THÊM: Vô hiệu hóa nút và thêm class cho trạng thái "Sắp ra mắt"
                disabled={true}
                type={"primary"}
                size={"large"}
                style={{
                  maxWidth: "100%",
                  width: "100%",
                  cursor: "not-allowed",
                  pointerEvents: "none",
                  opacity: 0.7,
                  backgroundColor: "#6b7280 !important",
                  color: "#d9d9d9 !important",
                  boxShadow: "none !important",
                }}
              >
                Chức năng sắp ra mắt
              </Button>
            </div>
          )}
        </Col>
      </Row>

      <PartnerConnectModalV3
        ref={partnerConnectModalRef}
        partnerId={partnerId || -1}
        parnerName={user?.fullName || ""}
        categories={categories}
        categoryServices={categoryServices}
        services={services}
        skills={skills}
      />

      <PartnerRegisterSucceedModal
        isVisible={isModalVisible}
        onClose={handleClose}
        onJobApply={onJobApply}
      />
    </div>
  );
}
